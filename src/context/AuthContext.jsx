import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Token'ı localStorage'dan okuyup decode eder.
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

// Token geçerli mi? (exp kontrolü)
function isTokenValid(decoded) {
  if (!decoded || !decoded.exp) return false;
  return decoded.exp * 1000 > Date.now();
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // /api/auth/me'den taze veri çekip user'ı günceller.
  // JWT'de avatar_url olmadığı için bu fonksiyon kritik.
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      // JWT'den gelen user_id'yi koru, DB'den gelen alanları merge et
      setUser((prev) => ({ ...prev, ...data }));
      return data;
    } catch {
      return null;
    }
  }, []);

  // Sayfa ilk açıldığında token var mı diye bakar.
  // Token varsa: JWT'yi decode et + /api/auth/me'den taze veriyi çek.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      if (isTokenValid(decoded)) {
        setUser(decoded);
        // JWT'de avatar_url yok → taze veriyi hemen çek
        refreshUser().finally(() => setLoading(false));
        return;
      } else {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, [refreshUser]);

  // Her dakika token'ı kontrol et, expire olduysa otomatik logout.
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const decoded = decodeToken(token);
      if (!isTokenValid(decoded)) {
        localStorage.removeItem('token');
        setUser(null);
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
    }, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // AuthCallback gibi yerlerden token set etmek için.
  const login = useCallback((token) => {
    localStorage.setItem('token', token);
    const decoded = decodeToken(token);
    if (isTokenValid(decoded)) {
      setUser(decoded);
    }
  }, []);

  // Çıkış yapar: token'ı sil, kullanıcıyı sıfırla.
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}