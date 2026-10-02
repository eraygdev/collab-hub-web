import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Register() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGithub = () => {
    window.location.href = `${API}/api/auth/github/login`;
  };

  if (loading || user) {
    return (
      <div className="w-full flex-1 flex items-center justify-center bg-bg">
        <p className="text-sm text-text-muted font-mono">yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex items-center justify-center bg-bg relative overflow-hidden">
      {/* Glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent opacity-[0.06] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md px-4 py-12">
        {/* Kart */}
        <div className="bg-surface border border-accent/10 rounded-2xl p-8 sm:p-10">

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-accent/15 bg-bg/50">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-mono tracking-wider text-text-muted uppercase">
              kayıt
            </span>
          </div>

          {/* Başlık */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-text mb-2">
            Hesap oluştur.
          </h1>
          <p className="text-sm text-text-muted leading-relaxed mb-8">
            Topluluğa katıl, projeni paylaş, ekibini kur.
          </p>

          {/* GitHub butonu */}
          <button
            onClick={handleGithub}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-accent text-bg text-sm font-bold rounded-xl border border-accent hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 015.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.13 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z" />
            </svg>
            GitHub ile Kayıt Ol
          </button>

          {/* Bilgi notu */}
          <div className="mt-6 pt-6 border-t border-accent/10">
            <p className="text-xs text-text-muted/70 text-center font-mono leading-relaxed">
              Kayıt olurken <span className="text-text-muted">kullanım şartlarını</span> ve{' '}
              <span className="text-text-muted">gizlilik politikasını</span> kabul etmiş sayılırsın.
            </p>
          </div>
        </div>

        {/* Alt Link */}
        <p className="text-center text-sm text-text-muted mt-6">
          Zaten hesabın var mı?{' '}
          <Link to="/login" className="text-text font-semibold hover:text-accent transition-colors underline underline-offset-2">
            Giriş yap
          </Link>
        </p>
      </div>
    </div>
  );
}