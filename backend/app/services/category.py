from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryUpdate


def get_all(db: Session) -> list[Category]:
    return db.query(Category).order_by(Category.name).all()


def get_by_id(category_id: str, db: Session) -> Category:
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return category


def create(payload: CategoryCreate, db: Session) -> Category:
    existing = db.query(Category).filter(Category.name == payload.name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Category name already exists")
    category = Category(name=payload.name)
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


def update(category_id: str, payload: CategoryUpdate, db: Session) -> Category:
    category = get_by_id(category_id, db)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(category, field, value)
    db.commit()
    db.refresh(category)
    return category


def delete(category_id: str, db: Session) -> None:
    category = get_by_id(category_id, db)
    db.delete(category)
    db.commit()