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
            ? 'bg-dark-bg/95 backdrop-blur-xl shadow-lg shadow-black/10'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo с анимацией */}
            <Link
              href="/"
              className="text-2xl lg:text-3xl font-bold text-text-primary hover:scale-105 transition-transform duration-300 flex items-center gap-2"
            >
              <span className="relative">
                AutoHub
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary-orange rounded-full animate-pulse"></span>
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

            {/* CTA Button с градиентом и glow */}
            <div className="flex items-center gap-3">
              <Link
                href="/publish"
                className="relative group bg-gradient-to-r from-primary-orange to-primary-orange-hover text-white px-6 py-2.5 lg:px-8 lg:py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-primary-orange/30 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <span className="hidden sm:inline">✨</span>
                  Опубликовать
                </span>
                {/* Анимированный фоновый эффект */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-orange-hover to-primary-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>

              {/* Mobile Menu Button с анимацией */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden relative w-10 h-10 flex items-center justify-center text-text-primary hover:bg-dark-bg-tertiary rounded-lg transition-all duration-300"
                aria-label="Toggle menu"
              >
                <div className="flex flex-col gap-1.5 w-5">
                  <span className={`h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                  <span className={`h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu с анимацией */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-dark-bg-secondary/95 backdrop-blur-xl border-t border-white/10">
            <nav className="container mx-auto px-4 py-6 flex flex-col gap-4">
              <Link
                href="/catalog"
                className="text-text-secondary hover:text-primary-orange transition-colors py-3 px-4 rounded-lg hover:bg-dark-bg-tertiary/50 font-medium flex items-center gap-3 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">🔍</span>
                Каталог
              </Link>
              <Link
                href="/about"
                className="text-text-secondary hover:text-primary-orange transition-colors py-3 px-4 rounded-lg hover:bg-dark-bg-tertiary/50 font-medium flex items-center gap-3 group"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="text-xl group-hover:scale-110 transition-transform">ℹ️</span>
                О нас
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Spacer чтобы контент не прятался под header */}
      <div className="h-16 lg:h-20"></div>
    </>
  )
}
