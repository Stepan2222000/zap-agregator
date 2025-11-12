"""
Настройка логирования
"""
import logging
import sys


def setup_logging():
    """Настройка логирования для приложения"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout)
        ]
    )

    # Отключаем избыточное логирование от uvicorn
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
