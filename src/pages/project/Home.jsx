import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useConfig } from "../../context/ConfigContext";
import { useLanguage } from '../../i18n/LanguageContext';
import EmptyState from '../../components/ui/EmptyState';
import ScrollHint from '../../components/ui/ScrollHint';
import SortDropdown from '../../components/ui/SortDropdown';
import Chip from '../../components/ui/Chip';
import CardSkeletonGrid from '../../components/ui/CardSkeletonGrid';
import ViewToggle from '../../components/ui/ViewToggle';
import ProjectCard from '../../components/project/ProjectCard';
import CategoryModal from '../../components/project/CategoryPick';
import * as Icon from '../../components/ui/Icons';
import { TEXT_REGEX, findInvalidChar } from '../../utils/validators';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { useProjectView } from '../../hooks/useProjectView';

import { API } from '../../utils/api';
const LIMIT = 20;

export default function Home() {
  
  const { t } = useLanguage();
  const { limits } = useConfig();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const VISIBLE_LIMIT = isMobile ? 4 : limits.visibleCategories;

  const [sortMode, setSortMode] = useState(() => {
    try {
      const stored = localStorage.getItem('reporeef:sort');
      if (['popular', 'hot', 'trending', 'newest'].includes(stored)) {
        return stored;
      }
    } catch {
      // localStorage erişilemezse default'a düş
    }
    return 'popular';
  });

  // setSortMode çağrıldığında localStorage'a yaz
  const handleSortChange = (mode) => {
    setSortMode(mode);
    try {
      localStorage.setItem('reporeef:sort', mode);
    } catch {
      // sessizce geç
    }
  };
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

    fetch(`${API}/categories`, { signal: controller.signal })
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
      params.set('sort', sortMode);

      const res = await fetch(`${API}/projects?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        signal,
      });

      if (!res.ok) {
        throw new Error('fetch_failed');
      }

      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    [sortMode]
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
          <div className="absolute -top-50 left-1/2 -translate-x-1/2 w-175 h-100 bg-accent opacity-[0.08] blur-[120px] rounded-pill" />
        </div>

        <div className="relative max-w-default mx-auto px-5 sm:px-6 lg:px-8 pt-[calc(var(--spacing-hero)*1.4)] pb-hero text-center">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-pill border border-accent/15 bg-surface/60">
            <span className="w-1.5 h-1.5 rounded-pill bg-accent animate-pulse" />
            <span className="text-mono-sm font-mono tracking-wider text-text-muted uppercase">
              {t('home.hero.eyebrow')}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-h1 font-extrabold tracking-tight text-text leading-[1.08] mb-5">
            {t('home.hero.title_1')}
            <br />
            <span className="text-text-muted">{t('home.hero.title_2')}</span>
          </h1>

          <p className="max-w-xl mx-auto text-body-sm sm:text-body text-text-muted leading-relaxed mb-10">
            {t('home.hero.subtitle')}
          </p>

          {/* COMMAND PALETTE */}
          <div ref={searchContainerRef} className="relative max-w-xl mx-auto">
            <div
              className={`relative flex items-center rounded-button border transition-all duration-300 overflow-hidden ${
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
                className="flex-1 bg-transparent pl-11 pr-32 py-3.5 text-body-sm text-text placeholder-text-muted/60 focus:outline-none font-mono"
              />

              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-1.5 rounded-button text-text-muted hover:text-text hover:bg-bg/60 transition-colors cursor-pointer"
                    aria-label={t('home.search.aria_clear')}
                  >
                    <Icon.Close className="w-3.5 h-3.5" />
                  </button>
                )}

                {!searchInput && (
                  <div className="hidden sm:flex items-center gap-0.5 px-2 py-1 rounded-button bg-bg border border-accent/15 pointer-events-none">
                    <kbd className="text-mono-sm font-mono font-bold text-text-muted leading-none">⌘</kbd>
                    <kbd className="text-mono-sm font-mono font-bold text-text-muted leading-none">K</kbd>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSearch}
                  className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 bg-accent text-bg text-caption font-bold rounded-button hover:bg-accent/90 transition-all hover:shadow-[0_0_20px_-3px_rgba(239,228,206,0.5)] cursor-pointer"
                >
                  <Icon.Search className="w-3 h-3" />
                  <span className="hidden sm:inline font-mono">{t('home.search.button')}</span>
                </button>
              </div>
            </div>

            {searchWarning && (
              <p className="mt-2 text-mono-sm text-text-muted font-mono inline-flex items-center gap-1.5">
                <Icon.Warning className="w-3 h-3" />
                {t('home.search.warning_prefix')} "{searchWarning}"
              </p>
            )}

            {/* History dropdown */}
            {showHistoryDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-accent/20 rounded-button shadow-2xl overflow-hidden z-100 animate-dropdown-center">
                <div className="flex items-center justify-between px-3 py-2 border-b border-accent/10">
                  <span className="text-mono-sm font-bold text-text-muted uppercase tracking-wider font-mono">
                    {t('home.search.history_label')}
                  </span>
                  <button
                    type="button"
                    onClick={clearHistory}
                    className="text-mono-sm text-text-muted hover:text-text transition-colors cursor-pointer font-mono"
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
                          className="flex-1 flex items-center gap-2.5 px-3 py-2.5 text-body-sm text-text/80 hover:bg-bg/50 hover:text-text transition-colors cursor-pointer text-left font-mono"
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
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-transparent text-text text-body-sm font-semibold rounded-button border border-accent/20 hover:border-accent/50 hover:bg-surface/60 transition-all cursor-pointer"
            >
              <Icon.Plus className="w-3.5 h-3.5" />
              {t('home.quick.create')}
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-transparent text-text-muted text-body-sm font-semibold rounded-button hover:text-text transition-all cursor-pointer"
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
      <div id="explore" className="relative z-0 w-full px-4 sm:px-6 lg:px-8 py-section scroll-mt-20">
        <div className="max-w-wide mx-auto">

          <div className="mb-6 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h2 className="text-h4 font-bold text-text tracking-tight font-mono">
                {t('home.explore.title')}
              </h2>
              <p className="text-body-sm text-text-muted mt-1">
                {t('home.explore.subtitle')}
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <ViewToggle
                view={view}
                onChange={setView}
                labelNormal={t('home.explore.view_normal')}
                labelCompact={t('home.explore.view_compact')}
              />

              {/* Sort selector */}
              <SortDropdown value={sortMode} onChange={handleSortChange} />
            </div>
          </div>

          {allCategories.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              <Chip
                variant="all"
                active={selectedCategories.length === 0}
                onClick={() => setSelectedCategories([])}
                animationDelay="0ms"
              >
                {t('home.categories.all')}
              </Chip>
              {allCategories.slice(0, VISIBLE_LIMIT).map((cat, index) => (
                <Chip
                  key={cat.id}
                  active={selectedCategories.includes(cat.id)}
                  onClick={() => toggleCategory(cat.id)}
                  animationDelay={`${(index + 1) * 30}ms`}
                >
                  {cat.name}
                </Chip>
              ))}
              {allCategories.length > VISIBLE_LIMIT && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  style={{ animationDelay: `${Math.min(VISIBLE_LIMIT + 1, 12) * 30}ms` }}
                  className="animate-chip inline-flex items-center gap-1 px-3 py-1.5 text-caption font-medium rounded-pill border border-dashed border-accent/30 text-text-muted hover:border-accent hover:text-text transition-all cursor-pointer font-mono"
                >
                  <Icon.Plus className="w-3 h-3" />
                  {t('home.categories.more', { count: allCategories.length - VISIBLE_LIMIT })}
                </button>
              )}
            </div>
          )}

          {selectedCategories.length > 1 && (
            <div className="animate-dropdown-center mb-5 flex items-center gap-2 text-caption">
              <span className="text-text-muted font-mono">{t('home.match.label')}</span>
              <div className="inline-flex rounded-button border border-accent/20 p-0.5 bg-surface/60">
                <button
                  onClick={() => setMatchMode('or')}
                  className={`px-3 py-1 rounded-button font-medium transition-all cursor-pointer font-mono ${
                    matchMode === 'or' ? 'bg-accent text-bg' : 'text-text-muted hover:text-text'
                  }`}
                >
                  {t('home.match.any')}
                </button>
                <button
                  onClick={() => setMatchMode('and')}
                  className={`px-3 py-1 rounded-button font-medium transition-all cursor-pointer font-mono ${
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
              <p className="text-caption text-text-muted font-mono">
                {selectedCategories.length > 0
                  ? t('home.filters.count_with_categories', {
                      count: projects.length,
                      catCount: selectedCategories.length,
                    })
                  : t('home.filters.count', { count: projects.length })}
              </p>
              <button
                onClick={clearFilters}
                className="text-caption text-text-muted hover:text-text underline underline-offset-2 transition-colors cursor-pointer font-mono"
              >
                {t('home.filters.clear')}
              </button>
            </div>
          )}

          {loading && <CardSkeletonGrid isCompact={isCompact} gridClass={gridClass} />}

          {loadError && !loading && (
            <div className="text-center py-20 rounded-card bg-surface/30 border border-accent/15">
              <Icon.Warning className="w-12 h-12 text-text-muted mx-auto mb-3" />
              <h3 className="text-h5 font-bold text-text mb-1 font-mono">{t('home.error.title')}</h3>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 text-body-sm font-medium bg-accent text-bg rounded-button hover:bg-accent/90 transition-colors cursor-pointer font-mono"
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
                        className="inline-flex items-center gap-2 px-6 py-3 bg-surface text-text text-body-sm font-semibold rounded-button border border-accent/20 hover:border-accent/60 hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.25)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
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
                <EmptyState
                  icon={Icon.Search}
                  title={hasActiveFilters ? t('home.empty.filtered_title') : t('home.empty.empty_title')}
                  description={hasActiveFilters ? t('home.empty.filtered_desc') : t('home.empty.empty_desc')}
                  cta={
                    hasActiveFilters
                      ? { label: t('home.empty.clear_filters'), onClick: clearFilters }
                      : { label: t('home.empty.create'), to: '/create-project' }
                  }
                />
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