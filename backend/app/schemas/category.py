from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class CategoryCreate(BaseModel):
    name: str


class CategoryUpdate(BaseModel):
    name: str | None = None
    is_active: bool | None = None


class CategoryResponse(BaseModel):
    id: UUID
    name: str
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}