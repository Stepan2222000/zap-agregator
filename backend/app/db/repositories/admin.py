"""
Repository для админских операций с объявлениями
"""
import logging
from typing import Optional, List, Dict, Any
from datetime import datetime
import asyncpg

logger = logging.getLogger(__name__)


class AdminRepository:
    """Repository для админ-панели"""

    def __init__(self, connection: asyncpg.Connection):
        self.connection = connection

    async def get_listings(
        self,
        status: Optional[str] = None,
        page: int = 1,
        limit: int = 20,
    ) -> Dict[str, Any]:
        """
        Получить список объявлений с фильтрацией и пагинацией.

        Args:
            status: Фильтр по статусу (processing/pending/approved/rejected)
            page: Номер страницы (начиная с 1)
            limit: Количество объявлений на странице

        Returns:
            Словарь с объявлениями и метаданными пагинации
        """
        offset = (page - 1) * limit

        # Базовый запрос
        base_query = """
            SELECT
                l.id,
                l.article_number,
                l.brand,
                l.price,
                l.status,
                l.created_at,
                l.ai_error_message
            FROM listings l
        """

        count_query = "SELECT COUNT(*) FROM listings l"

        # Добавляем фильтр по статусу если указан
        where_clause = ""
        params_list = []
        param_index = 1

        if status:
            where_clause = f" WHERE l.status = ${param_index}"
            params_list.append(status)
            param_index += 1

        # Подсчитываем общее количество
        total = await self.connection.fetchval(count_query + where_clause, *params_list)

        # Получаем объявления
        query = (
            base_query
            + where_clause
            + f" ORDER BY l.created_at DESC LIMIT ${param_index} OFFSET ${param_index + 1}"
        )
        params_list.extend([limit, offset])

        rows = await self.connection.fetch(query, *params_list)

        # Преобразуем в список словарей
        listings = [dict(row) for row in rows]

        # Подсчитываем количество страниц
        pages = (total + limit - 1) // limit if total > 0 else 0

        return {
            "items": listings,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": pages,
        }

    async def get_listing_detail(self, listing_id: str) -> Optional[Dict[str, Any]]:
        """
        Получить детальную информацию об объявлении для модерации.

        Args:
            listing_id: ID объявления

        Returns:
            Словарь с полной информацией или None если не найдено
        """
        # Получаем основную информацию объявления
        query = """
            SELECT
                l.id,
                l.article_number,
                l.brand,
                l.condition,
                l.price,
                l.description,
                l.status,
                l.created_at,
                l.updated_at,
                l.contact_phone,
                l.contact_whatsapp,
                l.contact_telegram,
                l.ai_processed_title,
                l.ai_processed_description,
                l.ai_error_message,
                l.part_id,
                p.canonical_name as part_name
            FROM listings l
            LEFT JOIN parts p ON l.part_id = p.id
            WHERE l.id = $1
        """

        listing_row = await self.connection.fetchrow(query, listing_id)

        if not listing_row:
            return None

        listing = dict(listing_row)

        # Получаем фотографии
        photos_query = """
            SELECT id, filename, file_path, display_order, created_at
            FROM photos
            WHERE listing_id = $1
            ORDER BY display_order
        """
        photo_rows = await self.connection.fetch(photos_query, listing_id)
        listing["photos"] = [dict(row) for row in photo_rows]

        return listing

    async def get_moderation_history(self, listing_id: str) -> List[Dict[str, Any]]:
        """
        Получить историю модерации объявления.

        Args:
            listing_id: ID объявления

        Returns:
            Список действий модератора
        """
        query = """
            SELECT
                id,
                action,
                moderator_note,
                created_at
            FROM moderation_log
            WHERE listing_id = $1
            ORDER BY created_at DESC
        """

        rows = await self.connection.fetch(query, listing_id)
        return [dict(row) for row in rows]

    async def get_stats_by_status(self) -> Dict[str, int]:
        """
        Получить статистику объявлений по статусам.

        Returns:
            Словарь с количеством объявлений для каждого статуса
        """
        query = """
            SELECT status, COUNT(*) as count
            FROM listings
            GROUP BY status
        """

        rows = await self.connection.fetch(query)

        stats = {
            "processing": 0,
            "pending": 0,
            "approved": 0,
            "rejected": 0,
        }

        for row in rows:
            stats[row["status"]] = row["count"]

        return stats

    async def approve_listing(self, listing_id: str, moderator_note: Optional[str] = None) -> bool:
        """
        Одобрить объявление.

        Args:
            listing_id: ID объявления
            moderator_note: Заметка модератора (опционально)

        Returns:
            True если успешно
        """
        # Обновляем статус объявления
        update_query = """
            UPDATE listings
            SET status = 'approved', updated_at = NOW()
            WHERE id = $1
            RETURNING id
        """

        result = await self.connection.fetchrow(update_query, listing_id)

        if not result:
            return False

        # Записываем в лог модерации
        log_query = """
            INSERT INTO moderation_log (listing_id, action, moderator_note)
            VALUES ($1, 'approved', $2)
        """
        await self.connection.execute(log_query, listing_id, moderator_note)

        logger.info(f"Объявление {listing_id} одобрено")
        return True

    async def reject_listing(self, listing_id: str, moderator_note: Optional[str] = None) -> bool:
        """
        Отклонить объявление.

        Args:
            listing_id: ID объявления
            moderator_note: Причина отклонения (опционально)

        Returns:
            True если успешно
        """
        # Обновляем статус объявления
        update_query = """
            UPDATE listings
            SET status = 'rejected', updated_at = NOW()
            WHERE id = $1
            RETURNING id
        """

        result = await self.connection.fetchrow(update_query, listing_id)

        if not result:
            return False

        # Записываем в лог модерации
        log_query = """
            INSERT INTO moderation_log (listing_id, action, moderator_note)
            VALUES ($1, 'rejected', $2)
        """
        await self.connection.execute(log_query, listing_id, moderator_note)

        logger.info(f"Объявление {listing_id} отклонено")
        return True

    async def reprocess_listing(self, listing_id: str) -> bool:
        """
        Отправить объявление на повторную обработку AI.

        Args:
            listing_id: ID объявления

        Returns:
            True если успешно
        """
        # Обновляем статус и очищаем AI данные
        update_query = """
            UPDATE listings
            SET status = 'processing',
                ai_processed_title = NULL,
                ai_processed_description = NULL,
                ai_error_message = NULL,
                updated_at = NOW()
            WHERE id = $1
            RETURNING id
        """

        result = await self.connection.fetchrow(update_query, listing_id)

        if not result:
            return False

        # Записываем в лог модерации
        log_query = """
            INSERT INTO moderation_log (listing_id, action, moderator_note)
            VALUES ($1, 'reprocess_ai', 'Отправлено на повторную обработку AI')
        """
        await self.connection.execute(log_query, listing_id)

        logger.info(f"Объявление {listing_id} отправлено на повторную обработку AI")
        return True
