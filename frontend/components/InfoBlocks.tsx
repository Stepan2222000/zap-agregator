'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const features = [
  {
    icon: '🤖',
    title: 'AI обогащение',
    subtitle: 'Google Gemini',
    description: 'Искусственный интеллект автоматически создает подробные описания, характеристики и категоризацию для ваших объявлений',
    gradient: 'from-purple-500/20 via-purple-400/10 to-primary-orange/20',
    glowColor: 'rgba(168, 85, 247, 0.4)',
    stat: '99% точность',
  },
  {
    icon: '⚡',
    title: 'Без регистрации',
    subtitle: 'Моментальный старт',
    description: 'Публикуйте объявления мгновенно без создания аккаунта. Простота и скорость на первом месте. Начните продавать за 2 минуты',
    gradient: 'from-primary-orange/20 via-yellow-400/10 to-yellow-500/20',
    glowColor: 'rgba(217, 119, 87, 0.4)',
    stat: '2 мин до публикации',
  },
  {
    icon: '🔍',
    title: 'Умный поиск',
    subtitle: 'AI-powered',
    description: 'Находите нужные запчасти по артикулам, названиям и характеристикам за секунды. Поиск понимает опечатки и синонимы',
    gradient: 'from-blue-500/20 via-cyan-400/10 to-primary-orange/20',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    stat: '1000+ запчастей',
  },
  {
    icon: '🔒',
    title: 'Модерация',
    subtitle: 'Гарантия качества',
    description: 'Все объявления проходят проверку для обеспечения качества и безопасности сделок. Защита от мошенничества',
    gradient: 'from-red-500/20 via-rose-400/10 to-primary-orange/20',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    stat: '24/7 проверка',
  },
  {
    icon: '💎',
    title: 'Бесплатно',
    subtitle: 'Навсегда',
    description: 'Никаких скрытых платежей. Размещайте неограниченное количество объявлений. Монетизация только через премиум-функции',
    gradient: 'from-primary-orange/20 via-pink-400/10 to-pink-500/20',
    glowColor: 'rgba(236, 72, 153, 0.4)',
    stat: '0₽ за публикацию',
  },
]

export default function InfoBlocks() {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(features.length).fill(false))
  const [isHeaderVisible, setIsHeaderVisible] = useState(false)
  const [isCTAVisible, setIsCTAVisible] = useState(false)

  const headerRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

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

    // CTA observer
    const ctaObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsCTAVisible(true)
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
    if (ctaRef.current) ctaObserver.observe(ctaRef.current)
    cardRefs.current.forEach(ref => {
      if (ref) cardsObserver.observe(ref)
    })

    return () => {
      headerObserver.disconnect()
      ctaObserver.disconnect()
      cardsObserver.disconnect()
    }
  }, [])

  return (
    <section className="py-12 sm:py-16 lg:py-24 px-3 sm:px-4 lg:px-8 bg-dark-bg-secondary">

      <div className="container mx-auto relative z-10">
        {/* Section Header с улучшенной анимацией */}
        <div
          ref={headerRef}
          className={`text-center mb-16 lg:mb-20 transition-all duration-1000 ${
            isHeaderVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-dark-bg-tertiary/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 mb-6 hover:border-primary-orange/30 transition-all duration-300 group">
            <span className="text-xl group-hover:scale-110 transition-transform">✨</span>
            <span className="text-sm text-text-secondary font-medium">Преимущества платформы</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-text-primary mb-6 leading-tight">
            Почему <span className="text-gradient animate-gradient inline-block">AutoHub AI</span> — лучший выбор
          </h2>
          <p className="text-text-secondary text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
            Мы используем передовые AI-технологии для создания идеального опыта покупки и продажи автозапчастей.
            <span className="text-primary-orange font-semibold"> Быстро. Просто. Надежно.</span>
          </p>
        </div>

        {/* Features Grid с улучшенными анимациями */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto mb-20">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              ref={el => { cardRefs.current[index] = el }}
              className={`group bg-dark-bg border border-white/5 rounded-xl p-6 sm:p-8 hover:border-primary-orange/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary-orange/10 ${
                visibleCards[index]
                  ? 'opacity-100 translate-y-0 scale-100'
                  : 'opacity-0 translate-y-10 scale-95'
              }`}
              style={{
                transitionDelay: visibleCards[index] ? `${index * 100}ms` : '0ms',
              }}
            >
              {/* Icon - улучшенная анимация */}
              <div className="mb-4 text-5xl lg:text-6xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg lg:text-xl font-bold text-text-primary mb-2 group-hover:text-primary-orange transition-colors duration-300">
                {feature.title}
              </h3>

              {/* Subtitle badge - с анимацией */}
              <div className="inline-flex items-center gap-1 text-primary-orange text-xs font-medium mb-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                {feature.subtitle}
              </div>

              {/* Description */}
              <p className="text-text-secondary leading-relaxed text-sm group-hover:text-text-primary/80 transition-colors duration-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section - минималистичный */}
        <div
          ref={ctaRef}
          className={`max-w-4xl mx-auto transition-all duration-500 ${
            isCTAVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="bg-dark-bg border border-white/10 rounded-xl p-6 sm:p-8 lg:p-12 text-center">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary mb-3 sm:mb-4 leading-tight">
              Готовы начать продажу автозапчастей?
            </h3>
            <p className="text-text-secondary text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
              Опубликуйте объявление <span className="text-primary-orange font-medium">бесплатно и без регистрации</span>.
              AI создаст описание автоматически.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
              <Link
                href="/publish"
                className="group bg-primary-orange hover:bg-primary-orange-hover text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 w-full sm:w-auto hover:scale-105 hover:shadow-xl hover:shadow-primary-orange/40 flex items-center justify-center gap-2"
              >
                <span>Опубликовать объявление</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>

              <Link
                href="/catalog"
                className="group border border-white/10 hover:border-primary-orange/30 text-text-secondary hover:text-primary-orange px-6 py-3 rounded-lg font-medium transition-all duration-300 w-full sm:w-auto hover:scale-105 hover:shadow-lg hover:shadow-primary-orange/10 flex items-center justify-center gap-2"
              >
                <span>Смотреть каталог</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Link>
            </div>

            {/* Trust indicators - упрощенные */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-white/5 text-center">
              {[
                { value: '< 5 мин', label: 'Время' },
                { value: '0₽', label: 'Стоимость' },
                { value: 'AI', label: 'Описание' },
              ].map((item, idx) => (
                <div key={idx}>
                  <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary-orange mb-1">
                    {item.value}
                  </div>
                  <div className="text-xs sm:text-sm text-text-muted">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
