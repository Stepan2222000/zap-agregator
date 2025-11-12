"""
Сервис для загрузки и обработки фотографий
"""
from fastapi import UploadFile, HTTPException
from PIL import Image
from pathlib import Path
from uuid import UUID
import uuid
import logging
from typing import List
import aiofiles
import os

from app.core.config import settings
from app.db.listings_repository import listings_repo

logger = logging.getLogger(__name__)


class FileUploadService:
    """Сервис для загрузки и оптимизации фотографий"""

    # Разрешенные MIME types
    ALLOWED_TYPES = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ]

    # Разрешенные расширения
    ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"]

    # Magic bytes для проверки реального типа файла (защита от подделки MIME)
    MAGIC_BYTES = {
        b'\xFF\xD8\xFF': 'image/jpeg',  # JPEG
        b'\x89PNG\r\n\x1a\n': 'image/png',  # PNG
        b'RIFF': 'image/webp',  # WebP (нужна дополнительная проверка)
    }

    def __init__(self):
        """Инициализация сервиса"""
        self.upload_dir = Path(settings.UPLOAD_DIR)
        self._ensure_upload_dir()

    def _ensure_upload_dir(self):
        """Создать директорию для загрузок если не существует"""
        try:
            self.upload_dir.mkdir(parents=True, exist_ok=True)
            logger.info(f"📁 Директория для загрузок: {self.upload_dir}")
        except Exception as e:
            logger.error(f"❌ Не удалось создать директорию загрузок: {e}")
            raise

    def validate_files(self, files: List[UploadFile]) -> None:
        """
        Валидация загружаемых файлов

        Raises:
            HTTPException: если валидация не прошла
        """
        if not files or len(files) == 0:
            raise HTTPException(
                status_code=400,
                detail="Необходимо загрузить хотя бы одну фотографию"
            )

        if len(files) > settings.MAX_PHOTOS_PER_LISTING:
            raise HTTPException(
                status_code=400,
                detail=f"Максимум {settings.MAX_PHOTOS_PER_LISTING} фотографий"
            )

        for file in files:
            # Проверка MIME type
            if file.content_type not in self.ALLOWED_TYPES:
                raise HTTPException(
                    status_code=400,
                    detail=f"Недопустимый формат файла: {file.content_type}. "
                           f"Разрешены: JPEG, PNG, WebP"
                )

            # Проверка расширения
            file_ext = Path(file.filename).suffix.lower()
            if file_ext not in self.ALLOWED_EXTENSIONS:
                raise HTTPException(
                    status_code=400,
                    detail=f"Недопустимое расширение файла: {file_ext}"
                )

    def _verify_file_type_by_magic_bytes(self, file_content: bytes, filename: str) -> None:
        """
        Проверка реального типа файла через magic bytes (защита от подделки MIME)

        Args:
            file_content: Содержимое файла
            filename: Имя файла для логирования

        Raises:
            HTTPException: если файл не является изображением
        """
        if len(file_content) < 12:
            raise HTTPException(
                status_code=400,
                detail=f"Файл {filename} слишком маленький или поврежден"
            )

        # Проверка magic bytes
        is_valid = False

        # Проверка JPEG (FF D8 FF)
        if file_content[:3] == b'\xFF\xD8\xFF':
            is_valid = True

        # Проверка PNG (89 50 4E 47 0D 0A 1A 0A)
        elif file_content[:8] == b'\x89PNG\r\n\x1a\n':
            is_valid = True

        # Проверка WebP (RIFF....WEBP)
        elif file_content[:4] == b'RIFF' and file_content[8:12] == b'WEBP':
            is_valid = True

        if not is_valid:
            logger.warning(f"⚠️ Файл {filename} не является изображением (проверка magic bytes)")
            raise HTTPException(
                status_code=400,
                detail=f"Файл {filename} не является изображением. Загружайте только JPEG, PNG или WebP."
            )

    async def save_photos(
        self,
        listing_id: UUID,
        files: List[UploadFile]
    ) -> List[dict]:
        """
        Сохранить и оптимизировать фотографии для объявления

        Args:
            listing_id: ID объявления
            files: Список файлов для загрузки

        Returns:
            Список сохраненных фотографий с их данными
        """
        # Валидация файлов
        self.validate_files(files)

        # Создать директорию для данного listing
        listing_dir = self.upload_dir / str(listing_id)
        listing_dir.mkdir(parents=True, exist_ok=True)

        saved_photos = []

        for order, file in enumerate(files):
            try:
                # Генерация уникального имени файла с санитизацией расширения
                file_ext = Path(file.filename).suffix.lower()

                # Санитизация расширения (защита от path traversal)
                safe_ext = file_ext.replace('..', '').replace('/', '').replace('\\', '').replace('\x00', '')

                # Дополнительная проверка - убедиться, что это разрешенное расширение
                if safe_ext not in self.ALLOWED_EXTENSIONS:
                    logger.warning(f"⚠️ Попытка загрузить файл с недопустимым расширением: {file.filename}")
                    raise HTTPException(
                        status_code=400,
                        detail=f"Недопустимое расширение файла. Разрешены: JPEG, PNG, WebP"
                    )

                unique_filename = f"{uuid.uuid4()}{safe_ext}"
                file_path = listing_dir / unique_filename

                # Chunked reading с проверкой размера (защита от DoS)
                total_size = 0
                chunks = []
                chunk_size = 8192  # 8KB chunks

                while True:
                    chunk = await file.read(chunk_size)
                    if not chunk:
                        break

                    total_size += len(chunk)

                    # Проверка размера после каждого chunk
                    if total_size > settings.MAX_FILE_SIZE:
                        logger.warning(f"⚠️ Файл {file.filename} слишком большой: {total_size} байт")
                        raise HTTPException(
                            status_code=400,
                            detail=f"Файл {file.filename} превышает максимальный размер "
                                   f"{settings.MAX_FILE_SIZE / 1024 / 1024}MB"
                        )

                    chunks.append(chunk)

                file_content = b''.join(chunks)

                # Проверка реального типа файла через magic bytes (защита от подделки MIME)
                self._verify_file_type_by_magic_bytes(file_content, file.filename)

                # Сохранить временный файл
                temp_path = listing_dir / f"temp_{unique_filename}"
                async with aiofiles.open(temp_path, 'wb') as f:
                    await f.write(file_content)

                # Оптимизация изображения с помощью Pillow
                await self._optimize_image(temp_path, file_path)

                # Удалить временный файл
                temp_path.unlink()

                # Сохранить информацию о фото в БД
                relative_path = str(file_path.relative_to(self.upload_dir))
                photo_data = await listings_repo.add_photo(
                    listing_id=listing_id,
                    filename=unique_filename,
                    file_path=relative_path,
                    order=order
                )

                saved_photos.append(photo_data)

                logger.info(f"✅ Фото {order + 1}/{len(files)} сохранено: {unique_filename}")

            except HTTPException:
                # Пробросить HTTPException выше
                raise
            except Exception as e:
                logger.error(f"❌ Ошибка сохранения фото {file.filename}: {e}")
                raise HTTPException(
                    status_code=500,
                    detail=f"Не удалось сохранить фото {file.filename}"
                )

        logger.info(f"✅ Все фото сохранены для listing {listing_id}: {len(saved_photos)} шт.")
        return saved_photos

    async def _optimize_image(self, input_path: Path, output_path: Path):
        """
        Оптимизировать изображение: resize, сжатие, конвертация

        Args:
            input_path: Путь к исходному файлу
            output_path: Путь для сохранения оптимизированного файла
        """
        try:
            # Открыть изображение
            with Image.open(input_path) as img:
                # Конвертация RGBA → RGB для JPEG
                if img.mode in ('RGBA', 'P', 'LA'):
                    # Создать белый фон
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    # Если есть alpha канал - использовать его для композиции
                    if img.mode == 'RGBA' or img.mode == 'LA':
                        background.paste(img, mask=img.split()[-1])
                    else:
                        background.paste(img)
                    img = background

                # Resize если изображение превышает максимальный размер
                max_dimension = 1920  # максимальная сторона
                if img.width > max_dimension or img.height > max_dimension:
                    img.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
                    logger.debug(f"🔧 Resize изображения до {img.size}")

                # Сохранить оптимизированное изображение
                save_kwargs = {
                    'optimize': True,
                    'quality': 85
                }

                # Для WebP используем специальные параметры
                if output_path.suffix.lower() == '.webp':
                    save_kwargs['quality'] = 80
                    save_kwargs['method'] = 6  # компрессия

                img.save(output_path, **save_kwargs)

                logger.debug(f"✅ Изображение оптимизировано: {output_path.name}")

        except Exception as e:
            logger.error(f"❌ Ошибка оптимизации изображения: {e}")
            raise

    async def delete_listing_photos(self, listing_id: UUID):
        """
        Удалить все фотографии объявления

        Args:
            listing_id: ID объявления
        """
        listing_dir = self.upload_dir / str(listing_id)

        if listing_dir.exists():
            try:
                # Удалить все файлы в директории
                for file_path in listing_dir.iterdir():
                    if file_path.is_file():
                        file_path.unlink()

                # Удалить саму директорию
                listing_dir.rmdir()

                logger.info(f"🗑️ Удалены все фото для listing {listing_id}")

            except Exception as e:
                logger.error(f"❌ Ошибка удаления фото для listing {listing_id}: {e}")


# Глобальный экземпляр
file_upload_service = FileUploadService()
