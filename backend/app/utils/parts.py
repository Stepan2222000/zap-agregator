"""
Утилиты для работы с запчастями
"""
from typing import List, Dict


def parse_article_numbers(article_str: str) -> List[Dict[str, str]]:
    """
    Парсит строку с артикулами.

    Args:
        article_str: Строка вида "W712/75:Mann-Filter;W71275:Mann-Filter"

    Returns:
        Список словарей с article_number и manufacturer

    Examples:
        >>> parse_article_numbers("W712/75:Mann-Filter;W71275:Mann-Filter")
        [
            {'article_number': 'W712/75', 'manufacturer': 'Mann-Filter'},
            {'article_number': 'W71275', 'manufacturer': 'Mann-Filter'}
        ]

        >>> parse_article_numbers("W712/75;W71275")
        [
            {'article_number': 'W712/75', 'manufacturer': None},
            {'article_number': 'W71275', 'manufacturer': None}
        ]
    """
    if not article_str or article_str.strip() == '':
        return []

    articles = []
    for item in article_str.split(';'):
        item = item.strip()

        # Пропускаем пустые строки
        if not item:
            continue

        if ':' in item:
            parts = item.split(':', 1)
            article_number = parts[0].strip()
            manufacturer = parts[1].strip() if len(parts) > 1 else None

            # Пропускаем, если артикул пустой
            if not article_number:
                continue

            articles.append({
                'article_number': article_number,
                'manufacturer': manufacturer or None,
            })
        else:
            # Пропускаем пустые артикулы
            if item:
                articles.append({
                    'article_number': item,
                    'manufacturer': None,
                })

    return articles
