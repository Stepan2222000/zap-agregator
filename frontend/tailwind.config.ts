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
        shine: {
          '0%': { transform: 'translateX(-100%) translateY(-100%) rotate(30deg)' },
          '100%': { transform: 'translateX(100%) translateY(100%) rotate(30deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s ease-in-out infinite',
        shine: 'shine 3s ease-in-out infinite',
        float: 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scale-in': 'scale-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
}

export default config
