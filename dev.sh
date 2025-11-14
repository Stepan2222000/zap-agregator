#!/bin/bash

# ======================================
# AutoHub AI - Development Mode Script
# ======================================
# Запуск development режима с автоматической перезагрузкой кода
# БЕЗ пересборки образов - код монтируется через volumes

set -e  # Остановка при ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Функции для красивого вывода
print_header() {
    echo -e "\n${MAGENTA}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║${NC}  ${CYAN}$1${NC}"
    echo -e "${MAGENTA}╚═══════════════════════════════════════════════════════╝${NC}\n"
}

print_step() {
    echo -e "${BLUE}▶${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_info() {
    echo -e "${CYAN}ℹ${NC} $1"
}

# Проверка наличия Docker и Docker Compose
check_docker() {
    print_step "Проверка Docker..."

    if ! command -v docker &> /dev/null; then
        print_error "Docker не установлен! Установите Docker Desktop для macOS."
        exit 1
    fi

    # Проверка Docker daemon с retry логикой (если Docker еще запускается)
    local max_attempts=10
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if docker info &> /dev/null; then
            print_success "Docker работает"
            return 0
        fi

        if [ $attempt -eq 1 ]; then
            echo -ne "${YELLOW}⏳${NC} Ожидание запуска Docker daemon..."
        else
            echo -ne "\r${YELLOW}⏳${NC} Ожидание запуска Docker daemon... ($attempt/$max_attempts)"
        fi

        sleep 2
        ((attempt++))
    done

    echo ""
    print_error "Docker daemon не запущен после $max_attempts попыток!"
    print_warning "Запустите Docker Desktop и попробуйте снова."
    exit 1
}

# Проверка файла .env
check_env() {
    print_step "Проверка конфигурации..."

    if [ ! -f .env ]; then
        print_warning "Файл .env не найден!"
        print_step "Создание .env из .env.docker.example..."

        if [ -f .env.docker.example ]; then
            cp .env.docker.example .env
            print_warning "Файл .env создан. ВНИМАНИЕ: Отредактируйте переменные окружения!"
            echo -e "${YELLOW}Особенно важно настроить:${NC}"
            echo "  - VERTEX_AI_PROJECT_ID"
            echo "  - POSTGRES_PASSWORD"
            echo "  - Положите credentials.json в backend/credentials/"
            echo ""
            read -p "Нажмите Enter для продолжения (или Ctrl+C для отмены)..." || true
        else
            print_error "Файл .env.docker.example не найден!"
            exit 1
        fi
    else
        print_success "Файл .env найден"
    fi
}

# Остановка и удаление старых контейнеров
cleanup() {
    print_header "ШАГ 1: Остановка старых контейнеров"

    print_step "Остановка dev-контейнеров (если запущены)..."
    if docker compose -f docker-compose.yml -f docker-compose.dev.yml ps -q 2>/dev/null | grep -q .; then
        docker compose -f docker-compose.yml -f docker-compose.dev.yml down
        print_success "Dev-контейнеры остановлены"
    else
        print_info "Dev-контейнеры не запущены"
    fi

    # Также проверим prod-контейнеры
    if docker compose ps -q 2>/dev/null | grep -q .; then
        print_warning "Обнаружены production контейнеры, останавливаем..."
        docker compose down
        print_success "Production контейнеры остановлены"
    fi
}

# Сборка образов (только при первом запуске или по флагу)
build() {
    print_header "ШАГ 2: Подготовка dev-образов"

    # Проверяем наличие dev-образов
    if docker images | grep -q "zap-agregator-frontend" && [ "$FORCE_BUILD" != "true" ]; then
        print_info "Dev-образы уже существуют (используем кеш)"
        print_info "Для пересборки запустите: ./dev.sh --build"
    else
        print_step "Сборка dev-образов (только первый раз)..."
        docker compose -f docker-compose.yml -f docker-compose.dev.yml build
        print_success "Dev-образы готовы"
    fi
}

# Запуск контейнеров в dev-режиме
start() {
    print_header "ШАГ 3: Запуск Development режима"

    print_step "Запуск контейнеров с hot-reload..."
    docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
    print_success "Dev-контейнеры запущены"

    echo ""
    print_info "Код монтируется через volumes - изменения применяются автоматически!"
    print_info "Backend: Измени .py файл → FastAPI перезапустится"
    print_info "Frontend: Измени .tsx файл → браузер обновится"
}

