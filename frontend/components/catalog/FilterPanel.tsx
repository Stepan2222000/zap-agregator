"use client";

/**
 * Компонент панели фильтров для каталога
 * Story 4.3: Filter Panel & Search Integration
 */

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, SlidersHorizontal, DollarSign, Package, Car } from "lucide-react";
import BrandSearch from "./BrandSearch";

interface FilterPanelProps {
  isOpen: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

// Список популярных брендов
const BRANDS = [
  "Audi",
  "BMW",
  "Mercedes",
  "Toyota",
  "VW",
  "Ford",
  "Nissan",
  "Honda",
  "Mazda",
  "Hyundai",
  "Kia",
  "Renault",
];

export default function FilterPanel({
  isOpen,
  onClose,
  isMobile = false,
}: FilterPanelProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Локальное состояние фильтров
  const [priceMin, setPriceMin] = useState(searchParams.get("price_min") || "");
  const [priceMax, setPriceMax] = useState(searchParams.get("price_max") || "");
  const [brand, setBrand] = useState(searchParams.get("brand") || "");
  const [condition, setCondition] = useState(searchParams.get("condition") || "");
  const [priceError, setPriceError] = useState("");

  // Обновить локальное состояние при изменении URL
  useEffect(() => {
    setPriceMin(searchParams.get("price_min") || "");
    setPriceMax(searchParams.get("price_max") || "");
    setBrand(searchParams.get("brand") || "");
    setCondition(searchParams.get("condition") || "");
  }, [searchParams]);

  const handleApply = () => {
    // Валидация
    if (
      priceMin &&
      priceMax &&
      parseFloat(priceMin) > parseFloat(priceMax)
    ) {
      setPriceError("Минимальная цена не может быть выше максимальной");
      return;
    }

    setPriceError("");

    // Создать новые параметры
    const params = new URLSearchParams(searchParams.toString());

    // Обновить/удалить параметры фильтров
    if (priceMin) {
      params.set("price_min", priceMin);
    } else {
      params.delete("price_min");
    }

    if (priceMax) {
      params.set("price_max", priceMax);
    } else {
      params.delete("price_max");
    }

    if (brand) {
      params.set("brand", brand);
    } else {
      params.delete("brand");
    }

    if (condition) {
      params.set("condition", condition);
    } else {
      params.delete("condition");
    }

    // Сбросить на первую страницу при применении фильтров
    params.set("page", "1");

    // Перейти на новый URL
    router.push(`/catalog?${params.toString()}`);

    // Закрыть модалку на мобильных
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleReset = () => {
    // Сбросить все фильтры
    setPriceMin("");
    setPriceMax("");
    setBrand("");
    setCondition("");
    setPriceError("");

    // Сохранить только query параметр если есть
    const params = new URLSearchParams();
    const query = searchParams.get("q");
    if (query) {
      params.set("q", query);
    }

    router.push(`/catalog?${params.toString()}`);

    if (isMobile && onClose) {
      onClose();
    }
  };

  // На desktop - всегда видна панель
  // На mobile - модальное окно
  if (isMobile && !isOpen) {
    return null;
  }

  const panelContent = (
    <div className="space-y-4 p-4 sm:p-5">
      {/* Заголовок (только на мобильных) */}
      {isMobile && (
        <div className="flex items-center justify-between pb-3 border-b border-light-bg-tertiary dark:border-dark-bg-tertiary">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-primary-orange" />
            <h2 className="text-lg font-bold text-light-text-primary dark:text-dark-text-primary">
              Фильтры
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary rounded-lg transition-colors active:scale-95"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
          </button>
        </div>
      )}

      {/* Цена */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-4 h-4 text-primary-orange" />
          <h3 className="font-bold text-sm text-light-text-primary dark:text-dark-text-primary">
            Цена, ₽
          </h3>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="От"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="
              flex-1 min-w-0 border-2 rounded-lg px-3 py-2.5
              bg-white dark:bg-dark-bg-secondary
              border-light-bg-tertiary dark:border-dark-bg-tertiary
              text-light-text-primary dark:text-dark-text-primary
              placeholder-light-text-muted dark:placeholder-dark-text-muted

              hover:border-primary-orange/50
              hover:shadow-[0_0_0_3px_rgba(217,119,87,0.05)]

              focus:outline-none
              focus:ring-2 focus:ring-primary-orange/20
              focus:border-primary-orange
              focus:shadow-[0_0_0_3px_rgba(217,119,87,0.1),0_0_12px_rgba(217,119,87,0.15)]

              transition-all duration-200
              text-sm
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
            "
            min="0"
          />
          <input
            type="number"
            placeholder="До"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="
              flex-1 min-w-0 border-2 rounded-lg px-3 py-2.5
              bg-white dark:bg-dark-bg-secondary
              border-light-bg-tertiary dark:border-dark-bg-tertiary
              text-light-text-primary dark:text-dark-text-primary
              placeholder-light-text-muted dark:placeholder-dark-text-muted

              hover:border-primary-orange/50
              hover:shadow-[0_0_0_3px_rgba(217,119,87,0.05)]

              focus:outline-none
              focus:ring-2 focus:ring-primary-orange/20
              focus:border-primary-orange
              focus:shadow-[0_0_0_3px_rgba(217,119,87,0.1),0_0_12px_rgba(217,119,87,0.15)]

              transition-all duration-200
              text-sm
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
            "
            min="0"
          />
        </div>
        {priceError && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-2 flex items-center gap-1">
            {priceError}
          </p>
        )}
      </div>

      {/* Состояние */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Package className="w-4 h-4 text-primary-orange" />
          <h3 className="font-bold text-sm text-light-text-primary dark:text-dark-text-primary">
            Состояние
          </h3>
        </div>
        <div className="space-y-1">
          <label className="flex items-center cursor-pointer group px-2 py-2.5 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition-all duration-200 min-h-[44px] hover:scale-[1.02] active:scale-[0.98]">
            <input
              type="radio"
              name="condition"
              value=""
              checked={condition === ""}
              onChange={(e) => setCondition(e.target.value)}
              className="mr-3 w-5 h-5 text-primary-orange focus:ring-2 focus:ring-primary-orange cursor-pointer"
            />
            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary transition-colors font-medium">Любое</span>
          </label>
          <label className="flex items-center cursor-pointer group px-2 py-2.5 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition-all duration-200 min-h-[44px] hover:scale-[1.02] active:scale-[0.98]">
            <input
              type="radio"
              name="condition"
              value="new"
              checked={condition === "new"}
              onChange={(e) => setCondition(e.target.value)}
              className="mr-3 w-5 h-5 text-primary-orange focus:ring-2 focus:ring-primary-orange cursor-pointer"
            />
            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary transition-colors font-medium">Новое</span>
          </label>
          <label className="flex items-center cursor-pointer group px-2 py-2.5 rounded-lg hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary transition-all duration-200 min-h-[44px] hover:scale-[1.02] active:scale-[0.98]">
            <input
              type="radio"
              name="condition"
              value="used"
              checked={condition === "used"}
              onChange={(e) => setCondition(e.target.value)}
              className="mr-3 w-5 h-5 text-primary-orange focus:ring-2 focus:ring-primary-orange cursor-pointer"
            />
            <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary group-hover:text-light-text-primary dark:group-hover:text-dark-text-primary transition-colors font-medium">Б/У</span>
          </label>
        </div>
      </div>

      {/* Марка */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Car className="w-4 h-4 text-primary-orange" />
          <h3 className="font-bold text-sm text-light-text-primary dark:text-dark-text-primary">
            Марка автомобиля
          </h3>
        </div>
        <BrandSearch value={brand} onChange={setBrand} brands={BRANDS} />
      </div>

      {/* Кнопки */}
      <div className="flex gap-2 pt-3 border-t border-light-bg-tertiary dark:border-dark-bg-tertiary mt-2">
        <button
          onClick={handleApply}
          className="
            flex-1 h-11 px-4

            bg-gradient-to-r from-primary-orange to-primary-orange-hover
            hover:from-primary-orange-hover hover:to-primary-orange

            active:scale-[0.98]
            text-white font-bold text-sm
            rounded-xl
            transition-all duration-200

            shadow-[0_4px_14px_rgba(217,119,87,0.25),0_2px_4px_rgba(0,0,0,0.1)]
            hover:shadow-[0_6px_20px_rgba(217,119,87,0.35),0_3px_6px_rgba(0,0,0,0.15)]

            hover:drop-shadow-[0_0_10px_rgba(217,119,87,0.4)]

            focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-offset-2
          "
        >
          Применить
        </button>
        <button
          onClick={handleReset}
          className="
            flex-1 h-11 px-4
            bg-white dark:bg-dark-bg-secondary
            border-2 border-light-bg-tertiary dark:border-dark-bg-tertiary
            hover:border-primary-orange/50
            hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary
            text-light-text-primary dark:text-dark-text-primary font-bold text-sm
            rounded-xl
            transition-all duration-200
            active:scale-[0.98]
            focus:outline-none focus:ring-2 focus:ring-primary-orange/20
          "
        >
          Сбросить
        </button>
      </div>
    </div>
  );

  if (isMobile) {
    // Модальное окно на мобильных
    return (
      <>
        {/* Overlay with enhanced backdrop blur */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-in fade-in duration-300 ease-out"
          onClick={onClose}
        />

        {/* Модалка с glass morphism */}
        <div
          className="
            fixed inset-x-0 bottom-0

            bg-white/95 dark:bg-dark-bg-secondary/95
            backdrop-blur-xl backdrop-saturate-150

            border-t border-light-bg-tertiary/50 dark:border-dark-bg-tertiary/50
            rounded-t-3xl
            z-50
            max-h-[85vh]
            overflow-y-auto

            shadow-[0_-10px_40px_rgba(0,0,0,0.15),0_-2px_8px_rgba(0,0,0,0.1)]
            dark:shadow-[0_-10px_40px_rgba(0,0,0,0.5),0_-2px_8px_rgba(0,0,0,0.3)]

            animate-in slide-in-from-bottom duration-300 ease-out
            pb-safe
          "
        >
          {panelContent}
        </div>
      </>
    );
  }

  // Sidebar на desktop
  return (
    <div
      className="
        bg-white dark:bg-dark-bg-secondary
        rounded-xl
        border border-light-bg-tertiary dark:border-dark-bg-tertiary
        sticky top-6

        shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.08)]
        dark:shadow-[0_4px_16px_rgba(0,0,0,0.3),0_1px_3px_rgba(0,0,0,0.4)]
      "
    >
      {panelContent}
    </div>
  );
}

// Кнопка открытия фильтров для мобильных
export function FilterButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        lg:hidden
        flex items-center gap-2
        px-4 h-11
        bg-white dark:bg-dark-bg-secondary
        border-2 border-light-bg-tertiary dark:border-dark-bg-tertiary
        hover:bg-light-bg-secondary dark:hover:bg-dark-bg-tertiary
        hover:border-primary-orange/50
        text-light-text-primary dark:text-dark-text-primary
        rounded-xl
        transition-all duration-200
        font-bold text-sm
        active:scale-95
        shadow-sm
        hover:shadow-md
        focus:outline-none focus:ring-2 focus:ring-primary-orange/20
      "
    >
      <SlidersHorizontal className="w-4 h-4" />
      Фильтры
    </button>
  );
}
