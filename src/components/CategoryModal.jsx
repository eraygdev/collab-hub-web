import { useState, useEffect, useMemo } from 'react';

export default function CategoryModal({
  isOpen,
  onClose,
  onConfirm,
  categories,
  selectedCategories,
}) {
  const [search, setSearch] = useState('');
  const [localSelected, setLocalSelected] = useState([]);

  // Modal açıldığında gerçek seçimleri local'e kopyala
  useEffect(() => {
    if (isOpen) {
      setLocalSelected(selectedCategories);
    }
  }, [isOpen, selectedCategories]);

  // Body scroll kilitle + Esc ile kapat (Esc = iptal)
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Modal kapanınca aramayı temizle
  useEffect(() => {
    if (!isOpen) setSearch('');
  }, [isOpen]);

  // Arama filtresi
  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return categories;
    return categories.filter((c) => c.toLowerCase().includes(term));
  }, [categories, search]);

  // Local'de toggle (Home'u etkilemez)
  const toggleLocal = (cat) => {
    setLocalSelected((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // Tamam'a basınca gerçek state'e aktar
  const handleConfirm = () => {
    onConfirm(localSelected);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Karanlık arka plan */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        aria-hidden="true"
      />

      {/* Modal kutusu */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >

          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-black">Kategoriler</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {localSelected.length > 0
                  ? `${localSelected.length} kategori seçili`
                  : 'Filtrelemek için kategori seç'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Arama */}
          <div className="p-5 pb-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Kategori ara..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-300 transition-all"
              />
            </div>
          </div>

          {/* Kategori listesi */}
          <div className="flex-1 overflow-y-auto p-5 pt-2">
            {filtered.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {filtered.map((cat) => {
                  const isSelected = localSelected.includes(cat);
                  return (
                    <button
                      key={cat}
                      onClick={() => toggleLocal(cat)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-8">
                "{search}" için kategori bulunamadı.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 flex items-center justify-between gap-3">
            <button
              onClick={() => setLocalSelected([])}
              className="text-xs text-gray-500 hover:text-black underline transition-colors cursor-pointer"
            >
              Seçimi temizle
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-sm font-semibold bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                İptal
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2.5 text-sm font-semibold bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Tamam
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}