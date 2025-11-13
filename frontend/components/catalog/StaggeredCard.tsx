"use client";

/**
 * Обертка для ListingCard с staggered анимацией появления
 * Карточки появляются по очереди с задержкой для живого эффекта
 */

import { useEffect, useState } from "react";
import ListingCard from "./ListingCard";

interface StaggeredCardProps {
  index: number;
  id: string;
  articleNumber: string;
  brand: string;
  condition: "new" | "used";
  price: number;
  title: string;
  mainPhotoUrl?: string | null;
}

export default function StaggeredCard({
  index,
  ...cardProps
}: StaggeredCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Задержка 75ms между карточками
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`
        transition-all duration-500 ease-out
        ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }
      `}
    >
      <ListingCard {...cardProps} />
    </div>
  );
}
