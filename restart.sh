#!/bin/bash

# ======================================
# AutoHub AI - Docker Restart Script
# ======================================
# Скрипт полного перезапуска Docker-инфраструктуры
# Останавливает старые контейнеры, пересобирает образы, запускает и проверяет здоровье

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

# Проверка наличия Docker и Docker Compose
check_docker() {
    print_step "Проверка Docker..."

    if ! command -v docker &> /dev/null; then
        print_error "Docker не установлен! Установите Docker Desktop для macOS."
        exit 1
    fi

    if ! docker info &> /dev/null; then
        print_error "Docker daemon не запущен! Запустите Docker Desktop."
        exit 1
    fi

    print_success "Docker работает"
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
            read -p "Нажмите Enter для продолжения (или Ctrl+C для отмены)..."
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
    print_header "ШАГ 1: Очистка старых контейнеров"

    print_step "Остановка контейнеров AutoHub AI..."
    if docker compose ps -q 2>/dev/null | grep -q .; then
        docker compose down --remove-orphans
        print_success "Контейнеры остановлены и удалены"
    else
        print_warning "Контейнеры не запущены, пропускаем"
    fi

    # Опционально: удаление старых образов
    # Раскомментируйте для полной очистки (медленнее, но чище)
    # print_step "Удаление старых образов..."
    # docker compose down --rmi local --remove-orphans
}

# Сборка образов
build() {
    print_header "ШАГ 2: Сборка Docker образов"

    print_step "Сборка backend (Python FastAPI)..."
    docker compose build backend
    print_success "Backend образ собран"

    print_step "Сборка frontend (Next.js)..."
    docker compose build frontend
    print_success "Frontend образ собран"
}

# Запуск контейнеров
start() {
    print_header "ШАГ 3: Запуск контейнеров"

    print_step "Запуск всех сервисов..."
    docker compose up -d
    print_success "Контейнеры запущены"
}

# Health checks
health_check() {
    print_header "ШАГ 4: Проверка здоровья сервисов"

    MAX_RETRIES=30
    RETRY_INTERVAL=2

    # Проверка PostgreSQL
    print_step "Проверка PostgreSQL..."
    for i in $(seq 1 $MAX_RETRIES); do
        if docker compose exec -T postgres pg_isready -U autohub_user -d autohub_ai &> /dev/null; then
            print_success "PostgreSQL готов к работе"
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
            print_success "Backend API работает"
            break
        fi

        if [ $i -eq $MAX_RETRIES ]; then
            print_error "Backend не отвечает после $MAX_RETRIES попыток"
            echo "Логи Backend:"
            docker compose logs --tail=50 backend
            exit 1
        fi

        echo -ne "${YELLOW}⏳${NC} Ожидание Backend... ($i/$MAX_RETRIES)\r"
        sleep $RETRY_INTERVAL
    done

    # Проверка Frontend
    print_step "Проверка Frontend..."
    for i in $(seq 1 $MAX_RETRIES); do
        if curl -f -s http://localhost:3000 > /dev/null 2>&1; then
            print_success "Frontend работает"
            break
        fi

        if [ $i -eq $MAX_RETRIES ]; then
            print_error "Frontend не отвечает после $MAX_RETRIES попыток"
            echo "Логи Frontend:"
            docker compose logs --tail=50 frontend
            exit 1
        fi

        echo -ne "${YELLOW}⏳${NC} Ожидание Frontend... ($i/$MAX_RETRIES)\r"
        sleep $RETRY_INTERVAL
    done
}

# Вывод статуса
show_status() {
    print_header "СТАТУС СЕРВИСОВ"

    docker compose ps

    echo ""
    echo -e "${GREEN}╔═══════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║${NC}  ${CYAN}AutoHub AI успешно запущен!${NC}                      ${GREEN}║${NC}"
    echo -e "${GREEN}╠═══════════════════════════════════════════════════════╣${NC}"
    echo -e "${GREEN}║${NC}  Frontend:  ${BLUE}http://localhost:3000${NC}                  ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}  Backend:   ${BLUE}http://localhost:8000${NC}                  ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}  API Docs:  ${BLUE}http://localhost:8000/api/docs${NC}         ${GREEN}║${NC}"
    echo -e "${GREEN}║${NC}  Admin:     ${BLUE}http://localhost:3000/admin${NC}            ${GREEN}║${NC}"
    echo -e "${GREEN}╚═══════════════════════════════════════════════════════╝${NC}"

    echo ""
    echo -e "${CYAN}Полезные команды:${NC}"
    echo "  docker compose logs -f          # Все логи в реальном времени"
    echo "  docker compose logs -f backend  # Логи backend"
    echo "  docker compose logs -f frontend # Логи frontend"
    echo "  docker compose stop             # Остановить все контейнеры"
    echo "  docker compose down             # Остановить и удалить контейнеры"
    echo "  docker compose restart backend  # Перезапустить только backend"
    echo ""
}

# Показ логов (опционально)
show_logs() {
    echo ""
    read -p "Показать логи? (y/N): " show_logs_choice || true
    if [[ $show_logs_choice =~ ^[Yy]$ ]]; then
        print_header "ЛОГИ СЕРВИСОВ (Ctrl+C для выхода)"
        docker compose logs -f
    fi
}

# Главная функция
main() {
    clear
    echo -e "${MAGENTA}"
    cat << "EOF"
    ╔═══════════════════════════════════════════════════╗
    ║                                                   ║
    ║           🚀  AUTOHUB AI RESTART  🚀             ║
    ║                                                   ║
    ║        Docker Full Lifecycle Management          ║
    ║                                                   ║
    ╚═══════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"

    # Выполнение всех шагов
    check_docker
    check_env
    cleanup
    build
    start
    health_check
    show_status
    show_logs

    print_success "Готово!"
}

# Запуск
main
