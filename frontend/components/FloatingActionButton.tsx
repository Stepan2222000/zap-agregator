'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function FloatingActionButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Показывать FAB после скролла на 100px
      if (window.pageYOffset > 100) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  return (
    <>
      {/* Mobile FAB */}
      <div
        className={`fixed bottom-6 right-6 z-40 lg:hidden transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16 pointer-events-none'
        }`}
      >
        <Link
          href="/publish"
          className="group relative flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-orange to-primary-orange-hover rounded-full shadow-2xl shadow-primary-orange/50 hover:scale-110 active:scale-95 transition-all duration-300"
        >
          {/* Pulsing ring */}
          <div className="absolute inset-0 rounded-full bg-primary-orange animate-ping opacity-20"></div>

          {/* Icon */}
          <span className="relative z-10 text-3xl">✨</span>

          {/* Tooltip */}
          <div className="absolute right-full mr-4 bg-light-bg-tertiary dark:bg-dark-bg-tertiary backdrop-blur-xl border border-light-bg-tertiary dark:border-white/10 text-light-text-primary dark:text-dark-text-primary text-sm font-semibold px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Опубликовать
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-8 border-transparent border-l-dark-bg-tertiary"></div>
          </div>
        </Link>
      </div>

      {/* Desktop Side Button (опционально) */}
      <div className="hidden lg:block fixed bottom-8 right-8 z-40">
        <Link
          href="/publish"
          className="group relative flex items-center gap-3 bg-gradient-to-r from-primary-orange to-primary-orange-hover text-white px-6 py-4 rounded-full shadow-2xl shadow-primary-orange/30 hover:shadow-primary-orange/50 hover:scale-105 transition-all duration-300 font-semibold"
        >
          <span className="text-2xl">✨</span>
          <span>Опубликовать объявление</span>

          {/* Animated glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-orange-hover to-primary-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
      </div>
    </>
  )
}
