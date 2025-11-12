/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Оптимизация производительности
  swcMinify: true,

  // Настройки изображений
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compress pages
  compress: true,

  // Power Page Speed
  poweredByHeader: false,

  // Experimental features для оптимизации
  experimental: {
    optimizeCss: true,
  },
}

module.exports = nextConfig
