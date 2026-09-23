import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Token'ı localStorage'dan okuyup decode eder.
// base64url → base64 dönüşümü + UTF-8 güvenli decode.
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    // base64url → base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // UTF-8 güvenli decode
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

// Tüm uygulamaya kullanıcı bilgisini dağıtan sağlayıcı.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sayfa ilk açıldığında token var mı diye bakar.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      if (isTokenValid(decoded)) {
        setUser(decoded);
      } else {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Her dakika token'ı kontrol et, expire olduysa otomatik logout.
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (!token) return;
      const decoded = decodeToken(token);
      if (!isTokenValid(decoded)) {
        localStorage.removeItem('token');
        setUser(null);
        // Kullanıcıyı login'e yönlendir
        if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
          window.location.href = '/login';
        }
      }
    }, 60 * 1000); // her dakika
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

  // /api/auth/me'den taze veri çekip user'ı günceller (Settings için).
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const res = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return null;
      const data = await res.json();
      // Mevcut decoded user'a taze alanları merge et
      setUser((prev) => ({ ...prev, ...data, user_id: data.user_id }));
      return data;
    } catch {
      return null;
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

// Herhangi bir bileşende kullanıcı bilgisine erişmek için hook.
export function useAuth() {
  return useContext(AuthContext);
}