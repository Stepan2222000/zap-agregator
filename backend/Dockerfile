# Backend Dockerfile для AutoHub AI
# Multi-stage build для оптимизации размера образа

# Stage 1: Builder - установка зависимостей
FROM python:3.10-slim as builder

WORKDIR /app

# Установка системных зависимостей для сборки пакетов
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Копирование requirements и установка зависимостей в виртуальное окружение
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Stage 2: Runtime - минимальный образ для production
FROM python:3.10-slim

WORKDIR /app

# Установка только runtime зависимостей
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Копирование установленных Python пакетов из builder stage
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

# Копирование исходного кода приложения
COPY ./app /app/app

# Создание директории для загруженных файлов
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

# Создание директории для credentials (опционально)
RUN mkdir -p /app/credentials

# Установка переменных окружения
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# Открытие порта
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:8000/api/health || exit 1

# Запуск приложения
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
