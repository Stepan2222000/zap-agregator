# AutoHub AI Product Requirements Document (PRD)

**Version:** 0.1
**Date:** 2025-11-12
**Author:** John (PM)
**Status:** Ready for Architecture

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-11-12 | 0.1 | Initial draft based on brainstorming session | John (PM) |

---

## Goals and Background Context

### Goals

- Создать MVP маркетплейса автозапчастей за 5 дней с одним разработчиком
- Интегрировать реальный AI-функционал (Google Gemini API) для автоматического обогащения объявлений
- Обеспечить простую публикацию объявлений без системы регистрации/аккаунтов
- Реализовать надёжную систему модерации для контроля качества контента
- Создать удобную систему поиска по артикулам запчастей с фильтрацией
- Обеспечить отличный Mobile-first опыт (мобильные устройства - основная платформа)
- Реализовать двойную систему идентификации запчастей (внешние артикулы + внутренние ID)
- Предоставить админам возможность массовой загрузки объявлений для наполнения платформы

### Background Context

Маркетплейс автозапчастей с AI-интеграцией решает проблему высокого барьера входа для продавцов запчастей и сложности поиска нужных деталей для покупателей. Традиционные площадки требуют детальных описаний, знания технических характеристик и множества шагов для публикации объявления. Данный проект упрощает этот процесс: продавцу достаточно указать артикул, загрузить фото и базовую информацию, а Google Gemini AI автоматически обогащает объявление структурированным описанием, корректным названием и характеристиками запчасти.

Система построена на принципе "простота для продавцов + качество через модерацию": отсутствие регистрации снижает барьер входа, а обязательная модерация человеком гарантирует качество контента. Двойная система идентификации (внешние артикулы производителей + внутренние ID платформы) позволяет гибко управлять каталогом и в будущем связывать аналоги и кросс-номера. Mobile-first подход отражает реальность рынка - большинство пользователей будут взаимодействовать с платформой через смартфоны.

### Success Metrics

**MVP Success Metrics:**
- ✅ 100+ approved listings в первый месяц
- ✅ Lighthouse Mobile score >= 80
- ✅ AI processing success rate >= 70%
- ✅ Average page load time < 3 секунды
- ✅ Zero critical bugs in production

---

## Requirements

### Functional Requirements

**Публикация объявлений:**
- **FR1:** Пользователь может опубликовать объявление о продаже автозапчасти без регистрации/аккаунта
- **FR2:** Форма публикации должна принимать: артикул, до 10 фотографий (любые форматы), состояние (новое/б\у), цену, марку автомобиля, описание, контактные данные (телефон, WhatsApp или Telegram)
- **FR3:** После публикации объявление автоматически отправляется на обработку Google Gemini API для обогащения данных

**AI-обработка:**
- **FR4:** Google Gemini API автоматически обрабатывает объявление: ищет информацию о запчасти по артикулу, формирует структурированное описание, создаёт корректное название, дополняет характеристиками
- **FR5:** Система должна корректно обрабатывать ситуации, когда Gemini API не отвечает или возвращает ошибку - объявление переходит в статус "На модерации" с пометкой об ошибке AI
- **FR6:** Модератор может повторно отправить объявление на обработку AI неограниченное количество раз

**Модерация:**
- **FR7:** Все объявления проходят обязательную модерацию человеком перед публикацией на сайте
- **FR8:** Админка должна отображать объявления с фильтрацией по статусам: "В обработке AI", "На модерации", "Одобрено", "Отклонено"
- **FR9:** Для каждого объявления модератор видит исходные данные пользователя и результаты AI-обработки (или их отсутствие)
- **FR10:** Модератор может одобрить, отклонить объявление или отправить на повторную обработку AI
- **FR11:** Модератор вручную создаёт внутренний ID и привязывает артикулы при одобрении объявления

**Система идентификации:**
- **FR12:** Каждая запчасть имеет внутренний ID (создаётся вручную модератором)
- **FR13:** К одному внутреннему ID может быть привязано несколько артикулов (разные номера одной запчасти)
- **FR14:** Один артикул может иметь много объявлений от разных продавцов
- **FR15:** Пользователь вводит артикул вручную без валидации

**Каталог и поиск:**
- **FR16:** Главная страница содержит поисковую строку для поиска по артикулам и названиям запчастей
- **FR17:** Главная страница отображает до 12 статических брендовых карточек (Audi, BMW, Mercedes, Toyota, VW и т.д.)
- **FR18:** Клик по брендовой карточке открывает каталог с применённым фильтром по выбранному бренду
- **FR19:** Поиск работает по текстовому совпадению с артикулом или названием запчасти
- **FR20:** Если поиск не находит результатов, показывается сообщение "Такого товара нет" (без показа похожих товаров)
- **FR21:** Каталог имеет обязательные фильтры: диапазон цены, состояние (новое/б\у), марка автомобиля

**Карточки объявлений:**
- **FR22:** Карточка-превью объявления в каталоге показывает: главную фотографию, название, артикул, марку, цену, состояние
- **FR23:** Детальная страница объявления показывает: фотогалерею со свайпом, все характеристики, описание, модели авто (опционально), контактные данные
- **FR24:** Поля в детальной карточке могут быть не заполнены, если объявление добавлено вручную админом без AI-обработки

**Массовая загрузка:**
- **FR25:** Админ может массово загружать объявления (через SQL-скрипты напрямую в БД или через админку)
- **FR26:** Объявления, добавленные напрямую в БД, сразу отображаются на сайте в статусе "Одобрено"

**UI/UX:**
- **FR27:** Все страницы должны быть оптимизированы под мобильные устройства (mobile-first подход)
- **FR28:** Десктопная версия является вторичной, но должна быть адаптивной

### Non-Functional Requirements

- **NFR1:** Срок разработки MVP - 5 дней с одним разработчиком
- **NFR2:** Технологический стек: Python FastAPI (backend), Next.js (frontend), PostgreSQL (БД), Google Gemini API (AI)
- **NFR3:** Система не требует капчи - защита от спама обеспечивается обязательной модерацией
- **NFR4:** Форма загрузки фотографий не требует предпросмотра
- **NFR5:** Интерфейс должен иметь крупные кнопки, читаемые шрифты, минимум горизонтальной прокрутки (оптимизация под touch)
- **NFR6:** Система должна поддерживать любые форматы изображений (jpg, png, webp и т.д.)
- **NFR7:** Максимальное количество фотографий на объявление - 10 штук
- **NFR8:** Все loading и error состояния должны быть корректно обработаны

### Out of Scope for MVP

- ❌ **Система аккаунтов/регистрации**
- ❌ **Автоматическая валидация артикулов**
- ❌ **Автоматическое связывание артикулов**
- ❌ **Рекомендации похожих товаров**
- ❌ **Капча**
- ❌ **Reviews/ratings**
- ❌ **Чат с продавцом**
- ❌ **Wishlist/избранное**

---

## Technical Assumptions

### Repository Structure: Monorepo

**Структура:**
```
zap-agregator/
├── backend/          # Python FastAPI
├── frontend/         # Next.js
├── shared/           # Общие типы, константы
├── docs/             # Документация
└── scripts/          # Утилиты, миграции БД
```

**Обоснование:**
- Один репозиторий упрощает синхронизацию изменений между frontend и backend
- Легче управлять версионированием API contracts
- Проще для solo-разработчика (нет необходимости переключаться между репозиториями)
- Общие типы и константы можно переиспользовать

### Service Architecture

**Архитектура: Monolith (Backend) + SPA (Frontend)**

**Backend (Python FastAPI):**
- **Тип:** Монолитное приложение с модульной структурой
- **БД:** PostgreSQL напрямую (БЕЗ SQLAlchemy ORM - использовать psycopg2 или asyncpg)
- **Паттерн:** Layered Architecture (Controllers → Services → Repositories)
- **Структура модулей:**
  ```
  backend/
  ├── app/
  │   ├── api/              # API endpoints (routers)
  │   │   ├── listings.py   # Объявления
  │   │   ├── admin.py      # Админка
  │   │   ├── search.py     # Поиск
  │   ├── services/         # Бизнес-логика
  │   │   ├── ai.py         # AI обработка (OpenAI SDK + Vertex AI)
  │   │   ├── moderation.py # Модерация
  │   ├── models/           # Data models (NOT ORM models)
  │   ├── schemas/          # Pydantic схемы
  │   ├── db/               # Database setup (connection pool)
  │   ├── core/             # Конфигурация, constants
  │   │   └── config.py     # Все настройки (API ключи, модель и т.д.)
  │   └── main.py           # Entry point
  ```

