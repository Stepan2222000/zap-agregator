"use client";

/**
 * Компонент отображения количества найденных результатов
 * С анимированным счетчиком
 */

import AnimatedCounter from "./AnimatedCounter";

interface ResultsCounterProps {
  total: number;
}

export default function ResultsCounter({ total }: ResultsCounterProps) {
  // Склонение слова "объявление"
  const getPlural = (n: number): string => {
    if (n === 1) return "объявление";
    if (n >= 2 && n <= 4) return "объявления";
    return "объявлений";
  };

  return (
    <div className="mb-4 animate-in fade-in slide-in-from-top duration-500">
      <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-semibold flex items-center gap-2">
        {/* Animated pulsing dot */}
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-orange opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-orange"></span>
        </span>

        Найдено{" "}
        <AnimatedCounter value={total} />
        {" "}
        {getPlural(total)}
      </p>
    </div>
  );
}
