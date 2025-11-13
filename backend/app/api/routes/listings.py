"""
API эндпоинты для работы с объявлениями
"""
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, BackgroundTasks, Query
from typing import List, Optional
from uuid import UUID
from decimal import Decimal
import logging

from app.schemas import (
    ListingCreate, ListingResponse, ListingStatusResponse,
    PhotoResponse, SearchResultResponse
)
from app.db.listings_repository import listings_repo
from app.services.file_upload import file_upload_service
from app.services.ai_service import ai_service
from app.services.search_service import search_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/listings", tags=["listings"])


@router.post("/", response_model=ListingResponse, status_code=201)
async def create_listing(
    background_tasks: BackgroundTasks,
    article_number: str = Form(...),
    condition: str = Form(...),
    price: float = Form(..., gt=0),
    brand: str = Form(...),
    description: Optional[str] = Form(None),
    contact_phone: str = Form(...),
    contact_whatsapp: Optional[str] = Form(None),
    contact_telegram: Optional[str] = Form(None),
    photos: List[UploadFile] = File(None),
):
    """
    Создать новое объявление о продаже автозапчасти.

    - **article_number**: Артикул запчасти (обязательно)
    - **condition**: Состояние - "new" или "used" (обязательно)
    - **price**: Цена в рублях (обязательно, > 0)
    - **brand**: Марка автомобиля (обязательно)
    - **description**: Описание запчасти (необязательно)
    - **contact_phone**: Контактный телефон (обязательно)
    - **contact_whatsapp**: WhatsApp (необязательно)
    - **contact_telegram**: Telegram (необязательно)
    - **photos**: Фотографии (от 1 до 10 файлов)
    """

    try:
        # Валидация входных данных через Pydantic
        listing_data = ListingCreate(
            article_number=article_number,
            condition=condition,
            price=price,
            brand=brand,
            description=description,
            contact_phone=contact_phone,
            contact_whatsapp=contact_whatsapp,
            contact_telegram=contact_telegram,
        )

        # Создание объявления в БД со статусом 'processing'
        listing_dict = await listings_repo.create_listing(
            article_number=listing_data.article_number,
            condition=listing_data.condition,
            price=float(listing_data.price),
            brand=listing_data.brand,
            description=listing_data.description,
            contact_phone=listing_data.contact_phone,
            contact_whatsapp=listing_data.contact_whatsapp,
            contact_telegram=listing_data.contact_telegram,
        )

        listing_id = listing_dict['id']

        # Story 2.2 - Обработка и сохранение фотографий
        if photos:
            saved_photos = await file_upload_service.save_photos(listing_id, photos)
            listing_dict['photos'] = saved_photos
        else:
            listing_dict['photos'] = []

        # Story 2.4 - Запуск AI обработки в фоне
        background_tasks.add_task(ai_service.process_listing, listing_id)

        logger.info(f"✅ Объявление {listing_id} создано с {len(listing_dict['photos'])} фото и отправлено на AI обработку")

        # Возвращаем созданное объявление
        return ListingResponse(**listing_dict)

    except ValueError as e:
        logger.warning(f"⚠️ Ошибка валидации данных: {e}")
        raise HTTPException(status_code=400, detail=f"Ошибка валидации: {str(e)}")

    except HTTPException:
        # Пробросить HTTPException от FileUploadService
        raise

    except Exception as e:
        logger.error(f"❌ Ошибка создания объявления: {e}")
        raise HTTPException(
            status_code=500,
            detail="Не удалось создать объявление. Попробуйте позже."
        )


@router.get("/", response_model=SearchResultResponse)
async def search_listings(
    q: Optional[str] = Query(None, max_length=255, description="Поиск по артикулу, названию или описанию"),
    brand: Optional[str] = Query(None, description="Фильтр по марке автомобиля"),
    condition: Optional[str] = Query(None, regex="^(new|used)$", description="Фильтр по состоянию"),
    price_min: Optional[Decimal] = Query(None, ge=0, description="Минимальная цена"),
    price_max: Optional[Decimal] = Query(None, ge=0, description="Максимальная цена"),
    page: int = Query(1, ge=1, description="Номер страницы"),
    limit: int = Query(20, ge=1, le=100, description="Количество на странице"),
):
    """
    Поиск и фильтрация объявлений (только approved)

    Story 4.1: Search & Filter API Endpoints

    Параметры:
    - **q**: Текстовый поиск по артикулу, названию, описанию
    - **brand**: Фильтр по марке (BMW, Audi, Toyota и т.д.)
    - **condition**: Фильтр по состоянию ("new" или "used")
    - **price_min**: Минимальная цена в рублях
    - **price_max**: Максимальная цена в рублях
    - **page**: Номер страницы (начинается с 1)
    - **limit**: Количество результатов на странице (макс 100)

    Возвращает только одобренные объявления (status = 'approved')
    """
    try:
        # Валидация диапазона цен
        if price_min is not None and price_max is not None and price_min > price_max:
            raise HTTPException(
                status_code=400,
                detail="Минимальная цена не может быть больше максимальной"
            )

        # Вызов сервиса поиска
        result = await search_service.search_listings(
            query=q,
            brand=brand,
            condition=condition,
            price_min=price_min,
            price_max=price_max,
            page=page,
            limit=limit
        )

        return SearchResultResponse(**result)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Ошибка поиска объявлений: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка выполнения поиска"
        )


@router.get("/{listing_id}", response_model=ListingResponse)
async def get_listing(listing_id: UUID):
    """
    Получить объявление по ID
    """
    try:
        listing = await listings_repo.get_listing_by_id(listing_id)

        if not listing:
            raise HTTPException(status_code=404, detail="Объявление не найдено")

        return ListingResponse(**listing)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Ошибка получения объявления {listing_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка получения объявления"
        )


@router.get("/{listing_id}/status", response_model=ListingStatusResponse)
async def get_listing_status(listing_id: UUID):
    """
    Получить статус обработки объявления
    """
    try:
        status_data = await listings_repo.get_listing_status(listing_id)

        if not status_data:
            raise HTTPException(status_code=404, detail="Объявление не найдено")

        return ListingStatusResponse(
            listing_id=status_data['id'],
            status=status_data['status'],
            ai_error_message=status_data['ai_error_message'],
            updated_at=status_data['updated_at']
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Ошибка получения статуса {listing_id}: {e}")
        raise HTTPException(
            status_code=500,
            detail="Ошибка получения статуса"
        )
