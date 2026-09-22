import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Token'ı localStorage'dan okuyup decode eder.
function decodeToken(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
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
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(decoded);
      } else {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Çıkış yapar: token'ı sil, kullanıcıyı sıfırla.
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Herhangi bir bileşende kullanıcı bilgisine erişmek için hook.
export function useAuth() {
  return useContext(AuthContext);
}