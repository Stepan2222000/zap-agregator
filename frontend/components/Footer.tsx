import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    platform: [
      { name: 'Главная', href: '/' },
      { name: 'Каталог', href: '/catalog' },
      { name: 'Опубликовать', href: '/publish' },
    ],
    company: [
      { name: 'О нас', href: '/about' },
      { name: 'Контакты', href: '/contacts' },
      { name: 'Блог', href: '/blog' },
    ],
    support: [
      { name: 'FAQ', href: '/faq' },
      { name: 'Поддержка', href: '/support' },
      { name: 'Политика', href: '/privacy' },
    ],
  }

  const socialLinks = [
    { name: 'Telegram', icon: '✈️', href: '#', color: 'hover:text-blue-400' },
    { name: 'WhatsApp', icon: '💬', href: '#', color: 'hover:text-green-400' },
    { name: 'Instagram', icon: '📷', href: '#', color: 'hover:text-pink-400' },
    { name: 'VK', icon: '🔵', href: '#', color: 'hover:text-blue-500' },
  ]

  return (
    <footer className="bg-light-bg-secondary dark:bg-dark-bg-secondary border-t border-light-bg-tertiary dark:border-white/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Content */}
        <div className="py-12 lg:py-16">
          {/* Top Section - Logo + Stats */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <span className="text-2xl lg:text-3xl font-bold text-light-text-primary dark:text-dark-text-primary">
                AutoHub <span className="text-gradient">AI</span>
              </span>
            </Link>
            <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm lg:text-base max-w-2xl mx-auto mb-8">
              Самый крупный AI-powered маркетплейс автозапчастей в России. Публикуйте бесплатно, находите быстро.
            </p>

            {/* Stats - равномерно распределенные */}
            <div className="flex justify-center gap-8 sm:gap-12 lg:gap-16">
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-gradient mb-1">1000+</div>
                <div className="text-sm text-light-text-muted dark:text-dark-text-muted">Запчастей</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-gradient mb-1">500+</div>
                <div className="text-sm text-light-text-muted dark:text-dark-text-muted">Продавцов</div>
              </div>
              <div>
                <div className="text-3xl lg:text-4xl font-bold text-gradient mb-1">99%</div>
                <div className="text-sm text-light-text-muted dark:text-dark-text-muted">AI точность</div>
              </div>
            </div>
          </div>

          {/* Links - равномерная сетка */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12 mb-12 max-w-4xl mx-auto">
            {/* Платформа */}
            <div className="text-center sm:text-left">
              <h3 className="text-light-text-primary dark:text-dark-text-primary font-bold text-base mb-4">Платформа</h3>
              <ul className="space-y-2.5">
                {footerLinks.platform.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-orange transition-colors text-sm inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Компания */}
            <div className="text-center sm:text-left">
              <h3 className="text-light-text-primary dark:text-dark-text-primary font-bold text-base mb-4">Компания</h3>
              <ul className="space-y-2.5">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-orange transition-colors text-sm inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Поддержка */}
            <div className="text-center sm:text-left">
              <h3 className="text-light-text-primary dark:text-dark-text-primary font-bold text-base mb-4">Поддержка</h3>
              <ul className="space-y-2.5">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-light-text-secondary dark:text-dark-text-secondary hover:text-primary-orange transition-colors text-sm inline-block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter - компактнее */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-light-bg-tertiary/30 dark:bg-dark-bg-tertiary/30 rounded-2xl p-6 lg:p-8 border border-light-bg-tertiary dark:border-white/5">
              <h3 className="text-lg lg:text-xl font-bold text-light-text-primary dark:text-dark-text-primary mb-2 text-center">
                Получайте обновления
              </h3>
              <p className="text-light-text-secondary dark:text-dark-text-secondary text-sm mb-6 text-center">
                Подпишитесь на рассылку и узнавайте о новых функциях первыми
              </p>
              <form className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Ваш email..."
                  className="flex-1 h-12 bg-light-bg dark:bg-dark-bg border border-light-bg-tertiary dark:border-white/10 rounded-xl px-4 text-light-text-primary dark:text-dark-text-primary placeholder:text-light-text-muted focus:outline-none focus:border-primary-orange/50 transition-all text-sm"
                />
                <button
                  type="submit"
                  className="h-12 bg-gradient-to-r from-primary-orange to-primary-orange-hover text-white px-8 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-orange/20 transition-all"
                >
                  Подписаться
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-light-bg-tertiary dark:border-white/5 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Social Links */}
            <div className="flex gap-2 order-1 sm:order-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`w-10 h-10 flex items-center justify-center bg-light-bg-tertiary/50 dark:bg-dark-bg-tertiary/50 rounded-lg ${social.color} transition-all hover:scale-110 text-lg`}
                  aria-label={social.name}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Copyright - центрировано */}
            <p className="text-light-text-muted dark:text-dark-text-muted text-xs sm:text-sm text-center order-2 sm:order-1 flex-1 sm:flex-none">
              © {currentYear} AutoHub AI. Все права защищены.
            </p>

            {/* Disclaimer текст - более компактный */}
            <p className="text-light-text-muted dark:text-dark-text-muted text-xs text-center order-3 w-full sm:w-auto sm:max-w-xs">
              AI-обработка объявлений
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
