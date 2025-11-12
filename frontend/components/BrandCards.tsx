'use client'

import { useState } from 'react'
import Link from 'next/link'

const brands = [
  { name: 'Audi', icon: '🅰️', color: '#BB0A30' },
  { name: 'BMW', icon: '🅱️', color: '#0066B1' },
  { name: 'Mercedes', icon: '⭐', color: '#00ADEF' },
  { name: 'Toyota', icon: '🔴', color: '#EB0A1E' },
  { name: 'VW', icon: '🔵', color: '#001E50' },
  { name: 'Ford', icon: '🏁', color: '#003478' },
  { name: 'Nissan', icon: '⚫', color: '#C3002F' },
  { name: 'Honda', icon: '🅷', color: '#CC0000' },
  { name: 'Mazda', icon: '🔷', color: '#003087' },
  { name: 'Hyundai', icon: '🇭', color: '#002C5F' },
  { name: 'Kia', icon: '🇰', color: '#BB162B' },
  { name: 'Renault', icon: '🔶', color: '#FFCC00' },
]

export default function BrandCards() {
  const [hoveredBrand, setHoveredBrand] = useState<string | null>(null)

  return (
    <section className="py-20 lg:py-32 px-4 lg:px-8 bg-dark-bg relative overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-orange/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-orange/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-dark-bg-tertiary/60 px-4 py-2 rounded-full border border-white/10 mb-4">
            <span className="text-xl">🚗</span>
            <span className="text-sm text-text-secondary font-medium">Выберите бренд</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-text-primary mb-4">
            Популярные <span className="text-gradient">бренды</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Найдите запчасти для вашего автомобиля среди ведущих производителей
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6 max-w-7xl mx-auto">
          {brands.map((brand, index) => (
            <Link
              key={brand.name}
              href={`/catalog?brand=${brand.name}`}
              onMouseEnter={() => setHoveredBrand(brand.name)}
              onMouseLeave={() => setHoveredBrand(null)}
              className="group relative"
              style={{
                animationDelay: `${index * 0.05}s`,
              }}
            >
              <div className="relative bg-dark-bg-tertiary/80 backdrop-blur-sm border border-white/5 rounded-2xl p-6 lg:p-8 min-h-[140px] flex flex-col items-center justify-center transition-all duration-300 hover:border-primary-orange/30 hover:bg-dark-bg-tertiary card-hover">
                {/* Glow эффект при hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-primary-orange/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
                ></div>

                {/* Badge с количеством запчастей */}
                <div className="absolute top-2 right-2 bg-primary-orange/20 text-primary-orange text-xs font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {Math.floor(Math.random() * 100) + 20}+
                </div>

                {/* Brand Icon */}
                <div className="relative mb-3 text-5xl lg:text-6xl group-hover:scale-110 transition-transform duration-300">
                  {brand.icon}
                  {/* Animated ring */}
                  <div className="absolute inset-0 border-2 border-primary-orange rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"></div>
                </div>

                {/* Brand Name */}
                <span className="text-base lg:text-lg font-bold text-text-secondary group-hover:text-primary-orange transition-colors duration-300">
                  {brand.name}
                </span>

                {/* Hover indicator */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs text-text-muted">Смотреть →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 lg:mt-16">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-dark-bg-tertiary/60 hover:bg-dark-bg-tertiary border border-white/10 hover:border-primary-orange/30 text-text-secondary hover:text-primary-orange px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
          >
            <span>Показать все бренды</span>
            <span className="text-xl">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
