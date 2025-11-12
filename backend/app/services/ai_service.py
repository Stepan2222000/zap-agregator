"""
Сервис для AI обработки объявлений через Gemini (Vertex AI) с Service Account
"""
from openai import OpenAI
import asyncio
import json
import logging
from typing import Optional, Dict
from uuid import UUID
import httpx
from pathlib import Path

from google.oauth2 import service_account
import google.auth.transport.requests

from app.core.config import settings
from app.db.listings_repository import listings_repo

logger = logging.getLogger(__name__)


# Промпт для обогащения объявления
LISTING_ENRICHMENT_PROMPT = """
Ты помощник для маркетплейса автозапчастей. Тебе дано объявление о продаже запчасти.

**Данные от пользователя:**
- Артикул: {article_number}
- Марка автомобиля: {brand}
- Состояние: {condition}
- Цена: {price} ₽
- Описание пользователя: {description}

**Твоя задача:**
1. Найти информацию о запчасти по артикулу {article_number}
2. Создать корректное название запчасти (краткое, точное)
3. Создать структурированное описание с:
   - Техническими характеристиками
   - Назначением запчасти
   - Применимостью
   - Особенностями (если есть)
4. Указать совместимые модели автомобилей марки {brand} (если найдёшь информацию)

**Формат ответа (строго JSON):**
{{
  "title": "Корректное короткое название запчасти",
  "description": "Подробное структурированное описание с характеристиками, назначением, применимостью. Минимум 3-4 предложения.",
  "compatible_models": ["Модель 1", "Модель 2", "Модель 3"]
}}

**ВАЖНО:**
- Отвечай ТОЛЬКО в формате JSON
- Не добавляй markdown, комментарии или дополнительный текст
- Если не можешь найти точную информацию, используй общие знания о запчастях
- compatible_models - опциональное поле, если не уверен - не указывай
"""


