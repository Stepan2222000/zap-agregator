# 🐳 Docker Deployment - AutoHub AI

Полное руководство по запуску AutoHub AI в Docker-контейнерах.

## 📋 Содержание

- [Быстрый старт](#быстрый-старт)
- [Требования](#требования)
- [Первоначальная настройка](#первоначальная-настройка)
- [Запуск проекта](#запуск-проекта)
- [Архитектура](#архитектура)
- [Управление контейнерами](#управление-контейнерами)
- [Логи и отладка](#логи-и-отладка)
- [Production deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

---

## 🚀 Быстрый старт

```bash
# 1. Клонируйте репозиторий (если еще не сделали)
git clone <repository-url>
cd zap-agregator

# 2. Создайте и настройте .env файл
cp .env.docker.example .env
# Отредактируйте .env и заполните необходимые переменные

# 3. Положите Google Cloud credentials
mkdir -p backend/credentials
# Скопируйте ваш credentials.json в backend/credentials/

# 4. Запустите всё одной командой!
./restart.sh
```

После запуска сервисы будут доступны:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/api/docs
- **Admin Panel**: http://localhost:3000/admin

---

## 💻 Требования

### Обязательное ПО

- **Docker Desktop** 4.0+ (для macOS/Windows) или **Docker Engine** 20.10+ (для Linux)
- **Docker Compose** 2.0+
- **Bash** (для запуска restart.sh)
- **curl** (для health checks)

### Проверка установки

```bash
# Проверка Docker
docker --version
docker compose version

# Проверка что Docker запущен
docker info
```

### Системные требования

- **RAM**: минимум 4GB, рекомендуется 8GB+
- **Disk**: минимум 10GB свободного места
- **CPU**: 2+ cores

---

## ⚙️ Первоначальная настройка

### 1. Настройка переменных окружения

Создайте `.env` файл из примера:

```bash
cp .env.docker.example .env
```

Отредактируйте `.env` и заполните обязательные переменные:

```env
# PostgreSQL (можно оставить по умолчанию или изменить)
POSTGRES_DB=autohub_ai
POSTGRES_USER=autohub_user
POSTGRES_PASSWORD=ваш_безопасный_пароль_здесь

# Google Vertex AI (ОБЯЗАТЕЛЬНО ЗАПОЛНИТЬ!)
VERTEX_AI_PROJECT_ID=ваш-project-id
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_CREDENTIALS_PATH=/app/credentials/credentials.json
AI_MODEL=google/gemini-2.5-pro

# API URL для фронтенда
NEXT_PUBLIC_API_URL=http://localhost:8000

# CORS (добавьте свои домены если нужно)
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
```

### 2. Google Cloud Credentials

Получите Service Account credentials для Vertex AI:

1. Откройте [Google Cloud Console](https://console.cloud.google.com)
2. Перейдите в IAM & Admin → Service Accounts
3. Создайте новый Service Account с ролью "Vertex AI User"
4. Создайте JSON ключ и скачайте его
5. Положите файл в проект:

```bash
mkdir -p backend/credentials
cp ~/Downloads/your-credentials.json backend/credentials/credentials.json
```

**⚠️ ВАЖНО**: Файл `backend/credentials/` добавлен в `.dockerignore`, но будет смонтирован как volume в контейнер.

### 3. Структура проекта

Убедитесь что структура соответствует ожидаемой:

```
zap-agregator/
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── requirements.txt
│   ├── app/
│   └── credentials/
│       └── credentials.json
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   └── app/
├── scripts/
│   └── migrations/
│       └── 001_initial_schema.sql
├── docker-compose.yml
├── .env
└── restart.sh
```

---

## 🏃 Запуск проекта

### Автоматический запуск (рекомендуется)

Используйте скрипт `restart.sh` для полного lifecycle management:

```bash
./restart.sh
```

Скрипт выполнит:
1. ✅ Проверку Docker и зависимостей
2. ✅ Остановку старых контейнеров
3. ✅ Сборку новых Docker образов
4. ✅ Запуск всех сервисов (PostgreSQL, Backend, Frontend)
5. ✅ Health checks для всех сервисов
6. ✅ Вывод статуса и полезных команд

### Ручной запуск

Если предпочитаете ручное управление:

```bash
# Сборка образов
docker compose build

# Запуск в фоновом режиме
docker compose up -d

# Проверка статуса
docker compose ps

# Просмотр логов
docker compose logs -f
```

### Первый запуск

При первом запуске:
- Автоматически создастся база данных PostgreSQL
- Выполнится SQL-миграция (`001_initial_schema.sql`)
- Создадутся необходимые таблицы
- Инициализируются volumes для данных

**Время первого запуска**: 2-5 минут (зависит от скорости интернета и мощности системы)

---

## 🏗️ Архитектура

### Сервисы

#### 1. PostgreSQL (`postgres`)
- **Image**: `postgres:14-alpine`
- **Container**: `autohub-postgres`
- **Port**: `5432`
- **Volume**: `postgres_data` (персистентное хранилище)
- **Init script**: автоматически выполняет `001_initial_schema.sql`

#### 2. Backend (`backend`)
- **Base**: `python:3.10-slim`
- **Container**: `autohub-backend`
- **Port**: `8000`
- **Framework**: FastAPI
- **Volume**: `backend_uploads` для загруженных фото
- **Health check**: `http://localhost:8000/api/health`

#### 3. Frontend (`frontend`)
- **Base**: `node:18-alpine`
- **Container**: `autohub-frontend`
- **Port**: `3000`
- **Framework**: Next.js 14
- **Output**: standalone (оптимизированный для Docker)
- **Health check**: `http://localhost:3000`

### Сеть

Все сервисы работают в изолированной сети `autohub-network`:
- Frontend → Backend: `http://backend:8000`
- Backend → PostgreSQL: `postgresql://user:pass@postgres:5432/db`
- Внешний доступ через проброшенные порты

### Volumes

```yaml
volumes:
  postgres_data:       # База данных PostgreSQL
  backend_uploads:     # Загруженные фотографии объявлений
```

Данные сохраняются между перезапусками контейнеров.

---

## 🛠️ Управление контейнерами

### Базовые команды

```bash
# Просмотр статуса
docker compose ps

# Запуск всех сервисов
docker compose up -d

# Остановка всех сервисов
docker compose stop

# Остановка и удаление контейнеров
docker compose down

# Остановка с удалением volumes (⚠️ удалятся данные!)
docker compose down -v

# Перезапуск конкретного сервиса
docker compose restart backend
docker compose restart frontend

# Пересборка конкретного сервиса
docker compose build --no-cache backend
docker compose up -d backend
```

### Масштабирование

```bash
# Просмотр ресурсов
docker stats

# Ограничение ресурсов (в docker-compose.yml)
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
```

---

## 📊 Логи и отладка

### Просмотр логов

```bash
# Все сервисы в реальном времени
docker compose logs -f

# Конкретный сервис
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f postgres

# Последние N строк
docker compose logs --tail=100 backend

# Логи с временными метками
docker compose logs -f -t
```

### Подключение к контейнерам

```bash
# Shell в backend контейнере
docker compose exec backend bash

# Shell в frontend контейнере
docker compose exec frontend sh

# PostgreSQL CLI
docker compose exec postgres psql -U autohub_user -d autohub_ai
```

### SQL запросы

```bash
# Подключение к БД
docker compose exec -it postgres psql -U autohub_user -d autohub_ai

# Примеры запросов
SELECT COUNT(*) FROM listings;
SELECT * FROM parts LIMIT 10;
\dt  # Список таблиц
\d listings  # Структура таблицы
```

### Health checks

```bash
# Проверка PostgreSQL
docker compose exec postgres pg_isready -U autohub_user

# Проверка Backend
curl http://localhost:8000/api/health

# Проверка Frontend
curl http://localhost:3000

# Статус health checks всех сервисов
docker compose ps
```

---

## 🚀 Production Deployment

### Оптимизация для production

1. **Измените пароли и секреты**:
```env
POSTGRES_PASSWORD=очень_сложный_пароль_128_символов
ADMIN_TOKEN=случайный_токен_вместо_simple-token
```

2. **Настройте CORS для вашего домена**:
```env
CORS_ORIGINS=["https://yourdomain.com","https://www.yourdomain.com"]
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

3. **Используйте внешнюю базу данных** (опционально):
```env
# Вместо контейнера postgres используйте managed database
DATABASE_URL=postgresql://user:pass@external-db-host:5432/dbname
```

4. **Настройте reverse proxy (nginx)**:
```nginx
# /etc/nginx/sites-available/autohub
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }

    location /api {
        proxy_pass http://localhost:8000;
    }

    location /uploads {
        proxy_pass http://localhost:8000;
    }
}
```

5. **Настройте SSL (Let's Encrypt)**:
```bash
certbot --nginx -d yourdomain.com
```

### Docker Compose Production

Создайте `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    restart: always
    deploy:
      resources:
        limits:
          cpus: '2.0'
          memory: 2G
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "5"

  frontend:
    restart: always
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "5"
```

Запуск:
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## 🔧 Troubleshooting

### Проблема: Контейнер не запускается

**Решение**:
```bash
# Проверьте логи
docker compose logs backend

# Проверьте конфигурацию
docker compose config

# Пересоберите образ
docker compose build --no-cache backend
docker compose up -d backend
```

### Проблема: Backend не может подключиться к PostgreSQL

**Возможные причины**:
- PostgreSQL еще не готов (подождите 10-20 секунд)
- Неправильный пароль в `.env`
- Контейнер postgres не запущен

**Решение**:
```bash
# Проверьте статус postgres
docker compose ps postgres

# Проверьте health check
docker compose exec postgres pg_isready -U autohub_user

# Проверьте логи
docker compose logs postgres
```

### Проблема: Frontend не может обратиться к Backend

**Проверьте**:
- `NEXT_PUBLIC_API_URL` должен быть `http://localhost:8000` (не `http://backend:8000` - это только для SSR)
- Backend запущен и отвечает: `curl http://localhost:8000/api/health`
- CORS настроен правильно в `.env`

### Проблема: Ошибка Vertex AI

**Проверьте**:
```bash
# Файл credentials существует
ls -la backend/credentials/credentials.json

# Переменная окружения правильная
docker compose exec backend env | grep VERTEX

# Project ID корректный
docker compose logs backend | grep -i vertex
```

### Проблема: "Port already in use"

**Решение**:
```bash
# Найдите процесс использующий порт
lsof -i :3000
lsof -i :8000

# Убейте процесс или измените порт в .env
FRONTEND_PORT=3001
BACKEND_PORT=8001
```

### Проблема: Медленная сборка

**Оптимизация**:
```bash
# Используйте BuildKit
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Очистите старые образы
docker system prune -a

# Используйте кеш при сборке
docker compose build
```

### Проблема: "No space left on device"

**Решение**:
```bash
# Очистка неиспользуемых ресурсов
docker system prune -a --volumes

# Проверка использования диска
docker system df
```

---

## 📝 Полезные команды

### Backup базы данных

```bash
# Создать backup
docker compose exec -T postgres pg_dump -U autohub_user autohub_ai > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановить из backup
docker compose exec -T postgres psql -U autohub_user -d autohub_ai < backup_20241114_120000.sql
```

### Очистка тестовых данных

```bash
# Подключитесь к БД
docker compose exec postgres psql -U autohub_user -d autohub_ai

# Очистите таблицы (осторожно!)
TRUNCATE listings, photos, article_numbers, parts CASCADE;
```

### Мониторинг ресурсов

```bash
# Реальное время
docker stats

# Использование диска
docker system df -v

# Логи с ошибками
docker compose logs | grep -i error
```

### Обновление зависимостей

```bash
# Backend (Python)
docker compose exec backend pip list --outdated

# Frontend (Node)
docker compose exec frontend npm outdated
```

---

## 🔗 Дополнительные ресурсы

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте [Troubleshooting](#troubleshooting)
2. Посмотрите логи: `docker compose logs -f`
3. Создайте issue в репозитории проекта

---

**Версия документа**: 1.0
**Последнее обновление**: 2024-11-14
