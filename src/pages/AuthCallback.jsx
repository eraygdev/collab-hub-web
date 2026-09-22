import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/dashboard', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [params, navigate]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <p className="text-sm text-gray-500">Giriş yapılıyor...</p>
    </div>
  );
}