class AIService:
    """Сервис для AI обработки объявлений через Vertex AI"""

    def __init__(self):
        """Инициализация AIService"""
        self.client = None
        self.credentials = None
        self._initialize_client()

    def _initialize_client(self):
        """Инициализировать OpenAI клиент с Vertex AI endpoint и Service Account"""
        if not settings.VERTEX_AI_PROJECT_ID or not settings.VERTEX_AI_CREDENTIALS_PATH:
            logger.warning("⚠️ AI интеграция не настроена (нет PROJECT_ID или CREDENTIALS_PATH)")
            return

        try:
            # Загрузка credentials из service account JSON файла
            credentials_path = Path(settings.VERTEX_AI_CREDENTIALS_PATH)

            # Проверка существования файла
            if not credentials_path.exists():
                # Пробуем относительно backend директории
                backend_path = Path(__file__).parent.parent.parent / settings.VERTEX_AI_CREDENTIALS_PATH
                if backend_path.exists():
                    credentials_path = backend_path
                else:
                    logger.error(f"❌ Credentials файл не найден: {settings.VERTEX_AI_CREDENTIALS_PATH}")
                    return

            logger.info(f"📄 Загрузка credentials из: {credentials_path}")

            # Загрузка service account credentials с правильными scopes
            self.credentials = service_account.Credentials.from_service_account_file(
                str(credentials_path),
                scopes=['https://www.googleapis.com/auth/cloud-platform']
            )

            # Получение access token
            auth_request = google.auth.transport.requests.Request()
            self.credentials.refresh(auth_request)

            logger.info(f"✅ Access token получен (истекает через ~1 час)")

            # Формирование OpenAI-compatible endpoint для Vertex AI
            base_url = (
                f"https://{settings.VERTEX_AI_LOCATION}-aiplatform.googleapis.com"
                f"/v1/projects/{settings.VERTEX_AI_PROJECT_ID}"
                f"/locations/{settings.VERTEX_AI_LOCATION}/endpoints/openapi"
            )

            logger.info(f"🌐 Vertex AI endpoint: {base_url}")

            # Настройка httpx клиента с timeout
            http_client = httpx.Client(
                timeout=httpx.Timeout(
                    connect=10.0,
                    read=settings.AI_TIMEOUT_SECONDS,
                    write=10.0,
                    pool=5.0
                )
            )

            # Создание OpenAI клиента с Vertex AI endpoint
            self.client = OpenAI(
                api_key=self.credentials.token,
                base_url=base_url,
                http_client=http_client
            )

            logger.info("✅ AI клиент инициализирован с Service Account аутентификацией")

        except Exception as e:
            logger.error(f"❌ Ошибка инициализации AI клиента: {e}")
            import traceback
            logger.error(traceback.format_exc())
            self.client = None
            self.credentials = None

    def _refresh_token_if_needed(self):
        """Обновить access token если истек или скоро истечет"""
        if not self.credentials:
            return False

        try:
            # Проверяем, нужно ли обновить токен
            # google-auth автоматически проверяет expiry
            if not self.credentials.valid:
                logger.info("🔄 Access token истек, обновляем...")
                auth_request = google.auth.transport.requests.Request()
                self.credentials.refresh(auth_request)

                # Обновляем токен в OpenAI клиенте
                if self.client:
                    self.client.api_key = self.credentials.token
                    logger.info("✅ Access token обновлен")

                return True

            return True

        except Exception as e:
            logger.error(f"❌ Ошибка обновления токена: {e}")
            return False

    async def process_listing(self, listing_id: UUID) -> bool:
        """
        Обработать объявление через Gemini AI

        Args:
            listing_id: ID объявления

        Returns:
            True если обработка прошла успешно, False при ошибке
        """
        # Проверка наличия AI клиента
        if not self.client or not self.credentials:
            logger.warning(f"⚠️ AI клиент не инициализирован для listing {listing_id}")
            await self._handle_ai_error(
                listing_id,
                "AI интеграция не настроена. Проверьте конфигурацию."
            )
            return False

        # Обновить токен если нужно
        if not self._refresh_token_if_needed():
            await self._handle_ai_error(
                listing_id,
                "Не удалось обновить access token для Vertex AI"
            )
            return False

        try:
            # Загрузить данные объявления
            listing = await listings_repo.get_listing_by_id(listing_id)

            if not listing:
                logger.error(f"❌ Listing {listing_id} не найден")
                return False

            logger.info(f"🤖 Начинаем AI обработку для listing {listing_id}")

            # Формируем prompt
            prompt = self._build_prompt(listing)

            # Вызываем AI с retry механизмом
            ai_response = await self._call_ai_with_retry(prompt)

            # Парсим JSON ответ
            parsed_data = self._parse_ai_response(ai_response)

            # Сохраняем результаты в БД
            await listings_repo.update_listing_status(
                listing_id=listing_id,
                status='pending',
                ai_processed_title=parsed_data.get('title'),
                ai_processed_description=parsed_data.get('description'),
                ai_error_message=None
            )

            logger.info(f"✅ AI обработка завершена для listing {listing_id}")
            return True

        except Exception as e:
            logger.error(f"❌ AI обработка провалилась для listing {listing_id}: {e}")
            await self._handle_ai_error(listing_id, str(e))
            return False

    def _build_prompt(self, listing: Dict) -> str:
        """Сформировать prompt для Gemini"""
        condition_ru = "новое" if listing['condition'] == 'new' else "б/у"
        description = listing['description'] or "не указано"

        return LISTING_ENRICHMENT_PROMPT.format(
            article_number=listing['article_number'],
            brand=listing['brand'],
            condition=condition_ru,
            price=listing['price'],
            description=description
        )

    async def _call_ai_with_retry(self, prompt: str) -> str:
        """
        Вызвать AI с retry механизмом

        Args:
            prompt: Промпт для AI

        Returns:
            Текстовый ответ от AI

        Raises:
            Exception: если все попытки провалились
        """
        last_error = None

        for attempt in range(settings.AI_MAX_RETRIES):
            try:
                logger.debug(f"🔄 AI попытка {attempt + 1}/{settings.AI_MAX_RETRIES}")

                # Обновить токен перед каждой попыткой
                self._refresh_token_if_needed()

                # Вызов с timeout
                response = await asyncio.wait_for(
                    self._call_ai(prompt),
                    timeout=settings.AI_TIMEOUT_SECONDS
                )

                logger.debug(f"✅ AI ответил успешно на попытке {attempt + 1}")
                return response

            except asyncio.TimeoutError:
                last_error = f"AI timeout ({settings.AI_TIMEOUT_SECONDS}s)"
                logger.warning(f"⏱️ {last_error} - попытка {attempt + 1}/{settings.AI_MAX_RETRIES}")

                # Exponential backoff
                if attempt < settings.AI_MAX_RETRIES - 1:
                    wait_time = 2 ** attempt  # 1, 2, 4 секунды
                    logger.debug(f"⏳ Ожидание {wait_time}s перед повторной попыткой...")
                    await asyncio.sleep(wait_time)

            except Exception as e:
                last_error = f"AI error: {str(e)}"
                logger.warning(f"❌ {last_error} - попытка {attempt + 1}/{settings.AI_MAX_RETRIES}")

                # Exponential backoff
                if attempt < settings.AI_MAX_RETRIES - 1:
                    wait_time = 2 ** attempt
                    await asyncio.sleep(wait_time)

        # Все попытки провалились
        error_msg = f"AI обработка провалилась после {settings.AI_MAX_RETRIES} попыток: {last_error}"
        raise Exception(error_msg)

    async def _call_ai(self, prompt: str) -> str:
        """
        Вызвать Gemini AI через OpenAI SDK (синхронный вызов в executor)

        Args:
            prompt: Промпт для AI

        Returns:
            Текстовый ответ от AI
        """
        loop = asyncio.get_event_loop()

        # OpenAI SDK синхронный, запускаем в executor
        # Добавляем grounding с Google Search для улучшенной обработки
        response = await loop.run_in_executor(
            None,
            lambda: self.client.chat.completions.create(
                model=settings.AI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant for an auto parts marketplace. "
                                   "You help enrich product listings with accurate information. "
                                   "Use web search to find current information about auto parts."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.3,
                max_tokens=1500,
                # Grounding с Google Search через правильную структуру extra_body
                extra_body={
                    "google": {
                        "tools": [
                            {
                                "googleSearch": {}
                            }
                        ]
                    }
                }
            )
        )

        return response.choices[0].message.content

    def _parse_ai_response(self, response: str) -> Dict:
        """
        Парсить JSON ответ от AI

        Args:
            response: Текстовый ответ от AI

        Returns:
            Словарь с распарсенными данными

        Raises:
            Exception: если не удалось распарсить JSON
        """
        try:
            # Убираем возможные markdown блоки
            cleaned = response.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            if cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]
            cleaned = cleaned.strip()

            # Парсим JSON
            data = json.loads(cleaned)

            # Валидация обязательных полей
            if 'title' not in data or 'description' not in data:
                raise ValueError("AI response missing required fields: title or description")

            logger.debug(f"✅ AI ответ распарсен: title='{data.get('title')[:50]}...'")
            return data

        except json.JSONDecodeError as e:
            logger.error(f"❌ Не удалось распарсить JSON от AI: {e}")
            logger.debug(f"AI response: {response[:200]}...")
            raise Exception(f"Invalid JSON from AI: {str(e)}")
        except Exception as e:
            logger.error(f"❌ Ошибка парсинга AI ответа: {e}")
            raise

    async def _handle_ai_error(self, listing_id: UUID, error_message: str):
        """
        Graceful degradation: сохранить ошибку и перевести в статус pending

        Args:
            listing_id: ID объявления
            error_message: Сообщение об ошибке
        """
        try:
            await listings_repo.update_listing_status(
                listing_id=listing_id,
                status='pending',
                ai_error_message=f"AI обработка не удалась: {error_message}"
            )

            logger.info(f"⚠️ Listing {listing_id} → pending с ошибкой AI (graceful degradation)")

        except Exception as e:
            logger.error(f"❌ Не удалось сохранить ошибку AI для listing {listing_id}: {e}")


# Глобальный экземпляр
ai_service = AIService()
