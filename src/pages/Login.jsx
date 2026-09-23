import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Login() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Giriş yapmışsa dashboard'a yönlendir.
  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGithub = () => {
    window.location.href = `${API}/api/auth/github/login`;
  };

  // Yönlendirme sırasında boş ekran gösterme.
  if (loading || user) {
    return (
      <div className="w-full px-4 py-10 text-center text-sm text-gray-500">
        Yükleniyor...
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      <div className="w-full max-w-md">

        {/* Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">
            Tekrar hoş geldin.
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Hesabına giriş yap ve kaldığın yerden devam et.
          </p>
        </div>

        {/* Kart */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">

          {/* GitHub Butonu */}
          <button
            onClick={handleGithub}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 015.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.13 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z" />
            </svg>
            GitHub ile Devam Et
          </button>

        </div>

        {/* Alt Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Hesabın yok mu?{' '}
          <Link to="/register" className="text-black font-semibold hover:underline">
            Kayıt ol
          </Link>
        </p>

      </div>
    </div>
  );
}