'use client'

import { useState, useEffect } from 'react'
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
  const [formProgress, setFormProgress] = useState(0)
  const [showStickyButton, setShowStickyButton] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      condition: 'used',
    },
  })

  // Отслеживание прогресса заполнения формы
  const formValues = watch()

  // Helper функция для проверки валидности поля
  const isFieldValid = (fieldName: keyof ListingFormData): boolean => {
    const value = formValues[fieldName]
    const hasError = errors[fieldName]
    const isFilled = value && String(value).trim() !== ''
    return isFilled && !hasError
  }

  // Функция автоформатирования телефона: +7 (XXX) XXX-XX-XX
  const formatPhoneNumber = (value: string): string => {
    // Убираем все нецифровые символы
    const digits = value.replace(/\D/g, '')

    // Если начинается с 8, заменяем на 7
    const normalizedDigits = digits.startsWith('8') ? '7' + digits.slice(1) : digits

    // Форматируем по частям
    if (normalizedDigits.length === 0) return ''
    if (normalizedDigits.length <= 1) return `+${normalizedDigits}`
    if (normalizedDigits.length <= 4) return `+${normalizedDigits[0]} (${normalizedDigits.slice(1)}`
    if (normalizedDigits.length <= 7) return `+${normalizedDigits[0]} (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4)}`
    if (normalizedDigits.length <= 9) return `+${normalizedDigits[0]} (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4, 7)}-${normalizedDigits.slice(7)}`

    return `+${normalizedDigits[0]} (${normalizedDigits.slice(1, 4)}) ${normalizedDigits.slice(4, 7)}-${normalizedDigits.slice(7, 9)}-${normalizedDigits.slice(9, 11)}`
  }

  // Обработчик изменения телефона
  const handlePhoneChange = (fieldName: 'contact_phone' | 'contact_whatsapp') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue(fieldName, formatted, { shouldValidate: true })
  }

  // Функция автоформатирования цены: добавляет пробелы между тысячами
  const formatPrice = (value: string): string => {
    // Убираем все нецифровые символы кроме точки
    const cleaned = value.replace(/[^\d.]/g, '')

    // Разделяем на целую и дробную части
    const parts = cleaned.split('.')
    const integerPart = parts[0]
    const decimalPart = parts[1]

    // Добавляем пробелы между тысячами
    const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')

    // Возвращаем с дробной частью, если она есть
    return decimalPart !== undefined ? `${formatted}.${decimalPart}` : formatted
  }

  // Обработчик изменения цены
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPrice(e.target.value)
    setValue('price', formatted, { shouldValidate: true })
  }

  useEffect(() => {
    // Не включаем condition в прогресс, так как у него есть значение по умолчанию
    const requiredFields = ['article_number', 'price', 'brand', 'contact_phone']
    const filledFields = requiredFields.filter(field => {
      const value = formValues[field as keyof ListingFormData]
      return value && String(value).trim() !== ''
    })

    // Учитываем фотографии как обязательное поле
    const photosFilled = photos.length > 0 ? 1 : 0
    const totalRequired = requiredFields.length + 1 // +1 для фотографий
    const progress = Math.round(((filledFields.length + photosFilled) / totalRequired) * 100)

    setFormProgress(progress)
  }, [formValues, photos])

  // Показывать sticky кнопку после скролла
  useEffect(() => {
    const handleScroll = () => {
      setShowStickyButton(window.scrollY > 300)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
      // Убираем форматирование из цены (пробелы) и преобразуем в число
      const cleanPrice = data.price.replace(/\s/g, '')
      formData.append('price', cleanPrice)
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
    <main className="min-h-screen bg-light-bg dark:bg-dark-bg py-6 sm:py-10 px-3 sm:px-4 lg:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Анимированный заголовок с прогресс-баром */}
        <div className="mb-6 sm:mb-10">
          {/* Hero заголовок */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-orange/20 to-primary-orange/5 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 animate-pulse">
              <span className="text-3xl sm:text-4xl">✨</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-light-text-primary dark:text-dark-text-primary mb-3 sm:mb-4">
              <span className="bg-gradient-to-r from-primary-orange via-primary-orange-hover to-primary-orange bg-clip-text text-transparent">
                Разместите
              </span>{' '}
              объявление
            </h1>
            <p className="text-base sm:text-lg text-light-text-secondary dark:text-dark-text-secondary max-w-2xl mx-auto px-2">
              Заполните форму ниже, и мы автоматически обработаем ваше объявление с помощью AI
            </p>
          </div>

          {/* Прогресс-бар заполнения */}
          <div className="bg-light-bg-secondary/50 dark:bg-dark-bg-secondary/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-light-bg-tertiary dark:border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm sm:text-base font-semibold text-light-text-primary dark:text-dark-text-primary">
                Прогресс заполнения
              </span>
              <span className={`text-sm sm:text-base font-bold ${
                formProgress === 100
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-primary-orange'
              }`}>
                {formProgress}%
              </span>
            </div>
            <div className="h-2.5 sm:h-3 bg-light-bg-tertiary dark:bg-dark-bg-tertiary rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ease-out rounded-full ${
                  formProgress === 100
                    ? 'bg-gradient-to-r from-green-500 to-green-600'
                    : 'bg-gradient-to-r from-primary-orange to-primary-orange-hover'
                }`}
                style={{ width: `${formProgress}%` }}
              />
            </div>
            {formProgress === 100 && (
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-2 font-medium animate-pulse">
                ✓ Все обязательные поля заполнены!
              </p>
            )}
          </div>
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
          {/* Карточка с основной информацией */}
          <div className="group bg-light-bg-secondary/80 dark:bg-dark-bg-secondary/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 space-y-5 sm:space-y-6 border border-light-bg-tertiary dark:border-white/5 hover:border-primary-orange/30 dark:hover:border-primary-orange/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-orange/10">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-orange/20 to-primary-orange/5 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl sm:text-2xl">📝</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                Основная информация
              </h2>
            </div>

            {/* Артикул */}
            <div>
              <label
                htmlFor="article_number"
                className="block text-sm sm:text-base font-semibold text-light-text-primary dark:text-dark-text-primary mb-2.5"
              >
                Артикул запчасти <span className="text-primary-orange">*</span>
              </label>
              <div className="relative">
                <input
                  {...register('article_number')}
                  type="text"
                  id="article_number"
                  placeholder="Например: 12345678"
                  className={`
                    w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl
                    bg-light-bg dark:bg-dark-bg
                    border-2 ${
                      errors.article_number
                        ? 'border-red-500 focus:border-red-600'
                        : isFieldValid('article_number')
                        ? 'border-green-500 dark:border-green-400 focus:border-green-600'
                        : 'border-light-bg-tertiary dark:border-dark-bg-tertiary focus:border-primary-orange hover:border-primary-orange/50'
                    }
                    text-base sm:text-lg text-light-text-primary dark:text-dark-text-primary
                    placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted
                    focus:outline-none focus:ring-4 ${
                      isFieldValid('article_number')
                        ? 'focus:ring-green-500/20'
                        : 'focus:ring-primary-orange/20'
                    }
                    transition-all duration-200
                    shadow-sm hover:shadow-md
                  `}
                />
                {isFieldValid('article_number') && (
                  <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 animate-in fade-in duration-200">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.article_number && (
                <p className="mt-2 text-sm sm:text-base text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <span>⚠️</span>
                  {errors.article_number.message}
                </p>
              )}
            </div>

            {/* Марка автомобиля */}
            <div>
              <label
                htmlFor="brand"
                className="block text-sm sm:text-base font-semibold text-light-text-primary dark:text-dark-text-primary mb-2.5"
              >
                Марка автомобиля <span className="text-primary-orange">*</span>
              </label>
              <div className="relative">
                <input
                  {...register('brand')}
                  type="text"
                  id="brand"
                  placeholder="Например: Toyota, BMW, Lada"
                  className={`
                    w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl
                    bg-light-bg dark:bg-dark-bg
                    border-2 ${
                      errors.brand
                        ? 'border-red-500 focus:border-red-600'
                        : isFieldValid('brand')
                        ? 'border-green-500 dark:border-green-400 focus:border-green-600'
                        : 'border-light-bg-tertiary dark:border-dark-bg-tertiary focus:border-primary-orange hover:border-primary-orange/50'
                    }
                    text-base sm:text-lg text-light-text-primary dark:text-dark-text-primary
                    placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted
                    focus:outline-none focus:ring-4 ${
                      isFieldValid('brand')
                        ? 'focus:ring-green-500/20'
                        : 'focus:ring-primary-orange/20'
                    }
                    transition-all duration-200
                    shadow-sm hover:shadow-md
                  `}
                />
                {isFieldValid('brand') && (
                  <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 animate-in fade-in duration-200">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.brand && (
                <p className="mt-2 text-sm sm:text-base text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <span>⚠️</span>
                  {errors.brand.message}
                </p>
              )}
            </div>

            {/* Состояние и цена в одной строке на больших экранах */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Состояние */}
              <div>
                <label
                  htmlFor="condition"
                  className="block text-sm sm:text-base font-semibold text-light-text-primary dark:text-dark-text-primary mb-2.5"
                >
                  Состояние <span className="text-primary-orange">*</span>
                </label>
                <div className="relative">
                  <select
                    {...register('condition')}
                    id="condition"
                    className={`
                      w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl
                      bg-light-bg dark:bg-dark-bg
                      border-2 ${
                        errors.condition
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-light-bg-tertiary dark:border-dark-bg-tertiary focus:border-primary-orange hover:border-primary-orange/50'
                      }
                      text-base sm:text-lg text-light-text-primary dark:text-dark-text-primary
                      focus:outline-none focus:ring-4 focus:ring-primary-orange/20
                      transition-all duration-200 cursor-pointer
                      shadow-sm hover:shadow-md
                      appearance-none
                    `}
                  >
                    <option value="used">Б/У</option>
                    <option value="new">Новое</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary-orange">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                {errors.condition && (
                  <p className="mt-2 text-sm sm:text-base text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <span>⚠️</span>
                    {errors.condition.message}
                  </p>
                )}
              </div>

              {/* Цена */}
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm sm:text-base font-semibold text-light-text-primary dark:text-dark-text-primary mb-2.5"
                >
                  Цена (₽) <span className="text-primary-orange">*</span>
                </label>
                <div className="relative">
                  <input
                    {...register('price', {
                      onChange: handlePriceChange
                    })}
                    type="text"
                    id="price"
                    placeholder="10 000"
                    inputMode="decimal"
                    className={`
                      w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl
                      bg-light-bg dark:bg-dark-bg
                      border-2 ${
                        errors.price
                          ? 'border-red-500 focus:border-red-600'
                          : isFieldValid('price')
                          ? 'border-green-500 dark:border-green-400 focus:border-green-600'
                          : 'border-light-bg-tertiary dark:border-dark-bg-tertiary focus:border-primary-orange hover:border-primary-orange/50'
                      }
                      text-base sm:text-lg text-light-text-primary dark:text-dark-text-primary
                      placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted
                      focus:outline-none focus:ring-4 ${
                        isFieldValid('price')
                          ? 'focus:ring-green-500/20'
                          : 'focus:ring-primary-orange/20'
                      }
                      transition-all duration-200
                      shadow-sm hover:shadow-md
                    `}
                  />
                  {isFieldValid('price') && (
                    <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 animate-in fade-in duration-200">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
                {errors.price && (
                  <p className="mt-2 text-sm sm:text-base text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <span>⚠️</span>
                    {errors.price.message}
                  </p>
                )}
              </div>
            </div>

            {/* Описание */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm sm:text-base font-semibold text-light-text-primary dark:text-dark-text-primary mb-2.5"
              >
                Описание <span className="text-light-text-muted dark:text-dark-text-muted text-sm">(необязательно)</span>
              </label>
              <div className="relative">
                <textarea
                  {...register('description')}
                  id="description"
                  rows={4}
                  placeholder="Дополнительная информация о запчасти, состояние, особенности..."
                  className={`
                    w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl
                    bg-light-bg dark:bg-dark-bg
                    border-2 ${
                      errors.description
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-light-bg-tertiary dark:border-dark-bg-tertiary focus:border-primary-orange hover:border-primary-orange/50'
                    }
                    text-base sm:text-lg text-light-text-primary dark:text-dark-text-primary
                    placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted
                    focus:outline-none focus:ring-4 focus:ring-primary-orange/20
                    transition-all duration-200 resize-y min-h-[120px]
                    shadow-sm hover:shadow-md
                  `}
                />
              </div>
              {errors.description && (
                <p className="mt-2 text-sm sm:text-base text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <span>⚠️</span>
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>

          {/* Карточка с фотографиями */}
          <div className="group bg-light-bg-secondary/80 dark:bg-dark-bg-secondary/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 space-y-5 sm:space-y-6 border border-light-bg-tertiary dark:border-white/5 hover:border-primary-orange/30 dark:hover:border-primary-orange/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-orange/10">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-orange/20 to-primary-orange/5 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl sm:text-2xl">📸</span>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                  Фотографии <span className="text-primary-orange">*</span>
                </h2>
                <p className="text-sm text-light-text-muted dark:text-dark-text-muted">
                  До 10 фотографий, макс. 5 МБ каждая
                </p>
              </div>
            </div>
            <PhotoUpload
              onPhotosChange={setPhotos}
              maxPhotos={10}
              maxFileSize={5 * 1024 * 1024}
            />
          </div>

          {/* Карточка с контактами */}
          <div className="group bg-light-bg-secondary/80 dark:bg-dark-bg-secondary/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-7 lg:p-8 space-y-5 sm:space-y-6 border border-light-bg-tertiary dark:border-white/5 hover:border-primary-orange/30 dark:hover:border-primary-orange/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary-orange/10">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-orange/20 to-primary-orange/5 rounded-xl sm:rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <span className="text-xl sm:text-2xl">📞</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-light-text-primary dark:text-dark-text-primary">
                Контактная информация
              </h2>
            </div>

            {/* Телефон */}
            <div>
              <label
                htmlFor="contact_phone"
                className="block text-sm sm:text-base font-semibold text-light-text-primary dark:text-dark-text-primary mb-2.5"
              >
                Телефон <span className="text-primary-orange">*</span>
              </label>
              <div className="relative">
                <input
                  {...register('contact_phone', {
                    onChange: handlePhoneChange('contact_phone')
                  })}
                  type="tel"
                  id="contact_phone"
                  placeholder="+7 (999) 123-45-67"
                  className={`
                    w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl
                    bg-light-bg dark:bg-dark-bg
                    border-2 ${
                      errors.contact_phone
                        ? 'border-red-500 focus:border-red-600'
                        : isFieldValid('contact_phone')
                        ? 'border-green-500 dark:border-green-400 focus:border-green-600'
                        : 'border-light-bg-tertiary dark:border-dark-bg-tertiary focus:border-primary-orange hover:border-primary-orange/50'
                    }
                    text-base sm:text-lg text-light-text-primary dark:text-dark-text-primary
                    placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted
                    focus:outline-none focus:ring-4 ${
                      isFieldValid('contact_phone')
                        ? 'focus:ring-green-500/20'
                        : 'focus:ring-primary-orange/20'
                    }
                    transition-all duration-200
                    shadow-sm hover:shadow-md
                  `}
                />
                {isFieldValid('contact_phone') && (
                  <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-green-600 dark:text-green-400 animate-in fade-in duration-200">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
              {errors.contact_phone && (
                <p className="mt-2 text-sm sm:text-base text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <span>⚠️</span>
                  {errors.contact_phone.message}
                </p>
              )}
            </div>

            {/* WhatsApp */}
            <div>
              <label
                htmlFor="contact_whatsapp"
                className="block text-sm sm:text-base font-semibold text-light-text-primary dark:text-dark-text-primary mb-2.5"
              >
                WhatsApp <span className="text-light-text-muted dark:text-dark-text-muted text-sm">(необязательно)</span>
              </label>
              <div className="relative">
                <input
                  {...register('contact_whatsapp', {
                    onChange: handlePhoneChange('contact_whatsapp')
                  })}
                  type="tel"
                  id="contact_whatsapp"
                  placeholder="+7 (999) 123-45-67"
                  className={`
                    w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl
                    bg-light-bg dark:bg-dark-bg
                    border-2 ${
                      errors.contact_whatsapp
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-light-bg-tertiary dark:border-dark-bg-tertiary focus:border-primary-orange hover:border-primary-orange/50'
                    }
                    text-base sm:text-lg text-light-text-primary dark:text-dark-text-primary
                    placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted
                    focus:outline-none focus:ring-4 focus:ring-primary-orange/20
                    transition-all duration-200
                    shadow-sm hover:shadow-md
                  `}
                />
              </div>
              {errors.contact_whatsapp && (
                <p className="mt-2 text-sm sm:text-base text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <span>⚠️</span>
                  {errors.contact_whatsapp.message}
                </p>
              )}
            </div>

            {/* Telegram */}
            <div>
              <label
                htmlFor="contact_telegram"
                className="block text-sm sm:text-base font-semibold text-light-text-primary dark:text-dark-text-primary mb-2.5"
              >
                Telegram <span className="text-light-text-muted dark:text-dark-text-muted text-sm">(необязательно)</span>
              </label>
              <div className="relative">
                <input
                  {...register('contact_telegram')}
                  type="text"
                  id="contact_telegram"
                  placeholder="@username или номер телефона"
                  className={`
                    w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl
                    bg-light-bg dark:bg-dark-bg
                    border-2 ${
                      errors.contact_telegram
                        ? 'border-red-500 focus:border-red-600'
                        : 'border-light-bg-tertiary dark:border-dark-bg-tertiary focus:border-primary-orange hover:border-primary-orange/50'
                    }
                    text-base sm:text-lg text-light-text-primary dark:text-dark-text-primary
                    placeholder:text-light-text-muted dark:placeholder:text-dark-text-muted
                    focus:outline-none focus:ring-4 focus:ring-primary-orange/20
                    transition-all duration-200
                    shadow-sm hover:shadow-md
                  `}
                />
              </div>
              {errors.contact_telegram && (
                <p className="mt-2 text-sm sm:text-base text-red-600 dark:text-red-400 flex items-center gap-1.5">
                  <span>⚠️</span>
                  {errors.contact_telegram.message}
                </p>
              )}
            </div>
          </div>

          {/* Кнопка отправки - десктопная версия */}
          <div className="hidden sm:block">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                group relative w-full py-4 sm:py-5 px-6 sm:px-8 rounded-2xl sm:rounded-3xl font-bold text-base sm:text-lg
                transition-all duration-300 overflow-hidden
                ${
                  isSubmitting
                    ? 'bg-light-text-muted dark:bg-dark-text-muted border-2 border-light-text-muted dark:border-dark-text-muted cursor-not-allowed text-white'
                    : 'bg-white/80 dark:bg-dark-bg-secondary/80 backdrop-blur-sm border-2 border-primary-orange text-primary-orange hover:border-primary-orange-hover hover:shadow-xl hover:shadow-primary-orange/20 hover:scale-[1.01] active:scale-[0.99]'
                }
                shadow-lg
              `}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Отправка...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform duration-300">✨</span>
                    <span>Опубликовать объявление</span>
                  </>
                )}
              </span>
            </button>
          </div>

          {/* Кнопка отправки - мобильная версия (не sticky) */}
          <div className="block sm:hidden">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                group relative w-full py-4 px-6 rounded-2xl font-bold text-base
                transition-all duration-200 overflow-hidden
                ${
                  isSubmitting
                    ? 'bg-light-text-muted dark:bg-dark-text-muted border-2 border-light-text-muted dark:border-dark-text-muted cursor-not-allowed text-white'
                    : 'bg-white/80 dark:bg-dark-bg-secondary/80 backdrop-blur-sm border-2 border-primary-orange text-primary-orange active:border-primary-orange-hover active:scale-95 shadow-lg'
                }
              `}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Отправка...</span>
                  </>
                ) : (
                  <>
                    <span className="text-xl">✨</span>
                    <span>Опубликовать</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </form>

        {/* Sticky кнопка отправки для мобильных (появляется при скролле) */}
        <div
          className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 p-4 bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-xl border-t border-light-bg-tertiary dark:border-white/10 shadow-2xl transition-all duration-300 ${
            showStickyButton && !isSubmitting
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0 pointer-events-none'
          }`}
        >
          <button
            type="submit"
            form="publish-form"
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
            className="group relative w-full py-4 px-6 rounded-2xl font-bold text-base bg-white/90 dark:bg-dark-bg-secondary/90 backdrop-blur-sm border-2 border-primary-orange text-primary-orange active:border-primary-orange-hover active:scale-95 transition-all duration-200 shadow-xl flex items-center justify-center gap-2 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-xl">✨</span>
              <span>Опубликовать объявление</span>
            </span>
          </button>
        </div>
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
