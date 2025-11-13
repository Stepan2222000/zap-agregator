# 🔧 Development Mode - AutoHub AI

Режим разработки с **автоматической перезагрузкой** (hot-reload) при изменении кода.

---

## 🔥 Суть Development режима

### Основная идея
В development режиме код вашего приложения **НЕ собирается в Docker образы**, а **монтируется напрямую** из вашей файловой системы в контейнеры через **volumes** (тома Docker).

**Это значит:**
- ✅ Редактируешь файл на компьютере → изменения мгновенно видны в контейнере
- ✅ Не нужно пересобирать Docker образы после каждого изменения
- ✅ Backend и Frontend автоматически перезапускаются при изменении кода
- ⚡ Быстрая итерация: сохранил → увидел результат через 1-2 секунды

**Production режим (по умолчанию):**
- Код компилируется и упаковывается В образ Docker
- Изменения требуют пересборки образа
- Оптимизирован для деплоя, но неудобен для разработки

**Development режим:**
- Код остается на диске и монтируется В контейнер
- Изменения применяются мгновенно
- Оптимизирован для быстрой разработки

---

## 🚀 Быстрый старт

### Production режим (по умолчанию)
```bash
# Стандартный запуск - БЕЗ автоматической перезагрузки
./restart.sh
```

**❌ Изменения НЕ применяются автоматически** - нужно перезапускать контейнеры.

---

### Development режим (hot-reload) ⭐ РЕКОМЕНДУЕТСЯ

```bash
# ПРОСТО запусти этот скрипт!
./dev.sh
```

**✅ Изменения применяются автоматически** - редактируй код, и он сразу перезагружается!

**Что делает dev.sh:**
- ✅ Проверяет Docker и .env
- ✅ Останавливает старые контейнеры
- ✅ НЕ пересобирает образы (использует кеш)
- ✅ Монтирует код через volumes
- ✅ Запускает с hot-reload
- ✅ Показывает логи в реальном времени

**Первый запуск или изменил зависимости?**
```bash
./dev.sh --build    # Пересоберет образы
```

---

## 📋 Что меняется в Dev режиме?

### Backend (FastAPI)
- ✅ **Hot-reload** через `uvicorn --reload`
- ✅ Код монтируется из `./backend/app` → `/app/app`
- ✅ Автоматический перезапуск при изменении `.py` файлов
- ⚡ Быстрый старт (без полной пересборки образа)

**Пример**: Изменил `backend/app/api/routes/listings.py` → FastAPI автоматически перезапустится через 1-2 секунды

### Frontend (Next.js)
- ✅ **Fast Refresh** через `npm run dev`
- ✅ Код монтируется из `./frontend` → `/app`
- ✅ Мгновенное обновление в браузере без перезагрузки
- ⚡ Hot Module Replacement (HMR)

**Пример**: Изменил `frontend/app/page.tsx` → браузер автоматически обновится без перезагрузки страницы

### База данных (PostgreSQL)
- Остается без изменений
- Данные сохраняются в volume

---

## 🛠️ Команды для работы

### Запуск
```bash
# Полный запуск (сборка + старт)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Только старт (без пересборки)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# С выводом логов
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### Остановка
```bash
# Остановить все сервисы
docker compose -f docker-compose.yml -f docker-compose.dev.yml down

# С удалением volumes (БД будет очищена!)
docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v
```

### Логи
```bash
# Все логи
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

# Только backend
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f backend

# Только frontend
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f frontend
```

### Перезапуск отдельного сервиса
```bash
# Перезапуск backend
docker compose -f docker-compose.yml -f docker-compose.dev.yml restart backend

# Перезапуск frontend
docker compose -f docker-compose.yml -f docker-compose.dev.yml restart frontend
```

---

## 💡 Рабочий процесс

### 1. Запуск dev-режима
```bash
cd /Users/stepanorlov/Desktop/STARTED/zap-agregator
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

