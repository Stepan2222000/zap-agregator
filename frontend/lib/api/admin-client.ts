/**
 * API клиент для админских запросов
 * Автоматически добавляет токен администратора в headers
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Получить токен администратора из localStorage
 */
function getAdminToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('adminToken');
}

/**
 * Базовая функция для выполнения запросов к API с токеном
 */
async function adminFetch(endpoint: string, options: RequestInit = {}) {
  const token = getAdminToken();

  if (!token) {
    throw new Error('Токен администратора отсутствует');
  }

  const headers = {
    'Content-Type': 'application/json',
    'X-Admin-Token': token,
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Если токен невалиден, удаляем его и редиректим на логин
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
      }
      throw new Error('Неверный токен администратора');
    }

    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Типы данных
 */
export interface AdminListingPreview {
  id: string;
  article_number: string;
  brand: string;
  price: number;
  status: string;
  created_at: string;
  ai_error_message?: string | null;
}

export interface AdminListingsResponse {
  items: AdminListingPreview[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface Photo {
  id: string;
  filename: string;
  file_path: string;
  order: number;
  created_at: string;
}

export interface ModerationAction {
  id: string;
  action: string;
  moderator_note?: string | null;
  created_at: string;
}

export interface AdminListingDetail {
  id: string;
  article_number: string;
  brand: string;
  condition: string;
  price: number;
  description?: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  contact_phone: string;
  contact_whatsapp?: string | null;
  contact_telegram?: string | null;
  ai_processed_title?: string | null;
  ai_processed_description?: string | null;
  ai_error_message?: string | null;
  photos: Photo[];
  part_id?: string | null;
  part_name?: string | null;
  moderation_history: ModerationAction[];
}

/**
 * Типы для работы с запчастями (Parts)
 */

export interface ArticleNumber {
  id: string;
  article_number: string;
  manufacturer?: string | null;
  created_at: string;
}

export interface Part {
  id: string;
  internal_code: string;
  canonical_name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PartWithArticles extends Part {
  article_numbers: ArticleNumber[];
}

export interface PartSearchResult extends Part {
  article_count: number;
  listing_count: number;
}

/**
 * API методы для админки
 */
export const adminApi = {
  /**
   * Получить список объявлений с фильтрацией и пагинацией
   */
  async getListings(params: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<AdminListingsResponse> {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const query = queryParams.toString();
    return adminFetch(`/api/admin/listings${query ? `?${query}` : ''}`);
  },

  /**
   * Получить детальную информацию об объявлении
   */
  async getListingDetail(listingId: string): Promise<AdminListingDetail> {
    return adminFetch(`/api/admin/listings/${listingId}`);
  },

  /**
   * Получить статистику по статусам
   */
  async getStats(): Promise<{
    stats_by_status: Record<string, number>;
    total: number;
  }> {
    return adminFetch('/api/admin/stats');
  },

  /**
   * Одобрить объявление
   */
  async approveListing(listingId: string, moderatorNote?: string): Promise<{
    success: boolean;
    message: string;
    listing_id: string;
  }> {
    return adminFetch(`/api/admin/listings/${listingId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ moderator_note: moderatorNote }),
    });
  },

  /**
   * Отклонить объявление
   */
  async rejectListing(listingId: string, moderatorNote?: string): Promise<{
    success: boolean;
    message: string;
    listing_id: string;
  }> {
    return adminFetch(`/api/admin/listings/${listingId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ moderator_note: moderatorNote }),
    });
  },

  /**
   * Отправить объявление на повторную обработку AI
   */
  async reprocessListing(listingId: string): Promise<{
    success: boolean;
    message: string;
    listing_id: string;
  }> {
    return adminFetch(`/api/admin/listings/${listingId}/reprocess`, {
      method: 'POST',
    });
  },

  // ============================================================
  // Методы для работы с запчастями (Parts)
  // ============================================================

  /**
   * Создать новую запчасть
   */
  async createPart(data: {
    internal_code: string;
    canonical_name: string;
    description?: string;
  }): Promise<Part> {
    return adminFetch('/api/admin/parts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Поиск запчастей по запросу
   */
  async searchParts(query: string, limit?: number): Promise<{
    results: PartSearchResult[];
    total: number;
  }> {
    const params = new URLSearchParams({ q: query });
    if (limit) params.append('limit', limit.toString());

    return adminFetch(`/api/admin/parts/search?${params.toString()}`);
  },

  /**
   * Получить детальную информацию о запчасти
   */
  async getPartDetail(partId: string): Promise<PartWithArticles> {
    return adminFetch(`/api/admin/parts/${partId}`);
  },

  /**
   * Добавить артикул к запчасти
   */
  async addArticleNumber(
    partId: string,
    data: { article_number: string; manufacturer?: string }
  ): Promise<ArticleNumber> {
    return adminFetch(`/api/admin/parts/${partId}/articles`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Привязать объявление к запчасти
   */
  async linkListingToPart(listingId: string, partId: string): Promise<{
    success: boolean;
    message: string;
    listing_id: string;
    part_id: string;
  }> {
    return adminFetch(`/api/admin/listings/${listingId}/link-part`, {
      method: 'PUT',
      body: JSON.stringify({ part_id: partId }),
    });
  },
};
