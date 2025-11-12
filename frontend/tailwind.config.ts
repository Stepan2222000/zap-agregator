import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Темная тема
        'dark-bg': '#0A1628',
        'dark-bg-secondary': '#0F172A',
        'dark-surface': '#1E293B',
        'dark-border': '#334155',
        'dark-text': '#E2E8F0',
        'dark-text-secondary': '#94A3B8',

        // Светлая тема
        'light-bg': '#FFFFFF',
        'light-bg-secondary': '#F9FAFB',
        'light-surface': '#FFFFFF',
        'light-border': '#E5E7EB',
        'light-text': '#1E293B',
        'light-text-secondary': '#64748B',

        // Акцентные цвета
        'accent-blue': '#3B82F6',
        'accent-blue-dark': '#2563EB',
        'accent-blue-light': '#60A5FA',

        // Карточки
        'card-light': '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
        'card': '0 4px 20px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}

export default config
