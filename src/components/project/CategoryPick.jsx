import { useState, useEffect, useRef } from 'react';
import * as Icon from '../ui/Icons';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

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

  useEffect(() => {
    if (isOpen) {
      setTempSelection(selectedCategories);
    }
  }, [isOpen, selectedCategories]);

  useEffect(() => {
    if (!isOpen) return;

    if (externalCategories?.length > 0) {
      setCategories(externalCategories);
      return;
    }

    if (categoriesCache?.length > 0) {
      setCategories(categoriesCache);
      return;
    }

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

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

        categoriesCache = list;
        setCategories(list);
        setLoading(false);
      } catch (err) {
        clearTimeout(timeoutId);

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

  if (!isOpen) return null;

  const toggle = (id) => {
    setTempSelection((prev) => {
      if (prev.includes(id)) {
        return prev.filter((x) => x !== id);
      }
      if (maxSelection && prev.length >= maxSelection) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleConfirm = () => {
    onConfirm(tempSelection);
    onClose();
  };

  const handleCancel = () => {
    setTempSelection(selectedCategories);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/70 backdrop-blur-sm"
      onClick={handleCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-lg bg-surface border border-accent/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-accent/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-text">Kategori Seç</h2>
            {maxSelection && (
              <p className="text-xs text-text-muted mt-0.5 font-mono">
                En fazla {maxSelection} kategori · {tempSelection.length} seçili
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-bg transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <Icon.Close className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading && (
            <div className="text-center py-10 text-sm text-text-muted font-mono">
              Kategoriler yükleniyor...
            </div>
          )}

          {error && !loading && (
            <div className="text-center py-10">
              <Icon.Warning className="w-10 h-10 text-text-muted mx-auto mb-2" />
              <p className="text-sm text-red-400 mb-1">{error}</p>
              <p className="text-xs text-text-muted">
                Backend'in çalıştığından emin ol.
              </p>
            </div>
          )}

          {!loading && !error && categories.length === 0 && (
            <div className="text-center py-10 text-sm text-text-muted">
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
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed font-mono ${
                      isSelected
                        ? 'bg-accent text-bg border-accent'
                        : 'bg-bg text-text-muted border-accent/15 hover:border-accent/40 hover:text-text'
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
        <div className="px-6 py-4 border-t border-accent/10 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 text-sm font-semibold text-text bg-transparent border border-accent/20 rounded-lg hover:bg-bg transition-colors cursor-pointer"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-bg bg-accent rounded-lg hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Onayla ({tempSelection.length})
          </button>
        </div>
      </div>
    </div>
  );
}