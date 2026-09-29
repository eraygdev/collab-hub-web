import { useState, useCallback, useEffect, useMemo, useRef } from "react";

const MAX_ITEMS = 8;
const STORAGE_PREFIX = "searchHistory:";

function readHistory(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeHistory(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch {
    // sessizce geç
  }
}

// Arama geçmişi hook'u — hem veri hem dropdown state'ini yönetir.
// type: 'project' | 'user'
// query: o anki input değeri (filtreleme için)
export function useSearchHistory(type = "project", query = "") {
  const storageKey = `${STORAGE_PREFIX}${type}`;
  const [history, setHistory] = useState(() => readHistory(storageKey));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const userClosedRef = useRef(false);
  const prevQueryRef = useRef(query);

  // Storage key değişirse yeniden oku
  useEffect(() => {
    setHistory(readHistory(storageKey));
  }, [storageKey]);

  // Query değişince: kullanıcı yazıyorsa dropdown'ı otomatik aç
  useEffect(() => {
    const prev = prevQueryRef.current;
    prevQueryRef.current = query;

    if (prev === query) return;

    if (userClosedRef.current && query.trim() !== "") {
      userClosedRef.current = false;
      setIsDropdownOpen(true);
    }
  }, [query]);

  // Query'e göre filtrelenmiş geçmiş
  const filteredHistory = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return history;
    return history.filter((item) => item.toLowerCase().includes(q));
  }, [history, query]);

  const hasHistory = filteredHistory.length > 0;

  const openDropdown = useCallback(() => {
    userClosedRef.current = false;
    setIsDropdownOpen(true);
  }, []);

  const closeDropdown = useCallback(() => {
    userClosedRef.current = true;
    setIsDropdownOpen(false);
  }, []);

  const hideDropdown = useCallback(() => {
    userClosedRef.current = false;
    setIsDropdownOpen(false);
  }, []);

  const add = useCallback(
    (item) => {
      const trimmed = (item || "").trim();
      if (!trimmed) return;

      setHistory((prev) => {
        const filtered = prev.filter(
          (q) => q.toLowerCase() !== trimmed.toLowerCase(),
        );
        const next = [trimmed, ...filtered].slice(0, MAX_ITEMS);
        writeHistory(storageKey, next);
        return next;
      });
    },
    [storageKey],
  );

  const remove = useCallback(
    (item) => {
      setHistory((prev) => {
        const next = prev.filter((q) => q !== item);
        writeHistory(storageKey, next);
        return next;
      });
    },
    [storageKey],
  );

  const clear = useCallback(() => {
    setHistory([]);
    writeHistory(storageKey, []);
    setIsDropdownOpen(false);
    userClosedRef.current = false;
  }, [storageKey]);

  return {
    history,
    filteredHistory,
    hasHistory,
    isDropdownOpen,
    openDropdown,
    closeDropdown,
    hideDropdown,
    add,
    remove,
    clear,
  };
}
