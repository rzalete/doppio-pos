from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user, require_admin
from app.schemas.category import CategoryCreate, CategoryResponse, CategoryUpdate
from app.services import category as category_service

router = APIRouter(prefix="/categories", tags=["Categories"])


@router.get("/", response_model=list[CategoryResponse])
def get_categories(db: Session = Depends(get_db), _=Depends(get_current_user)):
    return category_service.get_all(db)


@router.get("/{category_id}", response_model=CategoryResponse)
def get_category(category_id: UUID, db: Session = Depends(get_db), _=Depends(get_current_user)):
    return category_service.get_by_id(str(category_id), db)


@router.post("/", response_model=CategoryResponse, status_code=201)
def create_category(payload: CategoryCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    return category_service.create(payload, db)


@router.put("/{category_id}", response_model=CategoryResponse)
def update_category(category_id: UUID, payload: CategoryUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    return category_service.update(str(category_id), payload, db)


@router.delete("/{category_id}", status_code=204)
def delete_category(category_id: UUID, db: Session = Depends(get_db), _=Depends(require_admin)):
    category_service.delete(str(category_id), db)