"use client";

/**
 * Компонент карточки объявления для каталога
 * Story 4.2: Catalog Page with Listing Cards
 */

import Link from "next/link";

interface ListingCardProps {
  id: string;
  articleNumber: string;
  brand: string;
  condition: "new" | "used";
  price: number;
  title: string;
  mainPhotoUrl?: string | null;
}

export default function ListingCard({
  id,
  articleNumber,
  brand,
  condition,
  price,
  title,
  mainPhotoUrl,
}: ListingCardProps) {
  // Форматирование цены в российские рубли
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "RUB",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Формирование URL для изображения - используем относительный путь для работы с rewrites
  const imageUrl = mainPhotoUrl ? `/uploads/${mainPhotoUrl}` : null;

  return (
    <Link href={`/listing/${id}`} className="block h-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-orange focus-visible:ring-offset-2 rounded-xl">
      <div
        className="
          bg-white dark:bg-dark-bg-secondary
          rounded-xl
          border border-light-bg-tertiary dark:border-dark-bg-tertiary
          group-hover:border-primary-orange/60

          shadow-[0_2px_8px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.06)]
          group-hover:shadow-[0_8px_30px_rgba(217,119,87,0.12),0_3px_8px_rgba(0,0,0,0.08),0_0_0_1px_rgba(217,119,87,0.2)]
          dark:shadow-[0_2px_8px_rgba(0,0,0,0.2),0_1px_2px_rgba(0,0,0,0.3)]
          dark:group-hover:shadow-[0_8px_30px_rgba(217,119,87,0.25),0_3px_8px_rgba(0,0,0,0.4),0_0_0_1px_rgba(217,119,87,0.3)]

          transition-all duration-500 ease-out
          cursor-pointer
          overflow-hidden
          h-full flex flex-col
          group-active:scale-[0.98]
          relative

          group-hover:ring-1 group-hover:ring-primary-orange/30
          group-hover:-translate-y-1
        "
      >
        {/* Subtle gradient overlay на фоне карточки при hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50/30 dark:from-dark-bg-secondary dark:via-dark-bg-secondary dark:to-dark-bg-tertiary/30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Shine effect - блестящий эффект при hover */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out">
            <div className="absolute inset-0 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent skew-x-[-20deg]" />
          </div>
        </div>

        {/* Фото + Бэдж состояния */}
        <div className="relative overflow-hidden bg-light-bg-tertiary dark:bg-dark-bg-tertiary aspect-square z-10">
          {imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.15] transition-transform duration-700 ease-out"
                loading="lazy"
              />
              {/* Улучшенный gradient overlay при hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 relative overflow-hidden">
              {/* Shimmer animation */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out" />

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-light-bg-secondary dark:bg-dark-bg-tertiary flex items-center justify-center relative z-10">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-light-text-muted dark:text-dark-text-muted group-hover:text-primary-orange/50 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-light-text-muted dark:text-dark-text-muted text-sm font-medium relative z-10">
                Нет фото
              </span>
            </div>
          )}

          {/* Бэдж состояния с Glass Morphism */}
          <div
            className={`
              absolute top-2 left-2 px-2.5 py-1 rounded-md
              text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide

              backdrop-blur-md backdrop-saturate-150
              shadow-[0_4px_12px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.1)]
              group-hover:shadow-[0_6px_16px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.15)]
              border border-white/20

              ${
                condition === "new"
                  ? "bg-gradient-to-br from-primary-orange/95 to-[#C46847]/85 group-hover:from-primary-orange group-hover:to-[#C46847]/95"
                  : "bg-gradient-to-br from-amber-500/95 to-amber-600/85 group-hover:from-amber-500 group-hover:to-amber-600/95"
              }

              group-hover:scale-110 transition-all duration-300 ease-out
            `}
          >
            {condition === "new" ? "New" : "Б/У"}
          </div>
        </div>

        {/* Текстовая информация */}
        <div className="p-3 sm:p-4 flex flex-col flex-grow relative z-10">
          {/* Название (максимум 2 строки) */}
          <h3
            className="
              text-sm sm:text-base font-semibold
              text-light-text-primary dark:text-dark-text-primary
              mb-1.5
              line-clamp-2
              leading-snug
              group-hover:text-primary-orange
              transition-colors duration-200
            "
            title={title}
          >
            {title}
          </h3>

          {/* Артикул */}
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-1">
            <span className="font-semibold tracking-wide">{articleNumber}</span>
          </p>

          {/* Марка */}
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
            {brand}
          </p>

          {/* Цена с glow эффектом и gradient разделителем */}
          <div className="mt-auto pt-2 relative">
            {/* Gradient divider */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-light-bg-tertiary to-transparent dark:via-dark-bg-tertiary" />

            <p className="text-base sm:text-lg font-bold text-primary-orange group-hover:drop-shadow-[0_0_12px_rgba(217,119,87,0.5)] group-hover:scale-105 transition-all duration-300 origin-left">
              {formatPrice(price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
