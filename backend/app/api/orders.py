from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_cashier
from app.schemas.order import OrderCreate, OrderResponse, PayOrderRequest
from app.services import order as order_service

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("/", response_model=list[OrderResponse])
def get_orders(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return order_service.get_all(db, current_user)


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(order_id: UUID, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return order_service.get_by_id(str(order_id), db, current_user)


@router.post("/", response_model=OrderResponse, status_code=201)
def create_order(payload: OrderCreate, db: Session = Depends(get_db), current_user=Depends(require_cashier)):
    return order_service.create(payload, db, current_user)


@router.patch("/{order_id}/pay", response_model=OrderResponse)
def pay_order(order_id: UUID, payload: PayOrderRequest, db: Session = Depends(get_db), current_user=Depends(require_cashier)):
    return order_service.pay(str(order_id), payload, db, current_user)


@router.patch("/{order_id}/cancel", response_model=OrderResponse)
def cancel_order(order_id: UUID, db: Session = Depends(get_db), current_user=Depends(require_cashier)):
    return order_service.cancel(str(order_id), db, current_user)