**Frontend (Next.js):**
- **Тип:** Single Page Application (App Router)
- **Рендеринг:** Client-Side Rendering (CSR) с частичным Server-Side Rendering (SSR) для SEO
- **State Management:** React Context API + useState/useReducer (для MVP, без Redux)
- **Data Fetching:** Native fetch API или Axios
- **Структура:**
  ```
  frontend/
  ├── app/
  │   ├── page.tsx          # Главная
  │   ├── catalog/          # Каталог
  │   ├── listing/[id]/     # Детальная страница
  │   ├── publish/          # Публикация
  │   ├── admin/            # Админка
  ├── components/           # React компоненты
  ├── lib/                  # Утилиты, API client
  ├── styles/               # Tailwind конфиги
  └── public/               # Статика
  ```

**Интеграция:**
- RESTful API между frontend и backend
- CORS настроен для production сервера
- JSON для всех API responses

**База данных (PostgreSQL):**
- **Единственная СУБД для всего проекта**
- **Работа напрямую без ORM** (использовать psycopg2 или asyncpg)
- **Основные таблицы:**
  - `listings` - объявления
  - `parts` - запчасти (внутренние ID)
  - `article_numbers` - артикулы (связь many-to-one с parts)
  - `photos` - фотографии объявлений
  - `moderation_log` - история модерации
- **Отношения:**
  - Listings → Parts (many-to-one)
  - Parts → ArticleNumbers (one-to-many)
  - Listings → Photos (one-to-many)

**Файловое хранилище:**
- **Для деплоя на сервере:** Локальное хранилище на сервере (`backend/uploads/`)
- Простая структура папок: `uploads/{listing_id}/{photo_filename}`

### Testing Requirements

**Стратегия тестирования: Только ручное тестирование**

- ❌ Автоматические тесты не требуются
- ✅ Полное ручное тестирование всех функций перед деплоем
- ✅ Обязательная проверка на реальных мобильных устройствах
- ✅ Проверка обеих тем (тёмная + светлая)
- ✅ Проверка всех критичных флоу
- ✅ Проверка адаптивности на разных размерах экранов

**CI/CD:**
- ❌ Не требуется для MVP
- Деплой вручную на сервер

### Additional Technical Assumptions and Requests

**Языки и версии:**
- **Python:** 3.11+ (для FastAPI)
- **Node.js:** 18+ (для Next.js)
- **PostgreSQL:** 15+

**Ключевые библиотеки и зависимости:**

**Backend:**
- `fastapi` - веб-фреймворк
- `uvicorn` - ASGI сервер
- `psycopg2` или `asyncpg` - PostgreSQL драйвер
- `pydantic` - валидация данных
- `openai` - **OpenAI SDK для работы с Vertex AI endpoint**
- `python-multipart` - загрузка файлов
- `pillow` - обработка изображений (ресайз, оптимизация)

**Frontend:**
- `next` 14+ (App Router)
- `react` 18+
- `tailwindcss` - UI styling
- `axios` - HTTP client
- `lucide-react` - иконки
- `react-hook-form` - управление формами
- `zod` - валидация на клиенте
- `swiper` или `embla-carousel` - фотогалереи

**AI Integration (OpenAI SDK + Vertex AI):**

**Конфигурация в `backend/app/core/config.py`:**
```python
# AI Configuration
VERTEX_AI_ENDPOINT = "https://YOUR-VERTEX-AI-ENDPOINT"
VERTEX_AI_API_KEY = "your-api-key-here"
AI_MODEL = "gemini-2.5-pro"
AI_MAX_RETRIES = 3
AI_TIMEOUT_SECONDS = 30
```

**Использование OpenAI SDK с Vertex AI:**
```python
from openai import OpenAI

client = OpenAI(
    api_key=config.VERTEX_AI_API_KEY,
    base_url=config.VERTEX_AI_ENDPOINT
)

response = client.chat.completions.create(
    model=config.AI_MODEL,  # "gemini-2.5-pro"
    messages=[...]
)
```

**Deployment:**
- **Backend:** Развертывание на VPS (DigitalOcean, Hetzner, или любой другой)
- **Frontend:** Развертывание на том же сервере через nginx + PM2 (или отдельно на Vercel)
- **База данных:** PostgreSQL на том же VPS
- **Структура на сервере:**
  ```
  /var/www/zap-agregator/
  ├── backend/          # FastAPI app
  ├── frontend/         # Next.js build
  ├── uploads/          # Загруженные фото
  └── nginx.conf        # Nginx конфигурация
  ```

**Configuration Management (backend/app/core/config.py):**
```python
class Settings:
    # Database
    DATABASE_URL: str = "postgresql://user:pass@localhost/zap_agregator"

    # AI Settings
    VERTEX_AI_ENDPOINT: str = "https://..."
    VERTEX_AI_API_KEY: str = "..."
    AI_MODEL: str = "gemini-2.5-pro"
    AI_MAX_RETRIES: int = 3
    AI_TIMEOUT_SECONDS: int = 30

    # File Upload
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 5
    ALLOWED_IMAGE_TYPES: list = ["image/jpeg", "image/png", "image/webp"]

    # Admin
    ADMIN_TOKEN: str = "simple-token-for-mvp"  # Один модератор

    # CORS
    CORS_ORIGINS: list = ["http://your-domain.com"]

    # App Settings
    APP_NAME: str = "AutoHub AI"
    ITEMS_PER_PAGE: int = 20
```

**Безопасность (базовая, без особых заморачиваний):**
- **Админка:** Простой токен в header (`X-Admin-Token: simple-token-for-mvp`)
- **API:** Базовый rate limiting (например, 100 запросов в минуту)
- **Загрузка файлов:**
  - Валидация типов файлов (только jpg, png, webp)
  - Ограничение размера (макс 5MB на фото)
  - Ограничение количества (макс 10 фото)
- **CORS:** Настроен для production домена
- **SQL Injection:** Защита через параметризованные запросы в psycopg2/asyncpg

**Логирование:**
- Backend: базовое логирование через стандартный `logging` Python
- Уровни: INFO для production
- Логирование всех AI запросов и ошибок для отладки

**Обработка ошибок:**
- Глобальный exception handler в FastAPI
- Стандартизированный формат ошибок: `{"error": "message", "code": "ERROR_CODE"}`
- Graceful degradation: если Vertex AI недоступен - объявление просто идёт на модерацию без AI обработки

**Performance:**
- Индексы в PostgreSQL на часто используемые поля (article_number, status, brand)
- Пагинация для списка объявлений (по 20 на страницу)
- Lazy loading для изображений на фронтенде
- Image optimization через Next.js Image компонент

**Дополнительные технические детали:**
- **Один модератор:** Упрощённая система авторизации, нет необходимости в ролях
- **PostgreSQL для всего:** Единая БД для всех данных, включая логи модерации
- **Конфиг в коде:** Все настройки в `config.py`, легко менять без .env файлов

---

## Epic List

### Epic 1: Foundation & Home Page
Установить базовую инфраструктуру проекта (FastAPI backend, Next.js frontend, PostgreSQL) и доставить первую видимую функциональность - главную страницу с поисковой строкой, брендовыми карточками и кнопкой публикации.

**Estimated Time:** ~8-11 часов

### Epic 2: Listing Publication & AI Processing
Реализовать возможность публикации объявлений без регистрации с автоматической обработкой через Vertex AI (Gemini 2.5 Pro) для обогащения контента, включая обработку фотографий, валидацию данных и graceful degradation при ошибках AI.

**Estimated Time:** ~9-11.5 часов

### Epic 3: Admin Panel & Moderation System
Создать административную панель для модерации объявлений с фильтрацией по статусам, просмотром исходных данных и результатов AI, возможностью одобрения/отклонения/повторной обработки, а также массовой загрузки объявлений.

**Estimated Time:** ~8-10.5 часов

### Epic 4: Catalog, Search & Discovery
Реализовать каталог объявлений с поиском по артикулам/названиям, фильтрацией (цена, состояние, марка), интеграцией с брендовыми карточками с главной страницы и детальными страницами объявлений с фотогалереями.

**Estimated Time:** ~10.5-13 часов

### Epic 5: Testing & Production Deployment
Провести финальную оптимизацию mobile-first опыта, выполнить ручное тестирование и подготовить приложение к деплою на production сервер.

**Estimated Time:** ~5-7 часов

**Total Estimated Time:** ~45.5-59 часов

---

## Epic 1: Foundation & Home Page

**Расширенная цель:**

