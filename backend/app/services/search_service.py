"""
Сервис для поиска и фильтрации объявлений
Реализует Story 4.1: Search & Filter API Endpoints
"""
from typing import Optional
from decimal import Decimal
import logging

from ..db.connection import db

logger = logging.getLogger(__name__)


class SearchService:
    """
    Сервис для поиска объявлений с фильтрацией
    Работает только с approved объявлениями для публичного доступа
    """

    async def search_listings(
        self,
        query: Optional[str] = None,
        brand: Optional[str] = None,
        condition: Optional[str] = None,
        price_min: Optional[Decimal] = None,
        price_max: Optional[Decimal] = None,
        page: int = 1,
        limit: int = 20
    ) -> dict:
        """
        Поиск объявлений с применением фильтров и пагинацией

        Args:
            query: Текстовый поиск по артикулу, названию, описанию
            brand: Фильтр по марке автомобиля
            condition: Фильтр по состоянию ('new' или 'used')
            price_min: Минимальная цена
            price_max: Максимальная цена
            page: Номер страницы (начинается с 1)
            limit: Количество на странице (макс 100)

        Returns:
            dict: {
                "items": [...],  # список объявлений
                "total": int,    # общее количество результатов
                "page": int,     # текущая страница
                "pages": int,    # общее количество страниц
                "limit": int     # записей на странице
            }
        """
        # Валидация параметров
        if limit > 100:
            limit = 100
        if page < 1:
            page = 1

        offset = (page - 1) * limit

        # Построение WHERE условий
        where_clauses = ["listings.status = 'approved'"]
        params = []
        param_counter = 1

        # Текстовый поиск (по артикулу, AI названию, описанию)
        if query:
            where_clauses.append(f"""
                (listings.article_number ILIKE ${param_counter}
                 OR listings.ai_processed_title ILIKE ${param_counter}
                 OR listings.description ILIKE ${param_counter})
            """)
            params.append(f"%{query}%")
            param_counter += 1

        # Фильтр по марке
        if brand:
            where_clauses.append(f"listings.brand = ${param_counter}")
            params.append(brand)
            param_counter += 1

        # Фильтр по состоянию
        if condition:
            where_clauses.append(f"listings.condition = ${param_counter}")
            params.append(condition)
            param_counter += 1

        # Фильтр по минимальной цене
        if price_min is not None:
            where_clauses.append(f"listings.price >= ${param_counter}")
            params.append(price_min)
            param_counter += 1

        # Фильтр по максимальной цене
        if price_max is not None:
            where_clauses.append(f"listings.price <= ${param_counter}")
            params.append(price_max)
            param_counter += 1

        where_sql = " AND ".join(where_clauses)

        # SQL запрос для подсчета total
        count_sql = f"""
            SELECT COUNT(*) as total
            FROM listings
            WHERE {where_sql}
        """

        # SQL запрос для получения данных
        # Левый JOIN с photos для получения главного фото (с display_order = 0)
        data_sql = f"""
            SELECT
                listings.id,
                listings.article_number,
                listings.brand,
                listings.condition,
                listings.price,
                listings.ai_processed_title,
                listings.description,
                listings.created_at,
                photos.file_path as main_photo_url
            FROM listings
            LEFT JOIN photos ON listings.id = photos.listing_id AND photos.display_order = 0
            WHERE {where_sql}
            ORDER BY listings.created_at DESC
            LIMIT ${param_counter} OFFSET ${param_counter + 1}
        """

        try:
            # Получить total count
            count_row = await db.fetch_one(count_sql, *params)
            total = count_row['total'] if count_row else 0

            # Получить данные с пагинацией
            params_with_pagination = params + [limit, offset]
            rows = await db.fetch_all(data_sql, *params_with_pagination)

            # Преобразовать результаты
            items = []
            for row in rows:
                # Если AI не обработал - использовать оригинальное описание как название
                title = row['ai_processed_title'] or row['description'] or "Без названия"

                items.append({
                    "id": str(row['id']),
                    "article_number": row['article_number'],
                    "brand": row['brand'],
                    "condition": row['condition'],
                    "price": float(row['price']) if row['price'] else 0,
                    "ai_processed_title": title,
                    "main_photo_url": row['main_photo_url'],
                    "created_at": row['created_at'].isoformat() if row['created_at'] else None
                })

            # Рассчитать количество страниц
            pages = (total + limit - 1) // limit if total > 0 else 0

            # Логирование поискового запроса для аналитики
            logger.info(
                f"🔍 Поиск: query='{query}', brand='{brand}', condition='{condition}', "
                f"price_range={price_min}-{price_max}, results={len(items)}/{total}"
            )

            return {
                "items": items,
                "total": total,
                "page": page,
                "pages": pages,
                "limit": limit
            }

        except Exception as e:
            logger.error(f"❌ Ошибка поиска объявлений: {e}")
            raise

    async def get_listing_detail(self, listing_id: str) -> Optional[dict]:
        """
        Получить детальную информацию об объявлении для публичного доступа
        Возвращает только approved объявления

        Args:
            listing_id: UUID объявления

        Returns:
            dict или None: Полная информация об объявлении или None
        """
        query = """
            SELECT
                listings.id,
                listings.article_number,
                listings.brand,
                listings.condition,
                listings.price,
                listings.description,
                listings.contact_phone,
                listings.contact_whatsapp,
                listings.contact_telegram,
                listings.ai_processed_title,
                listings.ai_processed_description,
                listings.created_at,
                listings.updated_at
            FROM listings
            WHERE listings.id = $1 AND listings.status = 'approved'
        """

        try:
            row = await db.fetch_one(query, listing_id)

            if not row:
                return None

            # Получить все фотографии
            photos_query = """
                SELECT id, filename, file_path, display_order, created_at
                FROM photos
                WHERE listing_id = $1
                ORDER BY display_order ASC
            """
            photos_rows = await db.fetch_all(photos_query, listing_id)

            photos = [
                {
                    "id": str(photo['id']),
                    "filename": photo['filename'],
                    "file_path": photo['file_path'],
                    "display_order": photo['display_order'],
                    "created_at": photo['created_at'].isoformat() if photo['created_at'] else None
                }
                for photo in photos_rows
            ]

            return {
                "id": str(row['id']),
                "article_number": row['article_number'],
                "brand": row['brand'],
                "condition": row['condition'],
                "price": float(row['price']) if row['price'] else 0,
                "description": row['description'],
                "contact_phone": row['contact_phone'],
                "contact_whatsapp": row['contact_whatsapp'],
                "contact_telegram": row['contact_telegram'],
                "ai_processed_title": row['ai_processed_title'],
                "ai_processed_description": row['ai_processed_description'],
                "photos": photos,
                "created_at": row['created_at'].isoformat() if row['created_at'] else None,
                "updated_at": row['updated_at'].isoformat() if row['updated_at'] else None
            }

        except Exception as e:
            logger.error(f"❌ Ошибка получения детальной информации {listing_id}: {e}")
            raise


# Глобальный экземпляр сервиса
search_service = SearchService()
