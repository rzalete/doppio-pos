from datetime import datetime, timezone

from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.order import Order, OrderItem
from app.schemas.dashboard import DashboardSummary, TopProduct


def get_summary(db: Session) -> DashboardSummary:
    today = datetime.now(timezone.utc).date()

    today_stats = (
        db.query(
            func.coalesce(func.sum(Order.total_amount), 0).label("revenue"),
            func.count(Order.id).label("count"),
        )
        .filter(Order.status == "paid")
        .filter(func.date(Order.created_at) == today)
        .first()
    )

    total_stats = (
        db.query(
            func.coalesce(func.sum(Order.total_amount), 0).label("revenue"),
            func.count(Order.id).label("count"),
        )
        .filter(Order.status == "paid")
        .first()
    )

    top_products = (
        db.query(
            OrderItem.product_id.label("product_id"),
            OrderItem.product_name.label("product_name"),
            func.sum(OrderItem.quantity).label("total_quantity"),
            func.sum(OrderItem.subtotal).label("total_revenue"),
        )
        .join(Order, Order.id == OrderItem.order_id)
        .filter(Order.status == "paid")
        .group_by(OrderItem.product_id, OrderItem.product_name)
        .order_by(func.sum(OrderItem.quantity).desc())
        .limit(5)
        .all()
    )

    return DashboardSummary(
        today_revenue=today_stats.revenue,
        today_order_count=today_stats.count,
        total_revenue=total_stats.revenue,
        total_order_count=total_stats.count,
        top_products=[
            TopProduct(
                product_id=str(p.product_id),
                product_name=p.product_name,
                total_quantity=int(p.total_quantity),
                total_revenue=p.total_revenue,
            )
            for p in top_products
        ],
    )