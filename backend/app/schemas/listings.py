"""
Pydantic схемы для объявлений (listings)
"""
from datetime import datetime
from decimal import Decimal
from typing import Optional, Literal
from uuid import UUID
from pydantic import BaseModel, Field, field_validator, model_validator


class ListingCreate(BaseModel):
    """
    Схема для создания нового объявления
    Используется при POST /api/listings
    """
    article_number: str = Field(..., min_length=1, max_length=255, description="Артикул запчасти")
    condition: Literal['new', 'used'] = Field(..., description="Состояние: новое или б/у")
    price: Decimal = Field(..., gt=0, decimal_places=2, description="Цена в рублях")
    brand: str = Field(..., min_length=1, max_length=255, description="Марка автомобиля")
    description: Optional[str] = Field(None, description="Описание от продавца")
    contact_phone: str = Field(..., min_length=10, max_length=50, description="Телефон для связи")
    contact_whatsapp: Optional[str] = Field(None, max_length=50, description="WhatsApp для связи")
    contact_telegram: Optional[str] = Field(None, max_length=50, description="Telegram для связи")

    @field_validator('article_number', 'brand')
    @classmethod
    def strip_whitespace(cls, v: str) -> str:
        """Убрать лишние пробелы"""
        return v.strip()

    @field_validator('contact_phone', 'contact_whatsapp', 'contact_telegram')
    @classmethod
    def strip_contacts(cls, v: Optional[str]) -> Optional[str]:
        """Убрать лишние пробелы из контактов"""
        return v.strip() if v else v

    @model_validator(mode='after')
    def validate_contacts(self):
        """Проверить, что указан хотя бы один контакт"""
        if not self.contact_phone:
            raise ValueError("Необходимо указать номер телефона")
        return self

    class Config:
        json_schema_extra = {
            "example": {
                "article_number": "W712/75",
                "condition": "new",
                "price": "1250.00",
                "brand": "BMW",
                "description": "Оригинальный масляный фильтр Mann",
                "contact_phone": "+79991234567",
                "contact_whatsapp": "+79991234567",
                "contact_telegram": "@username"
            }
        }


class PhotoResponse(BaseModel):
    """
    Схема для фотографии объявления
    """
    id: UUID = Field(..., description="ID фотографии")
    listing_id: UUID = Field(..., description="ID объявления")
    filename: str = Field(..., description="Имя файла")
    file_path: str = Field(..., description="Путь к файлу")
    display_order: int = Field(..., description="Порядок отображения")
    created_at: datetime = Field(..., description="Дата загрузки")

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "660e8400-e29b-41d4-a716-446655440001",
                "listing_id": "550e8400-e29b-41d4-a716-446655440000",
                "filename": "photo_1.jpg",
                "file_path": "uploads/550e8400-e29b-41d4-a716-446655440000/photo_1.jpg",
                "display_order": 0,
                "created_at": "2025-11-12T10:30:00Z"
            }
        }


class ListingResponse(BaseModel):
    """
    Схема для возврата объявления клиенту
    Содержит всю информацию об объявлении, включая AI результаты
    """
    id: UUID = Field(..., description="ID объявления")
    article_number: str = Field(..., description="Артикул запчасти")
    condition: Literal['new', 'used'] = Field(..., description="Состояние")
    price: Decimal = Field(..., description="Цена")
    brand: str = Field(..., description="Марка автомобиля")
    description: Optional[str] = Field(None, description="Описание продавца")
    contact_phone: str = Field(..., description="Телефон")
    contact_whatsapp: Optional[str] = Field(None, description="WhatsApp")
    contact_telegram: Optional[str] = Field(None, description="Telegram")
    status: Literal['processing', 'pending', 'approved', 'rejected'] = Field(..., description="Статус объявления")
    ai_processed_title: Optional[str] = Field(None, description="Название от AI")
    ai_processed_description: Optional[str] = Field(None, description="Описание от AI")
    ai_error_message: Optional[str] = Field(None, description="Сообщение об ошибке AI")
    part_id: Optional[UUID] = Field(None, description="ID запчасти (внутренний)")
    photos: list[PhotoResponse] = Field(default_factory=list, description="Фотографии")
    created_at: datetime = Field(..., description="Дата создания")
    updated_at: datetime = Field(..., description="Дата обновления")

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "article_number": "W712/75",
                "condition": "new",
                "price": "1250.00",
                "brand": "BMW",
                "description": "Оригинальный масляный фильтр",
                "contact_phone": "+79991234567",
                "contact_whatsapp": "+79991234567",
                "contact_telegram": "@username",
                "status": "processing",
                "ai_processed_title": None,
                "ai_processed_description": None,
                "ai_error_message": None,
                "part_id": None,
                "photos": [],
                "created_at": "2025-11-12T10:30:00Z",
                "updated_at": "2025-11-12T10:30:00Z"
            }
        }


class ListingStatusResponse(BaseModel):
    """
    Схема для проверки статуса объявления
    Используется для GET /api/listings/{id}/status
    """
    status: Literal['processing', 'pending', 'approved', 'rejected'] = Field(..., description="Текущий статус")
    ai_error_message: Optional[str] = Field(None, description="Ошибка AI (если есть)")

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "status": "pending",
                "ai_error_message": None
            }
        }
