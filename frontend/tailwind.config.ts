import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Claude-inspired colors
        'primary-orange': '#D97757',
        'primary-orange-hover': '#C46847',
        'dark-bg': '#1A1A1A',
        'dark-bg-secondary': '#252525',
        'dark-bg-tertiary': '#2D2D2D',
        'text-primary': '#FFFFFF',
        'text-secondary': '#B0B0B0',
        'text-muted': '#707070',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(180deg, #1A1A1A 0%, #252525 100%)',
        'accent-gradient': 'linear-gradient(135deg, #D97757 0%, #E8A87C 100%)',
      },
    },
  },
  plugins: [],
}

export default config
