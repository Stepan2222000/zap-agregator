'use client'

import { useEffect } from 'react'
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  listingId: string
}

export default function SuccessModal({
  isOpen,
  onClose,
  listingId,
}: SuccessModalProps) {
  const router = useRouter()

  // Блокировка прокрутки при открытой модалке
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Закрытие по ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
    }

    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleGoHome = () => {
    onClose()
    router.push('/')
  }

  const handlePublishAnother = () => {
    onClose()
    // Перезагрузка страницы для сброса формы
    window.location.reload()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Оверлей */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />

      {/* Модальное окно */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-light-bg dark:bg-dark-bg rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-scale-in"
      >
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-light-bg-secondary dark:hover:bg-dark-bg-secondary transition-colors flex items-center justify-center"
          aria-label="Закрыть"
        >
          <XMarkIcon className="w-5 h-5 text-light-text-secondary dark:text-dark-text-secondary" />
        </button>

        {/* Иконка успеха */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-bounce-in">
            <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </div>

        {/* Заголовок */}
        <h2 className="text-2xl font-bold text-center text-light-text-primary dark:text-dark-text-primary mb-3">
          Объявление отправлено на обработку!
        </h2>

        {/* Описание */}
        <p className="text-center text-light-text-secondary dark:text-dark-text-secondary mb-2">
          Мы проверим ваше объявление и опубликуем его в течение 24 часов.
        </p>

        {/* ID объявления */}
        <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-lg p-4 mb-6">
          <p className="text-sm text-light-text-muted dark:text-dark-text-muted text-center mb-1">
            Номер вашего объявления:
          </p>
          <p className="text-center font-mono text-sm font-semibold text-primary-orange break-all">
            {listingId}
          </p>
        </div>

        {/* Кнопки действий */}
        <div className="space-y-3">
          <button
            onClick={handleGoHome}
            className="w-full py-3 px-6 bg-primary-orange hover:bg-primary-orange-hover text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Вернуться на главную
          </button>

          <button
            onClick={handlePublishAnother}
            className="w-full py-3 px-6 bg-light-bg-secondary dark:bg-dark-bg-secondary hover:bg-light-bg-tertiary dark:hover:bg-dark-bg-tertiary text-light-text-primary dark:text-dark-text-primary font-semibold rounded-lg transition-colors duration-200"
          >
            Подать ещё одно объявление
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
