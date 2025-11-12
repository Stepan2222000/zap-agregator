import { CpuChipIcon, BoltIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const FEATURES = [
  {
    icon: CpuChipIcon,
    title: 'Искусственный интеллект',
    description: 'AI автоматически обогащает объявления подробным описанием и характеристиками запчастей',
  },
  {
    icon: BoltIcon,
    title: 'Быстрая публикация',
    description: 'Публикуйте объявления без регистрации. Просто укажите артикул, загрузите фото и готово',
  },
  {
    icon: MagnifyingGlassIcon,
    title: 'Умный поиск',
    description: 'Находите нужные запчасти по артикулам, названиям и характеристикам за считанные секунды',
  },
];

export default function WhyAutoHub() {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        {/* Заголовок секции */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Почему <span className="text-accent-blue">AutoHub AI</span>?
          </h2>
          <p className="text-dark-text-secondary text-lg sm:text-xl max-w-2xl mx-auto">
            Современные технологии для удобной покупки и продажи автозапчастей
          </p>
        </div>

        {/* Карточки с преимуществами */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="card p-8 hover:scale-105 hover:shadow-2xl hover:border-accent-blue/50 transition-all duration-200"
              >
                {/* Иконка */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 mb-6 flex items-center justify-center bg-gradient-to-br from-accent-blue/20 to-accent-blue-dark/20 rounded-xl">
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-accent-blue" />
                </div>

                {/* Заголовок */}
                <h3 className="text-xl sm:text-2xl font-bold text-dark-bg mb-3">
                  {feature.title}
                </h3>

                {/* Описание */}
                <p className="text-dark-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
