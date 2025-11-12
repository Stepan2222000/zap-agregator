"""
API endpoints для админ-панели
"""
import logging
import csv
import io
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, UploadFile, File
from app.middleware.admin_auth import verify_admin_token
from app.db.connection import get_db_connection
from app.db.repositories.admin import AdminRepository
from app.db.repositories.parts import PartsRepository
from app.schemas.admin import (
    AdminListingsResponse,
    AdminListingPreview,
    AdminListingWithHistory,
    AdminListingDetail,
    ModerationAction,
    PartResponse,
    PartWithArticlesResponse,
    PartSearchResultResponse,
    ArticleNumberResponse,
    CreatePartRequest,
    AddArticleNumberRequest,
    LinkPartRequest,
)
from app.schemas.listings import PhotoResponse
from app.services.ai_service import AIService
from app.utils.parts import parse_article_numbers
from pydantic import BaseModel

logger = logging.getLogger(__name__)


# Pydantic модель для запросов на модерацию
class ModerationActionRequest(BaseModel):
    """Запрос на действие модерации с опциональной заметкой"""
    moderator_note: Optional[str] = None

router = APIRouter(
    prefix="/admin",
    tags=["admin"],
    dependencies=[Depends(verify_admin_token)],  # Все endpoints защищены
)


@router.get("/listings", response_model=AdminListingsResponse)
async def get_admin_listings(
    listing_status: Optional[str] = Query(
        None,
        alias="status",
        description="Фильтр по статусу: processing, pending, approved, rejected",
    ),
    page: int = Query(1, ge=1, description="Номер страницы"),
    limit: int = Query(20, ge=1, le=100, description="Количество на странице"),
):
    """
    Получить список объявлений для админ-панели с фильтрацией и пагинацией.

    Доступные статусы:
    - processing: В обработке AI
    - pending: На модерации
    - approved: Одобрено
    - rejected: Отклонено
    """
    # Валидация статуса
    if listing_status and listing_status not in ["processing", "pending", "approved", "rejected"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Неверный статус: {listing_status}. Доступные: processing, pending, approved, rejected",
        )

    async with get_db_connection() as conn:
        admin_repo = AdminRepository(conn)

        try:
            result = await admin_repo.get_listings(
                status=listing_status, page=page, limit=limit
            )

            # Преобразуем в Pydantic модели
            listings_data = []
            for item in result["items"]:
                listings_data.append(
                    AdminListingPreview(
                        id=str(item["id"]),  # Конвертируем UUID в строку
                        article_number=item["article_number"],
                        brand=item["brand"],
                        price=item["price"],
                        status=item["status"],
                        created_at=item["created_at"],
                        ai_error_message=item.get("ai_error_message"),
                    )
                )

            return AdminListingsResponse(
                items=listings_data,
                total=result["total"],
                page=result["page"],
                limit=result["limit"],
                pages=result["pages"],
            )

        except Exception as e:
            logger.error(f"Ошибка при получении списка объявлений: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Ошибка при получении списка объявлений",
            )


