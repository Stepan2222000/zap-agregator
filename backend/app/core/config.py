"""
Конфигурация приложения
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Настройки приложения"""

    # База данных
    DATABASE_URL: str
    DB_POOL_MIN_SIZE: int = 5
    DB_POOL_MAX_SIZE: int = 20

    # AI Settings (Vertex AI с Service Account)
    VERTEX_AI_PROJECT_ID: str
    VERTEX_AI_LOCATION: str = "us-central1"
    VERTEX_AI_CREDENTIALS_PATH: str = "credentials/gen-lang-client-0026618973-4dbdd3b53fdc.json"
    AI_MODEL: str = "google/gemini-2.5-pro"
    AI_MAX_RETRIES: int = 3
    AI_TIMEOUT_SECONDS: int = 30

    # API Settings
    API_PREFIX: str = "/api"
    CORS_ORIGINS: list = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # Загрузка файлов
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    MAX_PHOTOS_PER_LISTING: int = 10

    # Admin Settings
    ADMIN_TOKEN: str = "simple-token-for-mvp"  # Токен для единственного модератора

    class Config:
        env_file = ".env"
        case_sensitive = False
        extra = "ignore"  # Игнорировать неизвестные поля из .env


settings = Settings()
