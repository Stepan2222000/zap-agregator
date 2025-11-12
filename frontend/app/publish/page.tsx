'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import PhotoUpload from '@/components/PhotoUpload'
import SuccessModal from '@/components/SuccessModal'
import ErrorState from '@/components/ErrorState'

// Zod схема валидации
const listingSchema = z.object({
  article_number: z.string()
    .min(1, 'Артикул обязателен')
    .max(255, 'Артикул слишком длинный'),
  condition: z.enum(['new', 'used'], {
    errorMap: () => ({ message: 'Выберите состояние запчасти' }),
  }),
  price: z.string()
    .min(1, 'Цена обязательна')
    .refine((val) => {
      const num = parseFloat(val)
      return !isNaN(num) && num > 0
    }, 'Цена должна быть больше 0'),
  brand: z.string()
    .min(1, 'Марка автомобиля обязательна')
    .max(255, 'Название марки слишком длинное'),
  description: z.string().max(2000, 'Описание слишком длинное').optional(),
  contact_phone: z.string()
    .min(10, 'Телефон должен содержать минимум 10 цифр')
    .max(50, 'Телефон слишком длинный')
    .regex(/^[\d\s\+\-\(\)]+$/, 'Некорректный формат телефона'),
  contact_whatsapp: z.string()
    .max(50, 'Номер WhatsApp слишком длинный')
    .regex(/^[\d\s\+\-\(\)]*$/, 'Некорректный формат номера')
    .optional()
    .or(z.literal('')),
  contact_telegram: z.string()
    .max(50, 'Telegram слишком длинный')
    .optional()
    .or(z.literal('')),
})

type ListingFormData = z.infer<typeof listingSchema>