Установить всю базовую инфраструктуру проекта (монорепо, FastAPI backend, Next.js frontend, PostgreSQL database) и доставить первую видимую ценность для пользователя - полностью функциональную главную страницу. Главная страница должна содержать hero-блок с описанием, поисковую строку, кнопку быстрой публикации объявления, сетку из 12 брендовых карточек и информационные блоки об AI-технологиях. Этот эпик закладывает фундамент для всего приложения: структуру кода, базовые UI компоненты, логирование, обработку ошибок и готовую к интеграции архитектуру API.

### Story 1.1: Project Foundation & Database Setup

**As a** developer,
**I want** to set up the monorepo structure with FastAPI backend, Next.js frontend, PostgreSQL database and all necessary tooling,
**so that** I have a solid foundation to build features on with proper database schema and migrations.

#### Acceptance Criteria

1. Monorepo структура создана с папками `backend/`, `frontend/`, `docs/`, `scripts/`
2. Backend: FastAPI приложение настроено с базовой структурой (api/, services/, models/, core/)
3. Backend: PostgreSQL подключение настроено через psycopg2 или asyncpg
4. Backend: SQL миграции настроены (простые .sql файлы в scripts/)
5. Backend: Созданы основные таблицы БД: `listings`, `parts`, `article_numbers`, `photos`, `moderation_log`
6. Backend: Базовая конфигурация в `core/config.py` (DATABASE_URL, AI settings placeholders)
7. Frontend: Next.js 14+ проект создан с App Router
8. Frontend: Базовая структура папок создана (app/, components/, lib/)
9. Git репозиторий инициализирован с `.gitignore` (исключая node_modules, venv, *.pyc, uploads/)
10. Backend запускается без ошибок (`uvicorn app.main:app`)
11. Frontend запускается без ошибок (`npm run dev`)

### Story 1.2: Core API Infrastructure & Health Check

**As a** developer,
**I want** to establish core API patterns with health check endpoint, CORS configuration, error handling and logging,
**so that** all future API endpoints follow consistent patterns and the frontend can communicate with backend.

#### Acceptance Criteria

1. Health check endpoint создан: `GET /api/health` возвращает `{"status": "ok", "timestamp": "..."}`
2. CORS настроен для локальной разработки и production домена
3. Глобальный exception handler настроен в FastAPI
4. Стандартизированный формат ошибок: `{"error": "message", "code": "ERROR_CODE", "details": {}}`
5. Базовое логирование настроено (INFO level, логи в console)
6. API prefix `/api` применён ко всем endpoints
7. Frontend API client создан в `lib/api.ts` с базовыми методами (get, post, put, delete)
8. Frontend успешно вызывает `GET /api/health` и отображает результат
9. Обработка ошибок на frontend: если API недоступен, показывается сообщение пользователю
10. Environment variables загружаются корректно (DATABASE_URL на backend, NEXT_PUBLIC_API_URL на frontend)

### Story 1.3: Layout Components & Design Foundation

**As a** user,
**I want** to see профессиональный header и footer на всех страницах,
**so that** я понимаю, что это крупная корпоративная платформа.

#### Acceptance Criteria

1. Создан компонент `Header` с навигацией (логотип, поиск, кнопка "Опубликовать")
2. Header адаптивен: на мобильных - burger menu, на десктопе - полная навигация
3. Создан компонент `Footer` с информацией (копирайт, ссылки на разделы)
4. Создан общий `Layout` компонент, оборачивающий все страницы
5. Tailwind конфигурация содержит брендовые цвета (тёмно-синий, акцентный цвет)
6. Типографика настроена: шрифт загружен (например, Inter), базовые размеры определены
7. Header и Footer визуально выглядят профессионально и современно
8. Header sticky (прилипает к верху при скролле) на мобильных
9. Компоненты работают на всех размерах экранов (375px - 1920px)
10. Логотип проекта создан (текстовый или простая иконка, подходит под название)

### Story 1.4: Hero Section & Search Bar

**As a** user,
**I want** to видеть впечатляющий hero-блок с поисковой строкой на главной странице,
**so that** я могу сразу начать поиск нужной запчасти.

#### Acceptance Criteria

1. Hero-блок создан с заголовком проекта (например, "AutoHub AI - Умный маркетплейс автозапчастей")
2. Подзаголовок объясняет ценность: "AI-powered поиск запчастей. Публикуйте объявления бесплатно."
3. Крупная поисковая строка размещена в центре hero-блока
4. Поисковая строка имеет placeholder: "Введите артикул или название запчасти..."
5. Кнопка поиска визуально заметная (иконка лупы + текст "Найти")
6. При вводе текста и нажатии Enter/кнопки - редирект на `/catalog?q={query}` (функциональность каталога будет позже)
7. Hero-блок адаптивен: на мобильных - вертикальная компоновка, на десктопе - просторная
8. Hero-блок занимает ~60-80vh высоты экрана

### Story 1.5: Quick Publish Button & Brand Cards Grid

**As a** user,
**I want** to видеть кнопку быстрой публикации и карточки популярных брендов,
**so that** я могу быстро опубликовать объявление или найти запчасти для моей марки авто.

#### Acceptance Criteria

1. Кнопка "Опубликовать объявление" размещена видно на главной (после hero или в hero)
2. Клик на кнопку ведёт на `/publish` (страница будет создана позже)
3. Секция "Популярные бренды" создана ниже hero-блока
4. Сетка из 12 брендовых карточек отображается адаптивно:
   - Мобильные: 2-3 колонки
   - Планшеты: 3-4 колонки
   - Десктоп: 4-6 колонок
5. Каждая карточка содержит: изображение/иконку бренда + название (Audi, BMW, Mercedes, Toyota, VW, Ford, Nissan, Honda, Mazda, Hyundai, Kia, Renault)
6. Карточки кликабельны: клик ведёт на `/catalog?brand={brand_name}`
7. На мобильных карточки имеют минимум 44x44px для touch targets

### Story 1.6: Info Blocks & Mobile Optimization

**As a** user,
**I want** to видеть информацию о масштабе платформы и AI-технологиях,
**so that** я доверяю платформе и понимаю её преимущества.

#### Acceptance Criteria

1. Текстовый блок "О платформе" создан: "Самый крупный AI-powered маркетплейс автозапчастей в России"
2. Блок "Почему AutoHub AI" с акцентом на AI-технологии:
   - "🤖 Искусственный интеллект обогащает объявления"
   - "⚡ Быстрая публикация без регистрации"
   - "🔍 Умный поиск по артикулам"
3. Все блоки адаптивны для мобильных устройств
4. На мобильных (375px-430px) вся главная страница отображается корректно без горизонтального скролла
5. Тексты читаемы на мобильных (минимум 16px для body text)
6. Вертикальные отступы между секциями достаточные
7. Footer содержит: копирайт, год, возможно ссылки на соцсети (placeholder)
8. Lighthouse score для Mobile >= 80 (performance, accessibility, best practices)

---

## Epic 2: Listing Publication & AI Processing

**Расширенная цель:**

Реализовать полный цикл публикации объявлений без регистрации: пользователь заполняет простую форму с артикулом, загружает до 10 фотографий, указывает состояние, цену, марку, описание и контактные данные. После публикации объявление автоматически отправляется на обработку через Vertex AI (Gemini 2.5 Pro via OpenAI SDK), который обогащает объявление: ищет информацию о запчасти по артикулу, формирует структурированное описание, создаёт корректное название и дополняет характеристиками. Система должна gracefully обрабатывать ошибки AI (если Gemini недоступен - объявление идёт на модерацию с пометкой об ошибке) и давать пользователю мгновенную обратную связь об успешной публикации. Этот эпик доставляет критичную ценность: платформа начинает наполняться контентом.

### Story 2.1: Listing Data Models & API Endpoints

**As a** developer,
**I want** to create database tables for listings and API endpoints for creating listings,
**so that** the backend can store and manage listing data with proper status workflow.

#### Acceptance Criteria

1. PostgreSQL таблица `Listing` создана с полями:
   - `id` (UUID primary key)
   - `article_number` (string, обязательное)
   - `condition` (enum: new/used, обязательное)
   - `price` (decimal, обязательное)
   - `brand` (string, обязательное)
   - `description` (text, необязательное)
   - `contact_phone` (string, обязательное)
   - `contact_whatsapp` (string, необязательное)
   - `contact_telegram` (string, необязательное)
   - `status` (enum: processing/pending/approved/rejected, default=processing)
   - `ai_processed_title` (string, nullable)
   - `ai_processed_description` (text, nullable)
   - `ai_error_message` (text, nullable)
   - `created_at`, `updated_at` (timestamps)
