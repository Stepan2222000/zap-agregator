# AutoHub AI - Умный маркетплейс автозапчастей

Платформа для публикации и поиска автозапчастей с использованием AI-технологий для автоматического обогащения объявлений.

## 🏗️ Технологический стек

### Backend
- **Python 3.10+**
- **FastAPI** - современный веб-фреймворк
- **PostgreSQL** - реляционная база данных
- **asyncpg** - асинхронный драйвер PostgreSQL (БЕЗ ORM)
- **Google Gemini AI** - обработка объявлений (будет добавлено)

### Frontend
- **Next.js 14+** с App Router
- **React 18** - библиотека для UI
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- **Heroicons** - иконки

## 📁 Структура проекта

```
zap-agregator/
├── backend/               # FastAPI приложение
│   ├── app/
│   │   ├── api/          # API роутеры
│   │   ├── core/         # Конфигурация и утилиты
│   │   ├── db/           # Подключение к БД
│   │   ├── models/       # Pydantic модели
│   │   └── services/     # Бизнес-логика
│   └── requirements.txt
├── frontend/             # Next.js приложение
│   ├── app/             # App Router страницы
│   ├── components/      # React компоненты
│   └── lib/            # Утилиты и API client
├── scripts/            # SQL миграции
│   └── migrations/
└── docs/               # Документация
```

## 🚀 Быстрый старт

### Требования
- Python 3.10 или выше
- Node.js 18 или выше
- PostgreSQL 14 или выше
- npm или yarn

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd zap-agregator
```

### 2. Настройка Backend

#### Создание виртуального окружения
```bash
cd backend
python -m venv venv

# Активация (macOS/Linux)
source venv/bin/activate

# Активация (Windows)
venv\Scripts\activate
```

#### Установка зависимостей
```bash
pip install -r requirements.txt
```

#### Настройка базы данных
1. Создайте базу данных PostgreSQL:
```bash
psql -U postgres
CREATE DATABASE autohub_ai;
\q
```

2. Примените миграции:
```bash
psql -U postgres -d autohub_ai -f ../scripts/migrations/001_initial_schema.sql
```

#### Настройка переменных окружения
```bash
cp .env.example .env
```

Отредактируйте `.env` и укажите правильные значения:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/autohub_ai
CORS_ORIGINS=["http://localhost:3000"]
```

#### Запуск сервера
```bash
uvicorn app.main:app --reload
```

Backend будет доступен на http://localhost:8000
- API документация: http://localhost:8000/api/docs
- Health check: http://localhost:8000/api/health

### 3. Настройка Frontend

```bash
cd frontend
```

#### Установка зависимостей
```bash
npm install
```

#### Настройка переменных окружения
```bash
cp .env.local.example .env.local
```

Отредактируйте `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Запуск dev-сервера
```bash
npm run dev
```

Frontend будет доступен на http://localhost:3000

## 📊 Схема базы данных

### Таблицы
- **listings** - объявления о продаже запчастей
- **parts** - внутренние ID запчастей
- **article_numbers** - артикулы (many-to-one с parts)
- **photos** - фотографии объявлений
- **moderation_log** - история модерации

Подробная схема находится в [scripts/migrations/001_initial_schema.sql](scripts/migrations/001_initial_schema.sql)

## 🎨 Дизайн

- **Темная тема** по умолчанию
- **Mobile-first** подход
- **Адаптивный дизайн** для всех размеров экранов
- Цветовая схема:
  - Фон: `#0A1628`, `#0F172A`
  - Акцент: `#3B82F6` (синий)
  - Карточки: светлые на темном фоне

## 📝 Реализованные User Stories

### ✅ User Story 1.1: Project Foundation & Database Setup
- Структура monorepo
- Backend FastAPI с модульной архитектурой
- PostgreSQL база данных с 5 таблицами
- Next.js 14+ frontend с TypeScript

