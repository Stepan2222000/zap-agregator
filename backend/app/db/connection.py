"""
Управление подключением к PostgreSQL через asyncpg
"""
import asyncpg
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class Database:
    """Класс для управления connection pool к PostgreSQL"""

    def __init__(self):
        self.pool: Optional[asyncpg.Pool] = None

    async def connect(self, database_url: str, min_size: int = 5, max_size: int = 20):
        """Создание connection pool"""
        try:
            self.pool = await asyncpg.create_pool(
                database_url,
                min_size=min_size,
                max_size=max_size
            )
            logger.info("✅ Подключение к БД установлено")
        except Exception as e:
            logger.error(f"❌ Ошибка подключения к БД: {e}")
            raise

    async def disconnect(self):
        """Закрытие connection pool"""
        if self.pool:
            await self.pool.close()
            logger.info("Подключение к БД закрыто")

    async def fetch_one(self, query: str, *args):
        """Получить одну запись"""
        async with self.pool.acquire() as connection:
            return await connection.fetchrow(query, *args)

    async def fetch_all(self, query: str, *args):
        """Получить все записи"""
        async with self.pool.acquire() as connection:
            return await connection.fetch(query, *args)

    async def execute(self, query: str, *args):
        """Выполнить запрос без возврата данных"""
        async with self.pool.acquire() as connection:
            return await connection.execute(query, *args)


# Глобальный экземпляр
db = Database()
