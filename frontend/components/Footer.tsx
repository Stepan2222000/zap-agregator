import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-bg-secondary border-t border-dark-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* О проекте */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">AutoHub AI</h3>
            <p className="text-dark-text-secondary text-sm leading-relaxed">
              Умный маркетплейс автозапчастей с AI-технологиями.
              Публикуйте объявления бесплатно и находите нужные детали быстро.
            </p>
          </div>

          {/* Навигация */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Навигация</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/catalog" className="text-dark-text-secondary hover:text-accent-blue transition-colors">
                  Каталог запчастей
                </Link>
              </li>
              <li>
                <Link href="/publish" className="text-dark-text-secondary hover:text-accent-blue transition-colors">
                  Опубликовать объявление
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-dark-text-secondary hover:text-accent-blue transition-colors">
                  О платформе
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Контакты</h3>
            <ul className="space-y-2 text-sm text-dark-text-secondary">
              <li>Email: info@autohub-ai.ru</li>
              <li>Телефон: +7 (999) 123-45-67</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-dark-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-center sm:text-left">
              <p className="text-dark-text-secondary text-sm mb-3">
                © {currentYear} AutoHub AI. Все права защищены.
              </p>
              {/* Соцсети - placeholder */}
              <div className="flex justify-center sm:justify-start space-x-4">
                <a
                  href="#"
                  className="text-dark-text-secondary hover:text-accent-blue transition-colors"
                  aria-label="Telegram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-dark-text-secondary hover:text-accent-blue transition-colors"
                  aria-label="VK"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2zm3.23 14.59h-1.2a1.15 1.15 0 01-1-.56c-.53-.85-1.33-1.83-1.77-1.83-.13 0-.36.03-.36.67v1.45a1 1 0 01-.87 1.11c-1.45.1-3.1-.11-4.46-1.23a10.38 10.38 0 01-3.2-4.11c-.59-1.25-.11-1.91.36-1.91.74 0 1 0 1.43 1 .33.78.78 1.5 1.16 2a.81.81 0 00.85.48c.13 0 .5-.1.5-1v-1.9c0-.86-.18-1.26-.72-1.26h-.41a.55.55 0 01.31-.9 3.82 3.82 0 011.92-.46h.42c.94 0 1.16.06 1.51.63.23.35.23 1 .23 1.73v2.29c0 .47.09.56.14.56s.27-.09.64-.48a10.39 10.39 0 001.66-2.84.68.68 0 01.68-.45h1.2a1 1 0 01.93 1.34 13.34 13.34 0 01-2 3.12l-.7.84c-.3.36-.25.54 0 .88.2.26 1 .95 1.46 1.53a4.26 4.26 0 01.86 1.47 1 1 0 01-.94 1.38z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-dark-text-secondary hover:text-accent-blue transition-colors"
                  aria-label="YouTube"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy" className="text-dark-text-secondary hover:text-accent-blue transition-colors">
                Конфиденциальность
              </Link>
              <Link href="/terms" className="text-dark-text-secondary hover:text-accent-blue transition-colors">
                Условия использования
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
