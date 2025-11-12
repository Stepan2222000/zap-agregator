# 🚀 Быстрый запуск AutoHub AI

## Шаг 1: PostgreSQL

```bash
# Запустите PostgreSQL
brew services start postgresql

# Создайте базу данных
psql -U postgres -c "CREATE DATABASE autohub_ai;"

# Примените миграции
psql -U postgres -d autohub_ai -f scripts/migrations/001_initial_schema.sql
```

## Шаг 2: Backend

```bash
# Терминал 1
cd backend

# Создайте виртуальное окружение (первый раз)
python -m venv venv

# Активируйте окружение
source venv/bin/activate

# Установите зависимости (первый раз)
pip install -r requirements.txt

# Настройте .env (первый раз)
cp .env.example .env
# Отредактируйте .env и укажите DATABASE_URL

# Запустите сервер
uvicorn app.main:app --reload
```

✅ Backend запущен на http://localhost:8000

## Шаг 3: Frontend

```bash
# Терминал 2 (новое окно)
cd frontend

# Установите зависимости (первый раз)
npm install

# Настройте .env.local (первый раз)
cp .env.local.example .env.local

# Запустите dev-сервер
npm run dev
```

✅ Frontend запущен на http://localhost:3000

## Проверка

Откройте в браузере:
- **http://localhost:3000** - главная страница
- **http://localhost:8000/api/health** - health check API
- **http://localhost:8000/api/docs** - Swagger документация

## Быстрый перезапуск

Если уже всё настроено:

```bash
# Терминал 1
cd backend && source venv/bin/activate && uvicorn app.main:app --reload

# Терминал 2
cd frontend && npm run dev
```

## Типичные проблемы

**PostgreSQL не запущен:**
```bash
brew services start postgresql
```

**Порт 8000 занят:**
```bash
# Найдите процесс
lsof -i :8000
# Убейте процесс
kill -9 <PID>
```

**Порт 3000 занят:**
Next.js автоматически предложит использовать 3001

---

🎉 **Готово!** Теперь у вас запущен полноценный AI-маркетплейс автозапчастей.
