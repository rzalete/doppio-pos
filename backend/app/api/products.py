from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.schemas.product import ProductCreate, ProductResponse, ProductUpdate
from app.services import product as product_service

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("/", response_model=list[ProductResponse])
def get_products(
    category_id: UUID | None = Query(default=None),
    db: Session = Depends(get_db),
    _=Depends(get_current_user),
):
    return product_service.get_all(db, str(category_id) if category_id else None)


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return product_service.get_by_id(str(product_id), db)


@router.post("/", response_model=ProductResponse, status_code=201)
def create_product(payload: ProductCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    return product_service.create(payload, db)


@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: UUID, payload: ProductUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    return product_service.update(str(product_id), payload, db)


@router.delete("/{product_id}", status_code=204)
def delete_product(product_id: UUID, db: Session = Depends(get_db), _=Depends(require_admin)):
    product_service.delete(str(product_id), db)