@router.get("/listings/{listing_id}", response_model=AdminListingWithHistory)
async def get_admin_listing_detail(listing_id: str):
    """
    Получить детальную информацию об объявлении с историей модерации.
    """
    async with get_db_connection() as conn:
        admin_repo = AdminRepository(conn)

        try:
            # Получаем детали объявления
            listing_data = await admin_repo.get_listing_detail(listing_id)

            if not listing_data:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Объявление с ID {listing_id} не найдено",
                )

            # Получаем историю модерации
            history_data = await admin_repo.get_moderation_history(listing_id)

            # Преобразуем фотографии в Pydantic модели
            photos = [
                PhotoResponse(
                    id=photo["id"],
                    listing_id=listing_data["id"],
                    filename=photo["filename"],
                    file_path=photo["file_path"],
                    display_order=photo["display_order"],
                    created_at=photo["created_at"],
                )
                for photo in listing_data["photos"]
            ]

            # Преобразуем историю модерации
            moderation_history = [
                ModerationAction(
                    id=str(action["id"]),  # Конвертируем UUID в строку
                    action=action["action"],
                    moderator_note=action.get("moderator_note"),
                    created_at=action["created_at"],
                )
                for action in history_data
            ]

            # Создаем полный ответ
            return AdminListingWithHistory(
                id=str(listing_data["id"]),  # Конвертируем UUID в строку
                article_number=listing_data["article_number"],
                brand=listing_data["brand"],
                condition=listing_data["condition"],
                price=listing_data["price"],
                description=listing_data.get("description"),
                status=listing_data["status"],
                created_at=listing_data["created_at"],
                updated_at=listing_data["updated_at"],
                contact_phone=listing_data["contact_phone"],
                contact_whatsapp=listing_data.get("contact_whatsapp"),
                contact_telegram=listing_data.get("contact_telegram"),
                ai_processed_title=listing_data.get("ai_processed_title"),
                ai_processed_description=listing_data.get("ai_processed_description"),
                ai_error_message=listing_data.get("ai_error_message"),
                photos=photos,
                part_id=listing_data.get("part_id"),
                part_name=listing_data.get("part_name"),
                moderation_history=moderation_history,
            )

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Ошибка при получении деталей объявления: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Ошибка при получении деталей объявления",
            )


@router.get("/stats")
async def get_admin_stats():
    """
    Получить статистику объявлений по статусам.
    """
    async with get_db_connection() as conn:
        admin_repo = AdminRepository(conn)

        try:
            stats = await admin_repo.get_stats_by_status()
            return {
                "stats_by_status": stats,
                "total": sum(stats.values()),
            }

        except Exception as e:
            logger.error(f"Ошибка при получении статистики: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Ошибка при получении статистики",
            )


@router.put("/listings/{listing_id}/approve")
async def approve_listing(
    listing_id: str,
    request: ModerationActionRequest = ModerationActionRequest(),
):
    """
    Одобрить объявление.

    Устанавливает статус 'approved' и добавляет запись в историю модерации.
    """
    async with get_db_connection() as conn:
        admin_repo = AdminRepository(conn)

        try:
            success = await admin_repo.approve_listing(
                listing_id, request.moderator_note
            )

            if not success:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Объявление с ID {listing_id} не найдено",
                )

            return {
                "success": True,
                "message": "Объявление успешно одобрено",
                "listing_id": listing_id,
            }

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Ошибка при одобрении объявления: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Ошибка при одобрении объявления",
            )


@router.put("/listings/{listing_id}/reject")
async def reject_listing(
    listing_id: str,
    request: ModerationActionRequest = ModerationActionRequest(),
):
    """
    Отклонить объявление.

    Устанавливает статус 'rejected' и добавляет запись в историю модерации.
    """
    async with get_db_connection() as conn:
        admin_repo = AdminRepository(conn)

        try:
            success = await admin_repo.reject_listing(
                listing_id, request.moderator_note
            )

            if not success:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Объявление с ID {listing_id} не найдено",
                )

            return {
                "success": True,
                "message": "Объявление отклонено",
                "listing_id": listing_id,
            }

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Ошибка при отклонении объявления: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Ошибка при отклонении объявления",
            )


@router.post("/listings/{listing_id}/reprocess")
async def reprocess_listing(listing_id: str):
    """
    Отправить объявление на повторную обработку AI.

    Очищает предыдущие AI результаты и ошибки, устанавливает статус 'processing',
    и запускает AI обработку заново.
    """
    async with get_db_connection() as conn:
        admin_repo = AdminRepository(conn)
        ai_service = AIService()

        try:
            # Обновляем статус и очищаем AI данные
            success = await admin_repo.reprocess_listing(listing_id)

            if not success:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Объявление с ID {listing_id} не найдено",
                )

            # Запускаем AI обработку
            try:
                await ai_service.process_listing(listing_id)
            except Exception as ai_error:
                logger.error(f"Ошибка AI при повторной обработке {listing_id}: {str(ai_error)}")
                # Не кидаем исключение - объявление будет со статусом processing и ошибкой

            return {
                "success": True,
                "message": "Объявление отправлено на повторную обработку AI",
                "listing_id": listing_id,
            }

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Ошибка при повторной обработке объявления: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Ошибка при повторной обработке объявления",
            )


