"use client";

/**
 * Поисковик по маркам автомобилей
 * Компонент с autocomplete для фильтра марки
 */

import { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown } from "lucide-react";

interface BrandSearchProps {
  value: string;
  onChange: (value: string) => void;
  brands: string[];
}

export default function BrandSearch({ value, onChange, brands }: BrandSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Фильтрация брендов по поисковому запросу
  const filteredBrands = brands.filter((brand) =>
    brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Закрыть при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (brand: string) => {
    onChange(brand);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleClear = () => {
    onChange("");
    setSearchQuery("");
  };

  // Получить отображаемый текст
  const displayText = value || "Все марки";

  return (
    <div ref={containerRef} className="relative">
      {/* Кнопка открытия */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="
          w-full flex items-center justify-between gap-2
          border-2 rounded-lg px-3 py-2.5
          bg-white dark:bg-dark-bg-secondary
          border-light-bg-tertiary dark:border-dark-bg-tertiary
          text-light-text-primary dark:text-dark-text-primary
          hover:border-primary-orange/50
          focus:outline-none focus:ring-2 focus:ring-primary-orange/20 focus:border-primary-orange
          transition-all duration-200
          text-sm
          min-h-[44px]
        "
      >
        <span className={value ? "font-medium" : "text-light-text-muted dark:text-dark-text-muted"}>
          {displayText}
        </span>
        <div className="flex items-center gap-1.5">
          {value && (
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleClear();
                }
              }}
              className="w-5 h-5 flex items-center justify-center hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary rounded-md transition-colors cursor-pointer"
              aria-label="Очистить"
            >
              <X className="w-3.5 h-3.5" />
            </div>
          )}
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {/* Dropdown с анимацией */}
      {isOpen && (
        <div
          className="
            absolute top-full left-0 right-0 mt-2
            bg-white dark:bg-dark-bg-secondary
            border-2 border-light-bg-tertiary dark:border-dark-bg-tertiary
            rounded-xl
            shadow-xl
            z-50
            max-h-72
            overflow-hidden
            flex flex-col
            animate-in slide-in-from-top-2 fade-in duration-200
          "
        >
          {/* Поисковая строка */}
          <div className="p-3 border-b border-light-bg-tertiary dark:border-dark-bg-tertiary">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light-text-muted dark:text-dark-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск марки..."
                className="
                  w-full pl-10 pr-3 py-2
                  bg-light-bg-secondary dark:bg-dark-bg-tertiary
                  border border-transparent
                  rounded-lg
                  text-sm
                  text-light-text-primary dark:text-dark-text-primary
                  placeholder-light-text-muted dark:placeholder-dark-text-muted
                  focus:outline-none focus:ring-2 focus:ring-primary-orange/20
                "
                autoFocus
              />
            </div>
          </div>

          {/* Список марок */}
          <div className="overflow-y-auto max-h-56">
            {/* Опция "Все марки" */}
            <button
              type="button"
              onClick={() => handleSelect("")}
              className={`
                w-full text-left px-4 py-2.5 text-sm font-medium
                hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary
                transition-colors
                ${
                  !value
                    ? "bg-primary-orange/10 text-primary-orange font-bold"
                    : "text-light-text-primary dark:text-dark-text-primary"
                }
              `}
            >
              Все марки
            </button>

            {/* Отфильтрованные марки */}
            {filteredBrands.length > 0 ? (
              filteredBrands.map((brand) => (
                <button
                  key={brand}
                  type="button"
                  onClick={() => handleSelect(brand)}
                  className={`
                    w-full text-left px-4 py-2.5 text-sm font-medium
                    hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary
                    transition-colors
                    ${
                      value === brand
                        ? "bg-primary-orange/10 text-primary-orange font-bold"
                        : "text-light-text-primary dark:text-dark-text-primary"
                    }
                  `}
                >
                  {brand}
                </button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-sm text-light-text-muted dark:text-dark-text-muted">
                Марка не найдена
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