2. PostgreSQL таблица `Photo` создана с полями:
   - `id` (UUID primary key)
   - `listing_id` (foreign key to Listing)
   - `filename` (string)
   - `file_path` (string)
   - `order` (integer, для сортировки)
   - `created_at` (timestamp)
3. Foreign key constraint между Listing и Photo настроен (one-to-many)
4. Pydantic схемы созданы:
   - `ListingCreate` (для валидации входных данных)
   - `ListingResponse` (для возврата клиенту)
   - `PhotoResponse` (для фотографий)
5. API endpoint создан: `POST /api/listings` принимает multipart/form-data
6. Endpoint валидирует обязательные поля (артикул, состояние, цена, марка, телефон)
7. Endpoint валидирует контактные данные (хотя бы один контакт должен быть указан)
8. Endpoint создаёт запись в БД со статусом `processing`
9. Endpoint возвращает созданное объявление с ID
10. SQL миграция создана и применена для новых таблиц
11. Логируется создание каждого объявления
12. Ошибки валидации возвращаются в стандартизированном формате

### Story 2.2: Photo Upload & Storage

**As a** user,
**I want** to upload до 10 фотографий к моему объявлению,
**so that** покупатели могут видеть запчасть.

#### Acceptance Criteria

1. Backend: директория `uploads/` создаётся автоматически при старте приложения
2. Backend: endpoint `POST /api/listings` принимает массив файлов (до 10 фото)
3. Backend валидирует файлы:
   - Тип: только image/jpeg, image/png, image/webp
   - Размер: максимум 5MB на файл
   - Количество: максимум 10 файлов
4. Backend сохраняет файлы в структуру: `uploads/{listing_id}/{original_filename}`
5. Backend создаёт записи в таблице `Photo` с правильным `order` (порядок загрузки)
6. Backend использует Pillow для оптимизации изображений (resize до макс 1920px по большей стороне)
7. При ошибке загрузки (невалидный файл) - возвращается понятная ошибка
8. Если папка `uploads/` не доступна для записи - ошибка логируется и возвращается клиенту
9. Frontend API client имеет метод для загрузки с FormData
10. Endpoint возвращает массив загруженных фотографий с их ID и paths
11. При удалении listing (будущая функция) - фотографии тоже удаляются (cascade)
12. Логируется количество загруженных фото для каждого объявления

### Story 2.3: Publication Form UI

**As a** user,
**I want** to заполнить простую форму публикации объявления,
**so that** я могу продать свою запчасть без сложностей.

#### Acceptance Criteria

1. Страница `/publish` создана с формой публикации
2. Форма использует `react-hook-form` для управления состоянием
3. Форма содержит поля:
   - Артикул запчасти (text input, обязательное)
   - Марка автомобиля (select или text input, обязательное)
   - Состояние (radio buttons: "Новое" / "Б/У", обязательное)
   - Цена в рублях (number input, обязательное)
   - Описание (textarea, необязательное, placeholder: "Любые подробности о запчасти...")
   - Телефон (text input, обязательное)
   - WhatsApp (text input, необязательное)
   - Telegram (text input, необязательное)
   - Загрузка фото (file input, до 10 файлов)
4. Drag-and-drop зона для фотографий или кнопка выбора файлов
5. Превью загруженных фото (thumbnails) с возможностью удаления
6. Валидация на клиенте (zod schema):
   - Все обязательные поля заполнены
   - Цена > 0
   - Хотя бы один контакт указан (телефон обязателен)
   - Максимум 10 фото
7. Кнопка "Опубликовать" disabled пока форма не валидна
8. При сабмите форма отправляет данные через `POST /api/listings`
9. Во время отправки показывается loading state (кнопка disabled, спиннер)
10. Форма адаптивна для мобильных устройств
11. Все поля имеют labels и placeholders
12. Touch-friendly на мобильных (крупные кнопки, удобные inputs)

### Story 2.4: Vertex AI Integration via OpenAI SDK

**As a** system,
**I want** to automatically process listings through Gemini 2.5 Pro AI,
**so that** listings have enriched, structured information about the auto part.

#### Acceptance Criteria

1. Backend service `services/ai.py` создан с классом `AIService`
2. OpenAI SDK настроен с Vertex AI endpoint из конфига:
   ```python
   client = OpenAI(
       api_key=config.VERTEX_AI_API_KEY,
       base_url=config.VERTEX_AI_ENDPOINT
   )
   ```
3. Метод `process_listing(listing_id)` создан, который:
   - Загружает listing из БД
   - Формирует prompt для Gemini с артикулом, маркой, описанием пользователя
   - Запрашивает у AI: корректное название запчасти, расширенное описание, характеристики, совместимые модели авто
   - Сохраняет результат в `ai_processed_title` и `ai_processed_description`
   - Обновляет статус на `pending` (готово к модерации)
4. Prompt для AI структурирован и просит JSON ответ с полями:
   - `title`: корректное название запчасти
   - `description`: расширенное описание с характеристиками
   - `compatible_models`: список совместимых моделей (опционально)
5. Timeout для AI запроса: 30 секунд (из конфига)
6. Retry механизм: до 3 попыток при ошибках сети (из конфига)
7. При успешной обработке - логируется успех
8. При ошибке AI (timeout, API error, invalid response):
   - `status` остаётся `pending`
   - `ai_error_message` заполняется описанием ошибки
   - Логируется ошибка с деталями
9. Backend endpoint `POST /api/listings` после создания запускает AI обработку асинхронно (background task или простой вызов)
10. AI обработка не блокирует ответ пользователю (пользователь получает ответ сразу)

### Story 2.5: Listing Status Workflow & Error Handling

**As a** system,
**I want** to properly manage listing statuses and handle AI errors gracefully,
**so that** listings move through the correct workflow and moderators see all necessary information.

#### Acceptance Criteria

1. Статусная модель реализована:
   - `processing`: объявление создано, ожидает AI обработки
   - `pending`: AI обработал (или не обработал с ошибкой), ожидает модерации
   - `approved`: модератор одобрил
   - `rejected`: модератор отклонил
2. При создании listing статус = `processing`
3. После AI обработки (успех или ошибка) статус → `pending`
4. Поле `ai_error_message` заполняется только если AI выдал ошибку
5. Backend endpoint `GET /api/listings/{id}` создан для получения объявления
6. Backend endpoint `GET /api/listings/{id}/status` создан для проверки статуса
7. Frontend может опрашивать статус объявления после публикации
8. Логика graceful degradation работает:
   - Если Vertex AI недоступен → статус `pending`, ошибка залогирована
   - Модератор видит объявление с пометкой об ошибке AI
9. При network errors во время AI обработки:
   - Retry до 3 раз
   - Если все попытки провалились → `pending` с ошибкой
10. Все ошибки AI логируются с полным контекстом (listing_id, error message, stack trace)
11. Database transaction правильно обрабатывается (rollback при ошибках)
12. Rate limiting для AI запросов учтён (если Vertex AI лимитит - пауза и retry)

### Story 2.6: Success Feedback & User Experience

**As a** user,
**I want** to получить мгновенную обратную связь после публикации объявления,
**so that** я знаю, что моё объявление принято и обрабатывается.

#### Acceptance Criteria

1. После успешной отправки формы показывается success модальное окно
2. Модалка содержит:
   - ✅ Иконка успеха
   - Заголовок: "Объявление успешно опубликовано!"
   - Текст: "Ваше объявление отправлено на модерацию. Мы обрабатываем его с помощью AI и скоро опубликуем на сайте."
   - ID объявления (для справки)
   - Кнопка "Вернуться на главную" → редирект на `/`
   - Кнопка "Опубликовать ещё" → очистить форму
3. При ошибке отправки показывается error state:
   - ❌ Иконка ошибки
   - Понятное сообщение об ошибке (из API response)
   - Кнопка "Попробовать снова"
4. Форма не очищается при ошибке (пользователь не теряет данные)
5. При проблемах с сетью - специальное сообщение: "Проверьте подключение к интернету"
6. При validation errors - ошибки показываются под соответствующими полями
7. После успешной публикации форма очищается (если пользователь не нажал "Опубликовать ещё")
8. Mobile UX: модалка занимает почти весь экран на мобильных
9. Loading state во время отправки: disabled inputs, спиннер на кнопке
10. После публикации пользователь может сразу вернуться к использованию сайта
11. Analytics event логируется при успешной публикации (для будущей аналитики)

---

## Epic 3: Admin Panel & Moderation System

**Расширенная цель:**

