'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(brands.length).fill(false))
  const [isHeaderVisible, setIsHeaderVisible] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    }

    // Header observer
    const headerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsHeaderVisible(true)
        }
      })
    }, observerOptions)

    // Cards observer
    const cardsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = cardRefs.current.findIndex(ref => ref === entry.target)
          if (index !== -1) {
            setVisibleCards(prev => {
              const newVisible = [...prev]
              newVisible[index] = true
              return newVisible
            })
          }
        }
      })
    }, observerOptions)

    if (headerRef.current) headerObserver.observe(headerRef.current)
    cardRefs.current.forEach(ref => {
      if (ref) cardsObserver.observe(ref)
    })

    return () => {
      headerObserver.disconnect()
      cardsObserver.disconnect()
    }
  }, [])

  return (
    <section className="py-12 sm:py-16 lg:py-24 px-3 sm:px-4 lg:px-8 bg-dark-bg"
>

      <div className="container mx-auto relative z-10">
        {/* Section Header с анимацией */}
        <div
          ref={headerRef}
          className={`text-center mb-12 lg:mb-16 transition-all duration-1000 ${
            isHeaderVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-dark-bg-tertiary/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 mb-4 hover:border-primary-orange/30 transition-all duration-300 group">
            <span className="text-xl group-hover:scale-110 transition-transform">🚗</span>
            <span className="text-sm text-text-secondary font-medium">Выберите бренд</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-text-primary mb-4 leading-tight">
            Популярные <span className="text-gradient animate-gradient inline-block">бренды</span>
          </h2>
          <p className="text-text-secondary text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Найдите запчасти для вашего автомобиля среди <span className="text-primary-orange font-semibold">ведущих производителей</span>
          </p>
        </div>

        {/* Brands Grid с анимациями появления */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 lg:gap-6 max-w-7xl mx-auto">
          {brands.map((brand, index) => (
            <Link
              key={brand.name}
              href={`/catalog?brand=${brand.name}`}
              ref={el => { cardRefs.current[index] = el }}
              className={`group relative transition-all duration-700 ${
                visibleCards[index]
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-20 scale-95'
              }`}
              style={{
                transitionDelay: visibleCards[index] ? `${index * 50}ms` : '0ms',
              }}
            >
              <div className="bg-dark-bg-secondary border border-white/5 rounded-xl p-4 sm:p-6 lg:p-8 min-h-[100px] sm:min-h-[120px] flex flex-col items-center justify-center hover:border-white/10 hover:bg-dark-bg-tertiary transition-colors duration-200">
                {/* Brand Icon - простая анимация */}
                <div className="mb-2 sm:mb-3 text-4xl sm:text-5xl lg:text-6xl group-hover:scale-105 transition-transform duration-200">
                  {brand.icon}
                </div>

                {/* Brand Name */}
                <span className="text-sm sm:text-base lg:text-lg font-semibold text-text-secondary group-hover:text-primary-orange transition-colors duration-200">
                  {brand.name}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button - упрощенный */}
        <div className="text-center mt-8 sm:mt-12 lg:mt-16">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-dark-bg-secondary hover:bg-dark-bg-tertiary border border-white/10 text-text-secondary hover:text-text-primary px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            <span>Показать все бренды</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
