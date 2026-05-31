from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class OrderItemCreate(BaseModel):
    product_id: UUID
    quantity: int


class OrderCreate(BaseModel):
    items: list[OrderItemCreate]
    note: str | None = None


class OrderItemResponse(BaseModel):
    id: UUID
    product_id: UUID
    product_name: str
    product_price: Decimal
    quantity: int
    subtotal: Decimal

    model_config = {"from_attributes": True}


class CashierInOrder(BaseModel):
    id: UUID
    name: str

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: UUID
    user_id: UUID
    status: str
    payment_method: str | None
    total_amount: Decimal
    note: str | None
    created_at: datetime
    cashier: CashierInOrder
    items: list[OrderItemResponse]

    model_config = {"from_attributes": True}


class PayOrderRequest(BaseModel):
    payment_method: str