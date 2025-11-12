import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class', // Включаем поддержку темной темы через класс
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Основной акцентный цвет (одинаковый для обеих тем)
        'primary-orange': '#D97757',
        'primary-orange-hover': '#C46847',

        // Темная тема
        'dark-bg': '#1A1A1A',
        'dark-bg-secondary': '#252525',
        'dark-bg-tertiary': '#2D2D2D',
        'dark-text-primary': '#FFFFFF',
        'dark-text-secondary': '#B0B0B0',
        'dark-text-muted': '#707070',

        // Светлая тема
        'light-bg': '#FFFFFF',
        'light-bg-secondary': '#F5F5F5',
        'light-bg-tertiary': '#E8E8E8',
        'light-text-primary': '#1A1A1A',
        'light-text-secondary': '#4A4A4A',
        'light-text-muted': '#8A8A8A',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient-dark': 'linear-gradient(180deg, #1A1A1A 0%, #252525 100%)',
        'hero-gradient-light': 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',
        'accent-gradient': 'linear-gradient(135deg, #D97757 0%, #E8A87C 100%)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
