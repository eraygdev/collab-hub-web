import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';

export default function AuthCallback() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login, refreshUser } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      login(token);
      refreshUser().finally(() => {
        navigate('/dashboard', { replace: true });
      });
    } else {
      navigate('/login', { replace: true });
    }
  }, [params, navigate, login, refreshUser]);

  return (
    <div className="w-full flex-1 flex items-center justify-center bg-bg relative overflow-hidden min-h-[60vh]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent opacity-[0.06] blur-[100px] rounded-pill pointer-events-none" />

      <div className="relative flex flex-col items-center gap-4 text-center px-4">
        <svg
          className="w-8 h-8 text-accent animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-100"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>

        <p className="text-body-sm text-text-muted font-mono">
          {t('callback.loading')}<span className="animate-pulse">...</span>
        </p>
      </div>
    </div>
  );
}