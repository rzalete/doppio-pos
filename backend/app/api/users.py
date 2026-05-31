from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import require_admin
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.services import user as user_service

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db), _=Depends(require_admin)):
    return user_service.get_all(db)


@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: UUID, db: Session = Depends(get_db), _=Depends(require_admin)):
    return user_service.get_by_id(str(user_id), db)


@router.post("/", response_model=UserResponse, status_code=201)
def create_user(payload: UserCreate, db: Session = Depends(get_db), _=Depends(require_admin)):
    return user_service.create(payload, db)


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: UUID, payload: UserUpdate, db: Session = Depends(get_db), _=Depends(require_admin)):
    return user_service.update(str(user_id), payload, db)


@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: UUID, db: Session = Depends(get_db), _=Depends(require_admin)):
    user_service.delete(str(user_id), db)