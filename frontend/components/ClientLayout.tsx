'use client'

import { ReactNode } from 'react'
import { ThemeProvider } from '@/contexts/ThemeContext'
import Header from './Header'
import Footer from './Footer'

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </ThemeProvider>
  )
}
