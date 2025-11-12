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
    <section className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center justify-center px-4 lg:px-8 overflow-hidden">
      {/* Анимированный градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-bg-secondary to-dark-bg">
        {/* Анимированные круги для визуального интереса */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-orange/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-orange/5 rounded-full blur-3xl animate-float delay-200"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-orange/5 rounded-full blur-3xl"></div>
      </div>

      {/* Контент */}
      <div className={`relative z-10 max-w-4xl mx-auto text-center ${mounted ? 'animate-fade-up' : 'opacity-0'}`}>
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-dark-bg-tertiary/80 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 mb-6 lg:mb-8 animate-fade-scale">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-orange opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-orange"></span>
          </span>
          <span className="text-sm text-text-secondary font-medium">Powered by AI</span>
        </div>

        {/* Hero Title с градиентом */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-text-primary mb-4 lg:mb-6 tracking-tight leading-tight animate-fade-up delay-100">
          <span className="block">AutoHub</span>
          <span className="text-gradient animate-gradient inline-block">AI маркетплейс</span>
          <br className="hidden sm:block" />
          <span className="block mt-2">автозапчастей</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-text-secondary mb-10 lg:mb-14 leading-relaxed max-w-2xl mx-auto px-4 animate-fade-up delay-200">
          Искусственный интеллект автоматически обогащает ваши объявления.
          <br className="hidden sm:block" />
          <span className="text-primary-orange font-semibold">Публикуйте бесплатно</span> без регистрации.
        </p>

        {/* Search Bar с анимацией */}
        <form
          onSubmit={handleSearch}
          className={`relative max-w-2xl mx-auto animate-fade-up delay-300 ${
            isFocused ? 'scale-105' : 'scale-100'
          } transition-transform duration-300`}
        >
          <div className={`relative group ${isFocused ? 'ring-2 ring-primary-orange/50' : ''} rounded-2xl transition-all duration-300`}>
            {/* Glow эффект */}
            <div className={`absolute -inset-1 bg-gradient-to-r from-primary-orange to-primary-orange-hover rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 ${isFocused ? 'opacity-50' : ''}`}></div>

            {/* Input */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Введите артикул или название запчасти..."
                className="w-full h-16 lg:h-18 bg-dark-bg-tertiary/90 backdrop-blur-xl border border-white/10 rounded-2xl pl-6 pr-32 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-orange/50 transition-all duration-300 text-base lg:text-lg font-medium"
              />

              {/* Icons внутри input */}
              <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2">
                <span className="text-2xl">🔍</span>
              </div>

              {/* Search button */}
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-orange to-primary-orange-hover text-white px-6 lg:px-8 h-12 lg:h-14 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-primary-orange/30 hover:scale-105 flex items-center gap-2"
                aria-label="Поиск"
              >
                <span className="hidden sm:inline">Найти</span>
                <span className="sm:hidden text-xl">→</span>
              </button>
            </div>
          </div>

          {/* Подсказки под поиском */}
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap px-4">
            <span className="text-sm text-text-muted">Популярные:</span>
            {['Двигатель', 'Коробка передач', 'Фары'].map((tag, idx) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchQuery(tag)}
                className="text-sm text-text-secondary hover:text-primary-orange bg-dark-bg-tertiary/60 hover:bg-dark-bg-tertiary px-3 py-1.5 rounded-lg transition-all duration-200 border border-white/5 hover:border-primary-orange/30"
              >
                {tag}
              </button>
            ))}
          </div>
        </form>

        {/* Stats или features */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-16 lg:mt-20 max-w-3xl mx-auto animate-fade-up delay-400">
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-gradient mb-2">1000+</div>
            <div className="text-sm lg:text-base text-text-secondary">Запчастей в каталоге</div>
          </div>
          <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold text-gradient mb-2">99%</div>
            <div className="text-sm lg:text-base text-text-secondary">Точность AI</div>
          </div>
          <div className="text-center col-span-2 lg:col-span-1">
            <div className="text-3xl lg:text-4xl font-bold text-gradient mb-2">24/7</div>
            <div className="text-sm lg:text-base text-text-secondary">Доступность</div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden lg:block">
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white/40 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
