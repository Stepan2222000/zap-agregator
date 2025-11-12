"""
Repository для работы с объявлениями (listings) и фотографиями
"""
from uuid import UUID
from typing import Optional
import logging
from app.db.connection import db

logger = logging.getLogger(__name__)


class ListingsRepository:
    """Repository для работы с таблицами listings и photos"""

    @staticmethod
    async def create_listing(
        article_number: str,
        condition: str,
        price: float,
        brand: str,
        description: Optional[str],
        contact_phone: str,
        contact_whatsapp: Optional[str],
        contact_telegram: Optional[str],
    ) -> dict:
        """
        Создать новое объявление со статусом 'processing'
        """
        query = """
            INSERT INTO listings (
                article_number, condition, price, brand, description,
                contact_phone, contact_whatsapp, contact_telegram, status
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'processing')
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
                contact_phone, contact_whatsapp, contact_telegram
            )

            logger.info(f"✅ Создано объявление: {row['id']}")
            return dict(row)

        except Exception as e:
            logger.error(f"❌ Ошибка создания объявления: {e}")
            raise

    @staticmethod
    async def add_photo(
        listing_id: UUID,
        filename: str,
        file_path: str,
        order: int
    ) -> dict:
        """
        Добавить фотографию к объявлению
        """
        query = """
            INSERT INTO photos (listing_id, filename, file_path, display_order)
            VALUES ($1, $2, $3, $4)
            RETURNING id, listing_id, filename, file_path, display_order, created_at
        """

        try:
            row = await db.fetch_one(query, listing_id, filename, file_path, order)
            return dict(row)

        except Exception as e:
            logger.error(f"❌ Ошибка добавления фото для listing {listing_id}: {e}")
            raise

    @staticmethod
    async def get_listing_by_id(listing_id: UUID) -> Optional[dict]:
        """
        Получить объявление по ID с фотографиями
        """
        # Получаем listing
        listing_query = """
            SELECT
                id, article_number, condition, price, brand, description,
                contact_phone, contact_whatsapp, contact_telegram, status,
                ai_processed_title, ai_processed_description, ai_error_message,
                part_id, created_at, updated_at
            FROM listings
            WHERE id = $1
        """

        # Получаем photos
        photos_query = """
            SELECT id, filename, file_path, display_order, created_at
            FROM photos
            WHERE listing_id = $1
            ORDER BY display_order ASC
        """

        try:
            listing_row = await db.fetch_one(listing_query, listing_id)

            if not listing_row:
                return None

            listing = dict(listing_row)

            # Получаем фотографии
            photos_rows = await db.fetch_all(photos_query, listing_id)
            listing['photos'] = [dict(row) for row in photos_rows]

            return listing

        except Exception as e:
            logger.error(f"❌ Ошибка получения listing {listing_id}: {e}")
            raise

    @staticmethod
    async def get_listing_status(listing_id: UUID) -> Optional[dict]:
        """
        Получить только статус объявления
        """
        query = """
            SELECT id, status, ai_error_message, updated_at
            FROM listings
            WHERE id = $1
        """

        try:
            row = await db.fetch_one(query, listing_id)
            return dict(row) if row else None

        except Exception as e:
            logger.error(f"❌ Ошибка получения статуса listing {listing_id}: {e}")
            raise

    @staticmethod
    async def update_listing_status(
        listing_id: UUID,
        status: str,
        ai_processed_title: Optional[str] = None,
        ai_processed_description: Optional[str] = None,
        ai_error_message: Optional[str] = None
    ):
        """
        Обновить статус и AI данные объявления
        """
        query = """
            UPDATE listings
            SET
                status = $2,
                ai_processed_title = COALESCE($3, ai_processed_title),
                ai_processed_description = COALESCE($4, ai_processed_description),
                ai_error_message = $5,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
        """

        try:
            await db.execute(
                query,
                listing_id, status, ai_processed_title,
                ai_processed_description, ai_error_message
            )

            logger.info(f"✅ Обновлён статус listing {listing_id} → {status}")

        except Exception as e:
            logger.error(f"❌ Ошибка обновления статуса listing {listing_id}: {e}")
            raise


# Глобальный экземпляр
listings_repo = ListingsRepository()
