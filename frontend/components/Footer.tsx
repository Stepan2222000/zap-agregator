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
    <footer className="bg-dark-bg-secondary border-t border-white/5 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-orange/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-orange/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <span className="text-2xl lg:text-3xl font-bold text-text-primary group-hover:scale-105 transition-transform">
                AutoHub <span className="text-gradient">AI</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm lg:text-base leading-relaxed mb-6 max-w-sm">
              Самый крупный AI-powered маркетплейс автозапчастей в России. Публикуйте бесплатно, находите быстро.
            </p>

            {/* Stats */}
            <div className="flex gap-6">
              <div>
                <div className="text-2xl font-bold text-gradient">1000+</div>
                <div className="text-xs text-text-muted">Запчастей</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gradient">500+</div>
                <div className="text-xs text-text-muted">Продавцов</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gradient">99%</div>
                <div className="text-xs text-text-muted">AI точность</div>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h3 className="text-text-primary font-bold mb-4">Платформа</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-primary-orange transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-text-primary font-bold mb-4">Компания</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-primary-orange transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-text-primary font-bold mb-4">Поддержка</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-primary-orange transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="bg-dark-bg-tertiary/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 mb-12 border border-white/5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="text-xl font-bold text-text-primary mb-2">
                Получайте обновления
              </h3>
              <p className="text-text-secondary text-sm">
                Подпишитесь на рассылку и узнавайте о новых функциях первыми
              </p>
            </div>

            <form className="flex gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Ваш email..."
                className="flex-1 lg:w-64 h-12 bg-dark-bg-secondary border border-white/10 rounded-xl px-4 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary-orange/50 transition-all text-sm"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-primary-orange to-primary-orange-hover text-white px-6 h-12 rounded-xl font-semibold hover:shadow-lg hover:shadow-primary-orange/30 transition-all hover:scale-105 whitespace-nowrap"
              >
                Подписаться
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <p className="text-text-muted text-sm text-center lg:text-left">
              © {currentYear} AutoHub AI. Все права защищены. Made with{' '}
              <span className="text-primary-orange">❤️</span> in Russia
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={`w-10 h-10 flex items-center justify-center bg-dark-bg-tertiary/50 border border-white/5 rounded-lg text-text-secondary ${social.color} transition-all hover:scale-110 hover:border-primary-orange/30 text-lg`}
                  aria-label={social.name}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Language/Theme Toggle (placeholder) */}
            <div className="flex gap-3">
              <button className="text-text-secondary hover:text-primary-orange transition-colors text-sm font-medium px-3 py-1 rounded-lg hover:bg-dark-bg-tertiary/50">
                🇷🇺 RU
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-text-muted text-xs max-w-3xl mx-auto">
            AutoHub AI использует передовые технологии искусственного интеллекта для автоматической обработки объявлений.
            Все данные защищены и обрабатываются в соответствии с законодательством РФ.
          </p>
        </div>
      </div>
    </footer>
  )
}