# ============================================================
# Endpoints для управления запчастями (Parts)
# ============================================================


@router.post("/parts", response_model=PartResponse, status_code=status.HTTP_201_CREATED)
async def create_part(request: CreatePartRequest):
    """
    Создать новую запчасть.

    Модератор создает внутренний ID запчасти с уникальным кодом и названием.
    """
    async with get_db_connection() as conn:
        parts_repo = PartsRepository(conn)

        try:
            part = await parts_repo.create_part(
                internal_code=request.internal_code,
                canonical_name=request.canonical_name,
                description=request.description,
            )

            return PartResponse(**part)

        except Exception as e:
            error_msg = str(e)
            if "unique" in error_msg.lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Запчасть с кодом '{request.internal_code}' уже существует",
                )

            logger.error(f"Ошибка при создании запчасти: {error_msg}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Ошибка при создании запчасти",
            )


@router.get("/parts/search")
async def search_parts(
    q: str = Query(..., min_length=1, description="Поисковый запрос"),
    limit: int = Query(20, ge=1, le=100, description="Максимум результатов"),
):
    """
    Поиск запчастей по internal_code или canonical_name.

    Возвращает список запчастей с количеством артикулов и объявлений.
    """
    async with get_db_connection() as conn:
        parts_repo = PartsRepository(conn)

        try:
            results = await parts_repo.search_parts(query=q, limit=limit)

            return {
                "results": [PartSearchResultResponse(**item) for item in results],
                "total": len(results),
            }

        except Exception as e:
            logger.error(f"Ошибка при поиске запчастей: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Ошибка при поиске запчастей",
            )


@router.get("/parts/{part_id}", response_model=PartWithArticlesResponse)
async def get_part_detail(part_id: str):
    """
    Получить детальную информацию о запчасти со всеми артикулами.
    """
    async with get_db_connection() as conn:
        parts_repo = PartsRepository(conn)

        try:
            part = await parts_repo.get_part_with_articles(part_id)

            if not part:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Запчасть с ID {part_id} не найдена",
                )

            # Преобразуем артикулы в Pydantic модели
            part["article_numbers"] = [
                ArticleNumberResponse(**article) for article in part["article_numbers"]
            ]

            return PartWithArticlesResponse(**part)

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Ошибка при получении запчасти: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Ошибка при получении запчасти",
            )


@router.post("/parts/{part_id}/articles", response_model=ArticleNumberResponse, status_code=status.HTTP_201_CREATED)
async def add_article_number(part_id: str, request: AddArticleNumberRequest):
    """
    Добавить артикул к запчасти.

    Позволяет привязать новый артикул производителя к существующей запчасти.
    """
    async with get_db_connection() as conn:
        parts_repo = PartsRepository(conn)

        try:
            # Проверяем, что запчасть существует
            part = await parts_repo.get_part_by_id(part_id)
            if not part:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Запчасть с ID {part_id} не найдена",
                )

            # Добавляем артикул
            article = await parts_repo.add_article_number(
                part_id=part_id,
                article_number=request.article_number,
                manufacturer=request.manufacturer,
            )

            return ArticleNumberResponse(**article)

        except HTTPException:
            raise
        except Exception as e:
            error_msg = str(e)
            if "unique" in error_msg.lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Артикул '{request.article_number}' уже привязан к этой запчасти",
                )

            logger.error(f"Ошибка при добавлении артикула: {error_msg}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Ошибка при добавлении артикула",
            )


