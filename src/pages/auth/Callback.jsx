import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login, refreshUser } = useAuth();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      login(token); // Token'ı localStorage'a koy, user'ı JWT'den doldur
      // Taze veriyi /api/auth/me'den çek (avatar_url, bio vs.)
      refreshUser().finally(() => {
        navigate('/dashboard', { replace: true });
      });
    } else {
      navigate('/login', { replace: true });
    }
  }, [params, navigate, login, refreshUser]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <p className="text-sm text-gray-500">Giriş yapılıyor...</p>
    </div>
  );
}