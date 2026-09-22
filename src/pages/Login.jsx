import { Link } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Login() {
  const handleGoogle = () => {
    window.location.href = `${API}/api/auth/google/login`;
  };

  const handleGithub = () => {
    window.location.href = `${API}/api/auth/github/login`;
  };

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
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">

          {/* Google Butonu */}
          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 px-5 py-3 bg-white text-gray-900 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Google ile Devam Et
          </button>

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