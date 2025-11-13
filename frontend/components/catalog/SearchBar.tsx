"use client";

/**
 * Компонент поисковой строки для каталога
 * Story 4.3: Filter Panel & Search Integration
 */

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

interface SearchBarProps {
  sticky?: boolean;
}

export default function SearchBar({ sticky = false }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    // Создать новые параметры
    const params = new URLSearchParams(searchParams.toString());

    if (query.trim()) {
      params.set("q", query.trim());
    } else {
      params.delete("q");
    }

    // Сбросить на первую страницу
    params.set("page", "1");

    router.push(`/catalog?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={`
        w-full max-w-3xl
        ${sticky ? "sticky top-0 z-10 bg-light-bg dark:bg-dark-bg py-4" : ""}
      `}
    >
      <div className="relative group">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Поиск по артикулу или названию..."
          className="
            w-full
            h-11
            pl-12 pr-4
            bg-white dark:bg-dark-bg-secondary
            border-2 border-light-bg-tertiary dark:border-dark-bg-tertiary
            rounded-xl
            text-light-text-primary dark:text-dark-text-primary
            placeholder-light-text-muted dark:placeholder-dark-text-muted
            focus:outline-none
            focus:ring-4 focus:ring-primary-orange/20
            focus:border-primary-orange
            hover:border-light-text-muted dark:hover:border-dark-text-muted
            transition-all duration-300
            text-base
            shadow-sm
            focus:shadow-lg
          "
        />

        {/* Search icon inside input */}
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-light-text-muted dark:text-dark-text-muted pointer-events-none group-focus-within:text-primary-orange transition-colors duration-200" />

        {/* Submit button (visually hidden but accessible) */}
        <button
          type="submit"
          className="
            absolute right-2 top-1/2 -translate-y-1/2
            h-7
            px-4
            flex items-center justify-center gap-1.5
            bg-primary-orange
            text-white
            text-sm font-medium
            rounded-lg
            hover:bg-primary-orange-hover
            active:scale-95
            transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-orange focus:ring-offset-2
            shadow-sm hover:shadow-md
          "
          aria-label="Искать"
        >
          <span className="hidden sm:inline">Искать</span>
          <Search className="w-4 h-4 sm:hidden" />
        </button>
      </div>
    </form>
  );
}