# Health checks
health_check() {
    print_header "ШАГ 4: Проверка готовности сервисов"

    MAX_RETRIES=30
    RETRY_INTERVAL=2

    # Проверка PostgreSQL
    print_step "Проверка PostgreSQL..."
    for i in $(seq 1 $MAX_RETRIES); do
        if docker compose -f docker-compose.yml -f docker-compose.dev.yml exec -T postgres pg_isready -U autohub_user -d autohub_ai &> /dev/null; then
            print_success "PostgreSQL готов"
            break
        fi

        if [ $i -eq $MAX_RETRIES ]; then
            print_error "PostgreSQL не отвечает после $MAX_RETRIES попыток"
            exit 1
        fi

        echo -ne "${YELLOW}⏳${NC} Ожидание PostgreSQL... ($i/$MAX_RETRIES)\r"
        sleep $RETRY_INTERVAL
    done

    # Проверка Backend
    print_step "Проверка Backend API..."
    for i in $(seq 1 $MAX_RETRIES); do
        if curl -f -s http://localhost:8000/api/health > /dev/null 2>&1; then
            print_success "Backend API работает (hot-reload активен)"
            break
        fi

        if [ $i -eq $MAX_RETRIES ]; then
            print_error "Backend не отвечает после $MAX_RETRIES попыток"
            echo "Логи Backend:"
            docker compose -f docker-compose.yml -f docker-compose.dev.yml logs --tail=50 backend
            exit 1
        fi

        echo -ne "${YELLOW}⏳${NC} Ожидание Backend... ($i/$MAX_RETRIES)\r"
        sleep $RETRY_INTERVAL
    done

    # Проверка Frontend
    print_step "Проверка Frontend..."
    for i in $(seq 1 $MAX_RETRIES); do
        if curl -f -s http://localhost:3000 > /dev/null 2>&1; then
            print_success "Frontend работает (Fast Refresh активен)"
            break
        fi

        if [ $i -eq $MAX_RETRIES ]; then
            print_error "Frontend не отвечает после $MAX_RETRIES попыток"
            echo "Логи Frontend:"
            docker compose -f docker-compose.yml -f docker-compose.dev.yml logs --tail=50 frontend
            exit 1
        fi

        echo -ne "${YELLOW}⏳${NC} Ожидание Frontend... ($i/$MAX_RETRIES)\r"
        sleep $RETRY_INTERVAL
    done
}

# Вывод статуса и инструкций
show_status() {
    print_header "DEVELOPMENT MODE АКТИВЕН"

    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║${NC}  ${CYAN}🔥 Development режим с hot-reload!${NC}              ${GREEN}║${NC}"
    echo -e "${GREEN}╠═══════════════════════════════════════════════════════╣${NC}"
    echo -e "${GREEN}║${NC}  Frontend:  ${BLUE}http://localhost:3000${NC}                  ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}  Backend:   ${BLUE}http://localhost:8000${NC}                  ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}  API Docs:  ${BLUE}http://localhost:8000/api/docs${NC}         ${GREEN}║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"

    echo ""
    echo -e "${CYAN}📝 Изменяй код - он обновится автоматически:${NC}"
    echo "  backend/app/**/*.py    → FastAPI перезапустится (~1-2 сек)"
    echo "  frontend/app/**/*.tsx  → Браузер обновится мгновенно"
    echo ""

    echo -e "${CYAN}🛠️  Полезные команды:${NC}"
    echo "  docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f"
    echo "  docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f backend"
    echo "  docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f frontend"
    echo "  docker compose -f docker-compose.yml -f docker-compose.dev.yml down"
    echo ""

    echo -e "${YELLOW}⚠️  Что НЕ обновляется автоматически:${NC}"
    echo "  • requirements.txt или package.json → запусти ./dev.sh --build"
    echo "  • .env файл → перезапусти контейнер"
    echo "  • Dockerfile → запусти ./dev.sh --build"
    echo ""
}

# Показ логов
show_logs() {
    echo ""
    read -p "Показать логи в реальном времени? (Y/n): " show_logs_choice || true

    # По умолчанию показываем логи в dev режиме
    if [[ ! $show_logs_choice =~ ^[Nn]$ ]]; then
        print_header "ЛОГИ В РЕАЛЬНОМ ВРЕМЕНИ (Ctrl+C для выхода)"
        echo -e "${CYAN}💡 Следи за автоматической перезагрузкой после изменений кода${NC}"
        echo ""
        docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f
    fi
}

# Главная функция
main() {
    clear
    echo -e "${MAGENTA}"
    cat << "EOF"
    ╔═══════════════════════════════════════════════════╗
    ║                                                   ║
    ║         🔥  AUTOHUB AI - DEV MODE  🔥            ║
    ║                                                   ║
    ║          Hot-Reload Development Mode             ║
    ║                                                   ║
    ╚═══════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"

    # Проверка флага --build
    if [ "$1" == "--build" ] || [ "$1" == "-b" ]; then
        export FORCE_BUILD="true"
        print_info "Режим пересборки образов активирован"
    fi

    # Выполнение всех шагов
    check_docker
    check_env
    cleanup
    build
    start
    health_check
    show_status
    show_logs

    print_success "Development режим запущен!"
}

# Запуск
main "$@"
