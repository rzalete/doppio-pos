from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class ProductCreate(BaseModel):
    category_id: UUID
    name: str
    description: str | None = None
    price: Decimal
    image_url: str | None = None
    is_available: bool = True


class ProductUpdate(BaseModel):
    category_id: UUID | None = None
    name: str | None = None
    description: str | None = None
    price: Decimal | None = None
    image_url: str | None = None
    is_available: bool | None = None


class ProductResponse(BaseModel):
    id: UUID
    category_id: UUID
    name: str
    description: str | None
    price: Decimal
    image_url: str | None
    is_available: bool
    created_at: datetime
    category: "CategoryInProduct | None" = None

    model_config = {"from_attributes": True}


class CategoryInProduct(BaseModel):
    id: UUID
    name: str

    model_config = {"from_attributes": True}


ProductResponse.model_rebuild()