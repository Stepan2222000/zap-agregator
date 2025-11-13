"use client";

/**
 * Компонент для отображения пустого состояния (нет результатов поиска)
 * Story 4.2: Catalog Page with Listing Cards
 */

import { useRouter } from "next/navigation";

interface EmptyStateProps {
  hasFilters?: boolean;
}

export default function EmptyState({ hasFilters = false }: EmptyStateProps) {
  const router = useRouter();

  const handleClearFilters = () => {
    router.push("/catalog");
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[50vh] animate-in fade-in zoom-in-95 duration-500">
      <div className="max-w-md w-full text-center">
        {/* SVG иконка вместо emoji */}
        <div className="mb-8">
          {hasFilters ? (
            <svg className="w-24 h-24 mx-auto text-light-text-muted dark:text-dark-text-muted opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          ) : (
            <svg className="w-24 h-24 mx-auto text-light-text-muted dark:text-dark-text-muted opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        {/* Заголовок */}
        <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4">
          Такого товара нет
        </h2>

        {/* Подсказка */}
        <p className="text-base text-light-text-secondary dark:text-dark-text-secondary mb-8 leading-relaxed">
          {hasFilters
            ? "Попробуйте изменить параметры поиска или сбросить фильтры"
            : "Попробуйте использовать другие ключевые слова для поиска"}
        </p>

        {/* Кнопка сброса фильтров */}
        {hasFilters && (
          <button
            onClick={handleClearFilters}
            className="
              h-11 px-8
              bg-primary-orange
              hover:bg-primary-orange-hover
              active:scale-95
              text-white font-bold text-base
              rounded-xl
              transition-all duration-200
              shadow-lg hover:shadow-xl
              focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-offset-2
            "
          >
            Сбросить фильтры
          </button>
        )}

        {/* Альтернативный сценарий - если вообще нет объявлений */}
        {!hasFilters && (
          <button
            onClick={() => router.push("/publish")}
            className="
              h-11 px-8
              bg-primary-orange
              hover:bg-primary-orange-hover
              active:scale-95
              text-white font-bold text-base
              rounded-xl
              transition-all duration-200
              shadow-lg hover:shadow-xl
              focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-offset-2
            "
          >
            Опубликовать объявление
          </button>
        )}
      </div>
    </div>
  );
}
