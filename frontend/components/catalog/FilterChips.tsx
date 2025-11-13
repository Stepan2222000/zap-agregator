"use client";

/**
 * Компонент для отображения активных фильтров в виде chips
 * Story 4.3: Filter Panel & Search Integration
 */

import { useRouter, useSearchParams } from "next/navigation";
import { X, Search, Car, Package, DollarSign } from "lucide-react";

export default function FilterChips() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Сформировать список активных фильтров
  const activeFilters: Array<{
    key: string;
    label: string;
    value: string;
    icon: React.ReactNode;
  }> = [];

  const q = searchParams.get("q");
  const brand = searchParams.get("brand");
  const condition = searchParams.get("condition");
  const priceMin = searchParams.get("price_min");
  const priceMax = searchParams.get("price_max");

  if (q) {
    activeFilters.push({
      key: "q",
      label: `Поиск: "${q}"`,
      value: q,
      icon: <Search className="w-3.5 h-3.5" />,
    });
  }

  if (brand) {
    activeFilters.push({
      key: "brand",
      label: brand,
      value: brand,
      icon: <Car className="w-3.5 h-3.5" />,
    });
  }

  if (condition) {
    activeFilters.push({
      key: "condition",
      label: condition === "new" ? "Новое" : "Б/У",
      value: condition,
      icon: <Package className="w-3.5 h-3.5" />,
    });
  }

  if (priceMin || priceMax) {
    const min = priceMin || "0";
    const max = priceMax || "∞";
    activeFilters.push({
      key: "price",
      label: `${min} - ${max} ₽`,
      value: "price",
      icon: <DollarSign className="w-3.5 h-3.5" />,
    });
  }

  // Если нет активных фильтров, не показывать ничего
  if (activeFilters.length === 0) {
    return null;
  }

  const handleRemoveFilter = (filterKey: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Удалить соответствующий параметр
    if (filterKey === "price") {
      params.delete("price_min");
      params.delete("price_max");
    } else {
      params.delete(filterKey);
    }

    // Сбросить на первую страницу
    params.set("page", "1");

    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2 mb-4 animate-in fade-in slide-in-from-top-2 duration-300">
      {activeFilters.map((filter) => (
        <div
          key={filter.key}
          className="
            group
            flex items-center gap-2
            bg-primary-orange/10
            border-2 border-primary-orange/30
            text-primary-orange
            px-3 py-2
            rounded-full
            text-sm font-semibold
            transition-all duration-200
            hover:bg-primary-orange/20
            hover:border-primary-orange/50
            hover:shadow-sm
            animate-in fade-in zoom-in-95 duration-200
          "
        >
          {filter.icon}
          <span>{filter.label}</span>
          <button
            onClick={() => handleRemoveFilter(filter.key)}
            className="
              w-5 h-5
              flex items-center justify-center
              hover:bg-primary-orange/40
              rounded-full
              transition-all duration-200
              active:scale-90
              focus:outline-none
              focus:ring-2
              focus:ring-primary-orange
            "
            aria-label={`Удалить фильтр ${filter.label}`}
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </div>
      ))}
    </div>
  );
}
