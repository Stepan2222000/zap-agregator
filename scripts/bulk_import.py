#!/usr/bin/env python3
"""
Скрипт для массового импорта запчастей и артикулов из CSV файла.

Формат CSV файла (с заголовком):
internal_code,canonical_name,description,article_numbers

Где article_numbers - строка с артикулами в формате: "артикул1:производитель1;артикул2:производитель2"
Пример: "W712/75:Mann-Filter;W71275:Mann-Filter"

Если производитель не указан, используется формат: "артикул1;артикул2"
"""

import asyncio
import asyncpg
import csv
import sys
import os
from typing import List, Dict, Any

# Добавляем родительскую директорию в sys.path для импорта настроек
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from backend.app.core.config import settings
from backend.app.utils.parts import parse_article_numbers


async def import_parts_from_csv(csv_file_path: str, dry_run: bool = False):
    """
    Импортирует запчасти и артикулы из CSV файла.

    Args:
        csv_file_path: Путь к CSV файлу
        dry_run: Если True, только показывает что будет импортировано без записи в БД
    """
    # Подключаемся к БД
    print(f"Подключение к базе данных...")
    conn = await asyncpg.connect(settings.DATABASE_URL)

    try:
        # Читаем CSV файл
        print(f"Чтение CSV файла: {csv_file_path}")
        with open(csv_file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            rows = list(reader)

        print(f"Найдено строк: {len(rows)}")

        if dry_run:
            print("\n=== DRY RUN MODE - изменения не будут сохранены ===\n")

        imported_count = 0
        skipped_count = 0
        error_count = 0

        for i, row in enumerate(rows, start=1):
            internal_code = row.get('internal_code', '').strip()
            canonical_name = row.get('canonical_name', '').strip()
            description = row.get('description', '').strip() or None
            article_numbers_str = row.get('article_numbers', '').strip()

            if not internal_code or not canonical_name:
                print(f"[{i}] ПРОПУЩЕНО: Отсутствует internal_code или canonical_name")
                skipped_count += 1
                continue

            print(f"\n[{i}] Обработка: {internal_code} - {canonical_name}")

            if dry_run:
                # В режиме dry_run только показываем что будет сделано
                print(f"    ✓ Будет создана запчасть: {internal_code}")

                articles = parse_article_numbers(article_numbers_str)
                if articles:
                    print(f"    ✓ Будет добавлено артикулов: {len(articles)}")
                    for art in articles:
                        mfr = art['manufacturer'] or '(без производителя)'
                        print(f"      - {art['article_number']} ({mfr})")
                else:
                    print(f"    ⚠ Артикулы не указаны")

                imported_count += 1
                continue

            # Начинаем транзакцию
            async with conn.transaction():
                try:
                    # Проверяем, существует ли запчасть
                    existing = await conn.fetchrow(
                        "SELECT id FROM parts WHERE internal_code = $1",
                        internal_code
                    )

                    if existing:
                        print(f"    ⚠ Запчасть с кодом {internal_code} уже существует, пропускаем")
                        skipped_count += 1
                        continue

                    # Создаем запчасть
                    part_id = await conn.fetchval(
                        """
                        INSERT INTO parts (internal_code, canonical_name, description)
                        VALUES ($1, $2, $3)
                        RETURNING id
                        """,
                        internal_code,
                        canonical_name,
                        description,
                    )

                    print(f"    ✓ Запчасть создана (ID: {part_id})")

                    # Парсим и добавляем артикулы
                    articles = parse_article_numbers(article_numbers_str)

                    if articles:
                        for art in articles:
                            await conn.execute(
                                """
                                INSERT INTO article_numbers (part_id, article_number, manufacturer)
                                VALUES ($1, $2, $3)
                                """,
                                part_id,
                                art['article_number'],
                                art['manufacturer'],
                            )

                        print(f"    ✓ Добавлено артикулов: {len(articles)}")
                    else:
                        print(f"    ⚠ Артикулы не добавлены (не указаны в CSV)")

                    imported_count += 1

                except Exception as e:
                    print(f"    ✗ ОШИБКА: {str(e)}")
                    error_count += 1

    finally:
        await conn.close()

    # Итоговая статистика
    print("\n" + "=" * 60)
    print("ИТОГИ ИМПОРТА:")
    print(f"  Успешно импортировано: {imported_count}")
    print(f"  Пропущено: {skipped_count}")
    print(f"  Ошибок: {error_count}")
    print(f"  Всего строк: {len(rows)}")
    print("=" * 60)


async def create_sample_csv(output_path: str = "sample_import.csv"):
    """
    Создает пример CSV файла для импорта.

    Args:
        output_path: Путь для сохранения примера
    """
    sample_data = [
        {
            'internal_code': 'PART-001',
            'canonical_name': 'Масляный фильтр Mann W 712/75',
            'description': 'Качественный масляный фильтр для различных моделей автомобилей',
            'article_numbers': 'W712/75:Mann-Filter;W71275:Mann-Filter;WP92875:WIX Filters',
        },
        {
            'internal_code': 'PART-002',
            'canonical_name': 'Воздушный фильтр Bosch F 026 400 201',
            'description': 'Воздушный фильтр оригинального качества',
            'article_numbers': 'F026400201:Bosch;1457433529:Bosch',
        },
        {
            'internal_code': 'PART-003',
            'canonical_name': 'Тормозные колодки ATE 13.0460-7201.2',
            'description': '',
            'article_numbers': '13.0460-7201.2:ATE;607201:ATE',
        },
    ]

    with open(output_path, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=['internal_code', 'canonical_name', 'description', 'article_numbers'])
        writer.writeheader()
        writer.writerows(sample_data)

    print(f"Пример CSV файла создан: {output_path}")


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='Массовый импорт запчастей из CSV')
    parser.add_argument('command', choices=['import', 'sample'], help='Команда: import или sample')
    parser.add_argument('--file', '-f', help='Путь к CSV файлу для импорта')
    parser.add_argument('--dry-run', action='store_true', help='Режим проверки без сохранения в БД')
    parser.add_argument('--output', '-o', default='sample_import.csv', help='Путь для сохранения примера CSV')

    args = parser.parse_args()

    if args.command == 'sample':
        asyncio.run(create_sample_csv(args.output))

    elif args.command == 'import':
        if not args.file:
            print("Ошибка: укажите файл с помощью --file")
            sys.exit(1)

        if not os.path.exists(args.file):
            print(f"Ошибка: файл не найден: {args.file}")
            sys.exit(1)

        asyncio.run(import_parts_from_csv(args.file, dry_run=args.dry_run))
