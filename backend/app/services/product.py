from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


def get_all(db: Session, category_id: str | None = None) -> list[Product]:
    query = db.query(Product)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    return query.order_by(Product.name).all()


def get_by_id(product_id: str, db: Session) -> Product:
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


def create(payload: ProductCreate, db: Session) -> Product:
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


def update(product_id: str, payload: ProductUpdate, db: Session) -> Product:
    product = get_by_id(product_id, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


def delete(product_id: str, db: Session) -> None:
    product = get_by_id(product_id, db)
    db.delete(product)
    db.commit()