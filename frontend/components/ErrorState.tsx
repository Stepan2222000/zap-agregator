'use client'

import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ErrorStateProps {
  error: string | null
  onRetry?: () => void
  onClose?: () => void
  className?: string
}

export default function ErrorState({
  error,
  onRetry,
  onClose,
  className = '',
}: ErrorStateProps) {
  if (!error) return null

  return (
    <div
      className={`
        bg-red-50 dark:bg-red-900/20
        border-2 border-red-300 dark:border-red-800
        rounded-lg p-4 sm:p-5
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Иконка ошибки */}
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
        </div>

        {/* Контент */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-red-800 dark:text-red-300 mb-1">
            Ошибка при публикации объявления
          </h3>
          <p className="text-sm text-red-700 dark:text-red-400 break-words">
            {error}
          </p>

          {/* Кнопка повтора */}
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white text-sm font-medium rounded-lg transition-colors duration-200"
            >
              Попробовать снова
            </button>
          )}
        </div>

        {/* Кнопка закрытия */}
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 w-6 h-6 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center"
            aria-label="Закрыть ошибку"
          >
            <XMarkIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
          </button>
        )}
      </div>
    </div>
  )
}
