"""
Middleware для аутентификации администратора
"""
from fastapi import Header, HTTPException, status
from app.core.config import settings


async def verify_admin_token(x_admin_token: str = Header(None)) -> None:
    """
    Проверяет наличие и корректность админского токена в header запроса.

    Args:
        x_admin_token: Токен из header 'X-Admin-Token'

    Raises:
        HTTPException: 401 если токен отсутствует или неверен
    """
    if not x_admin_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Отсутствует токен администратора",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if x_admin_token != settings.ADMIN_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверный токен администратора",
            headers={"WWW-Authenticate": "Bearer"},
        )
