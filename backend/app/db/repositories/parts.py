"""
Repository для управления запчастями (parts) и артикулами
"""
import logging
from typing import Optional, List, Dict, Any
from asyncpg import Connection

logger = logging.getLogger(__name__)


class PartsRepository:
    """Класс для работы с запчастями и артикулами"""

    def __init__(self, connection: Connection):
        self.connection = connection

    async def create_part(
        self,
        internal_code: str,
        canonical_name: str,
        description: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Создать новую запчасть.

        Args:
            internal_code: Внутренний код запчасти (должен быть уникальным)
            canonical_name: Каноническое название запчасти
            description: Описание (опционально)

        Returns:
            Словарь с данными созданной запчасти

        Raises:
            UniqueViolationError: Если internal_code уже существует
        """
        query = """
            INSERT INTO parts (internal_code, canonical_name, description)
            VALUES ($1, $2, $3)
            RETURNING id, internal_code, canonical_name, description, created_at, updated_at
        """

        row = await self.connection.fetchrow(
            query, internal_code, canonical_name, description
        )

        logger.info(f"Создана новая запчасть: {internal_code}")
        return dict(row)

    async def search_parts(self, query: str, limit: int = 20) -> List[Dict[str, Any]]:
        """
        Поиск запчастей по internal_code или canonical_name.

        Args:
            query: Поисковый запрос
            limit: Максимальное количество результатов

        Returns:
            Список найденных запчастей
        """
        search_query = """
            SELECT
                p.id,
                p.internal_code,
                p.canonical_name,
                p.description,
                p.created_at,
                p.updated_at,
                COUNT(DISTINCT a.id) as article_count,
                COUNT(DISTINCT l.id) as listing_count
            FROM parts p
            LEFT JOIN article_numbers a ON p.id = a.part_id
            LEFT JOIN listings l ON p.id = l.part_id
            WHERE
                p.internal_code ILIKE $1
                OR p.canonical_name ILIKE $1
            GROUP BY p.id
            ORDER BY p.created_at DESC
            LIMIT $2
        """

        search_pattern = f"%{query}%"
        rows = await self.connection.fetch(search_query, search_pattern, limit)

        return [dict(row) for row in rows]

    async def get_part_by_id(self, part_id: str) -> Optional[Dict[str, Any]]:
        """
        Получить запчасть по ID.

        Args:
            part_id: UUID запчасти

        Returns:
            Словарь с данными запчасти или None
        """
        query = """
            SELECT
                id,
                internal_code,
                canonical_name,
                description,
                created_at,
                updated_at
            FROM parts
            WHERE id = $1
        """

        row = await self.connection.fetchrow(query, part_id)
        return dict(row) if row else None

    async def get_part_with_articles(self, part_id: str) -> Optional[Dict[str, Any]]:
        """
        Получить запчасть со всеми её артикулами.

        Args:
            part_id: UUID запчасти

        Returns:
            Словарь с данными запчасти и списком артикулов
        """
        # Получаем данные запчасти
        part = await self.get_part_by_id(part_id)
        if not part:
            return None

        # Получаем все артикулы
        articles_query = """
            SELECT
                id,
                article_number,
                manufacturer,
                created_at
            FROM article_numbers
            WHERE part_id = $1
            ORDER BY created_at ASC
        """

        articles = await self.connection.fetch(articles_query, part_id)

        part["article_numbers"] = [dict(row) for row in articles]
        return part

    async def add_article_number(
        self,
        part_id: str,
        article_number: str,
        manufacturer: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Добавить артикул к запчасти.

        Args:
            part_id: UUID запчасти
            article_number: Артикул
            manufacturer: Производитель (опционально)

        Returns:
            Словарь с данными созданного артикула

        Raises:
            UniqueViolationError: Если такой артикул уже привязан к этой запчасти
        """
        query = """
            INSERT INTO article_numbers (part_id, article_number, manufacturer)
            VALUES ($1, $2, $3)
            RETURNING id, part_id, article_number, manufacturer, created_at
        """

        row = await self.connection.fetchrow(query, part_id, article_number, manufacturer)

        logger.info(f"Добавлен артикул {article_number} к запчасти {part_id}")
        return dict(row)

    async def link_listing_to_part(self, listing_id: str, part_id: str) -> bool:
        """
        Привязать объявление к запчасти.

        Args:
            listing_id: UUID объявления
            part_id: UUID запчасти

        Returns:
            True если успешно
        """
        query = """
            UPDATE listings
            SET part_id = $1, updated_at = NOW()
            WHERE id = $2
            RETURNING id
        """

        result = await self.connection.fetchrow(query, part_id, listing_id)

        if result:
            logger.info(f"Объявление {listing_id} привязано к запчасти {part_id}")
            return True

        return False

    async def get_part_by_internal_code(self, internal_code: str) -> Optional[Dict[str, Any]]:
        """
        Получить запчасть по internal_code.

        Args:
            internal_code: Внутренний код запчасти

        Returns:
            Словарь с данными запчасти или None
        """
        query = """
            SELECT
                id,
                internal_code,
                canonical_name,
                description,
                created_at,
                updated_at
            FROM parts
            WHERE internal_code = $1
        """

        row = await self.connection.fetchrow(query, internal_code)
        return dict(row) if row else None

    async def search_by_article_number(self, article_number: str) -> List[Dict[str, Any]]:
        """
        Поиск запчастей по артикулу.

        Args:
            article_number: Артикул для поиска

        Returns:
            Список найденных запчастей с их артикулами
        """
        query = """
            SELECT
                p.id,
                p.internal_code,
                p.canonical_name,
                p.description,
                a.article_number,
                a.manufacturer
            FROM parts p
            INNER JOIN article_numbers a ON p.id = a.part_id
            WHERE a.article_number ILIKE $1
            ORDER BY p.created_at DESC
        """

        search_pattern = f"%{article_number}%"
        rows = await self.connection.fetch(query, search_pattern)

        return [dict(row) for row in rows]
