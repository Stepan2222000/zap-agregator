'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-bg-secondary to-accent-blue/20" />

      {/* Контент */}
      <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
        {/* Заголовок */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
          <span className="block">AutoHub</span>
          <span className="bg-gradient-to-r from-accent-blue to-accent-blue-dark bg-clip-text text-transparent">
            AI
          </span>
        </h1>

        {/* Подзаголовок */}
        <p className="text-lg sm:text-xl lg:text-2xl text-dark-text-secondary mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed">
          AI-powered поиск запчастей. Публикуйте объявления бесплатно. Находите нужные детали быстро.
        </p>

        {/* Поисковая форма */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-blue-dark rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />

            <div className="relative flex flex-col sm:flex-row gap-3 sm:gap-0 bg-white/95 backdrop-blur-sm rounded-2xl p-2 shadow-2xl">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Введите артикул или название запчасти..."
                className="flex-grow px-6 py-4 text-gray-900 placeholder-gray-500 bg-transparent outline-none text-base sm:text-lg rounded-xl sm:rounded-l-xl sm:rounded-r-none"
              />

              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-8 py-4 bg-accent-blue hover:bg-accent-blue-dark text-white font-semibold rounded-xl sm:rounded-r-xl sm:rounded-l-none transition-all duration-200 hover:shadow-lg hover:scale-105 min-h-[56px]"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                <span>Найти</span>
              </button>
            </div>
          </div>
        </form>

        {/* Дополнительный CTA */}
        <div className="mt-8 sm:mt-12">
          <p className="text-dark-text-secondary text-sm sm:text-base mb-4">
            Хотите продать запчасти?
          </p>
          <Link
            href="/publish"
            className="inline-block px-8 py-3 bg-transparent border-2 border-accent-blue text-accent-blue hover:bg-accent-blue hover:text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            Опубликовать объявление
          </Link>
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-accent-blue/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-blue-dark/10 rounded-full blur-3xl" />
    </section>
  );
}
