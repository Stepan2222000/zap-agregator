# Frontend Dockerfile для AutoHub AI
# Multi-stage build с standalone output для оптимизации

# Stage 1: Dependencies - установка зависимостей
FROM node:18-alpine AS deps

WORKDIR /app

# Установка системных зависимостей для native модулей
RUN apk add --no-cache libc6-compat

# Копирование package files
COPY package*.json ./

# Установка ВСЕХ зависимостей (включая dev) для сборки
RUN npm ci

# Stage 2: Builder - сборка приложения
FROM node:18-alpine AS builder

WORKDIR /app

# Копирование node_modules из deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./

# Копирование исходного кода
COPY . .

# Установка переменных окружения для сборки
# NEXT_PUBLIC_ переменные должны быть доступны на этапе сборки
ENV NEXT_TELEMETRY_DISABLED=1 \
    NODE_ENV=production

# Сборка Next.js приложения
RUN npm run build

# Stage 3: Runner - минимальный production образ
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

# Создание пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Копирование только необходимых файлов для production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Установка curl для healthcheck
RUN apk add --no-cache curl

# Изменение владельца файлов
RUN chown -R nextjs:nodejs /app

# Переключение на непривилегированного пользователя
USER nextjs

# Открытие порта
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Запуск приложения
CMD ["node", "server.js"]
