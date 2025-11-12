'use client'

import Link from 'next/link'

const features = [
  {
    icon: '🤖',
    title: 'AI обогащение',
    description: 'Искусственный интеллект автоматически создает подробные описания и характеристики для ваших объявлений',
    gradient: 'from-purple-500/20 to-primary-orange/20',
  },
  {
    icon: '⚡',
    title: 'Без регистрации',
    description: 'Публикуйте объявления мгновенно без создания аккаунта. Простота и скорость на первом месте',
    gradient: 'from-primary-orange/20 to-yellow-500/20',
  },
  {
    icon: '🔍',
    title: 'Умный поиск',
    description: 'Находите нужные запчасти по артикулам, названиям и характеристикам за секунды',
    gradient: 'from-blue-500/20 to-primary-orange/20',
  },
  {
    icon: '📱',
    title: 'Mobile First',
    description: 'Идеально работает на всех устройствах. Управляйте объявлениями прямо с телефона',
    gradient: 'from-green-500/20 to-primary-orange/20',
  },
  {
    icon: '🔒',
    title: 'Модерация',
    description: 'Все объявления проходят проверку для обеспечения качества и безопасности сделок',
    gradient: 'from-red-500/20 to-primary-orange/20',
  },
  {
    icon: '💎',
    title: 'Бесплатно',
    description: 'Никаких скрытых платежей. Размещайте неограниченное количество объявлений',
    gradient: 'from-primary-orange/20 to-pink-500/20',
  },
]

export default function InfoBlocks() {
  return (
    <section className="py-20 lg:py-32 px-4 lg:px-8 bg-gradient-to-b from-dark-bg to-dark-bg-secondary relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(217,119,87,0.1),transparent_50%)]"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary-orange/5 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-orange/5 rounded-full blur-3xl animate-float delay-200"></div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 bg-dark-bg-tertiary/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 mb-6">
            <span className="text-xl">✨</span>
            <span className="text-sm text-text-secondary font-medium">Преимущества</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-text-primary mb-6">
            Почему <span className="text-gradient">AutoHub AI</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Мы используем передовые технологии для создания лучшего опыта покупки и продажи автозапчастей
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative bg-dark-bg-tertiary/60 backdrop-blur-sm border border-white/5 rounded-2xl p-8 hover:border-primary-orange/30 transition-all duration-500 card-hover"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Gradient background на hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="text-6xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-text-primary mb-3 group-hover:text-primary-orange transition-colors duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-text-secondary leading-relaxed text-sm lg:text-base">
                  {feature.description}
                </p>

                {/* Decorative element */}
                <div className="absolute top-6 right-6 w-12 h-12 border border-primary-orange/20 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-dark-bg-secondary to-dark-bg-tertiary rounded-3xl p-8 lg:p-12 border border-white/10 overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-orange/10 via-transparent to-primary-orange/10 animate-gradient"></div>

            <div className="relative z-10 text-center">
              <h3 className="text-2xl lg:text-4xl font-bold text-text-primary mb-4">
                Готовы начать?
              </h3>
              <p className="text-text-secondary text-lg mb-8 max-w-2xl mx-auto">
                Опубликуйте свое первое объявление бесплатно и без регистрации. AI поможет создать идеальное описание.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/publish"
                  className="group relative bg-gradient-to-r from-primary-orange to-primary-orange-hover text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:shadow-2xl hover:shadow-primary-orange/30 hover:scale-105 overflow-hidden flex items-center gap-2"
                >
                  <span className="relative z-10">✨ Опубликовать объявление</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-orange-hover to-primary-orange opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Link>

                <Link
                  href="/catalog"
                  className="border-2 border-white/10 hover:border-primary-orange/50 text-text-secondary hover:text-primary-orange px-8 py-4 rounded-xl font-bold transition-all duration-300 hover:scale-105 flex items-center gap-2"
                >
                  🔍 Смотреть каталог
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient mb-1">5 мин</div>
                  <div className="text-xs text-text-muted">Время публикации</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient mb-1">0₽</div>
                  <div className="text-xs text-text-muted">Стоимость</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gradient mb-1">AI</div>
                  <div className="text-xs text-text-muted">Автоматизация</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