### ✅ User Story 1.2: Core API Infrastructure & Health Check
- Health check endpoint (`/api/health`)
- CORS конфигурация
- Глобальная обработка ошибок
- Логирование
- Frontend API client

### ✅ User Story 1.3: Layout Components & Design Foundation
- Header (адаптивный с burger menu)
- Footer (корпоративный дизайн с соцсетями)
- Tailwind конфигурация с брендовыми цветами
- Типографика и базовые стили

### ✅ User Story 1.4: Hero Section & Search Bar
- Hero-блок с градиентным фоном (70vh высоты)
- Заголовок "AutoHub AI" с AI-акцентом
- Поисковая строка с редиректом на `/catalog?q={query}`
- Кнопка "Опубликовать объявление"
- Адаптивный дизайн с плавными transitions
- Декоративные элементы и glow effects

### ✅ User Story 1.5: Quick Publish Button & Brand Cards Grid
- CTA-кнопка публикации в hero-блоке
- Секция "Популярные бренды" с 12 карточками
- Бренды: Audi, BMW, Mercedes, Toyota, Volkswagen, Ford, Nissan, Honda, Mazda, Hyundai, Kia, Renault
- Адаптивная сетка (2 колонки на мобильных, до 6 на десктопе)
- Клик на карточку → `/catalog?brand={name}`
- Hover effects (scale, shadow, border glow)

### ✅ User Story 1.6: Info Blocks & Mobile Optimization
- Секция "О платформе" с AI-акцентом
- Секция "Почему AutoHub AI" с 3 преимуществами:
  - 🤖 Искусственный интеллект обогащает объявления
  - ⚡ Быстрая публикация без регистрации
  - 🔍 Умный поиск по артикулам
- Оптимизация для мобильных (минимум 16px шрифт)
- Smooth scrolling и улучшенный font rendering
- Focus styles для доступности
- Next.js конфигурация с оптимизацией изображений

## 🔧 Полезные команды

### Backend
```bash
# Запуск с hot-reload
uvicorn app.main:app --reload

# Запуск на другом порту
uvicorn app.main:app --reload --port 8001

# Установка новых зависимостей
pip install <package>
pip freeze > requirements.txt
```

### Frontend
```bash
# Dev режим
npm run dev

# Продакшн сборка
npm run build
npm run start

# Линтинг
npm run lint
```

## 🐛 Troubleshooting

### Backend не запускается
- Проверьте, что PostgreSQL запущен: `pg_isready`
- Проверьте правильность DATABASE_URL в `.env`
- Убедитесь, что база данных создана и миграции применены

### Frontend не может подключиться к API
- Проверьте, что backend запущен на http://localhost:8000
- Проверьте NEXT_PUBLIC_API_URL в `.env.local`
- Проверьте CORS настройки в backend

### Ошибки TypeScript
- Удалите папки: `.next`, `node_modules`
- Переустановите зависимости: `npm install`

## 📄 Лицензия

Все права защищены © 2025 AutoHub AI

## 👥 Команда

Проект разрабатывается для демонстрации возможностей AI в сфере e-commerce автозапчастей.

---

## 🎯 Текущий статус

**Завершено:** User Stories 1.1-1.6 - Полная основа проекта с главной страницей

**Следующие шаги:** Реализация User Stories 2.1-2.3 (публикация объявлений)

### Компоненты главной страницы
- ✅ [HeroSection](frontend/components/HeroSection.tsx) - Hero-блок с поиском
- ✅ [AboutPlatform](frontend/components/AboutPlatform.tsx) - Информация о платформе
- ✅ [PopularBrands](frontend/components/PopularBrands.tsx) - Сетка из 12 брендов
- ✅ [WhyAutoHub](frontend/components/WhyAutoHub.tsx) - Преимущества платформы
- ✅ [BrandCard](frontend/components/BrandCard.tsx) - Карточка бренда
- ✅ [Header](frontend/components/Header.tsx) - Адаптивный header
- ✅ [Footer](frontend/components/Footer.tsx) - Footer с соцсетями
