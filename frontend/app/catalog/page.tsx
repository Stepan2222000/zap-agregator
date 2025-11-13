/**
 * Страница каталога объявлений
 * Story 4.2: Catalog Page with Listing Cards
 */

import { Suspense } from "react";
import ListingCard from "@/components/catalog/ListingCard";
import SkeletonCard from "@/components/catalog/SkeletonCard";
import EmptyState from "@/components/catalog/EmptyState";
import Pagination from "@/components/catalog/Pagination";
import CatalogClient from "@/components/catalog/CatalogClient";

// Для SSR используем INTERNAL_API_URL (внутри Docker), для CSR - NEXT_PUBLIC_API_URL
const API_BASE_URL = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface SearchParams {
  q?: string;
  brand?: string;
  condition?: "new" | "used";
  price_min?: string;
  price_max?: string;
  page?: string;
}

interface ListingItem {
  id: string;
  article_number: string;
  brand: string;
  condition: "new" | "used";
  price: number;
  ai_processed_title: string;
  main_photo_url: string | null;
  created_at: string;
}

interface SearchResult {
  items: ListingItem[];
  total: number;
  page: number;
  pages: number;
  limit: number;
}

// Функция для получения данных с сервера
async function fetchListings(searchParams: SearchParams): Promise<SearchResult> {
  // Построить query string
  const params = new URLSearchParams();

  if (searchParams.q) params.append("q", searchParams.q);
  if (searchParams.brand) params.append("brand", searchParams.brand);
  if (searchParams.condition) params.append("condition", searchParams.condition);
  if (searchParams.price_min) params.append("price_min", searchParams.price_min);
  if (searchParams.price_max) params.append("price_max", searchParams.price_max);
  params.append("page", searchParams.page || "1");
  params.append("limit", "20");

  const url = `${API_BASE_URL}/api/listings/?${params.toString()}`;

  const response = await fetch(url, {
    cache: "no-store", // Всегда получать свежие данные
  });

  if (!response.ok) {
    throw new Error("Не удалось загрузить объявления");
  }

  return response.json();
}

// Loading компонент для Suspense
function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
      {[...Array(10)].map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Проверить наличие фильтров
  const hasFilters = !!(
    searchParams.q ||
    searchParams.brand ||
    searchParams.condition ||
    searchParams.price_min ||
    searchParams.price_max
  );

  let data: SearchResult;

  try {
    data = await fetchListings(searchParams);
  } catch (error) {
    return (
      <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
        <CatalogClient>
          <div className="text-center py-12 bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 rounded-lg border border-light-bg-tertiary dark:border-dark-bg-tertiary">
            <span className="text-5xl mb-3 block">⚠️</span>
            <p className="text-red-500 dark:text-red-400 text-base font-semibold">
              Ошибка загрузки объявлений. Попробуйте позже.
            </p>
          </div>
        </CatalogClient>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg">
      <CatalogClient>
        {/* Количество результатов */}
        {data.items.length > 0 && (
          <div className="mb-4">
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm font-semibold flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-primary-orange animate-pulse" />
              Найдено{" "}
              <span className="text-primary-orange font-bold text-base">
                {data.total}
              </span>{" "}
              {data.total === 1
                ? "объявление"
                : data.total < 5
                ? "объявления"
                : "объявлений"}
            </p>
          </div>
        )}

        {/* Сетка карточек или Empty State */}
        {data.items.length > 0 ? (
          <>
            <Suspense fallback={<CatalogSkeleton />}>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 mb-6">
                {data.items.map((item) => (
                  <ListingCard
                    key={item.id}
                    id={item.id}
                    articleNumber={item.article_number}
                    brand={item.brand}
                    condition={item.condition}
                    price={item.price}
                    title={item.ai_processed_title || "Без названия"}
                    mainPhotoUrl={item.main_photo_url}
                  />
                ))}
              </div>
            </Suspense>

            {/* Пагинация */}
            <Pagination currentPage={data.page} totalPages={data.pages} />
          </>
        ) : (
          <EmptyState hasFilters={hasFilters} />
        )}
      </CatalogClient>
    </div>
  );
}
