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
      className="relative min-h-[75vh] sm:min-h-[80vh] lg:min-h-[85vh] flex items-center justify-center px-3 sm:px-4 lg:px-8 overflow-hidden bg-dark-bg"
    >
      {/* Фоновые анимированные орбы для глубины */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Главный градиент */}
        <div className="absolute inset-0 bg-gradient-to-b from-dark-bg via-dark-bg to-dark-bg-secondary"></div>

        {/* Анимированные орбы - subtle */}
        <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-primary-orange/10 rounded-full blur-3xl animate-float-slow"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-primary-orange/5 rounded-full blur-3xl animate-float-slow delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 sm:w-64 h-32 sm:h-64 bg-primary-orange/8 rounded-full blur-2xl animate-pulse-subtle"></div>
      </div>

      {/* Контент */}
      <div className={`relative z-10 max-w-4xl mx-auto text-center ${mounted ? 'animate-fade-up' : 'opacity-0'}`}>
        {/* Badge - с subtle glow */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-dark-bg-tertiary/80 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-primary-orange/20 mb-4 sm:mb-6 lg:mb-8 animate-fade-scale shadow-lg shadow-primary-orange/10">
          <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-orange opacity-75"></span>
            <span className="relative inline-flex rounded-full h-full w-full bg-primary-orange"></span>
          </span>
          <span className="text-xs sm:text-sm text-text-secondary font-medium">⚡ Powered by AI</span>
        </div>

        {/* Hero Title с улучшенным градиентом */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-3 sm:mb-4 lg:mb-6 tracking-tight leading-tight animate-fade-up delay-100 px-2">
          <span className="block text-gradient animate-gradient bg-gradient-to-r from-primary-orange via-primary-orange-hover to-primary-orange">
            AutoHub AI
          </span>
          <span className="block text-text-primary mt-1 sm:mt-2">
            Маркетплейс автозапчастей
          </span>
        </h1>

        {/* Subtitle - компактнее на мобильном */}
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-text-secondary mb-6 sm:mb-10 lg:mb-14 leading-relaxed max-w-2xl mx-auto px-2 sm:px-4 animate-fade-up delay-200">
          Искусственный интеллект автоматически обогащает ваши объявления.
          <br className="hidden sm:block" />
          <span className="text-primary-orange font-semibold">Публикуйте бесплатно</span> без регистрации.
        </p>

        {/* Search Bar - с улучшенными эффектами */}
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
              placeholder="Введите артикул или название..."
              className={`w-full h-12 sm:h-14 lg:h-16 bg-dark-bg-secondary border ${
                isFocused ? 'border-primary-orange shadow-lg shadow-primary-orange/20' : 'border-white/10'
              } rounded-xl pl-4 sm:pl-12 pr-16 sm:pr-28 text-text-primary placeholder:text-text-muted focus:outline-none transition-all duration-300 text-sm sm:text-base hover:border-white/20`}
            />

            {/* Icon внутри input - показываем на всех устройствах */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center text-text-muted sm:hidden">
              <span className="text-lg">🔍</span>
            </div>
            <div className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 items-center gap-2 text-text-muted">
              <span className="text-xl">🔍</span>
            </div>

            {/* Search button - с улучшенным hover */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-orange hover:bg-primary-orange-hover text-white px-3 sm:px-6 h-8 sm:h-10 lg:h-12 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:shadow-primary-orange/30 hover:scale-105"
              aria-label="Поиск"
            >
              <span className="hidden sm:inline">Найти</span>
              <span className="sm:hidden text-base">🔍</span>
            </button>
          </div>

          {/* Подсказки под поиском - с иконками */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mt-6 flex-wrap px-4">
            <span className="text-xs sm:text-sm text-text-muted hidden sm:inline">Популярные:</span>
            {[
              { label: 'Двигатель', icon: '⚙️' },
              { label: 'Коробка', icon: '🔧' },
              { label: 'Фары', icon: '💡' },
            ].map((tag, idx) => (
              <button
                key={tag.label}
                type="button"
                onClick={() => setSearchQuery(tag.label)}
                className="text-xs sm:text-sm text-text-secondary hover:text-primary-orange bg-dark-bg-tertiary/60 hover:bg-dark-bg-tertiary px-2.5 sm:px-3 py-1.5 rounded-lg transition-all duration-300 border border-white/5 hover:border-primary-orange/30 hover:scale-105 hover:shadow-lg hover:shadow-primary-orange/10 flex items-center gap-1.5"
              >
                <span>{tag.icon}</span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>
        </form>

        {/* Stats cards - с улучшенными анимациями */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mt-12 sm:mt-16 lg:mt-20 max-w-3xl mx-auto">
          {[
            { value: '1000+', label: 'Запчастей', icon: '🔧' },
            { value: '99%', label: 'Точность AI', icon: '🤖' },
            { value: '24/7', label: 'Доступность', icon: '⚡' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`bg-dark-bg-secondary border border-white/5 rounded-xl p-3 sm:p-4 lg:p-6 hover:border-primary-orange/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-orange/10 animate-fade-up ${
                idx === 0 ? 'delay-400' : idx === 1 ? 'delay-500' : 'delay-700'
              }`}
            >
              <div className="text-center">
                {/* Icon - показываем на всех устройствах */}
                <div className="text-xl sm:text-2xl lg:text-3xl mb-2">
                  {stat.icon}
                </div>

                {/* Value */}
                <div className="text-lg sm:text-2xl lg:text-3xl font-bold text-primary-orange mb-1">
                  {stat.value}
                </div>

                {/* Label */}
                <div className="text-xs sm:text-sm text-text-muted">
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
