'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-dark-bg-secondary border-b border-dark-border backdrop-blur-sm bg-opacity-95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Логотип */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-accent-blue-dark rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">A</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold text-white">AutoHub</span>
              <span className="text-xl font-bold text-accent-blue ml-1">AI</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/catalog"
              className="text-dark-text hover:text-white transition-colors font-medium flex items-center space-x-1"
            >
              <MagnifyingGlassIcon className="w-5 h-5" />
              <span>Каталог</span>
            </Link>
            <Link
              href="/publish"
              className="btn-primary"
            >
              Опубликовать объявление
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-dark-surface transition-colors"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6 text-white" />
            ) : (
              <Bars3Icon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-border fade-in">
            <nav className="flex flex-col space-y-3">
              <Link
                href="/catalog"
                className="text-dark-text hover:text-white transition-colors font-medium py-2 flex items-center space-x-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
                <span>Каталог</span>
              </Link>
              <Link
                href="/publish"
                className="btn-primary text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Опубликовать объявление
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
