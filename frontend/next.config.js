/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Оптимизация производительности
  swcMinify: true,

  // Docker standalone output для оптимального размера образа
  output: 'standalone',

  // Настройки изображений
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '8000',
        pathname: '/uploads/**',
      },
    ],
    // Переопределяем loader, чтобы заменить localhost на backend внутри Docker
    loader: 'default',
    loaderFile: undefined,
  },

  // Compress pages
  compress: true,

  // Power Page Speed
  poweredByHeader: false,

  // Experimental features для оптимизации
  experimental: {
    optimizeCss: true,
  },

  // Rewrites для проксирования запросов к backend (для Image Optimizer)
  async rewrites() {
    // INTERNAL_API_URL используется внутри Docker
    const backendUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
    ];
  },
}

module.exports = nextConfig
