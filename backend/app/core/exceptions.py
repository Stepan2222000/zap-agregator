"""
Глобальные обработчики исключений
"""
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel
import logging

logger = logging.getLogger(__name__)


class ErrorResponse(BaseModel):
    """Стандартный формат ответа с ошибкой"""
    error: str
    code: str
    details: dict = {}


async def global_exception_handler(request: Request, exc: Exception):
    """
    Глобальный обработчик исключений для всех unhandled errors.
    """
    logger.error(f"Необработанное исключение: {exc}", exc_info=True)

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Внутренняя ошибка сервера",
            "code": "INTERNAL_SERVER_ERROR",
            "details": {}
        }
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Обработчик ошибок валидации Pydantic.
    """
    logger.warning(f"Ошибка валидации: {exc.errors()}")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Ошибка валидации данных",
            "code": "VALIDATION_ERROR",
            "details": {"errors": exc.errors()}
        }
    )
