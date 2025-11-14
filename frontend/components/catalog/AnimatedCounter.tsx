"use client";

/**
 * Анимированный счетчик для количества результатов
 * Плавно увеличивается от 0 до целевого значения
 */

import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number; // Длительность анимации в миллисекундах
}

export default function AnimatedCounter({
  value,
  duration = 800,
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Если значение 0, сразу показываем 0
    if (value === 0) {
      setDisplayValue(0);
      return;
    }

    // Анимация счетчика
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Easing function (easeOutExpo для более быстрого начала и плавного окончания)
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      const currentValue = Math.floor(startValue + (value - startValue) * easeOutExpo);
      setDisplayValue(currentValue);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value); // Убедимся, что в конце точное значение
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className="text-primary-orange font-bold text-base tabular-nums animate-scale-in">
      {displayValue}
    </span>
  );
}
