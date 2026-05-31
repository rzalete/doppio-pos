from decimal import Decimal

from pydantic import BaseModel


class TopProduct(BaseModel):
    product_id: str
    product_name: str
    total_quantity: int
    total_revenue: Decimal


class DashboardSummary(BaseModel):
    today_revenue: Decimal
    today_order_count: int
    total_revenue: Decimal
    total_order_count: int
    top_products: list[TopProduct]