@router.put("/listings/{listing_id}/link-part")
async def link_listing_to_part(listing_id: str, request: LinkPartRequest):
    """
    Привязать объявление к запчасти.

    Модератор связывает объявление с внутренним ID запчасти.
    """
    async with get_db_connection() as conn:
        parts_repo = PartsRepository(conn)

        try:
            # Проверяем, что запчасть существует
            part = await parts_repo.get_part_by_id(request.part_id)
            if not part:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Запчасть с ID {request.part_id} не найдена",
                )

            # Привязываем объявление к запчасти
            success = await parts_repo.link_listing_to_part(listing_id, request.part_id)

            if not success:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Объявление с ID {listing_id} не найдено",
                )

            return {
                "success": True,
                "message": "Объявление успешно привязано к запчасти",
                "listing_id": listing_id,
                "part_id": request.part_id,
            }

        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Ошибка при привязке объявления к запчасти: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Ошибка при привязке объявления к запчасти",
            )


# ============================================================
# Endpoint для массовой загрузки (Bulk Import)
# ============================================================


@router.post("/bulk-import")
async def bulk_import_parts(file: UploadFile = File(...)):
    """
    Массовая загрузка запчастей из CSV файла.

    Формат CSV (с заголовком):
    internal_code,canonical_name,description,article_numbers

    Где article_numbers - строка вида: "W712/75:Mann-Filter;W71275:Mann-Filter"
    """
    # Проверяем тип файла
    if not file.filename.endswith('.csv'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Файл должен быть в формате CSV",
        )

    async with get_db_connection() as conn:
        parts_repo = PartsRepository(conn)

        try:
            # Читаем содержимое файла
            content = await file.read()
            csv_text = content.decode('utf-8')

            # Парсим CSV
            csv_reader = csv.DictReader(io.StringIO(csv_text))

            imported_count = 0
            skipped_count = 0
            errors = []

            for i, row in enumerate(csv_reader, start=1):
                internal_code = row.get('internal_code', '').strip()
                canonical_name = row.get('canonical_name', '').strip()
                description = row.get('description', '').strip() or None
                article_numbers_str = row.get('article_numbers', '').strip()

                # Валидация
                if not internal_code or not canonical_name:
                    errors.append(f"Строка {i}: пропущена (отсутствует internal_code или canonical_name)")
                    skipped_count += 1
                    continue

                try:
                    # Проверяем, существует ли запчасть по internal_code
                    existing = await parts_repo.get_part_by_internal_code(internal_code)
                    if existing:
                        errors.append(f"Строка {i}: пропущена (запчасть {internal_code} уже существует)")
                        skipped_count += 1
                        continue

                    # Используем транзакцию для атомарности операции
                    async with conn.transaction():
                        # Создаем запчасть
                        part = await parts_repo.create_part(
                            internal_code=internal_code,
                            canonical_name=canonical_name,
                            description=description,
                        )

                        # Парсим и добавляем артикулы
                        articles = parse_article_numbers(article_numbers_str)
                        for art in articles:
                            await parts_repo.add_article_number(
                                part_id=part['id'],
                                article_number=art['article_number'],
                                manufacturer=art['manufacturer'],
                            )

                        imported_count += 1
                        logger.info(f"Импортирована запчасть {internal_code} с {len(articles)} артикулами")

                except Exception as e:
                    error_msg = f"Строка {i}: ошибка ({str(e)})"
                    errors.append(error_msg)
                    logger.error(error_msg)

            return {
                "success": True,
                "imported": imported_count,
                "skipped": skipped_count,
                "total": imported_count + skipped_count,
                "errors": errors if errors else None,
            }

        except csv.Error as e:
            logger.error(f"Ошибка парсинга CSV: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Ошибка парсинга CSV: {str(e)}",
            )
        except UnicodeDecodeError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Ошибка декодирования файла. Убедитесь, что файл в кодировке UTF-8",
            )
        except Exception as e:
            logger.error(f"Ошибка при массовой загрузке: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Ошибка при массовой загрузке: {str(e)}",
            )
