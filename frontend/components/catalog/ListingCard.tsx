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
          group-hover:border-primary-orange
          shadow-sm group-hover:shadow-xl
          transition-all duration-300
          cursor-pointer
          overflow-hidden
          h-full flex flex-col
          group-active:scale-[0.98]
        "
      >
        {/* Фото + Бэдж состояния */}
        <div className="relative overflow-hidden bg-light-bg-tertiary dark:bg-dark-bg-tertiary aspect-square">
          {imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                loading="lazy"
              />
              {/* Gradient overlay при hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-light-bg-secondary dark:bg-dark-bg-tertiary flex items-center justify-center">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-light-text-muted dark:text-dark-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-light-text-muted dark:text-dark-text-muted text-sm font-medium">
                Нет фото
              </span>
            </div>
          )}

          {/* Бэдж состояния */}
          <div
            className={`
              absolute top-2 left-2 px-2.5 py-1 rounded-md
              text-white text-[10px] sm:text-xs font-bold uppercase tracking-wide
              shadow-md backdrop-blur-sm
              ${
                condition === "new"
                  ? "bg-primary-orange/90"
                  : "bg-amber-500/90"
              }
            `}
          >
            {condition === "new" ? "New" : "Б/У"}
          </div>
        </div>

        {/* Текстовая информация */}
        <div className="p-3 sm:p-4 flex flex-col flex-grow">
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
            <span className="font-medium">{articleNumber}</span>
          </p>

          {/* Марка */}
          <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary mb-2">
            {brand}
          </p>

          {/* Цена */}
          <div className="mt-auto pt-2 border-t border-light-bg-tertiary dark:border-dark-bg-tertiary">
            <p className="text-base sm:text-lg font-bold text-primary-orange">
              {formatPrice(price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
