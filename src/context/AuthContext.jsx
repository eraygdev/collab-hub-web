import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

const AuthContext = createContext(null);
import { API } from '../utils/api';

function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function isTokenValid(decoded) {
  if (!decoded || !decoded.exp) return false;
  return decoded.exp * 1000 > Date.now();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);
  const abortRef = useRef(null);
  const refreshingRef = useRef(false);  // ✅ YENİ

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    // ✅ Guard: Aynı anda 2. çağrı gelirse hemen çık
    if (refreshingRef.current) return null;
    refreshingRef.current = true;

    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) return null;
      const data = await res.json();

      // ✅ Guard: veri değişmediyse state'i güncelleme (referans sabit kalsın)
      setUser((prev) => {
        if (!prev) return data;

        const isSame =
          prev.user_id === data.user_id &&
          prev.username === data.username &&
          prev.email === data.email &&
          prev.avatar_url === data.avatar_url &&
          prev.bio === data.bio &&
          prev.is_premium === data.is_premium &&
          prev.projectCount === data.projectCount &&
          prev.maxProjects === data.maxProjects;

        return isSame ? prev : { ...prev, ...data };
      });

      return data;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') return null;
      if (import.meta.env.DEV) {
        console.warn('[AuthContext] refreshUser failed:', err.message);
      }
      return null;
    } finally {
      // ✅ Her durumda flag'i sıfırla
      refreshingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = decodeToken(token);
        if (isTokenValid(decoded)) {
          setUser(decoded);
          await refreshUser();
        } else {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [refreshUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const decoded = decodeToken(token);
      if (!isTokenValid(decoded)) {
        localStorage.removeItem('token');
        setUser(null);
        if (
          window.location.pathname !== '/login' &&
          window.location.pathname !== '/register'
        ) {
          window.location.href = '/login';
        }
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const login = useCallback((token) => {
    localStorage.setItem('token', token);
    const decoded = decodeToken(token);
    if (isTokenValid(decoded)) {
      setUser(decoded);
    }
  }, []);

  const setProjectCount = useCallback((count) => {
    setUser((prev) => (prev ? { ...prev, projectCount: count } : prev));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, refreshUser, setProjectCount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}