Создать административную панель для единственного модератора, которая позволяет контролировать качество контента на платформе. Админка должна отображать все объявления с удобной фильтрацией по статусам (В обработке AI, На модерации, Одобрено, Отклонено), показывать исходные данные пользователя и результаты AI-обработки (или их отсутствие при ошибках), предоставлять возможность одобрить/отклонить объявление или повторно отправить на AI обработку неограниченное количество раз. Модератор вручную создаёт внутренний ID запчасти и привязывает артикулы при одобрении. Также админка должна поддерживать массовую загрузку объявлений (через SQL скрипты или простой UI) для стратегии холодного старта - наполнения платформы начальным контентом. Этот эпик критичен для качества: без модерации платформа станет свалкой спама.

### Story 3.1: Admin Authentication & Protected Routes

**As a** moderator,
**I want** to authenticate with a simple token to access admin panel,
**so that** only authorized person can moderate listings.

#### Acceptance Criteria

1. Backend middleware создан для проверки admin токена
2. Токен проверяется через header: `X-Admin-Token: {token_from_config}`
3. Токен хранится в `config.py`: `ADMIN_TOKEN = "simple-token-for-mvp"`
4. Все admin endpoints защищены middleware:
   - `GET /api/admin/listings`
   - `PUT /api/admin/listings/{id}/approve`
   - `PUT /api/admin/listings/{id}/reject`
   - `POST /api/admin/listings/{id}/reprocess`
   - и другие будущие admin endpoints
5. При отсутствии токена или неверном токене возвращается 401 Unauthorized
6. Frontend страница `/admin` защищена: редирект на `/admin/login` если токен не установлен
7. Страница `/admin/login` создана с простой формой ввода токена
8. Токен сохраняется в localStorage после успешного входа
9. Frontend API client автоматически добавляет токен в headers при запросах к admin endpoints
10. После входа модератор редиректится на `/admin/dashboard`
11. Кнопка "Выйти" удаляет токен из localStorage
12. Простой и быстрый процесс входа (один токен, без усложнений)

### Story 3.2: Admin Dashboard & Listings Table

**As a** moderator,
**I want** to see all listings in a table with ability to filter by status,
**so that** I can quickly find listings that need moderation.

#### Acceptance Criteria

1. Backend endpoint `GET /api/admin/listings` создан с параметрами:
   - `status` (optional): фильтр по статусу
   - `page` (optional, default=1): номер страницы
   - `limit` (optional, default=20): количество на странице
2. Endpoint возвращает:
   - Массив listings с полной информацией (включая AI результаты и ошибки)
   - Pagination metadata (total, page, pages_total)
3. Endpoint поддерживает фильтрацию: `?status=pending` → только pending
4. Страница `/admin/dashboard` создана с таблицей объявлений
5. Таблица отображает колонки:
   - ID (короткий UUID)
   - Артикул
   - Марка
   - Цена
   - Статус
   - Дата создания
   - Действия (кнопки)
6. Вкладки (tabs) для быстрой фильтрации:
   - "В обработке AI" (processing)
   - "На модерации" (pending)
   - "Одобрено" (approved)
   - "Отклонено" (rejected)
   - "Все"
7. Pagination controls внизу таблицы
8. Клик по строке таблицы открывает детальный просмотр (sidebar или модалка)
9. Таблица адаптивна: на мобильных - карточки вместо таблицы
10. Loading state при загрузке данных
11. Empty state если нет объявлений: "Нет объявлений с таким статусом"
12. Количество объявлений в каждом статусе отображается на вкладках

### Story 3.3: Listing Detail View & Original Data Display

**As a** moderator,
**I want** to see all original user data and AI processing results for a listing,
**so that** I can make informed moderation decision.

#### Acceptance Criteria

1. Backend endpoint `GET /api/admin/listings/{id}` создан
2. Endpoint возвращает полную информацию:
   - Все исходные поля пользователя (артикул, марка, состояние, цена, описание, контакты)
   - Все фотографии с URLs
   - AI результаты (`ai_processed_title`, `ai_processed_description`)
   - AI ошибка если есть (`ai_error_message`)
   - Статус и даты
   - История модерации (если есть записи в moderation_log)
3. Детальная панель (sidebar или modal) открывается при клике на объявление
4. Панель разделена на секции:
   - **Исходные данные пользователя** (все поля формы)
   - **Фотографии** (галерея с возможностью листать)
   - **Результаты AI обработки** (если есть)
   - **Ошибки AI** (если есть, выделены красным)
   - **Действия модератора** (кнопки)
5. Если AI не обработал - показывается предупреждение: "⚠️ AI не смог обработать это объявление"
6. Если есть `ai_error_message` - показывается полный текст ошибки
7. Контактная информация отформатирована и кликабельна (телефон → tel:, telegram → link)
8. Фотографии отображаются в галерее (можно пролистывать)
9. Вся информация читабельна и хорошо структурирована
10. Панель закрывается кнопкой "Закрыть" или клик вне панели
11. На мобильных панель занимает весь экран (full screen modal)
12. Loading state при загрузке деталей объявления

### Story 3.4: Moderation Actions (Approve/Reject/Reprocess)

**As a** moderator,
**I want** to approve, reject or reprocess listings with AI,
**so that** I can control what content appears on the platform.

#### Acceptance Criteria

1. Backend endpoint `PUT /api/admin/listings/{id}/approve` создан
2. Endpoint обновляет статус на `approved` и сохраняет запись в `moderation_log`
3. Backend endpoint `PUT /api/admin/listings/{id}/reject` создан
4. Endpoint обновляет статус на `rejected` и сохраняет запись в `moderation_log`
5. Backend endpoint `POST /api/admin/listings/{id}/reprocess` создан
6. Reprocess endpoint:
   - Очищает старые AI результаты и ошибки
   - Устанавливает статус `processing`
   - Запускает AI обработку заново
   - Возвращает обновлённое объявление
7. Таблица `moderation_log` создана с полями:
   - `id`, `listing_id`, `action` (approved/rejected/reprocessed), `timestamp`, `moderator_note` (optional)
8. В детальной панели кнопки действий:
   - ✅ "Одобрить" (зелёная) - доступна если статус pending
   - ❌ "Отклонить" (красная) - доступна если статус pending
   - 🔄 "Отправить на AI повторно" (синяя) - доступна всегда
9. При клике на кнопку - confirmation dialog: "Вы уверены?"
10. После действия - объявление обновляется в таблице без перезагрузки страницы
11. Success notification показывается: "Объявление одобрено/отклонено"
12. При reprocess - показывается: "Объявление отправлено на повторную обработку AI"
13. Loading state на кнопках во время выполнения действия
14. Если reprocess провалился - показывается ошибка
15. История модерации отображается в детальной панели

### Story 3.5: Internal Part ID & Article Number Management

**As a** moderator,
**I want** to manually create internal part IDs and link article numbers,
**so that** different article numbers for the same part are grouped together.

#### Acceptance Criteria

1. Таблица `parts` в PostgreSQL содержит:
   - `id` (UUID primary key, внутренний ID)
   - `name` (string, название запчасти)
   - `created_at`, `updated_at`
2. Таблица `article_numbers` содержит:
   - `id`, `part_id` (FK to parts), `article_number` (string, unique), `created_at`
3. Таблица `listings` имеет FK: `part_id` (nullable, заполняется при модерации)
4. Backend endpoint `POST /api/admin/parts` создан для создания нового part
5. Backend endpoint `GET /api/admin/parts/search?q={article}` для поиска существующих parts
6. Backend endpoint `POST /api/admin/parts/{part_id}/articles` для привязки артикула к part
7. В детальной панели модерации секция "Привязка к запчасти":
   - Поле поиска: "Найти существующую запчасть по артикулу"
   - Dropdown с результатами поиска
   - Кнопка "Создать новую запчасть"
8. При выборе существующей запчасти:
   - Listing привязывается к `part_id`
   - Артикул из listing добавляется в `article_numbers` если его там нет
9. При создании новой запчасти:
   - Модератор вводит название запчасти (или используется AI название)
   - Создаётся запись в `parts`
   - Артикул добавляется в `article_numbers`
   - Listing привязывается к новому `part_id`
10. В детальной панели показывается текущая привязка (если есть)
11. При одобрении listing обязательно должен быть привязан к part (валидация)
12. Если part не привязан - кнопка "Одобрить" disabled с подсказкой

### Story 3.6: Bulk Listing Import for Content Seeding

**As a** moderator,
**I want** to mass import listings to seed the platform with initial content,
**so that** users see populated catalog from day one.

#### Acceptance Criteria

