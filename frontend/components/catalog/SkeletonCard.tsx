/**
 * Компонент skeleton loader для карточки объявления
 * Показывается во время загрузки данных
 * Story 4.2: Catalog Page with Listing Cards
 * Синхронизирован с актуальным дизайном ListingCard
 */

export default function SkeletonCard() {
  return (
    <div
      className="
        bg-white dark:bg-dark-bg-secondary
        rounded-xl
        border border-light-bg-tertiary dark:border-dark-bg-tertiary
        overflow-hidden
        h-full flex flex-col
        shadow-sm
      "
    >
      {/* Skeleton для фото (aspect-square как в ListingCard) */}
      <div className="bg-light-bg-tertiary dark:bg-dark-bg-tertiary aspect-square animate-pulse" />

      {/* Skeleton для текстовой информации */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Skeleton для названия (2 строки, text-sm sm:text-base) */}
        <div className="space-y-2 mb-2 animate-pulse">
          <div className="h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-md w-full" />
          <div className="h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-md w-3/4" />
        </div>

        {/* Skeleton для артикула (text-sm) */}
        <div className="h-3.5 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-md w-2/3 mb-1.5 animate-pulse" />

        {/* Skeleton для марки (text-sm) */}
        <div className="h-3.5 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-md w-1/2 mb-2 animate-pulse" />

        {/* Разделитель */}
        <div className="h-px bg-light-bg-tertiary dark:bg-dark-bg-tertiary mt-auto mb-2" />

        {/* Skeleton для цены (text-base sm:text-lg) */}
        <div className="animate-pulse">
          <div className="h-5 sm:h-6 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-md w-2/5" />
        </div>
      </div>
    </div>
  );
}
