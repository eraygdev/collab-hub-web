import { createContext, useContext, useEffect, useState } from 'react';

const ConfigContext = createContext(null);
const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Fallback — backend'e ulaşamazsa veya hata verirse.
// Değerler backend'deki constants.go ile uyumlu TUTULMALI.
const FALLBACK_LIMITS = {
  title: { min: 3, max: 80 },
  description: { min: 20, max: 150 },
  longDescription: { min: 0, max: 500 },
  githubUrl: { max: 200 },
  demoUrl: { max: 200 },
  imageUrl: { max: 300 },
  username: { min: 3, max: 30 },
  bio: { min: 0, max: 150 },
  maxCategories: 5,
  maxProjectsPerUser: 10,
  maxSearchLen: 100,
  maxProjectsPerPage: 20,
  maxUsersPerSearch: 5,
  visibleCategories: 12,  // frontend-specific
};

export function ConfigProvider({ children }) {
  const [limits, setLimits] = useState(FALLBACK_LIMITS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API}/api/config`)
      .then((res) => {
        if (!res.ok) throw new Error('fetch_failed');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (data?.limits) {
          setLimits({ ...FALLBACK_LIMITS, ...data.limits });
        }
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        // Hata → fallback kalır, sessizce devam et
        if (import.meta.env.DEV) {
          console.warn('[Config] Backend config not loaded, using fallback');
        }
        setError(true);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <ConfigContext.Provider value={{ limits, loading, error }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const ctx = useContext(ConfigContext);
  if (!ctx) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return ctx;
}