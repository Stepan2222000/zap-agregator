"use client";

/**
 * Компонент пагинации для каталога
 * Story 4.2: Catalog Page with Listing Cards
 */

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (totalPages <= 1) {
    return null; // Не показывать пагинацию если только 1 страница
  }

  const handlePageChange = (newPage: number) => {
    // Создать новые параметры с обновлённой страницей
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/catalog?${params.toString()}`);
  };

  // Генерация номеров страниц для отображения
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Максимум видимых номеров страниц

    if (totalPages <= maxVisible) {
      // Показать все страницы
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Показать с многоточием
      if (currentPage <= 3) {
        // Начало
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Конец
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Середина
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center gap-2 py-10">
      {/* Кнопка "Предыдущая" */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          flex items-center gap-2 px-4 h-11 rounded-xl
          font-bold text-sm transition-all duration-200
          ${
            currentPage === 1
              ? "bg-light-bg-tertiary/50 dark:bg-dark-bg-tertiary/50 text-light-text-muted dark:text-dark-text-muted cursor-not-allowed opacity-50"
              : "bg-white dark:bg-dark-bg-secondary border-2 border-light-bg-tertiary dark:border-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary hover:border-primary-orange hover:shadow-md active:scale-95 shadow-sm"
          }
        `}
        aria-label="Предыдущая страница"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Назад</span>
      </button>

      {/* Номера страниц */}
      <div className="flex items-center gap-1.5">
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="px-2 text-light-text-muted dark:text-dark-text-muted font-bold"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              className={`
                min-w-[44px] h-11 px-3 rounded-xl
                font-bold text-sm transition-all duration-200
                ${
                  isActive
                    ? "bg-primary-orange text-white shadow-lg scale-105"
                    : "bg-white dark:bg-dark-bg-secondary border-2 border-light-bg-tertiary dark:border-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary hover:border-primary-orange hover:shadow-md active:scale-95 shadow-sm"
                }
              `}
              aria-label={`Страница ${pageNum}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </button>
          );
        })}
      </div>

      {/* Кнопка "Следующая" */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          flex items-center gap-2 px-4 h-11 rounded-xl
          font-bold text-sm transition-all duration-200
          ${
            currentPage === totalPages
              ? "bg-light-bg-tertiary/50 dark:bg-dark-bg-tertiary/50 text-light-text-muted dark:text-dark-text-muted cursor-not-allowed opacity-50"
              : "bg-white dark:bg-dark-bg-secondary border-2 border-light-bg-tertiary dark:border-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary hover:border-primary-orange hover:shadow-md active:scale-95 shadow-sm"
          }
        `}
        aria-label="Следующая страница"
      >
        <span className="hidden sm:inline">Вперед</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
