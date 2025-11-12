'use client'

import { useTheme } from '@/contexts/ThemeContext'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-light-bg-tertiary dark:border-white/5 bg-light-bg-secondary dark:bg-dark-bg-tertiary/50">
        <div className="w-5 h-5"></div>
      </div>
    )
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg border border-light-bg-tertiary dark:border-white/5 bg-light-bg-secondary dark:bg-dark-bg-tertiary/50 hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary transition-all duration-300 hover:scale-105 active:scale-95 hover:border-primary-orange/30"
      aria-label="Переключить тему"
      title={theme === 'dark' ? 'Включить светлую тему' : 'Включить темную тему'}
    >
      {/* Иконка солнца (светлая тема) */}
      <svg
        className={`absolute w-5 h-5 transition-all duration-300 ${
          theme === 'light'
            ? 'rotate-0 scale-100 opacity-100'
            : 'rotate-90 scale-0 opacity-0'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>

      {/* Иконка луны (темная тема) */}
      <svg
        className={`absolute w-5 h-5 transition-all duration-300 ${
          theme === 'dark'
            ? 'rotate-0 scale-100 opacity-100'
            : '-rotate-90 scale-0 opacity-0'
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>

      {/* Эффект glow при hover */}
      <div className="absolute inset-0 rounded-lg bg-primary-orange opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-sm"></div>
    </button>
  )
}
