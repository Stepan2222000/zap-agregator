'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-light-bg/98 dark:bg-dark-bg/98 backdrop-blur-xl shadow-lg shadow-black/20 dark:shadow-black/20 border-b border-light-bg-tertiary dark:border-white/5'
            : 'bg-light-bg/50 dark:bg-dark-bg/50 backdrop-blur-sm'
        }`}
      >
        {/* Градиентная линия внизу */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-orange to-transparent opacity-50"></div>
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Logo с улучшенной анимацией */}
            <Link
              href="/"
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-light-text-primary dark:text-dark-text-primary hover:scale-110 transition-all duration-500 flex items-center gap-1.5 sm:gap-2 group"
            >
              <span className="relative group-hover:text-primary-orange transition-colors duration-500">
                AutoHub
                {/* Пульсирующая точка с улучшенной анимацией */}
                <span className="hidden sm:block absolute -top-1 -right-1 w-2 h-2 bg-primary-orange rounded-full animate-pulse shadow-lg shadow-primary-orange/50"></span>
                {/* Подсветка при наведении */}
                <span className="absolute inset-0 bg-gradient-to-r from-primary-orange/0 via-primary-orange/20 to-primary-orange/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></span>
              </span>
              <span className="text-gradient font-extrabold group-hover:scale-110 transition-transform duration-500">AI</span>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
              <Link
                href="/catalog"
                className="text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-orange transition-colors duration-200 font-medium relative group text-sm sm:text-base"
              >
                Каталог
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-orange transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <ThemeToggle />
            </div>

            {/* CTA Button с оранжевой обводкой - тонкая версия */}
            <Link
              href="/publish"
              className="relative group bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-dark-bg-secondary/80 dark:via-dark-bg-secondary/60 dark:to-dark-bg-secondary/40 backdrop-blur-sm text-primary-orange text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-2.5 lg:px-8 lg:py-3 rounded-full font-semibold transition-all duration-500 hover:shadow-xl hover:shadow-primary-orange/30 hover:scale-105 active:scale-95 overflow-hidden border-2 border-primary-orange hover:border-primary-orange-hover"
            >
              {/* Светящийся фон при hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-orange/0 via-primary-orange/5 to-primary-orange/10 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-full"></div>

              {/* Тонкое внешнее свечение */}
              <div className="absolute -inset-0.5 bg-primary-orange/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

              {/* Градиентная волна */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-orange/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer rounded-full"></div>

              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                <span className="text-sm sm:text-base group-hover:rotate-12 transition-transform duration-300">✨</span>
                <span className="font-semibold tracking-wide">Опубликовать</span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Spacer чтобы контент не прятался под header - адаптивный */}
      <div className="h-14 sm:h-16 lg:h-20"></div>
    </>
  )
}
