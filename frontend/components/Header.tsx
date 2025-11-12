'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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
            ? 'bg-dark-bg/98 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5'
            : 'bg-dark-bg/50 backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Logo с анимацией - упрощенный для мобильного */}
            <Link
              href="/"
              className="text-xl sm:text-2xl lg:text-3xl font-bold text-text-primary hover:scale-105 transition-transform duration-300 flex items-center gap-1.5 sm:gap-2"
            >
              <span className="relative">
                AutoHub
                {/* Пульсирующая точка только на desktop */}
                <span className="hidden sm:block absolute -top-1 -right-1 w-2 h-2 bg-primary-orange rounded-full animate-pulse"></span>
              </span>
              <span className="text-gradient">AI</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link
                href="/catalog"
                className="text-text-secondary hover:text-primary-orange transition-colors duration-200 font-medium relative group"
              >
                Каталог
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-orange transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="/about"
                className="text-text-secondary hover:text-primary-orange transition-colors duration-200 font-medium relative group"
              >
                О нас
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-orange transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>

            {/* CTA Button с градиентом и glow - компактнее на мобильном */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/publish"
                className="relative group bg-gradient-to-r from-primary-orange to-primary-orange-hover text-white text-sm sm:text-base px-3 py-2 sm:px-6 sm:py-2.5 lg:px-8 lg:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-primary-orange/30 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1 sm:gap-2 whitespace-nowrap">
                  {/* Показываем только emoji на мобильном */}
                  <span className="sm:hidden text-base">✨</span>
                  {/* Полный текст на планшетах и выше */}
                  <span className="hidden sm:inline">✨ Опубликовать</span>
                </span>
                {/* Анимированный фоновый эффект */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-orange-hover to-primary-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              {/* Mobile Menu Button с улучшенной анимацией */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-text-primary hover:bg-dark-bg-tertiary/50 active:bg-dark-bg-tertiary rounded-lg transition-all duration-300 border border-white/5 hover:border-primary-orange/30"
                aria-label="Toggle menu"
              >
                <div className="flex flex-col gap-1.5 w-5">
                  <span className={`h-0.5 bg-current transition-all duration-300 rounded-full ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`h-0.5 bg-current transition-all duration-300 rounded-full ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`h-0.5 bg-current transition-all duration-300 rounded-full ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu с улучшенной анимацией */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-dark-bg-secondary/98 backdrop-blur-xl border-t border-white/5">
            <nav className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 flex flex-col gap-2 sm:gap-3">
              <Link
                href="/catalog"
                className="text-text-secondary hover:text-primary-orange active:text-primary-orange transition-all py-3 px-4 rounded-xl hover:bg-dark-bg-tertiary/50 active:bg-dark-bg-tertiary font-medium flex items-center justify-between group border border-transparent hover:border-primary-orange/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl group-hover:scale-110 transition-transform">🔍</span>
                  <span>Каталог</span>
                </div>
                <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="/about"
                className="text-text-secondary hover:text-primary-orange active:text-primary-orange transition-all py-3 px-4 rounded-xl hover:bg-dark-bg-tertiary/50 active:bg-dark-bg-tertiary font-medium flex items-center justify-between group border border-transparent hover:border-primary-orange/20"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl group-hover:scale-110 transition-transform">ℹ️</span>
                  <span>О нас</span>
                </div>
                <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Spacer чтобы контент не прятался под header - адаптивный */}
      <div className="h-14 sm:h-16 lg:h-20"></div>
    </>
  )
}