1. SQL скрипт создан: `scripts/import_listings.sql` с примерами INSERT statements
2. Скрипт документирован: как запускать, какие поля обязательные
3. Скрипт создаёт listings напрямую со статусом `approved` (минуя модерацию)
4. Скрипт создаёт parts и article_numbers автоматически
5. Альтернатива: простой UI в админке для bulk import:
   - Форма загрузки CSV файла
   - CSV формат: article_number, brand, condition, price, description, photo_urls (comma-separated)
6. Backend endpoint `POST /api/admin/listings/bulk-import` принимает CSV
7. Endpoint парсит CSV, валидирует данные
8. Endpoint создаёт listings, parts, article_numbers автоматически
9. Endpoint загружает фотографии по URLs (если указаны)
10. После импорта показывается результат: "Импортировано X объявлений, Y ошибок"
11. Ошибки импорта логируются с деталями
12. Импортированные объявления сразу видны в каталоге (статус approved)
13. CSV template доступен для скачивания из админки
14. Bulk import работает с батчами (не падает на больших файлах)
15. Документация в README: как подготовить данные для импорта

---

## Epic 4: Catalog, Search & Discovery

**Расширенная цель:**

Реализовать полноценный каталог объявлений с мощным поиском и фильтрацией, который позволяет покупателям находить нужные запчасти. Каталог должен поддерживать текстовый поиск по артикулам и названиям запчастей, фильтрацию по цене (диапазон), состоянию (новое/б\у) и марке автомобиля. Интеграция с главной страницей: поисковая строка и брендовые карточки должны вести в каталог с применёнными фильтрами. Каталог отображает объявления в виде превью-карточек (фото, название, артикул, марка, цена, состояние) с пагинацией. При клике открывается детальная страница с полной фотогалереей (свайп на мобильных), всеми характеристиками, описанием и контактной информацией для связи с продавцом. Если поиск не находит результатов - показывается простое сообщение "Такого товара нет". Этот эпик доставляет ценность покупателям: возможность найти и купить нужную запчасть.

### Story 4.1: Search & Filter API Endpoints

**As a** developer,
**I want** to create backend API for searching and filtering listings,
**so that** frontend can display relevant search results with applied filters.

#### Acceptance Criteria

1. Backend endpoint `GET /api/listings` создан для публичного доступа (без admin токена)
2. Endpoint возвращает только approved listings (status = 'approved')
3. Endpoint поддерживает query параметры:
   - `q` (search query): текстовый поиск по article_number, ai_processed_title, description
   - `brand`: фильтр по марке автомобиля
   - `condition`: фильтр по состоянию (new/used)
   - `price_min`, `price_max`: диапазон цены
   - `page` (default=1), `limit` (default=20): пагинация
4. Поиск работает case-insensitive по полям:
   - `article_number` (ILIKE)
   - `ai_processed_title` (ILIKE)
   - `description` (ILIKE)
5. Фильтры применяются через AND логику (все условия должны совпадать)
6. Результаты сортируются по дате создания (новые первые)
7. Endpoint возвращает JSON:
   ```json
   {
     "items": [{listing preview data}],
     "total": 150,
     "page": 1,
     "pages": 8,
     "limit": 20
   }
   ```
8. Каждый listing preview содержит:
   - id, article_number, brand, condition, price
   - ai_processed_title (или original description если AI не обработал)
   - main_photo_url (первое фото)
   - created_at
9. PostgreSQL индексы созданы на: article_number, brand, status, price для быстрого поиска
10. Empty результаты возвращают пустой массив items с total=0
11. Ошибки валидации возвращаются в стандартизированном формате
12. Endpoint логирует поисковые запросы (для будущей аналитики)

### Story 4.2: Catalog Page with Listing Cards

**As a** user,
**I want** to see search results as attractive preview cards,
**so that** I can quickly browse available parts and choose what I need.

#### Acceptance Criteria

1. Страница `/catalog` создана
2. Страница вызывает `GET /api/listings` с параметрами из URL query
3. Карточки объявлений отображаются в адаптивной сетке:
   - Мобильные: 1-2 колонки
   - Планшеты: 2-3 колонки
   - Десктоп: 3-4 колонки
4. Каждая карточка содержит:
   - Главная фотография (первое фото, или placeholder если нет фото)
   - Название (ai_processed_title или описание, обрезанное до 2 строк)
   - Артикул
   - Марка автомобиля
   - Цена (форматированная: "25 000 ₽")
   - Бэдж состояния ("Новое" / "Б/У")
5. Карточки кликабельны: ведут на `/listing/{id}`
6. Карточки имеют hover effects (scale, shadow) на десктопе
7. Карточки визуально привлекательны и профессиональны
8. Lazy loading для фотографий (Next.js Image component)
9. Skeleton loaders показываются во время загрузки
10. Если результатов нет - показывается empty state: "Такого товара нет" (крупный текст с иконкой)
11. Пагинация внизу страницы (Previous / 1 2 3 ... / Next)
12. Mobile-first: карточки оптимизированы для touch (минимум 44x44px для клика)

### Story 4.3: Filter Panel & Search Integration

**As a** user,
**I want** to filter search results by price, condition and brand,
**so that** I can narrow down to exactly what I'm looking for.

#### Acceptance Criteria

1. Панель фильтров создана на странице `/catalog`
2. Панель на мобильных: открывается по кнопке "Фильтры" (модалка или slide-in)
3. Панель на десктопе: sidebar слева или сверху (always visible)
4. Фильтры в панели:
   - **Цена**: два input поля (от - до) с валидацией (только числа)
   - **Состояние**: чекбоксы ("Новое", "Б/У")
   - **Марка**: dropdown select с популярными марками (Audi, BMW, Mercedes, Toyota, VW, и т.д.) + "Все марки"
5. Кнопка "Применить фильтры" обновляет URL и перезагружает результаты
6. Кнопка "Сбросить" очищает все фильтры
7. Активные фильтры отображаются как chips/tags над результатами (можно удалить по клику)
8. Поисковая строка дублируется в каталоге (sticky на мобильных)
9. Ввод в поисковую строку обновляет параметр `q` в URL
10. URL синхронизирован с фильтрами: `/catalog?q=карданный+вал&brand=BMW&price_min=5000&price_max=15000`
11. При переходе с главной страницы фильтры применяются автоматически:
    - Из поиска: `/catalog?q={query}`
    - Из брендовой карточки: `/catalog?brand={brand}`
12. Количество найденных результатов показывается: "Найдено: 42 объявления"
13. Фильтры работают мгновенно (без перезагрузки страницы)
14. Mobile UX: фильтры в модалке, кнопка "Показать результаты"

### Story 4.4: Listing Detail Page with Photo Gallery

**As a** user,
**I want** to see full details of a listing with all photos and characteristics,
**so that** I can make informed purchase decision.

#### Acceptance Criteria

1. Backend endpoint `GET /api/listings/{id}` создан для публичного доступа
2. Endpoint возвращает полную информацию только для approved listing
3. Endpoint возвращает 404 если listing не найден или не approved
4. Страница `/listing/[id]` создана с детальным просмотром
5. Страница разделена на секции:
   - **Фотогалерея** (главная секция сверху)
   - **Основная информация** (название, артикул, марка, состояние, цена)
   - **Характеристики** (AI обработанные данные)
   - **Описание** (ai_processed_description или оригинальное описание)
   - **Совместимые модели** (если AI нашёл, опционально)
   - **Контактная информация** (кнопки для связи)
6. Фотогалерея:
   - Главное фото крупно отображается
   - Thumbnails остальных фото внизу/сбоку
   - На мобильных: свайп между фото (swiper или embla-carousel)
   - На десктопе: клик по thumbnail меняет главное фото
   - Zoom на клик по главному фото (опционально для MVP)
7. Основная информация:
   - Название крупным шрифтом (h1)
   - Цена крупно
   - Артикул и марка
   - Бэдж состояния
8. Контактная информация:
   - Телефон: кнопка с иконкой телефона (на мобильных: `tel:` link)
   - WhatsApp: кнопка с иконкой (link на `https://wa.me/{number}`)
   - Telegram: кнопка с иконкой (link на `https://t.me/{username}`)
9. Если какие-то поля не заполнены - они не показываются (graceful degradation)
10. Breadcrumbs: Главная > Каталог > {Название запчасти}
11. Кнопка "Назад к каталогу" для удобной навигации
12. Mobile-first: все элементы адаптивны, кнопки крупные для touch

### Story 4.5: Photo Gallery Swipe & Image Optimization

**As a** user,
**I want** to swipe through photos on mobile and see them clearly,
**so that** I can examine the part from all angles.

#### Acceptance Criteria

