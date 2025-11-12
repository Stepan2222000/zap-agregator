'use client';

import { useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  total: number;
  errors?: string[] | null;
}

export default function BulkImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.csv')) {
        setError('Пожалуйста, выберите CSV файл');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
      setResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Выберите файл для загрузки');
      return;
    }

    setIsUploading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Токен администратора отсутствует');
      }

      const response = await fetch(`${API_URL}/api/admin/bulk-import`, {
        method: 'POST',
        headers: {
          'X-Admin-Token': token,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || `HTTP ${response.status}`);
      }

      const data: ImportResult = await response.json();
      setResult(data);
      setFile(null);

      // Очищаем input
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке файла');
    } finally {
      setIsUploading(false);
    }
  };

  const downloadSampleCSV = () => {
    const csvContent = `internal_code,canonical_name,description,article_numbers
PART-001,Масляный фильтр Mann W 712/75,Качественный масляный фильтр для различных моделей автомобилей,W712/75:Mann-Filter;W71275:Mann-Filter;WP92875:WIX Filters
PART-002,Воздушный фильтр Bosch F 026 400 201,Воздушный фильтр оригинального качества,F026400201:Bosch;1457433529:Bosch
PART-003,Тормозные колодки ATE 13.0460-7201.2,,13.0460-7201.2:ATE;607201:ATE`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'sample_import.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Массовая загрузка запчастей</h1>
        <p className="mt-1 text-gray-600">
          Загрузите CSV файл для импорта запчастей и артикулов в систему
        </p>
      </div>

      {/* Инструкция */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">Формат CSV файла</h2>
        <div className="space-y-2 text-sm text-blue-800">
          <p>
            <strong>Обязательные колонки:</strong>
          </p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>
              <code className="bg-blue-100 px-2 py-0.5 rounded">internal_code</code> - внутренний
              код запчасти (уникальный)
            </li>
            <li>
              <code className="bg-blue-100 px-2 py-0.5 rounded">canonical_name</code> - название
              запчасти
            </li>
            <li>
              <code className="bg-blue-100 px-2 py-0.5 rounded">description</code> - описание
              (опционально)
            </li>
            <li>
              <code className="bg-blue-100 px-2 py-0.5 rounded">article_numbers</code> - артикулы в
              формате: <code>артикул1:производитель1;артикул2:производитель2</code>
            </li>
          </ul>
          <p className="mt-3">
            <strong>Пример:</strong>{' '}
            <code className="bg-blue-100 px-2 py-0.5 rounded">
              W712/75:Mann-Filter;W71275:Mann-Filter
            </code>
          </p>
          <button
            onClick={downloadSampleCSV}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Скачать пример CSV
          </button>
        </div>
      </div>

      {/* Загрузка файла */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Загрузка файла</h2>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Выберите CSV файл
            </label>
            <input
              id="file-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={isUploading}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && (
              <p className="mt-2 text-sm text-gray-600">
                Выбран файл: <span className="font-medium">{file.name}</span> (
                {(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Загрузка...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Загрузить и импортировать
              </>
            )}
          </button>
        </div>
      </div>

      {/* Ошибка */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <svg
            className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <p className="font-medium text-red-900">Ошибка</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Результат импорта */}
      {result && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Результаты импорта</h2>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-600 font-medium">Импортировано</p>
              <p className="text-3xl font-bold text-green-900 mt-1">{result.imported}</p>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-600 font-medium">Пропущено</p>
              <p className="text-3xl font-bold text-yellow-900 mt-1">{result.skipped}</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium">Всего строк</p>
              <p className="text-3xl font-bold text-blue-900 mt-1">{result.total}</p>
            </div>
          </div>

          {result.errors && result.errors.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                Ошибки и предупреждения ({result.errors.length})
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                <ul className="space-y-1 text-sm text-gray-700">
                  {result.errors.map((err, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{err}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {result.imported > 0 && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">
                ✓ Импорт завершен успешно! Загружено <strong>{result.imported}</strong>{' '}
                {result.imported === 1 ? 'запчасть' : 'запчастей'}.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
