import './globals.css'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FloatingActionButton from '@/components/FloatingActionButton'

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
    <html lang="ru">
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingActionButton />
      </body>
    </html>
  )
}
