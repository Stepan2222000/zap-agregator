"""
Repository для работы с объявлениями (listings)
Использует asyncpg для прямых SQL запросов
"""
from typing import Optional
from uuid import UUID
from datetime import datetime
import logging

from ..connection import db

logger = logging.getLogger(__name__)


class ListingsRepository:
    """
    Repository для работы с таблицей listings
    Все методы работают через чистый SQL без ORM
    """

    async def create_listing(
        self,
        article_number: str,
        condition: str,
        price: float,
        brand: str,
        description: Optional[str],
        contact_phone: str,
        contact_whatsapp: Optional[str],
        contact_telegram: Optional[str],
        status: str = "processing"
    ) -> dict:
        """
        Создать новое объявление в БД

        Args:
            article_number: Артикул запчасти
            condition: Состояние ('new' или 'used')
            price: Цена
            brand: Марка автомобиля
            description: Описание от продавца (опционально)
            contact_phone: Телефон
            contact_whatsapp: WhatsApp (опционально)
            contact_telegram: Telegram (опционально)
            status: Статус (по умолчанию 'processing')

        Returns:
            dict: Созданное объявление
        """
        query = """
            INSERT INTO listings (
                article_number, condition, price, brand, description,
                contact_phone, contact_whatsapp, contact_telegram, status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING
                id, article_number, condition, price, brand, description,
                contact_phone, contact_whatsapp, contact_telegram, status,
                ai_processed_title, ai_processed_description, ai_error_message,
                part_id, created_at, updated_at
        """

        try:
            row = await db.fetch_one(
                query,
                article_number, condition, price, brand, description,
                contact_phone, contact_whatsapp, contact_telegram, status
            )

            logger.info(f"✅ Создано объявление: {row['id']} (артикул: {article_number})")
            return dict(row)

        except Exception as e:
            logger.error(f"❌ Ошибка создания объявления: {e}")
            raise

    async def get_listing_by_id(self, listing_id: UUID) -> Optional[dict]:
        """
        Получить объявление по ID

        Args:
            listing_id: UUID объявления

        Returns:
            dict или None: Данные объявления или None если не найдено
        """
        query = """
            SELECT
                id, article_number, condition, price, brand, description,
                contact_phone, contact_whatsapp, contact_telegram, status,
                ai_processed_title, ai_processed_description, ai_error_message,
                part_id, created_at, updated_at
            FROM listings
            WHERE id = $1
        """

        try:
            row = await db.fetch_one(query, listing_id)
            return dict(row) if row else None

        except Exception as e:
            logger.error(f"❌ Ошибка получения объявления {listing_id}: {e}")
            raise

    async def get_listing_status(self, listing_id: UUID) -> Optional[dict]:
        """
        Получить только статус объявления

        Args:
            listing_id: UUID объявления

        Returns:
            dict или None: Статус и сообщение об ошибке AI (если есть)
        """
        query = """
            SELECT status, ai_error_message
            FROM listings
            WHERE id = $1
        """

        try:
            row = await db.fetch_one(query, listing_id)
            return dict(row) if row else None

        except Exception as e:
            logger.error(f"❌ Ошибка получения статуса {listing_id}: {e}")
            raise

    async def update_listing_status(
        self,
        listing_id: UUID,
        status: str,
        ai_error_message: Optional[str] = None
    ) -> None:
        """
        Обновить статус объявления

        Args:
            listing_id: UUID объявления
            status: Новый статус
            ai_error_message: Сообщение об ошибке AI (опционально)
        """
        query = """
            UPDATE listings
            SET status = $1, ai_error_message = $2
            WHERE id = $3
        """

        try:
            await db.execute(query, status, ai_error_message, listing_id)
            logger.info(f"✅ Обновлен статус объявления {listing_id}: {status}")

        except Exception as e:
            logger.error(f"❌ Ошибка обновления статуса {listing_id}: {e}")
            raise

    async def update_listing_ai_data(
        self,
        listing_id: UUID,
        ai_processed_title: Optional[str],
        ai_processed_description: Optional[str],
        status: str = "pending"
    ) -> None:
        """
        Обновить данные объявления после AI обработки

        Args:
            listing_id: UUID объявления
            ai_processed_title: Название от AI
            ai_processed_description: Описание от AI
            status: Новый статус (по умолчанию 'pending')
        """
        query = """
            UPDATE listings
            SET
                ai_processed_title = $1,
                ai_processed_description = $2,
                status = $3,
                ai_error_message = NULL
            WHERE id = $4
        """

        try:
            await db.execute(
                query,
                ai_processed_title, ai_processed_description, status, listing_id
            )
            logger.info(f"✅ Обновлены AI данные для объявления {listing_id}")

        except Exception as e:
            logger.error(f"❌ Ошибка обновления AI данных {listing_id}: {e}")
            raise

    async def get_listings_by_status(
        self,
        status: str,
        page: int = 1,
        limit: int = 20
    ) -> tuple[list[dict], int]:
        """
        Получить объявления по статусу с пагинацией

        Args:
            status: Статус для фильтрации
            page: Номер страницы (начинается с 1)
            limit: Количество записей на странице

        Returns:
            tuple: (список объявлений, общее количество)
        """
        offset = (page - 1) * limit

        # Запрос для получения записей
        query_data = """
            SELECT
                id, article_number, condition, price, brand, description,
                contact_phone, contact_whatsapp, contact_telegram, status,
                ai_processed_title, ai_processed_description, ai_error_message,
                part_id, created_at, updated_at
            FROM listings
            WHERE status = $1
            ORDER BY created_at DESC
            LIMIT $2 OFFSET $3
        """

        # Запрос для подсчета общего количества
        query_count = """
            SELECT COUNT(*) as total
            FROM listings
            WHERE status = $1
        """

        try:
            rows = await db.fetch_all(query_data, status, limit, offset)
            count_row = await db.fetch_one(query_count, status)

            listings = [dict(row) for row in rows]
            total = count_row['total'] if count_row else 0

            return listings, total

        except Exception as e:
            logger.error(f"❌ Ошибка получения объявлений по статусу {status}: {e}")
            raise


# Глобальный экземпляр repository
listings_repo = ListingsRepository()
