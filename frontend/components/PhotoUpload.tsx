'use client'

import { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react'
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface PhotoUploadProps {
  onPhotosChange: (photos: File[]) => void
  maxPhotos?: number
  maxFileSize?: number // в байтах
}

export default function PhotoUpload({
  onPhotosChange,
  maxPhotos = 10,
  maxFileSize = 5 * 1024 * 1024, // 5MB по умолчанию
}: PhotoUploadProps) {
  const [photos, setPhotos] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

  // Cleanup previews при размонтировании компонента (защита от memory leak)
  useEffect(() => {
    return () => {
      previews.forEach((preview) => {
        try {
          URL.revokeObjectURL(preview)
        } catch (e) {
          // Ignore - URL уже был revoked или невалиден
        }
      })
    }
  }, [previews])

  // Валидация файла
  const validateFile = (file: File): string | null => {
    // Проверка типа
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Неподдерживаемый формат файла: ${file.name}. Разрешены: JPEG, PNG, WebP`
    }

    // Проверка размера
    if (file.size > maxFileSize) {
      return `Файл ${file.name} слишком большой (${(file.size / 1024 / 1024).toFixed(2)}MB). Максимум ${maxFileSize / 1024 / 1024}MB`
    }

    return null
  }

  // Обработка добавления файлов
  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return

    setError(null)
    const newFiles = Array.from(fileList)

    // Проверка количества
    if (photos.length + newFiles.length > maxPhotos) {
      setError(`Максимум ${maxPhotos} фотографий`)
      return
    }

    // Валидация каждого файла
    for (const file of newFiles) {
      const validationError = validateFile(file)
      if (validationError) {
        setError(validationError)
        return
      }
    }

    // Создание превью
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file))

    const updatedPhotos = [...photos, ...newFiles]
    const updatedPreviews = [...previews, ...newPreviews]

    setPhotos(updatedPhotos)
    setPreviews(updatedPreviews)
    onPhotosChange(updatedPhotos)
  }

  // Обработка drag-and-drop
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    handleFiles(files)
  }

  // Обработка выбора через input
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
  }

  // Клик по зоне загрузки
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  // Удаление фото
  const handleRemovePhoto = (index: number) => {
    // Освобождаем URL для предотвращения утечек памяти
    URL.revokeObjectURL(previews[index])

    const updatedPhotos = photos.filter((_, i) => i !== index)
    const updatedPreviews = previews.filter((_, i) => i !== index)

    setPhotos(updatedPhotos)
    setPreviews(updatedPreviews)
    onPhotosChange(updatedPhotos)
    setError(null)
  }

  return (
    <div className="space-y-4">
      {/* Drag-and-drop зона */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-lg p-8
          transition-all duration-200 cursor-pointer
          ${
            isDragging
              ? 'border-primary-orange bg-primary-orange/10 scale-[1.02]'
              : 'border-light-text-muted dark:border-dark-text-muted hover:border-primary-orange'
          }
          ${photos.length >= maxPhotos ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleInputChange}
          className="hidden"
          disabled={photos.length >= maxPhotos}
        />

        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <PhotoIcon
            className={`w-12 h-12 ${
              isDragging
                ? 'text-primary-orange'
                : 'text-light-text-muted dark:text-dark-text-muted'
            }`}
          />

          <div>
            <p className="text-base font-medium text-light-text-primary dark:text-dark-text-primary">
              Перетащите фотографии сюда
            </p>
            <p className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
              или нажмите, чтобы выбрать
            </p>
          </div>

          <p className="text-xs text-light-text-muted dark:text-dark-text-muted">
            JPEG, PNG, WebP • До {maxPhotos} фото • Максимум {maxFileSize / 1024 / 1024}MB каждое
          </p>
        </div>
      </div>

      {/* Сообщение об ошибке */}
      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Превью загруженных фото */}
      {photos.length > 0 && (
        <div>
          <p className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary mb-3">
            Загружено фото: {photos.length} из {maxPhotos}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {previews.map((preview, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden bg-light-bg-secondary dark:bg-dark-bg-secondary group"
              >
                {/* Изображение */}
                <img
                  src={preview}
                  alt={`Фото ${index + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Оверлей с кнопкой удаления */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(index)}
                    className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-colors"
                    aria-label={`Удалить фото ${index + 1}`}
                  >
                    <XMarkIcon className="w-6 h-6 text-white" />
                  </button>
                </div>

                {/* Номер фото */}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
