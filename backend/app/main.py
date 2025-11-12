"""
Главное приложение FastAPI
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from app.core.config import settings
from app.core.exceptions import (
    global_exception_handler,
    validation_exception_handler
)
from app.core.logging_config import setup_logging
from app.db.connection import db
from app.api.routes import health

# Настройка логирования
setup_logging()

app = FastAPI(
    title="AutoHub AI API",
    version="0.1.0",
    docs_url=f"{settings.API_PREFIX}/docs",
    redoc_url=f"{settings.API_PREFIX}/redoc"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Обработчики исключений
app.add_exception_handler(Exception, global_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)

# Роутеры
app.include_router(health.router, prefix=settings.API_PREFIX, tags=["health"])


@app.on_event("startup")
async def startup():
    """Событие при запуске приложения"""
    await db.connect(
        settings.DATABASE_URL,
        settings.DB_POOL_MIN_SIZE,
        settings.DB_POOL_MAX_SIZE
    )


@app.on_event("shutdown")
async def shutdown():
    """Событие при остановке приложения"""
    await db.disconnect()


@app.get("/")
async def root():
    """Корневой endpoint"""
    return {
        "message": "AutoHub AI API - используйте /api для всех endpoints",
        "docs": f"{settings.API_PREFIX}/docs"
    }
