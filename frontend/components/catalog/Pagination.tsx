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
          font-bold text-sm transition-all duration-300
          ${
            currentPage === 1
              ? "bg-light-bg-tertiary/50 dark:bg-dark-bg-tertiary/50 text-light-text-muted dark:text-dark-text-muted cursor-not-allowed opacity-40"
              : "bg-white dark:bg-dark-bg-secondary border-2 border-light-bg-tertiary dark:border-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary hover:border-primary-orange/50 hover:shadow-[0_4px_12px_rgba(217,119,87,0.15),0_2px_4px_rgba(0,0,0,0.08)] hover:scale-105 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-white hover:to-primary-orange/5 dark:hover:from-dark-bg-secondary dark:hover:to-primary-orange/10 active:scale-95 shadow-sm group"
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
                font-bold text-sm transition-all duration-300
                relative overflow-hidden
                ${
                  isActive
                    ? "bg-gradient-to-r from-primary-orange to-primary-orange-hover text-white shadow-[0_4px_14px_rgba(217,119,87,0.35),0_2px_4px_rgba(0,0,0,0.1)] scale-110 drop-shadow-[0_0_12px_rgba(217,119,87,0.5)] ring-2 ring-primary-orange/30 ring-offset-2"
                    : "bg-white dark:bg-dark-bg-secondary border-2 border-light-bg-tertiary dark:border-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary hover:border-primary-orange hover:shadow-[0_4px_12px_rgba(217,119,87,0.15),0_2px_4px_rgba(0,0,0,0.08)] hover:scale-105 hover:bg-gradient-to-r hover:from-white hover:to-primary-orange/5 dark:hover:from-dark-bg-secondary dark:hover:to-primary-orange/10 active:scale-95 shadow-sm hover:-translate-y-0.5"
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
          font-bold text-sm transition-all duration-300
          ${
            currentPage === totalPages
              ? "bg-light-bg-tertiary/50 dark:bg-dark-bg-tertiary/50 text-light-text-muted dark:text-dark-text-muted cursor-not-allowed opacity-40"
              : "bg-white dark:bg-dark-bg-secondary border-2 border-light-bg-tertiary dark:border-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary hover:border-primary-orange/50 hover:shadow-[0_4px_12px_rgba(217,119,87,0.15),0_2px_4px_rgba(0,0,0,0.08)] hover:scale-105 hover:-translate-y-0.5 hover:bg-gradient-to-r hover:from-white hover:to-primary-orange/5 dark:hover:from-dark-bg-secondary dark:hover:to-primary-orange/10 active:scale-95 shadow-sm group"
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
