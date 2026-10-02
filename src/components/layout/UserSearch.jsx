import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounced } from '../../hooks/useDebounced';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { USERNAME_REGEX, findInvalidChar } from '../../utils/validators';
import { SEARCH_LIMITS, PAGINATION_LIMITS } from '../../constants/limits';
import CharWarning from '../ui/CharWarning';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function UserSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState('');

  const debouncedQuery = useDebounced(query, 300);
  const containerRef = useRef(null);
  const abortRef = useRef(null);

  const {
    filteredHistory,
    hasHistory,
    isDropdownOpen,
    openDropdown,
    hideDropdown,
    add: addHistory,
    remove: removeHistory,
    clear: clearHistory,
  } = useSearchHistory('user', query);

  useEffect(() => {
    if (abortRef.current) {
      abortRef.current.abort();
    }

    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const search = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API}/api/users/search?q=${encodeURIComponent(debouncedQuery)}&limit=${PAGINATION_LIMITS.usersPerSearch}`,
          { signal: controller.signal }
        );

        if (!res.ok) throw new Error('Arama başarısız');

        const data = await res.json();
        setResults(Array.isArray(data) ? data : []);
        openDropdown();
      } catch (err) {
        if (err.name !== 'AbortError') {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    };

    search();

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, openDropdown]);

  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        hideDropdown();
      }
    };

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        hideDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isDropdownOpen, hideDropdown]);

  const showWarning = (char) => {
    setWarning(char);
    setTimeout(() => setWarning(''), 3000);
  };

  const handleChange = (e) => {
    const value = e.target.value;

    if (value === '') {
      setQuery('');
      setWarning('');
      return;
    }

    if (!USERNAME_REGEX.test(value)) {
      const bad = findInvalidChar(value, USERNAME_REGEX);
      if (bad) showWarning(bad);
      return;
    }

    if (value.length > SEARCH_LIMITS.userSearchMaxLength) return;

    setQuery(value);
    setWarning('');
  };

  const handleSelect = (username) => {
    addHistory(username);
    setQuery('');
    setResults([]);
    hideDropdown();
    setWarning('');
    navigate(`/profile/${encodeURIComponent(username)}`);
  };

  const handleSelectHistory = (username) => {
    setQuery('');
    setResults([]);
    hideDropdown();
    setWarning('');
    navigate(`/profile/${encodeURIComponent(username)}`);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    hideDropdown();
    setWarning('');
  };

  const handleFocus = () => {
    if (results.length > 0 || (query.trim() === '' && hasHistory)) {
      openDropdown();
    }
  };

  const showResults = query.trim() !== '' && results.length > 0;
  const showHistory = !showResults && hasHistory;
  const showEmpty =
    query.trim() !== '' &&
    !loading &&
    results.length === 0 &&
    !hasHistory;

  return (
    <div ref={containerRef} className="relative hidden md:block flex-1 max-w-md">
      {/* Arama kutusu */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          placeholder="Kullanıcı ara..."
          maxLength={SEARCH_LIMITS.userSearchMaxLength}
          className={`w-full pl-9 pr-8 py-2 text-[13px] bg-surface border rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/30 transition-all ${
            warning ? 'border-amber-400/60' : 'border-accent/10'
          }`}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text transition-colors cursor-pointer"
            aria-label="Temizle"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <CharWarning
        char={warning}
        className="absolute top-full left-0 right-0 mt-1"
      />

      {/* Dropdown */}
      {isDropdownOpen && !warning && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-accent/20 rounded-xl shadow-2xl overflow-hidden z-[100]">
          {/* Kullanıcı sonuçları */}
          {showResults && (
            <ul className="max-h-80 overflow-y-auto">
              {results.map((user) => (
                <li key={user.user_id}>
                  <button
                    onClick={() => handleSelect(user.username)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-bg/60 transition-colors cursor-pointer text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-bg border border-accent/15 overflow-hidden shrink-0">
                      {user.avatar_url ? (
                        <img
                          src={user.avatar_url}
                          alt={user.username}
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
                          <svg className="w-4 h-4 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate font-mono">
                        {user.username}
                      </p>
                      {user.bio && (
                        <p className="text-xs text-text-muted truncate">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Geçmiş */}
          {showHistory && (
            <>
              <div className="flex items-center justify-between px-3 py-2 border-b border-accent/10">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider font-mono">
                  Son Aramalar
                </span>
                <button
                  type="button"
                  onClick={clearHistory}
                  className="text-[10px] text-text-muted hover:text-text transition-colors cursor-pointer font-mono"
                >
                  Tümünü temizle
                </button>
              </div>
              <ul className="max-h-72 overflow-y-auto">
                {filteredHistory.map((username) => (
                  <li key={username}>
                    <div className="flex items-center group">
                      <button
                        type="button"
                        onClick={() => handleSelectHistory(username)}
                        className="flex-1 flex items-center gap-2.5 px-3 py-2.5 text-sm text-text/80 hover:bg-bg/60 hover:text-text transition-colors cursor-pointer text-left font-mono"
                      >
                        <svg className="w-3.5 h-3.5 text-text-muted shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="truncate">{username}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => removeHistory(username)}
                        className="p-2 mr-1 text-text-muted hover:text-text transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                        aria-label={`${username} aramasını sil`}
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Boş */}
          {showEmpty && (
            <div className="px-4 py-3 text-xs text-text-muted text-center font-mono">
              Sonuç bulunamadı
            </div>
          )}
        </div>
      )}
    </div>
  );
}