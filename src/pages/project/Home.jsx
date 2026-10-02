import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../../components/project/ProjectCard';
import CategoryModal from '../../components/project/CategoryPick';
import { SEARCH_LIMITS } from '../../constants/limits';
import { TEXT_REGEX, findInvalidChar } from '../../utils/validators';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { useProjectView } from '../../hooks/useProjectView';

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
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matchMode, setMatchMode] = useState('or');

  const [allCategories, setAllCategories] = useState([]);

  const searchContainerRef = useRef(null);
  const searchInputRef = useRef(null);

  const { isCompact, view, setView } = useProjectView();

  const {
    filteredHistory,
    hasHistory,
    isDropdownOpen,
    openDropdown,
    closeDropdown,
    hideDropdown,
    add: addHistory,
    remove: removeHistory,
    clear: clearHistory,
  } = useSearchHistory('project', searchInput);

  const categoryKey = useMemo(
    () => [...selectedCategories].sort().join(','),
    [selectedCategories]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  useEffect(() => {
    if (!isDropdownOpen) return;
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        hideDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen, hideDropdown]);

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

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

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
        if (err.name === 'AbortError') return;
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
      // sessizce
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

  const handleSearch = () => {
    const q = searchInput.trim();
    setActiveSearch(q);
    if (q) addHistory(q);
    closeDropdown();
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
    if (e.key === 'Escape') {
      hideDropdown();
      searchInputRef.current?.blur();
    }
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setActiveSearch('');
    setSearchWarning('');
    searchInputRef.current?.focus();
  };

  const handleSelectHistory = (q) => {
    setSearchInput(q);
    setActiveSearch(q);
    hideDropdown();
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

  const showHistoryDropdown = isDropdownOpen && hasHistory && !searchWarning;

  const gridClass = isCompact
    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
    : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';

  return (
    <div className="w-full bg-bg min-h-screen">

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="relative z-20 border-b border-accent/10">

        {/* Glow blob */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-accent opacity-[0.08] blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-accent/15 bg-surface/60">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-mono tracking-wider text-text-muted uppercase">
              Açık kaynak · Topluluk · Kollaborasyon
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-text leading-[1.05] mb-6">
            Fikirlerini paylaş,
            <br />
            <span className="text-text-muted">ekibini kur.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-text-muted leading-relaxed mb-10">
            Açık kaynak projeleri keşfet, katkıda bulun veya kendi projeni yayınla.
            Tüm geliştiriciler tek bir yerde.
          </p>

          {/* COMMAND PALETTE + ARA */}
          <div ref={searchContainerRef} className="relative max-w-2xl mx-auto">
            <div className="flex items-stretch gap-2">

              <div
                className={`relative flex-1 flex items-center rounded-2xl border bg-surface transition-all duration-300 ${
                  isSearchFocused
                    ? 'border-accent/60 shadow-[0_0_0_4px_rgba(239,228,206,0.08),0_0_40px_-8px_rgba(239,228,206,0.3)]'
                    : 'border-accent/15 hover:border-accent/30'
                }`}
              >
                <span className="absolute left-4 text-text-muted pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                  </svg>
                </span>

                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  onKeyDown={handleSearchKeyDown}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    openDropdown();
                  }}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Proje, kategori veya teknoloji ara..."
                  maxLength={SEARCH_LIMITS.maxLength}
                  className="w-full bg-transparent pl-12 pr-20 py-4 text-base text-text placeholder-text-muted/70 focus:outline-none font-mono"
                />

                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="absolute right-14 p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-bg/60 transition-colors cursor-pointer"
                    aria-label="Aramayı temizle"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                <div className="absolute right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-bg border border-accent/20 pointer-events-none">
                  <kbd className="text-[10px] font-mono font-bold text-text">⌘</kbd>
                  <kbd className="text-[10px] font-mono font-bold text-text">K</kbd>
                </div>
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="shrink-0 px-6 sm:px-7 py-4 bg-accent text-bg text-sm font-bold rounded-2xl border border-accent hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.5)] cursor-pointer"
              >
                Ara
              </button>
            </div>

            {showHistoryDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-accent/20 rounded-2xl shadow-2xl overflow-hidden z-[100]">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-accent/10">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">
                    Son Aramalar
                  </span>
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="text-[10px] text-text-muted hover:text-text transition-colors cursor-pointer font-mono"
                  >
                    tümünü temizle
                  </button>
                </div>
                <ul className="max-h-72 overflow-y-auto">
                  {filteredHistory.map((q) => (
                    <li key={q}>
                      <div className="flex items-center group">
                        <button
                          type="button"
                          onClick={() => handleSelectHistory(q)}
                          className="flex-1 flex items-center gap-3 px-4 py-3 text-sm text-text/80 hover:bg-bg/50 hover:text-text transition-colors cursor-pointer text-left font-mono"
                        >
                          <svg className="w-3.5 h-3.5 text-text-muted shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="truncate">{q}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeHistory(q)}
                          className="p-2.5 mr-1 text-text-muted hover:text-text transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                          aria-label={`${q} aramasını sil`}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {searchWarning && (
            <p className="mt-3 text-[11px] text-text font-mono">
              ⚠ Geçersiz karakter: "{searchWarning}"
            </p>
          )}

          {/* Quick actions */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/create-project"
              className="group inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg text-sm font-bold rounded-xl border border-accent hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Proje Oluştur
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent text-text text-sm font-bold rounded-xl border border-accent/30 hover:border-accent hover:bg-surface/60 transition-all cursor-pointer"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          KEŞFET
      ═══════════════════════════════════════════ */}
      <div className="relative z-0 w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">

          <div className="mb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-text tracking-tight font-mono">
                /keşfet
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Topluluk tarafından oluşturulan en son projeler.
              </p>
            </div>

            {/* Görünüm toggle */}
            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-xl border border-accent/20 p-0.5 bg-surface/60">
                {/* Büyük kartlar — 3 çizgi */}
                <button
                  onClick={() => setView('normal')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    view === 'normal'
                      ? 'bg-accent text-bg shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                  aria-label="Büyük kartlar"
                  title="Büyük kartlar"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                {/* Küçük kartlar — grid */}
                <button
                  onClick={() => setView('compact')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    view === 'compact'
                      ? 'bg-accent text-bg shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                  aria-label="Küçük kartlar"
                  title="Küçük kartlar"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {allCategories.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategories([])}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer font-mono ${
                  selectedCategories.length === 0
                    ? 'bg-accent text-bg border-accent'
                    : 'bg-surface text-text-muted border-accent/15 hover:border-accent/40 hover:text-text'
                }`}
              >
                tümü
              </button>
              {allCategories.slice(0, VISIBLE_LIMIT).map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer font-mono ${
                      isSelected
                        ? 'bg-accent text-bg border-accent'
                        : 'bg-surface text-text-muted border-accent/15 hover:border-accent/40 hover:text-text'
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
              {allCategories.length > VISIBLE_LIMIT && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-1.5 text-xs font-medium rounded-full border border-dashed border-accent/30 text-text-muted hover:border-accent hover:text-text transition-all cursor-pointer font-mono"
                >
                  +{allCategories.length - VISIBLE_LIMIT} daha
                </button>
              )}
            </div>
          )}

          {selectedCategories.length > 1 && (
            <div className="mb-5 flex items-center gap-2 text-xs">
              <span className="text-text-muted font-mono">eşleşme:</span>
              <div className="inline-flex rounded-lg border border-accent/20 p-0.5 bg-surface/60">
                <button
                  onClick={() => setMatchMode('or')}
                  className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer font-mono ${
                    matchMode === 'or' ? 'bg-accent text-bg' : 'text-text-muted hover:text-text'
                  }`}
                >
                  herhangi
                </button>
                <button
                  onClick={() => setMatchMode('and')}
                  className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer font-mono ${
                    matchMode === 'and' ? 'bg-accent text-bg' : 'text-text-muted hover:text-text'
                  }`}
                >
                  hepsi
                </button>
              </div>
            </div>
          )}

          {hasActiveFilters && !loading && (
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs text-text-muted font-mono">
                <span className="text-text">{projects.length}</span> proje
                {selectedCategories.length > 0 && (
                  <> · <span className="text-text">{selectedCategories.length}</span> kategori</>
                )}
              </p>
              <button
                onClick={clearFilters}
                className="text-xs text-text-muted hover:text-text underline underline-offset-2 transition-colors cursor-pointer font-mono"
              >
                filtreleri temizle
              </button>
            </div>
          )}

          {loading && (
            <div className={gridClass}>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className={`${
                    isCompact ? 'h-40' : 'h-72'
                  } rounded-2xl bg-surface/40 border border-accent/10 animate-pulse`}
                />
              ))}
            </div>
          )}

          {loadError && !loading && (
            <div className="text-center py-20 rounded-2xl bg-surface/30 border border-accent/15">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-lg font-bold text-text mb-1 font-mono">projeler yüklenemedi</h3>
              <p className="text-sm text-text-muted mb-4">{loadError}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm font-medium bg-accent text-bg rounded-lg hover:bg-accent/90 transition-colors cursor-pointer font-mono"
              >
                tekrar dene
              </button>
            </div>
          )}

          {!loading && !loadError && (
            <>
              {projects.length > 0 ? (
                <>
                  <div className={gridClass}>
                    {projects.map((project) => (
                      <ProjectCard
                        key={project.id}
                        project={project}
                        compact={isCompact}
                      />
                    ))}
                  </div>
                  {hasMore && (
                    <div className="text-center mt-12">
                      <button
                        onClick={handleLoadMore}
                        disabled={loadingMore}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-surface text-text text-sm font-semibold rounded-xl border border-accent/20 hover:border-accent/60 hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.25)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                      >
                        {loadingMore ? (
                          <>yükleniyor<span className="animate-pulse">...</span></>
                        ) : (
                          <>↓ daha fazla yükle</>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 rounded-2xl bg-surface/30 border border-dashed border-accent/20">
                  <div className="text-5xl mb-3">🔍</div>
                  <h3 className="text-lg font-bold text-text mb-1 font-mono">
                    {hasActiveFilters ? 'sonuç bulunamadı' : 'henüz proje yok'}
                  </h3>
                  <p className="text-sm text-text-muted mb-5">
                    {hasActiveFilters
                      ? 'Arama veya filtre kriterlerine uyan proje yok.'
                      : 'İlk projeyi sen oluştur!'}
                  </p>
                  {hasActiveFilters ? (
                    <button
                      onClick={clearFilters}
                      className="px-5 py-2.5 text-sm font-medium bg-accent text-bg rounded-lg hover:bg-accent/90 transition-colors cursor-pointer font-mono"
                    >
                      filtreleri temizle
                    </button>
                  ) : (
                    <Link
                      to="/create-project"
                      className="inline-block px-5 py-2.5 text-sm font-medium bg-accent text-bg rounded-lg hover:bg-accent/90 transition-colors font-mono"
                    >
                      proje oluştur
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