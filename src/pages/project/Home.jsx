import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from "../../context/ConfigContext";
import { useLanguage } from '../../i18n/LanguageContext';
import ScrollHint from '../../components/ui/ScrollHint';
import ProjectCard from '../../components/project/ProjectCard';
import CategoryModal from '../../components/project/CategoryPick';
import * as Icon from '../../components/ui/Icons';
import { TEXT_REGEX, findInvalidChar } from '../../utils/validators';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { useProjectView } from '../../hooks/useProjectView';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const LIMIT = 20;

export default function Home() {
  const { t } = useLanguage();
  const { limits } = useConfig();
  const VISIBLE_LIMIT = limits.visibleCategories;

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
        throw new Error('fetch_failed');
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
    if (value.length > limits.maxSearchLen) return;
    setSearchInput(value);
    setSearchWarning('');
  };

  const handleSearch = () => {
    const q = searchInput.trim();
    setActiveSearch(q);
    if (q) addHistory(q);
    closeDropdown();
    searchInputRef.current?.blur();
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-50 left-1/2 -translate-x-1/2 w-175 h-100 bg-accent opacity-[0.08] blur-[120px] rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-accent/15 bg-surface/60">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] font-mono tracking-wider text-text-muted uppercase">
              {t('home.hero.eyebrow')}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-text leading-[1.08] mb-5">
            {t('home.hero.title_1')}
            <br />
            <span className="text-text-muted">{t('home.hero.title_2')}</span>
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-text-muted leading-relaxed mb-10">
            {t('home.hero.subtitle')}
          </p>

          {/* COMMAND PALETTE */}
          <div ref={searchContainerRef} className="relative max-w-xl mx-auto">
            <div
              className={`relative flex items-center rounded-xl border transition-all duration-300 overflow-hidden ${
                isSearchFocused
                  ? 'bg-surface border-accent/60 shadow-[0_0_0_4px_rgba(239,228,206,0.06),0_0_40px_-8px_rgba(239,228,206,0.25),0_1px_0_0_rgba(239,228,206,0.06)_inset]'
                  : 'bg-surface border-accent/20 shadow-[0_1px_0_0_rgba(239,228,206,0.04)_inset,0_4px_16px_-8px_rgba(0,0,0,0.5)] hover:border-accent/40'
              }`}
            >
              <span className="absolute left-4 text-text-muted pointer-events-none">
                <Icon.Search className="w-4 h-4" />
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
                placeholder={t('home.search.placeholder')}
                maxLength={limits.maxSearchLen}
                className="flex-1 bg-transparent pl-11 pr-32 py-3.5 text-sm text-text placeholder-text-muted/60 focus:outline-none font-mono"
              />

              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-1.5 rounded-md text-text-muted hover:text-text hover:bg-bg/60 transition-colors cursor-pointer"
                    aria-label={t('home.search.aria_clear')}
                  >
                    <Icon.Close className="w-3.5 h-3.5" />
                  </button>
                )}

                {!searchInput && (
                  <div className="hidden sm:flex items-center gap-0.5 px-2 py-1 rounded-md bg-bg border border-accent/15 pointer-events-none">
                    <kbd className="text-[10px] font-mono font-bold text-text-muted leading-none">⌘</kbd>
                    <kbd className="text-[10px] font-mono font-bold text-text-muted leading-none">K</kbd>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSearch}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 bg-accent text-bg text-xs font-bold rounded-lg hover:bg-accent/90 transition-all hover:shadow-[0_0_20px_-3px_rgba(239,228,206,0.5)] cursor-pointer"
                >
                  <Icon.Search className="w-3 h-3" />
                  <span className="hidden sm:inline font-mono">{t('home.search.button')}</span>
                </button>
              </div>
            </div>

            {searchWarning && (
              <p className="mt-2 text-[11px] text-text-muted font-mono inline-flex items-center gap-1.5">
                <Icon.Warning className="w-3 h-3" />
                {t('home.search.warning_prefix')} "{searchWarning}"
              </p>
            )}

            {/* History dropdown */}
            {showHistoryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-accent/20 rounded-xl shadow-2xl overflow-hidden z-100 animate-dropdown-center">                <div className="flex items-center justify-between px-3 py-2 border-b border-accent/10">
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">
                    {t('home.search.history_label')}
                  </span>
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="text-[10px] text-text-muted hover:text-text transition-colors cursor-pointer font-mono"
                  >
                    {t('home.search.history_clear')}
                  </button>
                </div>
                <ul className="max-h-72 overflow-y-auto">
                  {filteredHistory.map((q) => (
                    <li key={q}>
                      <div className="flex items-center group">
                        <button
                          type="button"
                          onClick={() => handleSelectHistory(q)}
                          className="flex-1 flex items-center gap-2.5 px-3 py-2.5 text-sm text-text/80 hover:bg-bg/50 hover:text-text transition-colors cursor-pointer text-left font-mono"
                        >
                          <Icon.Clock className="w-3.5 h-3.5 text-text-muted shrink-0" />
                          <span className="truncate">{q}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeHistory(q)}
                          className="p-2 mr-1 text-text-muted hover:text-text transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                          aria-label={t('home.search.history_remove', { query: q })}
                        >
                          <Icon.Close className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/create-project"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-transparent text-text text-sm font-semibold rounded-lg border border-accent/20 hover:border-accent/50 hover:bg-surface/60 transition-all cursor-pointer"
            >
              <Icon.Plus className="w-3.5 h-3.5" />
              {t('home.quick.create')}
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-transparent text-text-muted text-sm font-semibold rounded-lg hover:text-text transition-all cursor-pointer"
            >
              {t('home.quick.dashboard')}
              <Icon.ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Scroll hint — filtre yoksa default, varsa sonuç özeti */}
          {!hasActiveFilters ? (
            <ScrollHint targetId="explore" />
          ) : (
            <ScrollHint
              targetId="explore"
              label={
                loading ? (
                  <>
                    {t('home.load_more_loading')}
                    <span className="animate-pulse">...</span>
                  </>
                ) : projects.length > 0 ? (
                  t('home.search.results_hint', { count: projects.length })
                ) : (
                  t('home.search.no_results_hint')
                )
              }
              showIcon={!loading && projects.length > 0}
              disabled={loading || projects.length === 0}
            />
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          KEŞFET
      ═══════════════════════════════════════════ */}
      <div id="explore" className="relative z-0 w-full px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        <div className="max-w-7xl mx-auto">

          <div className="mb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-text tracking-tight font-mono">
                {t('home.explore.title')}
              </h2>
              <p className="text-sm text-text-muted mt-1">
                {t('home.explore.subtitle')}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="inline-flex rounded-lg border border-accent/20 p-0.5 bg-surface/60">
                <button
                  onClick={() => setView('normal')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    view === 'normal'
                      ? 'bg-accent text-bg shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                  aria-label={t('home.explore.view_normal')}
                  title={t('home.explore.view_normal')}
                >
                  <Icon.List className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setView('compact')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    view === 'compact'
                      ? 'bg-accent text-bg shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                  aria-label={t('home.explore.view_compact')}
                  title={t('home.explore.view_compact')}
                >
                  <Icon.LayoutGrid className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {allCategories.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategories([])}
                style={{ animationDelay: '0ms' }}
                className={`animate-chip px-3 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer font-mono ${
                  selectedCategories.length === 0
                    ? 'bg-accent text-bg border-accent'
                    : 'bg-surface text-text-muted border-accent/15 hover:border-accent/40 hover:text-text'
                }`}
              >
                {t('home.categories.all')}
              </button>
              {allCategories.slice(0, VISIBLE_LIMIT).map((cat, index) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleCategory(cat.id)}
                    style={{ animationDelay: `${(index + 1) * 30}ms` }}
                    className={`animate-chip px-3 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer font-mono ${
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
                  style={{ animationDelay: `${Math.min(VISIBLE_LIMIT + 1, 12) * 30}ms` }}
                  className="animate-chip inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full border border-dashed border-accent/30 text-text-muted hover:border-accent hover:text-text transition-all cursor-pointer font-mono"
                >
                  <Icon.Plus className="w-3 h-3" />
                  {t('home.categories.more', { count: allCategories.length - VISIBLE_LIMIT })}
                </button>
              )}
            </div>
          )}

          {selectedCategories.length > 1 && (
            <div className="animate-dropdown-center mb-5 flex items-center gap-2 text-xs">
              <span className="text-text-muted font-mono">{t('home.match.label')}</span>
              <div className="inline-flex rounded-lg border border-accent/20 p-0.5 bg-surface/60">
                <button
                  onClick={() => setMatchMode('or')}
                  className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer font-mono ${
                    matchMode === 'or' ? 'bg-accent text-bg' : 'text-text-muted hover:text-text'
                  }`}
                >
                  {t('home.match.any')}
                </button>
                <button
                  onClick={() => setMatchMode('and')}
                  className={`px-3 py-1 rounded-md font-medium transition-all cursor-pointer font-mono ${
                    matchMode === 'and' ? 'bg-accent text-bg' : 'text-text-muted hover:text-text'
                  }`}
                >
                  {t('home.match.all')}
                </button>
              </div>
            </div>
          )}

          {hasActiveFilters && !loading && (
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs text-text-muted font-mono">
                {selectedCategories.length > 0
                  ? t('home.filters.count_with_categories', {
                      count: projects.length,
                      catCount: selectedCategories.length,
                    })
                  : t('home.filters.count', { count: projects.length })}
              </p>
              <button
                onClick={clearFilters}
                className="text-xs text-text-muted hover:text-text underline underline-offset-2 transition-colors cursor-pointer font-mono"
              >
                {t('home.filters.clear')}
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
              <Icon.Warning className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <h3 className="text-lg font-bold text-text mb-1 font-mono">{t('home.error.title')}</h3>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 text-sm font-medium bg-accent text-bg rounded-lg hover:bg-accent/90 transition-colors cursor-pointer font-mono"
              >
                {t('home.error.retry')}
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
                          <>{t('home.load_more_loading')}<span className="animate-pulse">...</span></>
                        ) : (
                          <>
                            <Icon.ChevronDown className="w-4 h-4" />
                            {t('home.load_more')}
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-20 rounded-2xl bg-surface/30 border border-dashed border-accent/20">
                  <Icon.Search className="w-12 h-12 text-text-muted mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-text mb-1 font-mono">
                    {hasActiveFilters ? t('home.empty.filtered_title') : t('home.empty.empty_title')}
                  </h3>
                  <p className="text-sm text-text-muted mb-5">
                    {hasActiveFilters ? t('home.empty.filtered_desc') : t('home.empty.empty_desc')}
                  </p>
                  {hasActiveFilters ? (
                    <button
                      onClick={clearFilters}
                      className="px-5 py-2.5 text-sm font-medium bg-accent text-bg rounded-lg hover:bg-accent/90 transition-colors cursor-pointer font-mono"
                    >
                      {t('home.empty.clear_filters')}
                    </button>
                  ) : (
                    <Link
                      to="/create-project"
                      className="inline-block px-5 py-2.5 text-sm font-medium bg-accent text-bg rounded-lg hover:bg-accent/90 transition-colors font-mono"
                    >
                      {t('home.empty.create')}
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