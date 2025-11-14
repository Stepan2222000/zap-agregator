import './globals.css'
import type { Metadata } from 'next'
import ClientLayout from '@/components/ClientLayout'

export const metadata: Metadata = {
  title: 'AutoHub AI - Умный маркетплейс автозапчастей',
  description: 'AI-powered поиск запчастей. Публикуйте объявления бесплатно. Самый крупный маркетплейс автозапчастей в России.',
  keywords: 'автозапчасти, запчасти, автомобили, AI, маркетплейс',
  openGraph: {
    title: 'AutoHub AI - Умный маркетплейс автозапчастей',
    description: 'AI-powered поиск запчастей. Публикуйте объявления бесплатно.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Скрипт для предотвращения мигания темы при загрузке */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.classList.add(theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-light-bg dark:bg-dark-bg text-light-text-primary dark:text-dark-text-primary transition-colors duration-300" suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  )
}
