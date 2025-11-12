#!/bin/bash

# AutoHub AI - Скрипт автоматической настройки
# Запустите: chmod +x setup.sh && ./setup.sh

set -e

echo "🚀 AutoHub AI - Автоматическая настройка проекта"
echo "================================================="
echo ""

# Проверка PostgreSQL
echo "1️⃣ Проверка PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL не установлен. Установите через: brew install postgresql"
    exit 1
fi

if ! pg_isready -q; then
    echo "⚠️  PostgreSQL не запущен. Запускаю..."
    brew services start postgresql
    sleep 2
fi

echo "✅ PostgreSQL работает"
echo ""

# Создание базы данных
echo "2️⃣ Создание базы данных..."
if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw autohub_ai; then
    echo "ℹ️  База данных autohub_ai уже существует"
else
    psql -U postgres -c "CREATE DATABASE autohub_ai;"
    echo "✅ База данных создана"
fi
echo ""

# Применение миграций
echo "3️⃣ Применение миграций..."
psql -U postgres -d autohub_ai -f scripts/migrations/001_initial_schema.sql
echo "✅ Миграции применены"
echo ""

# Настройка Backend
echo "4️⃣ Настройка Backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Создание виртуального окружения..."
    python3 -m venv venv
fi

source venv/bin/activate

echo "Установка зависимостей..."
pip install -q -r requirements.txt

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Создан .env файл (отредактируйте DATABASE_URL если нужно)"
else
    echo "ℹ️  .env уже существует"
fi

cd ..
echo "✅ Backend настроен"
echo ""

# Настройка Frontend
echo "5️⃣ Настройка Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Установка npm зависимостей..."
    npm install
else
    echo "ℹ️  node_modules уже существует"
fi

if [ ! -f ".env.local" ]; then
    cp .env.local.example .env.local
    echo "✅ Создан .env.local файл"
else
    echo "ℹ️  .env.local уже существует"
fi

cd ..
echo "✅ Frontend настроен"
echo ""

# Готово
echo "================================================="
echo "✅ Настройка завершена успешно!"
echo ""
echo "📋 Для запуска проекта:"
echo ""
echo "Терминал 1 (Backend):"
echo "  cd backend && source venv/bin/activate && uvicorn app.main:app --reload"
echo ""
echo "Терминал 2 (Frontend):"
echo "  cd frontend && npm run dev"
echo ""
echo "🌐 Адреса:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/api/docs"
echo ""
echo "================================================="