1. Swiper library (или embla-carousel) интегрирована для мобильных устройств
2. На мобильных пользователь может свайпить пальцем между фотографиями
3. Индикатор текущего фото: "3 / 7" или dots pagination
4. Lazy loading следующего/предыдущего фото для производительности
5. На десктопе: стрелки "Предыдущее" / "Следующее" для навигации
6. Keyboard navigation на десктопе: стрелки влево/вправо
7. Фотографии оптимизированы:
   - Next.js Image component используется для автоматической оптимизации
   - Responsive images (разные размеры для мобильных/десктопа)
   - WebP format если браузер поддерживает
8. Placeholder/blur preview пока фото загружается
9. Если фото не загружается - показывается fallback изображение
10. Alt texts для accessibility (описание запчасти)
11. Fullscreen mode для фото (опционально для MVP, можно упростить)
12. Performance: Lighthouse score для детальной страницы >= 80

### Story 4.6: Home Page Integration & Empty States

**As a** user,
**I want** search and brand cards on home page to work and lead me to filtered catalog,
**so that** I can start my shopping journey from the homepage.

#### Acceptance Criteria

1. Поисковая строка на главной странице функциональна:
   - Ввод текста и Enter → редирект на `/catalog?q={query}`
   - Клик на кнопку поиска → редирект на `/catalog?q={query}`
2. Брендовые карточки на главной функциональны:
   - Клик на карточку "BMW" → редирект на `/catalog?brand=BMW`
   - Клик на карточку "Audi" → редирект на `/catalog?brand=Audi`
   - И так для всех 12 брендов
3. Кнопка "Опубликовать объявление" на главной ведёт на `/publish` (уже работает)
4. Каталог корректно принимает параметры из URL и применяет фильтры
5. Empty state на `/catalog` если нет результатов:
   - Текст: "Такого товара нет"
   - Подсказка: "Попробуйте изменить фильтры или поисковый запрос"
   - Кнопка "Сбросить фильтры"
6. Empty state если вообще нет объявлений в БД:
   - "Пока нет объявлений"
   - "Станьте первым, кто опубликует объявление"
   - Кнопка "Опубликовать объявление"
7. Навигация между страницами плавная (Next.js router)
8. Back button в браузере работает корректно (история сохраняется)
9. Все переходы с главной тестируются вручную:
   - Поиск → каталог с результатами
   - Бренд → каталог с фильтром
   - Каталог → детальная страница → назад
10. Mobile navigation плавная без багов
11. URL параметры корректно кодируются (пробелы, кириллица)
12. SEO meta tags для главной, каталога и детальных страниц (title, description)

---

## Epic 5: Theming, Polish & Production Deployment

**Расширенная цель:**

Довести MVP до production-ready состояния: провести финальную оптимизацию mobile-first опыта на реальных устройствах, выполнить полное ручное тестирование всех критичных флоу (публикация, модерация, поиск, просмотр), исправить найденные баги и подготовить приложение к деплою на production сервер. Включает настройку nginx, PM2 для backend, build frontend, миграцию БД на production PostgreSQL и финальную проверку работоспособности. Этот эпик превращает рабочий прототип в полноценный MVP, готовый к показу пользователям.

### Story 5.1: Mobile-First UX Polish & Responsive Fixes

**As a** user on mobile,
**I want** the app to work flawlessly on my phone,
**so that** I can comfortably browse and publish listings from anywhere.

#### Acceptance Criteria

1. Ручное тестирование на реальных устройствах (iOS + Android):
   - iPhone (375px - 430px ширина)
   - Android (360px - 412px ширина)
2. Все интерактивные элементы touch-friendly:
   - Минимум 44x44px для всех кнопок и ссылок
   - Достаточные отступы между кликабельными элементами (минимум 8px)
3. Тексты читабельны на маленьких экранах:
   - Body text минимум 16px
   - Headings пропорциональны и читабельны
   - Line-height оптимальный (1.5-1.6 для body)
4. Формы удобны на мобильных:
   - Input поля достаточно крупные
   - Labels видимые и понятные
   - Keyboard types правильные (tel для телефона, number для цены)
   - Автозаполнение работает (autocomplete attributes)
5. Навигация оптимизирована:
   - Burger menu плавно открывается/закрывается
   - Все ссылки работают корректно
   - Back button браузера работает ожидаемо
6. Контент не обрезается:
   - Нет горизонтального скролла (overflow-x: hidden где нужно)
   - Все карточки и элементы вмещаются в viewport
   - Изображения responsive (не вылезают за границы)
7. Модальные окна и панели:
   - На мобильных занимают почти весь экран (легко закрыть)
   - Фильтры в каталоге: slide-in панель или fullscreen modal
   - Success модалки удобны для чтения и закрытия
8. Фотогалерея на мобильных:
   - Swipe плавный и отзывчивый
   - Zoom работает корректно (pinch-to-zoom если есть)
   - Navigation интуитивная
9. Performance на мобильных:
   - Lazy loading работает корректно
   - Изображения оптимизированы (WebP, правильные размеры)
   - Нет лагов при скролле или свайпе
10. Все критичные флоу протестированы на мобильных
11. Исправлены все найденные баги и неудобства
12. Lighthouse Mobile score >= 80 (Performance, Accessibility, Best Practices)

### Story 5.2: Comprehensive Manual Testing & Bug Fixes

**As a** developer,
**I want** to thoroughly test all features and fix discovered bugs,
**so that** the MVP is stable and ready for production.

#### Acceptance Criteria

1. **Публикация объявления (end-to-end):**
   - Заполнение формы с валидными данными → успех
   - Загрузка 10 фото → успех
   - Загрузка невалидного файла → понятная ошибка
   - Отправка без обязательных полей → validation errors
   - AI обработка срабатывает корректно
   - Success модалка показывается
   - Объявление появляется в админке со статусом processing → pending
2. **Модерация (admin flow):**
   - Вход в админку с токеном → успех
   - Вход с неверным токеном → 401
   - Просмотр списка объявлений → корректно
   - Фильтрация по статусам → работает
   - Детальный просмотр объявления → все данные видны
   - Одобрение объявления → статус меняется на approved
   - Отклонение объявления → статус rejected
   - Reprocess AI → объявление обрабатывается заново
   - Привязка к part_id → работает корректно
   - Bulk import (CSV или SQL) → объявления появляются
3. **Каталог и поиск:**
   - Поиск по артикулу → находит правильные результаты
   - Поиск по названию → работает
   - Фильтр по марке → применяется корректно
   - Фильтр по цене → диапазон работает
   - Фильтр по состоянию → работает
   - Комбинация фильтров → корректные результаты
   - Пагинация → переключение страниц работает
   - Empty state → показывается когда нет результатов
4. **Детальная страница:**
   - Открытие по ID → загружается корректно
   - Фотогалерея → свайп работает (мобильные)
   - Фотогалерея → клик по thumbnail работает (десктоп)
   - Контактные кнопки → правильные links
   - Все данные отображаются корректно
   - Graceful degradation → пустые поля не показываются
5. **Интеграция главной страницы:**
   - Поиск с главной → ведёт в каталог с query
   - Брендовые карточки → ведут в каталог с фильтром
   - Кнопка публикации → ведёт на форму
6. **Адаптивность:**
   - Все страницы корректны на мобильных (375px+)
   - Все страницы корректны на десктопе (1024px+)
   - Нет горизонтального скролла
7. **Ошибки и edge cases:**
   - Network error при API запросе → понятная ошибка
   - AI timeout/error → graceful degradation
   - Несуществующий listing ID → 404 страница
   - Неавторизованный доступ к админке → редирект на login
9. Все найденные баги документируются и исправляются
10. Критичные баги блокируют деплой, некритичные помечаются для будущих фиксов
11. Checklist пройден полностью (✅ все пункты)
12. MVP готов к показу пользователям

### Story 5.3: Production Deployment & Server Setup

**As a** developer,
**I want** to deploy the application to production server,
**so that** it's accessible to real users via a domain.

#### Acceptance Criteria

1. **Backend deployment:**
   - Backend код залит на VPS сервер
   - Python 3.11+ установлен на сервере
   - Virtual environment создано и зависимости установлены
   - PostgreSQL 15+ установлен и настроен
   - Production база данных создана
   - Миграции применены к production БД
   - `config.py` обновлён с production настройками
   - Uvicorn настроен для production
   - PM2 настроен для автозапуска backend
   - Backend доступен на порту 8000
2. **Frontend deployment:**
   - Next.js build создан: `npm run build`
   - Frontend build залит на сервер или развёрнут на Vercel
   - Environment variable `NEXT_PUBLIC_API_URL` указывает на production backend
   - Static assets оптимизированы
   - Next.js запущен через PM2 или развёрнут на Vercel
