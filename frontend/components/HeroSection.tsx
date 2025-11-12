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

        {/* Search Bar - улучшенный премиум дизайн */}
        <form
          onSubmit={handleSearch}
          className="relative max-w-2xl mx-auto animate-fade-up delay-300"
        >
          <div className="relative group">
            {/* Glow эффект при фокусе */}
            <div className={`absolute -inset-0.5 bg-gradient-to-r from-primary-orange via-primary-orange-hover to-primary-orange rounded-2xl blur-lg opacity-0 group-hover:opacity-20 ${isFocused ? 'opacity-30' : ''} transition-opacity duration-500`}></div>

            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Введите артикул или название запчасти..."
                className={`w-full h-14 sm:h-16 lg:h-[72px] bg-white dark:bg-dark-bg-secondary border-2 ${
                  isFocused
                    ? 'border-primary-orange shadow-lg shadow-primary-orange/20 dark:shadow-primary-orange/30'
                    : 'border-gray-200 dark:border-white/10 shadow-md dark:shadow-xl dark:shadow-black/20'
                } rounded-2xl pl-5 sm:pl-14 lg:pl-16 pr-28 sm:pr-36 lg:pr-40 text-light-text-primary dark:text-dark-text-primary placeholder:text-gray-400 dark:placeholder:text-dark-text-muted focus:outline-none transition-all duration-300 text-base sm:text-lg font-medium backdrop-blur-xl`}
              />

              {/* SVG Icon внутри input */}
              <div className={`absolute left-4 sm:left-5 lg:left-6 top-1/2 -translate-y-1/2 transition-all duration-300 ${
                isFocused ? 'text-primary-orange scale-110' : 'text-gray-400 dark:text-dark-text-muted'
              }`}>
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              {/* Search button - премиум дизайн */}
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className={`absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-orange to-primary-orange-hover hover:from-primary-orange-hover hover:to-primary-orange text-white px-5 sm:px-7 lg:px-9 h-10 sm:h-12 lg:h-14 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-primary-orange/30 hover:shadow-xl hover:shadow-primary-orange/40 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group/btn ${
                  searchQuery.trim() ? 'animate-pulse-subtle' : ''
                }`}
                aria-label="Поиск"
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm sm:text-base lg:text-lg">Найти</span>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Подсказки под поиском - улучшенный дизайн */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 sm:mt-8 flex-wrap px-4">
            <span className="text-xs sm:text-sm text-light-text-muted dark:text-dark-text-muted font-medium">Популярные:</span>
            {['Двигатель', 'Коробка передач', 'Фары', 'Подвеска'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchQuery(tag)}
                className="text-xs sm:text-sm text-light-text-secondary dark:text-dark-text-secondary hover:text-white bg-white/60 dark:bg-dark-bg-tertiary/60 hover:bg-primary-orange dark:hover:bg-primary-orange px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-300 border border-gray-200 dark:border-white/5 hover:border-primary-orange shadow-sm hover:shadow-md hover:shadow-primary-orange/20 hover:scale-105 active:scale-95 font-medium backdrop-blur-sm"
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
