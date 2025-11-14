/**
 * Компонент skeleton loader для карточки объявления
 * Показывается во время загрузки данных
 * Story 4.2: Catalog Page with Listing Cards
 * Синхронизирован с актуальным дизайном ListingCard + продвинутый shimmer effect
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

        shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)]
        dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.3)]

        animate-pulse
      "
    >
      {/* Skeleton для фото с shimmer эффектом */}
      <div className="bg-light-bg-tertiary dark:bg-dark-bg-tertiary aspect-square relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent" />
      </div>

      {/* Skeleton для текстовой информации */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        {/* Skeleton для названия с staggered shimmer */}
        <div className="space-y-2 mb-2">
          <div className="h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-md w-full relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" style={{ animationDelay: '0ms' }} />
          </div>
          <div className="h-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-md w-3/4 relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" style={{ animationDelay: '150ms' }} />
          </div>
        </div>

        {/* Skeleton для артикула */}
        <div className="h-3.5 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-md w-2/3 mb-1.5 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" style={{ animationDelay: '300ms' }} />
        </div>

        {/* Skeleton для марки */}
        <div className="h-3.5 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-md w-1/2 mb-2 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent" style={{ animationDelay: '450ms' }} />
        </div>

        {/* Разделитель */}
        <div className="h-px bg-light-bg-tertiary dark:bg-dark-bg-tertiary mt-auto mb-2" />

        {/* Skeleton для цены с primary-orange shimmer */}
        <div className="h-5 sm:h-6 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-md w-2/5 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-primary-orange/20 to-transparent" style={{ animationDelay: '600ms' }} />
        </div>
      </div>
    </div>
  );
}