export default function PublishPage() {
  const [photos, setPhotos] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [createdListingId, setCreatedListingId] = useState<string>('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      condition: 'used',
    },
  })

  const onSubmit = async (data: ListingFormData) => {
    // Проверка наличия фотографий
    if (photos.length === 0) {
      setError('Необходимо загрузить хотя бы одну фотографию')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      // Формирование FormData для multipart/form-data
      const formData = new FormData()
      formData.append('article_number', data.article_number)
      formData.append('condition', data.condition)
      formData.append('price', data.price)
      formData.append('brand', data.brand)
      if (data.description) {
        formData.append('description', data.description)
      }
      formData.append('contact_phone', data.contact_phone)
      if (data.contact_whatsapp) {
        formData.append('contact_whatsapp', data.contact_whatsapp)
      }
      if (data.contact_telegram) {
        formData.append('contact_telegram', data.contact_telegram)
      }

      // Добавление фотографий
      photos.forEach((photo) => {
        formData.append('photos', photo)
      })

      // Отправка на backend
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/listings`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.detail || `Ошибка сервера: ${response.status}`
        )
      }

      const result = await response.json()

      // Успех - показываем модалку
      setCreatedListingId(result.id)
      setSuccessModalOpen(true)

      // Сброс формы
      reset()
      setPhotos([])
    } catch (err) {
      console.error('Ошибка при создании объявления:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Не удалось отправить объявление. Попробуйте позже.'
      )
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRetry = () => {
    setError(null)
  }

  return (
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-light-text-primary dark:text-dark-text-primary mb-3">
            Подать объявление
          </h1>
          <p className="text-light-text-secondary dark:text-dark-text-secondary">
            Заполните форму ниже, чтобы опубликовать объявление о продаже автозапчасти.
            Все поля, отмеченные *, обязательны для заполнения.
          </p>
        </div>

        {/* Ошибка */}
        {error && (
          <ErrorState
            error={error}
            onRetry={handleRetry}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Карточка с основной информацией */}
          <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-xl p-6 space-y-5">
            <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
              Основная информация
            </h2>

            {/* Артикул */}
            <div>
              <label
                htmlFor="article_number"
                className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2"
              >
                Артикул запчасти *
              </label>
              <input
                {...register('article_number')}
                type="text"
                id="article_number"
                placeholder="Например: 12345678"
                className={`
                  w-full px-4 py-3 rounded-lg
                  bg-light-bg dark:bg-dark-bg
                  border-2 ${
                    errors.article_number
                      ? 'border-red-500'
                      : 'border-light-bg-tertiary dark:border-dark-bg-tertiary'
                  }
                  text-light-text-primary dark:text-dark-text-primary
                  placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted
                  focus:border-primary-orange focus:outline-none
                  transition-colors
                `}
              />
              {errors.article_number && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.article_number.message}
                </p>
              )}
            </div>

            {/* Марка автомобиля */}
            <div>
              <label
                htmlFor="brand"
                className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2"
              >
                Марка автомобиля *
              </label>
              <input
                {...register('brand')}
                type="text"
                id="brand"
                placeholder="Например: Toyota, BMW, Lada"
                className={`
                  w-full px-4 py-3 rounded-lg
                  bg-light-bg dark:bg-dark-bg
                  border-2 ${
                    errors.brand
                      ? 'border-red-500'
                      : 'border-light-bg-tertiary dark:border-dark-bg-tertiary'
                  }
                  text-light-text-primary dark:text-dark-text-primary
                  placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted
                  focus:border-primary-orange focus:outline-none
                  transition-colors
                `}
              />
              {errors.brand && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.brand.message}
                </p>
              )}
            </div>

            {/* Состояние и цена в одной строке на больших экранах */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Состояние */}
              <div>
                <label
                  htmlFor="condition"
                  className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2"
                >
                  Состояние *
                </label>
                <select
                  {...register('condition')}
                  id="condition"
                  className={`
                    w-full px-4 py-3 rounded-lg
                    bg-light-bg dark:bg-dark-bg
                    border-2 ${
                      errors.condition
                        ? 'border-red-500'
                        : 'border-light-bg-tertiary dark:border-dark-bg-tertiary'
                    }
                    text-light-text-primary dark:text-dark-text-primary
                    focus:border-primary-orange focus:outline-none
                    transition-colors cursor-pointer
                  `}
                >
                  <option value="used">Б/У</option>
                  <option value="new">Новое</option>
                </select>
                {errors.condition && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.condition.message}
                  </p>
                )}
              </div>

              {/* Цена */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2"
                >
                  Цена (₽) *
                </label>
                <input
                  {...register('price')}
                  type="number"
                  id="price"
                  placeholder="10000"
                  step="0.01"
                  min="0"
                  className={`
                    w-full px-4 py-3 rounded-lg
                    bg-light-bg dark:bg-dark-bg
                    border-2 ${
                      errors.price
                        ? 'border-red-500'
                        : 'border-light-bg-tertiary dark:border-dark-bg-tertiary'
                    }
                    text-light-text-primary dark:text-dark-text-primary
                    placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted
                    focus:border-primary-orange focus:outline-none
                    transition-colors
                  `}
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>

            {/* Описание */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2"
              >
                Описание (необязательно)
              </label>
              <textarea
                {...register('description')}
                id="description"
                rows={4}
                placeholder="Дополнительная информация о запчасти, состояние, особенности..."
                className={`
                  w-full px-4 py-3 rounded-lg
                  bg-light-bg dark:bg-dark-bg
                  border-2 ${
                    errors.description
                      ? 'border-red-500'
                      : 'border-light-bg-tertiary dark:border-dark-bg-tertiary'
                  }
                  text-light-text-primary dark:text-dark-text-primary
                  placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted
                  focus:border-primary-orange focus:outline-none
                  transition-colors resize-y
                `}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Карточка с фотографиями */}
          <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-xl p-6 space-y-5">
            <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
              Фотографии *
            </h2>
            <PhotoUpload
              onPhotosChange={setPhotos}
              maxPhotos={10}
              maxFileSize={5 * 1024 * 1024}
            />
          </div>

          {/* Карточка с контактами */}
          <div className="bg-light-bg-secondary dark:bg-dark-bg-secondary rounded-xl p-6 space-y-5">
            <h2 className="text-xl font-semibold text-light-text-primary dark:text-dark-text-primary">
              Контактная информация
            </h2>

            {/* Телефон */}
            <div>
              <label
                htmlFor="contact_phone"
                className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2"
              >
                Телефон *
              </label>
              <input
                {...register('contact_phone')}
                type="tel"
                id="contact_phone"
                placeholder="+7 (999) 123-45-67"
                className={`
                  w-full px-4 py-3 rounded-lg
                  bg-light-bg dark:bg-dark-bg
                  border-2 ${
                    errors.contact_phone
                      ? 'border-red-500'
                      : 'border-light-bg-tertiary dark:border-dark-bg-tertiary'
                  }
                  text-light-text-primary dark:text-dark-text-primary
                  placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted
                  focus:border-primary-orange focus:outline-none
                  transition-colors
                `}
              />
              {errors.contact_phone && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.contact_phone.message}
                </p>
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label
                htmlFor="contact_whatsapp"
                className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2"
              >
                WhatsApp (необязательно)
              </label>
              <input
                {...register('contact_whatsapp')}
                type="tel"
                id="contact_whatsapp"
                placeholder="+7 (999) 123-45-67"
                className={`
                  w-full px-4 py-3 rounded-lg
                  bg-light-bg dark:bg-dark-bg
                  border-2 ${
                    errors.contact_whatsapp
                      ? 'border-red-500'
                      : 'border-light-bg-tertiary dark:border-dark-bg-tertiary'
                  }
                  text-light-text-primary dark:text-dark-text-primary
                  placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted
                  focus:border-primary-orange focus:outline-none
                  transition-colors
                `}
              />
              {errors.contact_whatsapp && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.contact_whatsapp.message}
                </p>
              )}
            </div>

            {/* Telegram */}
            <div>
              <label
                htmlFor="contact_telegram"
                className="block text-sm font-medium text-light-text-primary dark:text-dark-text-primary mb-2"
              >
                Telegram (необязательно)
              </label>
              <input
                {...register('contact_telegram')}
                type="text"
                id="contact_telegram"
                placeholder="@username или номер телефона"
                className={`
                  w-full px-4 py-3 rounded-lg
                  bg-light-bg dark:bg-dark-bg
                  border-2 ${
                    errors.contact_telegram
                      ? 'border-red-500'
                      : 'border-light-bg-tertiary dark:border-dark-bg-tertiary'
                  }
                  text-light-text-primary dark:text-dark-text-primary
                  placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted
                  focus:border-primary-orange focus:outline-none
                  transition-colors
                `}
              />
              {errors.contact_telegram && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.contact_telegram.message}
                </p>
              )}
            </div>
          </div>

          {/* Кнопка отправки */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`
              w-full py-4 px-6 rounded-lg font-semibold text-lg
              transition-all duration-200
              ${
                isSubmitting
                  ? 'bg-light-text-muted dark:bg-dark-text-muted cursor-not-allowed'
                  : 'bg-primary-orange hover:bg-primary-orange-hover shadow-lg hover:shadow-xl'
              }
              text-white
            `}
          >
            {isSubmitting ? 'Отправка...' : 'Опубликовать объявление'}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        listingId={createdListingId}
      />
    </main>
  )
}
