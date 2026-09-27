import { useState, useEffect, useRef } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Basit in-memory cache — aynı oturumda tekrar fetch etmesin
let categoriesCache = null;

export default function CategoryPick({
  isOpen,
  onClose,
  onConfirm,
  categories: externalCategories,
  selectedCategories = [],
  maxSelection,
}) {
  const [categories, setCategories] = useState(
    externalCategories?.length ? externalCategories : categoriesCache || []
  );
  const [tempSelection, setTempSelection] = useState(selectedCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef(null);

  // Modal açıldığında seçimi senkronize et
  useEffect(() => {
    if (isOpen) {
      setTempSelection(selectedCategories);
    }
  }, [isOpen, selectedCategories]);

  // ✅ Kategorileri sadece GEREKTİĞİNDE fetch et
  useEffect(() => {
    if (!isOpen) return;

    // Dışarıdan kategoriler geldiyse fetch etme
    if (externalCategories?.length > 0) {
      setCategories(externalCategories);
      return;
    }

    // Cache varsa fetch etme
    if (categoriesCache?.length > 0) {
      setCategories(categoriesCache);
      return;
    }

    // ✅ Önceki isteği iptal et
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    // ✅ 5 saniye timeout — backend kapalıysa sonsuza kadar bekleme
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 5000);

    const fetchCategories = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`${API}/api/categories`, {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error('Kategoriler yüklenemedi');
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : [];

        categoriesCache = list; // ✅ Cache'e kaydet
        setCategories(list);
        setLoading(false);
      } catch (err) {
        clearTimeout(timeoutId);

        // ✅ AbortError'ı sessizce yut — StrictMode/cleanup normal
        if (err.name === 'AbortError') {
          return;
        }

        setError('Kategoriler yüklenemedi. Backend çalışıyor mu?');
        setCategories([]);
        setLoading(false);
      }
    };

    fetchCategories();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [isOpen, externalCategories]);

  // Modal kapalıysa hiçbir şey render etme
  if (!isOpen) return null;

  const toggle = (id) => {
    setTempSelection((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (maxSelection && prev.length >= maxSelection) {
        return prev; // sınırı aşma
      }
      return [...prev, id];
    });
  };

  const handleConfirm = () => {
    onConfirm(tempSelection);
    onClose();
  };

  const handleCancel = () => {
    setTempSelection(selectedCategories); // değişiklikleri iptal et
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-black">Kategori Seç</h2>
            {maxSelection && (
              <p className="text-xs text-gray-500 mt-0.5">
                En fazla {maxSelection} kategori · {tempSelection.length} seçili
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && (
            <div className="text-center py-10 text-sm text-gray-500">
              Kategoriler yükleniyor...
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-10">
              <div className="text-4xl mb-2">⚠️</div>
              <p className="text-sm text-red-500 mb-1">{error}</p>
              <p className="text-xs text-gray-400">
                Backend'in çalıştığından emin ol.
              </p>
            </div>
          )}

          {!loading && !error && categories.length === 0 && (
            <div className="text-center py-10 text-sm text-gray-500">
              Kategori bulunamadı.
            </div>
          )}

          {!loading && !error && categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = tempSelection.includes(cat.id);
                const isDisabled =
                  !isSelected && maxSelection && tempSelection.length >= maxSelection;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggle(cat.id)}
                    disabled={isDisabled}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      isSelected
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Onayla ({tempSelection.length})
          </button>
        </div>
      </div>
    </div>
  );
}