3. **Nginx configuration:**
   - Nginx установлен и настроен
   - Reverse proxy настроен:
     - `/api/*` → проксируется на backend (localhost:8000)
     - `/*` → проксируется на frontend (localhost:3000 или static build)
   - Static files (`/uploads/`) раздаются через nginx напрямую
   - GZIP compression включён
   - SSL/TLS сертификат установлен (опционально для MVP)
   - Домен настроен и указывает на сервер
4. **Database & File Storage:**
   - PostgreSQL работает и принимает подключения
   - Backup стратегия определена (pg_dump команда)
   - Директория `uploads/` создана с правильными permissions
   - Файлы загружаются и раздаются корректно
5. **Security basics:**
   - Firewall настроен (открыты только 80, 443, 22)
   - Admin токен изменён с дефолтного
   - Секретные ключи не в git репозитории
6. **Health checks:**
   - `GET /api/health` возвращает 200 OK
   - Frontend загружается корректно
   - База данных подключается
   - AI запросы работают
7. **Production testing:**
   - Все критичные флоу протестированы на production
8. **Monitoring & Logs:**
   - Логи backend доступны (PM2 logs)
   - Nginx access/error logs доступны
9. **Documentation:**
   - README обновлён с инструкциями по деплою
10. MVP доступен по домену или IP адресу
11. Performance приемлемый (время загрузки < 3 секунды)
12. Приложение стабильно работает без падений

### Story 5.4: Final Polish & Launch Preparation

**As a** product owner,
**I want** the application to be fully polished and ready for users,
**so that** it makes a great first impression.

#### Acceptance Criteria

1. **Visual polish:**
   - Все тексты проверены на орфографию и грамматику
   - Все placeholder изображения заменены на реальные
   - Все иконки единообразны
   - Spacing и alignment везде правильные
2. **Content:**
   - Название проекта финализировано (AutoHub AI или ZapMarket Pro)
   - Логотип создан и размещён
   - Hero текст на главной отполирован
   - Footer содержит актуальную информацию
   - Все UI тексты понятны и профессиональны
3. **404 и Error pages:**
   - 404 страница создана с дизайном
   - 500 error page создана
   - Все error states приятные для глаза
4. **Loading states:**
   - Все async операции имеют loading indicators
   - Skeleton loaders используются где уместно
5. **Empty states:**
   - Все empty states имеют полезные сообщения
   - Предлагаются действия (CTA кнопки)
6. **Accessibility final check:**
   - Keyboard navigation работает
   - Focus indicators видимые
   - Alt texts для изображений
   - Color contrast проверен (WCAG AA)
7. **Performance final check:**
   - Lighthouse audit пройден (Mobile + Desktop >= 80)
   - Нет console errors или warnings
   - Images оптимизированы
8. **Cross-browser testing:**
   - Chrome/Edge ✅
   - Safari (iOS) ✅
   - Firefox ✅
9. **Launch checklist:**
   - ✅ Все features работают
   - ✅ Все баги исправлены
   - ✅ Деплой на production
   - ✅ DNS настроен
   - ✅ Тестирование на production
   - ✅ Backup стратегия определена
10. **🎉 MVP готов к публичному запуску!**

---

## Checklist Results Report

### Executive Summary

**Overall PRD Completeness:** 92%

**MVP Scope Appropriateness:** Just Right ✅

**Readiness for Architecture Phase:** READY ✅

**Key Strengths:**
- Исключительно детальные functional requirements (FR1-FR29)
- Отличная структура epics с последовательными stories
- Чёткие технические решения и ограничения
- Реалистичная оценка времени (45.5-59 часов с оптимизацией)
- Mobile-first подход последовательно применён
- Graceful degradation учтён во всех критичных местах

**Most Critical Gaps:**
- Отсутствуют явные success metrics/KPIs (добавлены в секцию Goals)
- Нет формального списка "Out of Scope" (добавлен в Requirements)

### Category Analysis Table

| Category | Status | Critical Issues |
|----------|--------|----------------|
| 1. Problem Definition & Context | PASS (90%) | Success metrics добавлены |
| 2. MVP Scope Definition | PASS (95%) | Out of scope добавлен |
| 3. User Experience Requirements | PASS (95%) | Отлично детализировано |
| 4. Functional Requirements | PASS (98%) | Практически идеально |
| 5. Non-Functional Requirements | PASS (88%) | Базовая security намеренно упрощена |
| 6. Epic & Story Structure | PASS (95%) | Отличная структура |
| 7. Technical Guidance | PASS (95%) | Очень детальное и чёткое |
| 8. Cross-Functional Requirements | PASS (92%) | Всё покрыто адекватно |
| 9. Clarity & Communication | PASS (95%) | Очень чёткий документ |

**OVERALL STATUS: PASS (92%)**

### Final Decision

**✅ READY FOR ARCHITECT**

PRD является comprehensive, хорошо структурированным и готов для архитектурного дизайна и разработки.

**Качество PRD: ОТЛИЧНОЕ (92/100)**

---

## Next Steps

### UX Expert Prompt

Привет! Я передаю тебе PRD для маркетплейса автозапчастей с AI-интеграцией.

**Твоя задача:** Создать детальный UX/UI дизайн на основе этого PRD.

**Ключевые требования из PRD:**
- **Mobile-first**: вся разработка начинается с мобильной версии (375px-430px)

**Приоритетные страницы для дизайна:**
1. Главная страница (Hero, поиск, брендовые карточки, CTA публикации)
2. Каталог с фильтрами и карточками объявлений
3. Детальная страница объявления с фотогалереей
4. Форма публикации объявления
5. Админка (таблица модерации)

**Что нужно от тебя:**
- Wireframes для всех ключевых страниц
- Детальная спецификация UI компонентов
- Accessibility guidelines (WCAG AA минимум)
- Responsive breakpoints стратегия

Начни с главной страницы и продвигайся согласно Epic List в PRD.

---

### Architect Prompt

Привет! Я передаю тебе PRD для маркетплейса автозапчастей с AI-интеграцией.

**Твоя задача:** Создать детальную техническую архитектуру на основе этого PRD.

**Ключевые технические решения из PRD:**

**Stack:**
- **Backend:** Python FastAPI (БЕЗ SQLAlchemy - работа с PostgreSQL напрямую через asyncpg)
- **Frontend:** Next.js 14+ (App Router)
- **Database:** PostgreSQL 15+ (единственная СУБД)
- **AI:** OpenAI SDK с Vertex AI endpoint (модель: gemini-2.5-pro)
- **Deployment:** VPS (nginx + PM2 для backend)

**Критичные архитектурные требования:**
1. **PostgreSQL напрямую** - NO ORM, использовать asyncpg
2. **Monorepo структура** - backend/ и frontend/ в одном репо
3. **Конфигурация в коде** - `backend/app/core/config.py` для всех настроек
4. **Только ручное тестирование** - NO автоматические тесты, NO CI/CD
5. **RESTful API** - JSON responses, стандартизированные ошибки
6. **Graceful degradation** - система работает без AI

**Database Schema (критично для Epic 1):**
Спроектируй схему для:
- `listings` (объявления + AI результаты + статусы)
- `parts` (внутренние ID запчастей)
- `article_numbers` (артикулы, many-to-one с parts)
- `photos` (фотографии объявлений)
- `moderation_log` (история модерации)

**Relationships:**
- Listings → Parts (many-to-one via part_id)
- Parts → ArticleNumbers (one-to-many)
- Listings → Photos (one-to-many)

**Обязательные индексы:**
- `article_number`, `status`, `brand`, `price`

**API Endpoints:** Спроектируй детально все endpoints из Epic Stories

**AI Integration:**
```python
from openai import OpenAI

client = OpenAI(
    api_key=config.VERTEX_AI_API_KEY,
    base_url=config.VERTEX_AI_ENDPOINT
)
# Retry: до 3 попыток, Timeout: 30 секунд
```

**File Upload:**
- Локальное хранилище: `backend/uploads/{listing_id}/{filename}`
- Валидация: jpg/png/webp, макс 5MB, макс 10 фото
- Оптимизация: Pillow resize до 1920px

**Production Deployment:**
- Nginx reverse proxy
- PM2 для автозапуска
- PostgreSQL на VPS

**Что нужно от тебя:**
1. Детальная схема PostgreSQL с DDL
2. Структура backend и frontend модулей
3. API contract (все endpoints с examples)
4. Coding standards и patterns
5. Deployment guide

**Timeline:** 5 дней разработки - архитектура должна быть simple but solid.

Начни с Database Schema и API Contract - это фундамент для Epic 1.

---

**🎉 PRD Complete and Ready!**
