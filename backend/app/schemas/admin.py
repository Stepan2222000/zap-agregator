"""
Pydantic схемы для админки
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel
from app.schemas.listings import PhotoResponse


class AdminListingPreview(BaseModel):
    """Превью объявления для админской таблицы"""

    id: str
    article_number: str
    brand: str
    price: float
    status: str
    created_at: datetime
    ai_error_message: Optional[str] = None


class AdminListingsResponse(BaseModel):
    """Ответ со списком объявлений для админки с пагинацией"""

    items: List[AdminListingPreview]
    total: int
    page: int
    limit: int
    pages: int


class AdminListingDetail(BaseModel):
    """Детальная информация об объявлении для модерации"""

    # Основная информация
    id: str
    article_number: str
    brand: str
    condition: str
    price: float
    description: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    # Контактные данные
    contact_phone: str
    contact_whatsapp: Optional[str] = None
    contact_telegram: Optional[str] = None

    # AI обработка
    ai_processed_title: Optional[str] = None
    ai_processed_description: Optional[str] = None
    ai_error_message: Optional[str] = None

    # Фотографии
    photos: List[PhotoResponse]

    # Привязка к запчасти
    part_id: Optional[str] = None
    part_name: Optional[str] = None


class ModerationAction(BaseModel):
    """История действия модератора"""

    id: str
    action: str  # approved, rejected, reprocessed
    moderator_note: Optional[str] = None
    created_at: datetime


class AdminListingWithHistory(AdminListingDetail):
    """Детальная информация с историей модерации"""

    moderation_history: List[ModerationAction] = []


# Схемы для работы с запчастями (Parts)


class ArticleNumberResponse(BaseModel):
    """Артикул запчасти"""

    id: str
    article_number: str
    manufacturer: Optional[str] = None
    created_at: datetime


class PartResponse(BaseModel):
    """Информация о запчасти"""

    id: str
    internal_code: str
    canonical_name: str
    description: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class PartWithArticlesResponse(PartResponse):
    """Запчасть со списком артикулов"""

    article_numbers: List[ArticleNumberResponse] = []


class PartSearchResultResponse(BaseModel):
    """Результат поиска запчасти"""

    id: str
    internal_code: str
    canonical_name: str
    description: Optional[str] = None
    article_count: int
    listing_count: int
    created_at: datetime
    updated_at: datetime


class CreatePartRequest(BaseModel):
    """Запрос на создание запчасти"""

    internal_code: str
    canonical_name: str
    description: Optional[str] = None


class AddArticleNumberRequest(BaseModel):
    """Запрос на добавление артикула"""

    article_number: str
    manufacturer: Optional[str] = None


class LinkPartRequest(BaseModel):
    """Запрос на привязку объявления к запчасти"""

    part_id: str
