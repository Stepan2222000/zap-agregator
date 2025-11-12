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

    # AI Settings (placeholders для будущего)
    VERTEX_AI_API_KEY: Optional[str] = None
    VERTEX_AI_ENDPOINT: Optional[str] = None
    VERTEX_AI_MODEL: str = "gemini-2.0-flash-exp"

    # API Settings
    API_PREFIX: str = "/api"
    CORS_ORIGINS: list = ["http://localhost:3000", "http://127.0.0.1:3000"]

    # Загрузка файлов
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE: int = 5 * 1024 * 1024  # 5MB
    MAX_PHOTOS_PER_LISTING: int = 10

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
