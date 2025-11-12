'use client';

import { useEffect, useState } from 'react';
import { adminApi, AdminListingDetail, PartSearchResult } from '@/lib/api/admin-client';

interface ListingDetailModalProps {
  listingId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function ListingDetailModal({
  listingId,
  isOpen,
  onClose,
}: ListingDetailModalProps) {
  const [listing, setListing] = useState<AdminListingDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // State для привязки запчастей
  const [showPartSearch, setShowPartSearch] = useState(false);
  const [partSearchQuery, setPartSearchQuery] = useState('');
  const [partSearchResults, setPartSearchResults] = useState<PartSearchResult[]>([]);
  const [partSearchLoading, setPartSearchLoading] = useState(false);
  const [showCreatePart, setShowCreatePart] = useState(false);
  const [newPartData, setNewPartData] = useState({
    internal_code: '',
    canonical_name: '',
    description: '',
  });

  // Очистка состояний формы поиска запчастей
  const resetPartSearchState = () => {
    setShowPartSearch(false);
    setPartSearchQuery('');
    setPartSearchResults([]);
    setShowCreatePart(false);
    setNewPartData({ internal_code: '', canonical_name: '', description: '' });
  };

  // Загрузка деталей при открытии
  useEffect(() => {
    if (isOpen && listingId) {
      resetPartSearchState(); // Очищаем форму поиска при открытии
      loadDetails();
    }
  }, [isOpen, listingId]);

  const loadDetails = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await adminApi.getListingDetail(listingId);
      setListing(data);
      setCurrentPhotoIndex(0);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки деталей');
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчики действий модерации
  const handleApprove = async () => {
    if (!confirm('Вы уверены, что хотите одобрить это объявление?')) return;

    setActionLoading(true);
    setError('');

    try {
      await adminApi.approveListing(listingId);
      setSuccessMessage('✓ Объявление одобрено');
      await loadDetails(); // Обновляем данные
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Ошибка одобрения');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Вы уверены, что хотите отклонить это объявление?')) return;

    setActionLoading(true);
    setError('');

    try {
      await adminApi.rejectListing(listingId);
      setSuccessMessage('✓ Объявление отклонено');
      await loadDetails();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Ошибка отклонения');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReprocess = async () => {
    if (!confirm('Отправить объявление на повторную обработку AI?')) return;

    setActionLoading(true);
    setError('');

    try {
      await adminApi.reprocessListing(listingId);
      setSuccessMessage('✓ Отправлено на обработку AI');
      await loadDetails();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Ошибка повторной обработки');
    } finally {
      setActionLoading(false);
    }
  };

  // Обработчики для работы с запчастями
  const handleSearchParts = async () => {
    if (!partSearchQuery.trim()) return;

    setPartSearchLoading(true);
    try {
      const result = await adminApi.searchParts(partSearchQuery, 10);
      setPartSearchResults(result.results);
    } catch (err: any) {
      setError(err.message || 'Ошибка поиска запчастей');
    } finally {
      setPartSearchLoading(false);
    }
  };

  const handleLinkPart = async (partId: string) => {
    if (!confirm('Привязать это объявление к выбранной запчасти?')) return;

    setActionLoading(true);
    setError('');

    try {
      await adminApi.linkListingToPart(listingId, partId);
      setSuccessMessage('✓ Объявление привязано к запчасти');
      setShowPartSearch(false);
      setPartSearchQuery('');
      setPartSearchResults([]);
      await loadDetails();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Ошибка привязки запчасти');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreatePart = async () => {
    if (!newPartData.internal_code || !newPartData.canonical_name) {
      setError('Заполните обязательные поля');
      return;
    }

    setActionLoading(true);
    setError('');

    try {
      const newPart = await adminApi.createPart(newPartData);
      setSuccessMessage('✓ Запчасть создана');

      // Привязываем созданную запчасть
      await adminApi.linkListingToPart(listingId, newPart.id);
      setSuccessMessage('✓ Объявление привязано к новой запчасти');

      setShowCreatePart(false);
      setShowPartSearch(false);
      setNewPartData({ internal_code: '', canonical_name: '', description: '' });
      await loadDetails();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Ошибка создания запчасти');
    } finally {
      setActionLoading(false);
    }
  };

  if (!isOpen) return null;

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Форматирование цены
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      processing: { label: 'В обработке AI', color: 'bg-blue-100 text-blue-700' },
      pending: { label: 'На модерации', color: 'bg-yellow-100 text-yellow-700' },
      approved: { label: 'Одобрено', color: 'bg-green-100 text-green-700' },
      rejected: { label: 'Отклонено', color: 'bg-red-100 text-red-700' },
    };
    const config = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-700' };
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-start justify-center p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Заголовок */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Детали объявления</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Контент */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <p className="text-gray-600">Загрузка...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {listing && !isLoading && !error && (
            <div className="space-y-6">
              {/* Основная информация */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {listing.ai_processed_title || listing.article_number}
                    </h3>
                    <p className="text-sm text-gray-600">ID: {listing.id}</p>
                  </div>
                  {getStatusBadge(listing.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Артикул</p>
                    <p className="text-lg font-semibold text-gray-900">{listing.article_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Марка</p>
                    <p className="text-lg font-semibold text-gray-900">{listing.brand}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Цена</p>
                    <p className="text-lg font-semibold text-gray-900">{formatPrice(listing.price)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Состояние</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {listing.condition === 'new' ? 'Новое' : 'Б/У'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Фотогалерея */}
              {listing.photos && listing.photos.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Фотографии ({listing.photos.length})</h4>
                  <div className="bg-gray-100 rounded-xl overflow-hidden">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/${listing.photos[currentPhotoIndex].file_path}`}
                      alt={`Фото ${currentPhotoIndex + 1}`}
                      className="w-full h-96 object-contain"
                    />
                    {listing.photos.length > 1 && (
                      <div className="flex items-center justify-center gap-2 p-4 bg-white">
                        <button
                          onClick={() => setCurrentPhotoIndex((i) => Math.max(0, i - 1))}
                          disabled={currentPhotoIndex === 0}
                          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                        >
                          ←
                        </button>
                        <span className="text-sm text-gray-600">
                          {currentPhotoIndex + 1} / {listing.photos.length}
                        </span>
                        <button
                          onClick={() => setCurrentPhotoIndex((i) => Math.min(listing.photos.length - 1, i + 1))}
                          disabled={currentPhotoIndex === listing.photos.length - 1}
                          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50"
                        >
                          →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Описание пользователя */}
              {listing.description && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Описание от продавца</h4>
                  <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{listing.description}</p>
                </div>
              )}

              {/* AI обработка */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">AI обработка</h4>
                {listing.ai_error_message ? (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-red-900 mb-1">⚠ AI не смог обработать</p>
                    <p className="text-sm text-red-700">{listing.ai_error_message}</p>
                  </div>
                ) : listing.ai_processed_description ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-green-900 mb-2">✓ AI обработка завершена</p>
                    <p className="text-gray-700">{listing.ai_processed_description}</p>
                  </div>
                ) : (
                  <p className="text-gray-600 italic">AI обработка еще не выполнена</p>
                )}
              </div>

              {/* Привязка к запчасти */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">Привязка к запчасти</h4>
                  {!showPartSearch && (
                    <button
                      onClick={() => setShowPartSearch(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      disabled={actionLoading}
                    >
                      {listing.part_id ? 'Изменить' : 'Привязать'}
                    </button>
                  )}
                </div>

                {listing.part_id ? (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-blue-900 mb-1">✓ Привязано к запчасти</p>
                    <p className="text-sm text-blue-700">
                      {listing.part_name || listing.part_id}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-600 italic">Запчасть еще не привязана</p>
                )}

                {/* Форма поиска/создания запчасти */}
                {showPartSearch && (
                  <div className="mt-4 bg-gray-50 rounded-lg p-4 space-y-4">
                    {!showCreatePart ? (
                      <>
                        {/* Поиск существующих запчастей */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Поиск запчасти
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={partSearchQuery}
                              onChange={(e) => setPartSearchQuery(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleSearchParts()}
                              placeholder="Введите код или название..."
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={partSearchLoading || actionLoading}
                            />
                            <button
                              onClick={handleSearchParts}
                              disabled={partSearchLoading || actionLoading || !partSearchQuery.trim()}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {partSearchLoading ? 'Поиск...' : 'Найти'}
                            </button>
                          </div>
                        </div>

                        {/* Результаты поиска */}
                        {partSearchResults.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">
                              Найдено: {partSearchResults.length}
                            </p>
                            {partSearchResults.map((part) => (
                              <div
                                key={part.id}
                                className="bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-500 transition-colors"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900">{part.internal_code}</p>
                                    <p className="text-sm text-gray-600">{part.canonical_name}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      Артикулов: {part.article_count} | Объявлений: {part.listing_count}
                                    </p>
                                  </div>
                                  <button
                                    onClick={() => handleLinkPart(part.id)}
                                    disabled={actionLoading}
                                    className="ml-4 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                  >
                                    Привязать
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex gap-2">
                          <button
                            onClick={() => setShowCreatePart(true)}
                            className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                            disabled={actionLoading}
                          >
                            + Создать новую запчасть
                          </button>
                          <button
                            onClick={() => {
                              setShowPartSearch(false);
                              setPartSearchQuery('');
                              setPartSearchResults([]);
                            }}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                            disabled={actionLoading}
                          >
                            Отмена
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Форма создания новой запчасти */}
                        <div className="space-y-3">
                          <h5 className="font-medium text-gray-900">Создать новую запчасть</h5>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Внутренний код <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newPartData.internal_code}
                              onChange={(e) =>
                                setNewPartData({ ...newPartData, internal_code: e.target.value })
                              }
                              placeholder="Например: PART-12345"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={actionLoading}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Каноническое название <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newPartData.canonical_name}
                              onChange={(e) =>
                                setNewPartData({ ...newPartData, canonical_name: e.target.value })
                              }
                              placeholder="Например: Масляный фильтр Mann W 712/75"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={actionLoading}
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Описание (опционально)
                            </label>
                            <textarea
                              value={newPartData.description}
                              onChange={(e) =>
                                setNewPartData({ ...newPartData, description: e.target.value })
                              }
                              placeholder="Дополнительная информация о запчасти..."
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              disabled={actionLoading}
                            />
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={handleCreatePart}
                              disabled={
                                actionLoading ||
                                !newPartData.internal_code ||
                                !newPartData.canonical_name
                              }
                              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Создать и привязать
                            </button>
                            <button
                              onClick={() => {
                                setShowCreatePart(false);
                                setNewPartData({ internal_code: '', canonical_name: '', description: '' });
                              }}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                              disabled={actionLoading}
                            >
                              Назад
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Контактные данные */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Контактная информация</h4>
                <div className="space-y-2">
                  <a
                    href={`tel:${listing.contact_phone}`}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    📞 {listing.contact_phone}
                  </a>
                  {listing.contact_whatsapp && (
                    <a
                      href={`https://wa.me/${listing.contact_whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-600 hover:text-green-700"
                    >
                      💬 WhatsApp: {listing.contact_whatsapp}
                    </a>
                  )}
                  {listing.contact_telegram && (
                    <a
                      href={`https://t.me/${listing.contact_telegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                    >
                      ✈ Telegram: @{listing.contact_telegram}
                    </a>
                  )}
                </div>
              </div>

              {/* История модерации */}
              {listing.moderation_history && listing.moderation_history.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">История модерации</h4>
                  <div className="space-y-2">
                    {listing.moderation_history.map((action) => (
                      <div key={action.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{action.action}</p>
                          {action.moderator_note && (
                            <p className="text-sm text-gray-600 mt-1">{action.moderator_note}</p>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{formatDate(action.created_at)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Метаданные */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Создано:</span> {formatDate(listing.created_at)}
                </div>
                <div>
                  <span className="font-medium">Обновлено:</span> {formatDate(listing.updated_at)}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Футер с действиями */}
        <div className="px-6 py-4 border-t border-gray-200">
          {/* Success сообщение */}
          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-green-800 text-sm">
              {successMessage}
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {/* Кнопка повторной обработки AI - доступна всегда */}
              <button
                onClick={handleReprocess}
                disabled={actionLoading}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Повторить AI
              </button>
            </div>

            <div className="flex gap-2">
              {/* Кнопки одобрения/отклонения - только для статуса pending */}
              {listing && listing.status === 'pending' && (
                <>
                  <button
                    onClick={handleReject}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Отклонить
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Одобрить
                  </button>
                </>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
