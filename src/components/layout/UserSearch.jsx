import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounced } from '../../hooks/useDebounced';
import { USERNAME_REGEX, findInvalidChar } from '../../utils/validators';
import { SEARCH_LIMITS, PAGINATION_LIMITS } from '../../constants/limits';
import CharWarning from '../ui/CharWarning';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function UserSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [warning, setWarning] = useState('');

  const debouncedQuery = useDebounced(query, 300);
  const containerRef = useRef(null);
  const abortRef = useRef(null);

  // Arama isteği
  useEffect(() => {
    // ✅ Önceki isteği iptal et
    if (abortRef.current) {
      abortRef.current.abort();
    }

    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsOpen(false);
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
        setIsOpen(true);
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
  }, [debouncedQuery]);

  // Dışarı tıklayınca kapat
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

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
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setWarning('');
    navigate(`/profile/${encodeURIComponent(username)}`);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    setWarning('');
  };

  return (
    <div ref={containerRef} className="relative hidden md:block">
      {/* Arama kutusu */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="Kullanıcı ara..."
          maxLength={SEARCH_LIMITS.userSearchMaxLength}
          className={`w-56 pl-9 pr-8 py-2 text-sm bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:bg-white transition-all ${
            warning ? 'border-amber-400' : 'border-gray-200 focus:border-gray-300'
          }`}
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-black transition-colors cursor-pointer"
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
      {isOpen && !warning && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden z-50">
          {loading && (
            <div className="px-4 py-3 text-xs text-gray-500 text-center">
              Aranıyor...
            </div>
          )}

          {!loading && results.length === 0 && (
            <div className="px-4 py-3 text-xs text-gray-500 text-center">
              Sonuç bulunamadı
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="max-h-80 overflow-y-auto">
              {results.map((user) => (
                <li key={user.user_id}>
                  <button
                    onClick={() => handleSelect(user.username)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors cursor-pointer text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-200 overflow-hidden shrink-0">
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
                          <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-black truncate">
                        {user.username}
                      </p>
                      {user.bio && (
                        <p className="text-xs text-gray-500 truncate">
                          {user.bio}
                        </p>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}