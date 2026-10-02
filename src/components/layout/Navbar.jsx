import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import UserDropdown from './UserDropdown';
import UserSearch from './UserSearch';
import LanguageSwitcher from './LanguageSwitcher';
import * as Icon from '../ui/Icons';
import { useDebounced } from '../../hooks/useDebounced';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { USERNAME_REGEX, findInvalidChar } from '../../utils/validators';
import { SEARCH_LIMITS, PAGINATION_LIMITS } from '../../constants/limits';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Navbar({ onOpenSidebar }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileQuery, setMobileQuery] = useState('');
  const [mobileResults, setMobileResults] = useState([]);
  const [mobileWarning, setMobileWarning] = useState('');
  const [mobileLoading, setMobileLoading] = useState(false);

  const mobileDebouncedQuery = useDebounced(mobileQuery, 300);
  const mobileSearchRef = useRef(null);
  const mobileAbortRef = useRef(null);

  const {
    filteredHistory: mobileHistory,
    hasHistory: mobileHasHistory,
    add: mobileAddHistory,
    remove: mobileRemoveHistory,
    clear: mobileClearHistory,
  } = useSearchHistory('user', mobileQuery);

  useEffect(() => {
    if (!mobileSearchOpen) return;

    if (mobileAbortRef.current) {
      mobileAbortRef.current.abort();
    }

    if (!mobileDebouncedQuery.trim()) {
      setMobileResults([]);
      return;
    }

    const controller = new AbortController();
    mobileAbortRef.current = controller;

    const search = async () => {
      setMobileLoading(true);
      try {
        const res = await fetch(
          `${API}/api/users/search?q=${encodeURIComponent(mobileDebouncedQuery)}&limit=${PAGINATION_LIMITS.usersPerSearch}`,
          { signal: controller.signal }
        );
        if (!res.ok) throw new Error('search_failed');
        const data = await res.json();
        setMobileResults(Array.isArray(data) ? data : []);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setMobileResults([]);
        }
      } finally {
        setMobileLoading(false);
      }
    };

    search();

    return () => {
      controller.abort();
    };
  }, [mobileDebouncedQuery, mobileSearchOpen]);

  useEffect(() => {
    if (!mobileSearchOpen) return;

    const handleClickOutside = (e) => {
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)) {
        setMobileSearchOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setMobileSearchOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [mobileSearchOpen]);

  const handleMobileChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setMobileQuery('');
      setMobileWarning('');
      return;
    }
    if (!USERNAME_REGEX.test(value)) {
      const bad = findInvalidChar(value, USERNAME_REGEX);
      if (bad) {
        setMobileWarning(bad);
        setTimeout(() => setMobileWarning(''), 3000);
      }
      return;
    }
    if (value.length > SEARCH_LIMITS.userSearchMaxLength) return;
    setMobileQuery(value);
    setMobileWarning('');
  };

  const handleMobileSelect = (username) => {
    mobileAddHistory(username);
    setMobileQuery('');
    setMobileResults([]);
    setMobileSearchOpen(false);
    navigate(`/profile/${encodeURIComponent(username)}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-bg/80 backdrop-blur-md border-b border-accent/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3 sm:gap-6 lg:gap-10">

          {/* SOL: Sidebar toggle + Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSidebar}
              className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors cursor-pointer"
              aria-label={t('navbar.aria.open_menu')}
            >
              <Icon.Menu className="w-5 h-5" />
            </button>

            <Link
              to="/"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="font-display text-[20px] leading-none text-text hover:text-accent transition-colors shrink-0"
              aria-label={t('navbar.aria.logo')}
            >
              Collab-Hub
            </Link>
          </div>

          {/* ORTA: Desktop arama */}
          <div className="hidden md:flex flex-1 justify-center min-w-0">
            <UserSearch />
          </div>

          {/* SAĞ: Dil + Mobil arama + Auth */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3 shrink-0">

            <LanguageSwitcher />

            <button
              onClick={() => setMobileSearchOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface transition-colors cursor-pointer"
              aria-label={t('navbar.aria.search_users')}
            >
              <Icon.Search className="w-4 h-4" />
            </button>

            {user ? (
              <UserDropdown />
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `hidden sm:inline-flex items-center justify-center px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all cursor-pointer ${
                      isActive
                        ? 'bg-surface text-text'
                        : 'text-text-muted hover:text-text hover:bg-surface'
                    }`
                  }
                >
                  {t('navbar.auth.login')}
                </NavLink>
                <NavLink
                  to="/register"
                  className="inline-flex items-center justify-center px-3.5 py-1.5 text-[13px] font-semibold rounded-lg bg-accent text-bg border border-accent hover:bg-accent/90 transition-all cursor-pointer"
                >
                  {t('navbar.auth.register')}
                </NavLink>
              </>
            )}
          </div>
        </div>

        {/* MOBİL ARAMA DROPDOWN */}
        {mobileSearchOpen && (
          <div
            ref={mobileSearchRef}
            className="md:hidden absolute top-full left-0 right-0 bg-surface border-b border-accent/20 shadow-2xl animate-dropdown-left"
          >
            <div className="px-4 py-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
                  <Icon.Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={mobileQuery}
                  onChange={handleMobileChange}
                  placeholder={t('navbar.mobile_search.placeholder')}
                  autoFocus
                  maxLength={SEARCH_LIMITS.userSearchMaxLength}
                  className={`w-full pl-9 pr-9 py-2.5 text-sm bg-bg border rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all ${
                    mobileWarning ? 'border-amber-400/60' : 'border-accent/15 focus:border-accent/40'
                  }`}
                />
                {mobileQuery && (
                  <button
                    onClick={() => {
                      setMobileQuery('');
                      setMobileResults([]);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text transition-colors cursor-pointer"
                    aria-label={t('navbar.mobile_search.aria_clear')}
                  >
                    <Icon.Close className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {mobileWarning && (
                <p className="mt-1.5 text-[11px] text-amber-400 font-mono inline-flex items-center gap-1">
                  <Icon.Warning className="w-3 h-3" />
                  {t('navbar.mobile_search.warning_prefix')} "{mobileWarning}"
                </p>
              )}

              {mobileQuery.trim() !== '' && mobileResults.length > 0 && (
                <ul className="mt-2 max-h-72 overflow-y-auto -mx-1">
                  {mobileResults.map((u) => (
                    <li key={u.user_id}>
                      <button
                        onClick={() => handleMobileSelect(u.username)}
                        className="w-full flex items-center gap-3 px-2 py-2.5 hover:bg-bg/60 rounded-lg transition-colors cursor-pointer text-left"
                      >
                        <div className="w-8 h-8 rounded-full bg-bg border border-accent/15 overflow-hidden shrink-0">
                          {u.avatar_url ? (
                            <img
                              src={u.avatar_url}
                              alt={u.username}
                              loading="lazy"
                              decoding="async"
                              width="32"
                              height="32"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Icon.User className="w-4 h-4 text-text-muted" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text truncate font-mono">
                            {u.username}
                          </p>
                          {u.bio && (
                            <p className="text-xs text-text-muted truncate">{u.bio}</p>
                          )}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {mobileQuery.trim() === '' && mobileHasHistory && (
                <>
                  <div className="flex items-center justify-between mt-3 mb-1 px-1">
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">
                      {t('navbar.mobile_search.history_label')}
                    </span>
                    <button
                      onClick={mobileClearHistory}
                      className="text-[10px] text-text-muted hover:text-text transition-colors cursor-pointer font-mono"
                    >
                      {t('navbar.mobile_search.history_clear')}
                    </button>
                  </div>
                  <ul className="max-h-60 overflow-y-auto -mx-1">
                    {mobileHistory.map((username) => (
                      <li key={username}>
                        <div className="flex items-center group">
                          <button
                            onClick={() => handleMobileSelect(username)}
                            className="flex-1 flex items-center gap-2.5 px-2 py-2 text-sm text-text/80 hover:bg-bg/60 hover:text-text rounded-lg transition-colors cursor-pointer text-left font-mono"
                          >
                            <Icon.Clock className="w-3.5 h-3.5 text-text-muted shrink-0" />
                            <span className="truncate">{username}</span>
                          </button>
                          <button
                            onClick={() => mobileRemoveHistory(username)}
                            className="p-2 mr-1 text-text-muted hover:text-text transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                            aria-label={t('navbar.mobile_search.history_remove', { username })}
                          >
                            <Icon.Close className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {mobileQuery.trim() !== '' && !mobileLoading && mobileResults.length === 0 && (
                <p className="mt-2 px-2 py-3 text-xs text-text-muted text-center font-mono">
                  {t('navbar.mobile_search.no_results')}
                </p>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}