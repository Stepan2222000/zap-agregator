'use client';

import { useEffect, useState } from 'react';
import { adminApi, AdminListingPreview } from '@/lib/api/admin-client';
import ListingDetailModal from '@/components/admin/ListingDetailModal';

// Типы статусов
const STATUS_CONFIG = {
  processing: { label: 'В обработке AI', color: 'blue' },
  pending: { label: 'На модерации', color: 'yellow' },
  approved: { label: 'Одобрено', color: 'green' },
  rejected: { label: 'Отклонено', color: 'red' },
};

export default function AdminDashboard() {
  const [listings, setListings] = useState<AdminListingPreview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Фильтры и пагинация
  const [currentStatus, setCurrentStatus] = useState<string | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);

  // Modal детального просмотра
  const [selectedListingId, setSelectedListingId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Статистика по статусам
  const [stats, setStats] = useState<Record<string, number>>({
    processing: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Загрузка статистики
  const loadStats = async () => {
    try {
      const data = await adminApi.getStats();
      setStats(data.stats_by_status);
    } catch (err) {
      console.error('Ошибка загрузки статистики:', err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // Загрузка объявлений
  const loadListings = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await adminApi.getListings({
        status: currentStatus,
        page: currentPage,
        limit: 20,
      });

      setListings(data.items);
      setTotalPages(data.pages);
      setTotal(data.total);
    } catch (err: any) {
      setError(err.message || 'Ошибка загрузки объявлений');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, [currentStatus, currentPage]);

  // Обработчик смены статуса
  const handleStatusChange = (status: string | undefined) => {
    setCurrentStatus(status);
    setCurrentPage(1); // Сбрасываем на первую страницу
  };

  // Обработчик закрытия модала - перезагружаем данные
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedListingId(null);
    // Перезагружаем список и статистику после модерации
    loadListings();
    loadStats();
  };

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

  // Получить цвет бейджа статуса
  const getStatusBadgeClass = (status: string) => {
    const colorMap = {
      processing: 'bg-blue-100 text-blue-700',
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    };
    return colorMap[status as keyof typeof colorMap] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Модерация объявлений</h1>
        <p className="mt-1 text-gray-600">Управление всеми объявлениями на платформе</p>
      </div>

      {/* Вкладки статусов */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleStatusChange(undefined)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              currentStatus === undefined
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Все <span className="ml-1 text-xs opacity-75">({stats.processing + stats.pending + stats.approved + stats.rejected})</span>
          </button>

          {Object.entries(STATUS_CONFIG).map(([status, config]) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentStatus === status
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {config.label} <span className="ml-1 text-xs opacity-75">({stats[status] || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Заголовок таблицы */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {currentStatus
              ? STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG].label
              : 'Все объявления'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">Найдено: {total} объявлений</p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Загрузка...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium text-red-900">Ошибка загрузки</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && listings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Нет объявлений</h3>
            <p className="text-gray-600">
              {currentStatus
                ? `Объявлений со статусом "${STATUS_CONFIG[currentStatus as keyof typeof STATUS_CONFIG].label}" не найдено`
                : 'Пока нет объявлений в системе'}
            </p>
          </div>
        )}

        {/* Таблица */}
        {!isLoading && !error && listings.length > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Артикул
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Марка
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Цена
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата создания
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {listings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                        {listing.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {listing.article_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {listing.brand}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {formatPrice(listing.price)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(listing.status)}`}>
                          {STATUS_CONFIG[listing.status as keyof typeof STATUS_CONFIG]?.label || listing.status}
                        </span>
                        {listing.ai_error_message && (
                          <span className="ml-2 text-xs text-red-600" title={listing.ai_error_message}>
                            ⚠ AI ошибка
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(listing.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <button
                          onClick={() => {
                            setSelectedListingId(listing.id);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                        >
                          Посмотреть →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Страница {currentPage} из {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ← Назад
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Вперед →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal детального просмотра */}
      {selectedListingId && (
        <ListingDetailModal
          listingId={selectedListingId}
          isOpen={isModalOpen}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
