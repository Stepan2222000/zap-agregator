'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <section
      className="relative min-h-[80vh] sm:min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center px-3 sm:px-4 lg:px-8 overflow-hidden bg-light-bg dark:bg-dark-bg"
    >
      {/* Простой чистый градиент вместо сложного фона */}
      <div className="absolute inset-0 bg-gradient-to-b from-light-bg via-light-bg to-light-bg-secondary dark:from-dark-bg dark:via-dark-bg dark:to-dark-bg-secondary opacity-50"></div>

      {/* Контент */}
      <div className={`relative z-10 max-w-4xl mx-auto text-center ${mounted ? 'animate-fade-up' : 'opacity-0'}`}>
        {/* Badge - меньше на мобильном */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-light-bg-tertiary/80 dark:bg-dark-bg-tertiary/80 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-light-bg-tertiary dark:border-white/10 mb-4 sm:mb-6 lg:mb-8 animate-fade-scale">
          <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-orange opacity-75"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-primary-orange"></span>
          </span>
          <span className="text-xs sm:text-sm text-light-text-secondary dark:text-dark-text-secondary font-medium">Powered by AI</span>
        </div>

        {/* Hero Title с градиентом - оптимизирован для мобильного */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-light-text-primary dark:text-dark-text-primary mb-3 sm:mb-4 lg:mb-6 tracking-tight leading-tight animate-fade-up delay-100 px-2">
          <span className="block">AutoHub</span>
          <span className="text-gradient animate-gradient inline-block">AI маркетплейс</span>
          <br className="hidden sm:block" />
          <span className="block mt-1 sm:mt-2">автозапчастей</span>
        </h1>

        {/* Subtitle - компактнее на мобильном */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-light-text-secondary dark:text-dark-text-secondary mb-6 sm:mb-10 lg:mb-14 leading-relaxed max-w-2xl mx-auto px-2 sm:px-4 animate-fade-up delay-200">
          Искусственный интеллект автоматически обогащает ваши объявления.
          <br className="hidden sm:block" />
          <span className="text-primary-orange font-semibold">Публикуйте бесплатно</span> без регистрации.
        </p>

        {/* Search Bar - упрощенный */}
        <form
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto animate-fade-up delay-300"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Введите артикул или название запчасти..."
              className={`w-full h-12 sm:h-14 lg:h-16 bg-light-bg-secondary dark:bg-dark-bg-secondary border ${
                isFocused ? 'border-primary-orange' : 'border-light-bg-tertiary dark:border-white/10'
              } rounded-xl px-4 sm:pl-12 pr-20 sm:pr-28 text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted focus:outline-none transition-colors duration-200 text-sm sm:text-base`}
            />

            {/* Icon внутри input - только на планшетах и выше */}
            <div className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 items-center gap-2 text-light-text-muted dark:text-dark-text-muted">
              <span className="text-xl">🔍</span>
            </div>

            {/* Search button - упрощенный */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-orange hover:bg-primary-orange-hover text-white px-4 sm:px-6 h-8 sm:h-10 lg:h-12 rounded-lg font-medium transition-colors duration-200"
              aria-label="Поиск"
            >
              <span className="hidden sm:inline">Найти</span>
              <span className="sm:hidden">→</span>
            </button>
          </div>

          {/* Подсказки под поиском */}
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap px-4">
            <span className="text-sm text-light-text-muted dark:text-dark-text-muted">Популярные:</span>
            {['Двигатель', 'Коробка передач', 'Фары'].map((tag, idx) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchQuery(tag)}
                className="text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-orange bg-light-bg-tertiary/60 dark:bg-dark-bg-tertiary/60 hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary px-3 py-1.5 rounded-lg transition-all duration-200 border border-light-bg-tertiary dark:border-white/5 hover:border-primary-orange/30"
              >
                {tag}
              </button>
            ))}
          </div>
        </form>

        {/* Stats cards - минималистичный дизайн */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-12 sm:mt-16 lg:mt-20 max-w-3xl mx-auto animate-fade-up delay-400">
          {[
            { value: '1000+', label: 'Запчастей', icon: '🔧' },
            { value: '99%', label: 'Точность AI', icon: '🤖' },
            { value: '24/7', label: 'Доступность', icon: '⚡' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-light-bg-secondary dark:bg-dark-bg-secondary border border-light-bg-tertiary dark:border-white/5 rounded-xl p-3 sm:p-4 lg:p-6 hover:border-light-bg-tertiary dark:hover:border-white/10 transition-colors duration-200"
            >
              <div className="text-center">
                {/* Icon - только на desktop */}
                <div className="text-2xl sm:text-3xl lg:text-4xl mb-2 hidden sm:block">
                  {stat.icon}
                </div>

                {/* Value */}
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-orange mb-1">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-xs sm:text-sm text-light-text-muted dark:text-dark-text-muted">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
