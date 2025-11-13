"use client";

/**
 * Клиентский компонент-обёртка для каталога
 * Управляет состоянием открытия фильтров на мобильных
 * Story 4.3: Filter Panel & Search Integration
 */

import { useState } from "react";
import FilterPanel, { FilterButton } from "./FilterPanel";
import SearchBar from "./SearchBar";
import FilterChips from "./FilterChips";

interface CatalogClientProps {
  children: React.ReactNode;
}

export default function CatalogClient({ children }: CatalogClientProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Hero секция с заголовком */}
      <div className="mb-6">
        {/* Заголовок */}
        <h1 className="text-2xl sm:text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
          Каталог запчастей
        </h1>
      </div>

      {/* Поисковая строка */}
      <div className="flex items-center gap-3 mb-4">
        <SearchBar />
        <FilterButton onClick={() => setIsFilterOpen(true)} />
      </div>

      {/* Активные фильтры (chips) */}
      <FilterChips />

      {/* Layout с фильтрами и результатами */}
      <div className="flex gap-6">
        {/* Панель фильтров (desktop) */}
        <aside className="hidden lg:block w-64 lg:w-72 flex-shrink-0">
          <FilterPanel isOpen={true} isMobile={false} />
        </aside>

        {/* Контент каталога */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* Панель фильтров (mobile) */}
      <FilterPanel
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        isMobile={true}
      />
    </div>
  );
}
