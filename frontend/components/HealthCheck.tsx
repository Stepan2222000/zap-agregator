'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

interface HealthStatus {
  status: string;
  timestamp: string;
  database: string;
}

export default function HealthCheck() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await apiClient.get<HealthStatus>('/api/health');
        setHealth(data);
        setError(null);
      } catch (err) {
        setError('Не удалось подключиться к API');
        console.error('Health check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
  }, []);

  if (loading) {
    return (
      <div className="p-4 bg-gray-800 text-gray-300 rounded">
        <p>Проверка подключения к API...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900/50 border border-red-700 text-red-200 rounded">
        <p className="font-bold">Ошибка подключения</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-900/50 border border-green-700 text-green-200 rounded">
      <p className="font-bold">✅ API доступен</p>
      {health && (
        <div className="mt-2 text-sm">
          <p>Статус: {health.status}</p>
          <p>База данных: {health.database}</p>
          <p>Время: {new Date(health.timestamp).toLocaleString('ru-RU')}</p>
        </div>
      )}
    </div>
  );
}
