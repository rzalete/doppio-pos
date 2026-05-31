from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, PayOrderRequest


def get_all(db: Session, current_user) -> list[Order]:
    query = db.query(Order)
    if current_user.role == "cashier":
        query = query.filter(Order.user_id == current_user.id)
    return query.order_by(Order.created_at.desc()).all()


def get_by_id(order_id: str, db: Session, current_user) -> Order:
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    if current_user.role == "cashier" and str(order.user_id) != str(current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return order


def create(payload: OrderCreate, db: Session, current_user) -> Order:
    if not payload.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order must have at least one item")

    order = Order(user_id=current_user.id, note=payload.note)
    db.add(order)
    db.flush()

    total = 0
    for item in payload.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Product {item.product_id} not found")
        if not product.is_available:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Product '{product.name}' is not available")

        subtotal = product.price * item.quantity
        total += subtotal

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name=product.name,
            product_price=product.price,
            quantity=item.quantity,
            subtotal=subtotal,
        )
        db.add(order_item)

    order.total_amount = total
    db.commit()
    db.refresh(order)
    return order


def pay(order_id: str, payload: PayOrderRequest, db: Session, current_user) -> Order:
    order = get_by_id(order_id, db, current_user)

    if order.status != "pending":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Order is already {order.status}")

    if payload.payment_method not in ("cash", "qris"):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid payment method")

    order.status = "paid"
    order.payment_method = payload.payment_method
    db.commit()
    db.refresh(order)
    return order


def cancel(order_id: str, db: Session, current_user) -> Order:
    order = get_by_id(order_id, db, current_user)

    if order.status != "pending":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f"Order is already {order.status}")

    order.status = "cancelled"
    db.commit()
    db.refresh(order)
    return order