### 2. Редактирование кода
```bash
# Открой проект в редакторе
code .

# Или используй любой редактор
vim backend/app/api/routes/listings.py
```

### 3. Изменения применяются автоматически!
- **Backend**: Сохрани файл → увидишь в логах `Reloading...`
- **Frontend**: Сохрани файл → браузер автоматически обновится

### 4. Просмотр логов в реальном времени
```bash
# В отдельном терминале
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f
```

---

## 🎯 Алиасы для удобства

Добавь в `~/.zshrc` или `~/.bashrc`:

```bash
# AutoHub AI shortcuts
alias ahub-dev='docker compose -f docker-compose.yml -f docker-compose.dev.yml'
alias ahub-prod='docker compose'
```

Теперь можно использовать:
```bash
ahub-dev up        # Dev режим
ahub-dev logs -f   # Логи в dev
ahub-prod up -d    # Production режим
```

---

## ⚠️ Важные особенности

### Что НЕ перезагружается автоматически:

#### Backend:
- ❌ `requirements.txt` - нужна пересборка образа
- ❌ Environment variables (`.env`) - нужен перезапуск контейнера
- ❌ Dockerfile - нужна пересборка образа

#### Frontend:
- ❌ `package.json` - нужна пересборка образа
- ❌ `next.config.js` - нужен перезапуск контейнера
- ❌ Environment variables - нужен перезапуск

### Когда нужна пересборка:

```bash
# Изменил requirements.txt или package.json
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Или пересобрать конкретный сервис
docker compose -f docker-compose.yml -f docker-compose.dev.yml build backend
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d backend
```

---

## 🐛 Troubleshooting

### Backend не перезагружается
**Проблема**: Изменил код, но uvicorn не перезапускается

**Решение**:
```bash
# Проверь логи
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs backend

# Убедись что включен --reload
docker compose -f docker-compose.yml -f docker-compose.dev.yml exec backend ps aux | grep uvicorn
```

### Frontend не обновляется в браузере
**Проблема**: Изменил компонент, но браузер не обновился

**Решение**:
1. Проверь что dev-сервер запущен:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml logs frontend
   ```
2. Hard refresh в браузере: `Cmd+Shift+R` (Mac) или `Ctrl+Shift+R` (Windows/Linux)
3. Очисти кеш Next.js:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml exec frontend rm -rf .next
   docker compose -f docker-compose.yml -f docker-compose.dev.yml restart frontend
   ```

### Медленная работа на macOS
**Проблема**: File watching медленный из-за Docker Desktop

**Решение**: Используй `:cached` флаг в volumes (уже настроен в docker-compose.dev.yml)

---

## 🔄 Переключение между режимами

### Dev → Prod
```bash
# Остановить dev
docker compose -f docker-compose.yml -f docker-compose.dev.yml down

# Запустить prod
./restart.sh
```

### Prod → Dev
```bash
# Остановить prod
docker compose down

# Запустить dev
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

---

## 📊 Сравнение режимов

| Критерий | Production | Development |
|----------|-----------|-------------|
| **Hot-reload** | ❌ Нет | ✅ Да |
| **Скорость сборки** | 🐢 Медленно (full build) | ⚡ Быстро |
| **Размер образа** | ✅ Минимальный | ❌ Больше |
| **Оптимизация** | ✅ Да (minify, etc) | ❌ Нет |
| **Для deployment** | ✅ Да | ❌ Нет |
| **Для разработки** | ❌ Неудобно | ✅ Удобно |

---

## ✅ Best Practices

1. **Используй dev-режим** для активной разработки
2. **Тестируй в prod-режиме** перед деплоем
3. **Не коммить** `.env.local` с локальными настройками
4. **Регулярно очищай** Docker volumes: `docker system prune -a`
5. **Следи за логами** чтобы не пропустить ошибки

---

**Версия документа**: 1.0
**Последнее обновление**: 2024-11-14
