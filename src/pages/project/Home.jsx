import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../../components/project/ProjectCard';
import CategoryModal from '../../components/project/CategoryPick';
import CharWarning from '../../components/ui/CharWarning';
import { SEARCH_LIMITS } from '../../constants/limits';
import { TEXT_REGEX, findInvalidChar } from '../../utils/validators';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const LIMIT = 20;
const VISIBLE_LIMIT = 12;

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [searchInput, setSearchInput] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [searchWarning, setSearchWarning] = useState('');

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matchMode, setMatchMode] = useState('or');

  const [allCategories, setAllCategories] = useState([]);

  const categoryKey = useMemo(
    () => [...selectedCategories].sort().join(','),
    [selectedCategories]
  );

  // ✅ Kategoriler için de abort
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    fetch(`${API}/api/categories`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        clearTimeout(timeoutId);
        if (Array.isArray(data)) setAllCategories(data);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        if (err.name === 'AbortError') return;
        setAllCategories([]);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  const fetchProjects = useCallback(
    async (searchValue, categoryIds, mode, offsetValue, signal) => {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({ limit: LIMIT, offset: offsetValue });
      if (searchValue) params.set('search', searchValue);
      if (categoryIds.length > 0) {
        params.set('categoryIds', categoryIds.join(','));
        params.set('mode', mode);
      }

      const res = await fetch(`${API}/api/projects?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        signal,
      });

      if (!res.ok) {
        const text = await res.text();
        let data = {};
        try { data = JSON.parse(text); } catch {}
        throw new Error(data.error || 'Projeler yüklenemedi');
      }

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    []
  );

  // ✅ Ana fetch effect — abort + timeout
  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10sn timeout

    const load = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const categoryIds = categoryKey ? categoryKey.split(',') : [];
        const data = await fetchProjects(
          activeSearch,
          categoryIds,
          matchMode,
          0,
          controller.signal
        );
        clearTimeout(timeoutId);
        setProjects(data);
        setHasMore(data.length === LIMIT);
        setLoading(false);
      } catch (err) {
        clearTimeout(timeoutId);
        // ✅ AbortError'ı sessizce geç
        if (err.name === 'AbortError') {
          return;
        }
        // ✅ Sadece gerçek hatayı göster
        setLoadError(err.message);
        setLoading(false);
      }
    };

    load();

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [activeSearch, categoryKey, matchMode, fetchProjects]);

  // ... geri kalan handler'lar aynı
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      const data = await fetchProjects(
        activeSearch,
        selectedCategories,
        matchMode,
        projects.length
      );
      setProjects((prev) => [...prev, ...data]);
      setHasMore(data.length === LIMIT);
    } catch {
      // sessizce geç
    } finally {
      setLoadingMore(false);
    }
  };

  const showSearchWarning = (char) => {
    setSearchWarning(char);
    setTimeout(() => setSearchWarning(''), 3000);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setSearchInput('');
      setSearchWarning('');
      return;
    }
    if (!TEXT_REGEX.test(value)) {
      const bad = findInvalidChar(value, TEXT_REGEX);
      if (bad) showSearchWarning(bad);
      return;
    }
    if (value.length > SEARCH_LIMITS.maxLength) return;
    setSearchInput(value);
    setSearchWarning('');
  };

  const handleSearch = () => setActiveSearch(searchInput.trim());
  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };
  const handleClearSearch = () => {
    setSearchInput('');
    setActiveSearch('');
    setSearchWarning('');
  };

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSearchInput('');
    setActiveSearch('');
    setSearchWarning('');
    setSelectedCategories([]);
    setMatchMode('or');
  };

  const hasActiveFilters =
    activeSearch.trim() !== '' || selectedCategories.length > 0;

  return (
    <div className="w-full">
      {/* HERO */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">
            Fikirlerini paylaş, ekibini kur.
          </h1>
          <p className="mt-3 text-base text-gray-500 max-w-xl">
            Açık kaynak projeleri keşfet, katkıda bulun veya kendi projeni yayınla.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/create-project" className="px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">
              Proje Oluştur
            </Link>
            <Link to="/dashboard" className="px-5 py-2.5 bg-white text-gray-900 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* KEŞFET */}
      <div className="w-full px-4 sm:px-6 lg:px-8 pt-10 pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div className="shrink-0">
              <h2 className="text-2xl font-bold text-black tracking-tight">Keşfet</h2>
              <p className="text-sm text-gray-500 mt-1">
                Topluluk tarafından oluşturulan en son projeleri inceleyin ve katılın.
              </p>
            </div>

            <div className="w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 lg:w-64">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                    </svg>
                  </span>
                  <input
                    type="text"
                    value={searchInput}
                    onChange={handleSearchInputChange}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Proje ara..."
                    maxLength={SEARCH_LIMITS.maxLength}
                    className={`w-full pl-10 pr-9 py-2.5 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all ${
                      searchWarning ? 'border-amber-400' : 'border-gray-200 focus:border-gray-300'
                    }`}
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-black transition-colors cursor-pointer"
                      aria-label="Aramayı temizle"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  className="px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
                >
                  Ara
                </button>
              </div>
              <CharWarning char={searchWarning} />
            </div>
          </div>

          {allCategories.length > 0 && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategories([])}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                    selectedCategories.length === 0
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  Tümü
                </button>
                {allCategories.slice(0, VISIBLE_LIMIT).map((cat) => {
                  const isSelected = selectedCategories.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.id)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
                        isSelected
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
                {allCategories.length > VISIBLE_LIMIT && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-3 py-1.5 text-xs font-medium rounded-full border border-dashed border-gray-300 text-gray-600 hover:border-gray-500 hover:text-black transition-colors cursor-pointer"
                  >
                    +{allCategories.length - VISIBLE_LIMIT} daha
                  </button>
                )}
              </div>
            </div>
          )}

          {selectedCategories.length > 1 && (
            <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-500">Eşleşme:</span>
              <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
                <button
                  onClick={() => setMatchMode('or')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    matchMode === 'or' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  Herhangi biri
                </button>
                <button
                  onClick={() => setMatchMode('and')}
                  className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                    matchMode === 'and' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'
                  }`}
                >
                  Hepsi
                </button>
              </div>
              <span className="text-gray-400">
                {matchMode === 'and'
                  ? '· seçili kategorilerin tümü olmalı'
                  : '· seçili kategorilerden en az biri olmalı'}
              </span>
            </div>
          )}

          {hasActiveFilters && !loading && (
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs text-gray-500">
                {projects.length} proje gösteriliyor
                {selectedCategories.length > 0 && <> · {selectedCategories.length} kategori seçili</>}
              </p>
              <button
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-black underline transition-colors cursor-pointer"
              >
                Filtreleri temizle
              </button>
            </div>
          )}

          {loading && (
            <div className="text-center py-20 text-sm text-gray-500">
              Projeler yükleniyor...
            </div>
          )}

          {loadError && !loading && (
            <div className="text-center py-20">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-lg font-bold text-black mb-1">Projeler yüklenemedi</h3>
              <p className="text-sm text-gray-500 mb-4">{loadError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
              >
                Tekrar Dene
              </button>
            </div>
          )}

          {!loading && !loadError && (
            <>
              {projects.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {projects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                  {hasMore && (
                    <div className="text-center mt-10">
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="px-6 py-3 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loadingMore ? 'Yükleniyor...' : 'Daha Fazla Yükle'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20">
                  <div className="text-5xl mb-3">🔍</div>
                  <h3 className="text-lg font-bold text-black mb-1">Sonuç bulunamadı</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {hasActiveFilters ? 'Arama veya filtre kriterlerine uyan proje yok.' : 'İlk projeyi sen oluştur!'}
                  </p>
                  {hasActiveFilters ? (
                    <button
                      onClick={clearFilters}
                      className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      Filtreleri Temizle
                    </button>
                  ) : (
                    <Link
                      to="/create-project"
                      className="px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors inline-block"
                    >
                      Proje Oluştur
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={(newSelection) => setSelectedCategories(newSelection)}
        categories={allCategories}
        selectedCategories={selectedCategories}
      />
    </div>
  );
}