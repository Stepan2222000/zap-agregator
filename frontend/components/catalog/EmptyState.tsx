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
    <div className="flex flex-col items-center justify-center py-20 px-4 min-h-[50vh]">
      <div className="max-w-md w-full text-center">
        {/* SVG иконка с glow эффектом и float анимацией */}
        <div className="mb-8 animate-in fade-in zoom-in-95 duration-700 delay-150">
          {hasFilters ? (
            <div className="relative inline-block animate-float">
              {/* Glow effect за иконкой с pulse-glow */}
              <div className="absolute inset-0 blur-3xl bg-primary-orange/15 rounded-full animate-pulse-glow" />
              <svg className="w-24 h-24 mx-auto text-light-text-muted dark:text-dark-text-muted opacity-40 relative z-10 transition-all duration-500 hover:opacity-60 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          ) : (
            <div className="relative inline-block animate-float">
              <div className="absolute inset-0 blur-3xl bg-primary-orange/15 rounded-full animate-pulse-glow" />
              <svg className="w-24 h-24 mx-auto text-light-text-muted dark:text-dark-text-muted opacity-40 relative z-10 transition-all duration-500 hover:opacity-60 hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
        </div>

        {/* Заголовок с анимацией */}
        <h2 className="text-3xl font-bold text-light-text-primary dark:text-dark-text-primary mb-4 animate-in fade-in slide-in-from-bottom-3 duration-700 delay-300">
          Такого товара нет
        </h2>

        {/* Подсказка с анимацией */}
        <p className="text-base text-light-text-secondary dark:text-dark-text-secondary mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-3 duration-700 delay-450">
          {hasFilters
            ? "Попробуйте изменить параметры поиска или сбросить фильтры"
            : "Попробуйте использовать другие ключевые слова для поиска"}
        </p>

        {/* Кнопка с gradient и glow */}
        {hasFilters && (
          <button
            onClick={handleClearFilters}
            className="
              h-11 px-8

              bg-gradient-to-r from-primary-orange to-primary-orange-hover
              hover:from-primary-orange-hover hover:to-primary-orange

              active:scale-95
              text-white font-bold text-base
              rounded-xl
              transition-all duration-200

              shadow-[0_4px_14px_rgba(217,119,87,0.3),0_2px_4px_rgba(0,0,0,0.1)]
              hover:shadow-[0_6px_20px_rgba(217,119,87,0.4),0_3px_6px_rgba(0,0,0,0.15)]

              focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-offset-2

              animate-in fade-in slide-in-from-bottom-3 duration-700 delay-600

              hover:drop-shadow-[0_0_12px_rgba(217,119,87,0.5)]
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

              bg-gradient-to-r from-primary-orange to-primary-orange-hover
              hover:from-primary-orange-hover hover:to-primary-orange

              active:scale-95
              text-white font-bold text-base
              rounded-xl
              transition-all duration-200

              shadow-[0_4px_14px_rgba(217,119,87,0.3),0_2px_4px_rgba(0,0,0,0.1)]
              hover:shadow-[0_6px_20px_rgba(217,119,87,0.4),0_3px_6px_rgba(0,0,0,0.15)]

              focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-offset-2

              animate-in fade-in slide-in-from-bottom-3 duration-700 delay-600

              hover:drop-shadow-[0_0_12px_rgba(217,119,87,0.5)]
            "
          >
            Опубликовать объявление
          </button>
        )}
      </div>
    </div>
  );
}
