"""
Health check endpoint
"""
from fastapi import APIRouter
from datetime import datetime
from app.db.connection import db

router = APIRouter()


@router.get("/health")
async def health_check():
    """
    Health check endpoint для проверки статуса API и БД.
    """
    try:
        # Проверяем подключение к БД
        result = await db.fetch_one("SELECT 1 as status")
        db_status = "ok" if result else "error"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "ok" if db_status == "ok" else "degraded",
        "timestamp": datetime.utcnow().isoformat(),
        "database": db_status
    }
