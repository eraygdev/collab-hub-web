import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import * as Icon from '../../components/ui/Icons';

import { API } from '../../utils/api';

export default function Register() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleGithub = () => {
    window.location.href = `${API}/api/auth/github/login`;
  };

  if (loading || user) {
    return (
      <div className="w-full flex-1 flex items-center justify-center bg-bg">
        <p className="text-body-sm text-text-muted font-mono">{t('auth.loading')}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex items-center justify-center bg-bg relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-accent opacity-[0.06] blur-[120px] rounded-pill pointer-events-none" />

      <div className="relative w-full max-w-md px-4 py-12">
        <div className="bg-surface border border-accent/10 rounded-card p-8 sm:p-10">

          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-pill border border-accent/15 bg-bg/50">
            <span className="w-1.5 h-1.5 rounded-pill bg-accent animate-pulse" />
            <span className="text-mono-sm font-mono tracking-wider text-text-muted uppercase">
              {t('register.eyebrow')}
            </span>
          </div>

          <h1 className="text-h3 font-extrabold tracking-tight text-text mb-2">
            {t('register.title')}
          </h1>
          <p className="text-body-sm text-text-muted leading-relaxed mb-8">
            {t('register.subtitle')}
          </p>

          <button
            onClick={handleGithub}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 bg-accent text-bg text-body-sm font-bold rounded-button border border-accent hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer"
          >
            <Icon.Github className="w-5 h-5" />
            {t('register.github_button')}
          </button>

          <div className="mt-6 pt-6 border-t border-accent/10">
            <p className="text-caption text-text-muted/70 text-center font-mono leading-relaxed">
              {t('register.terms_prefix')}{' '}
              <Link
                to="/terms"
                className="text-text-muted hover:text-accent underline underline-offset-2 transition-colors"
              >
                {t('register.terms_link')}
              </Link>{' '}
              {t('register.and')}{' '}
              <Link
                to="/privacy"
                className="text-text-muted hover:text-accent underline underline-offset-2 transition-colors"
              >
                {t('register.privacy_link')}
              </Link>
              {t('register.terms_suffix')}
            </p>
          </div>
        </div>

        <p className="text-center text-body-sm text-text-muted mt-6">
          {t('register.has_account')}{' '}
          <Link
            to="/login"
            className="text-text font-semibold hover:text-accent transition-colors underline underline-offset-2"
          >
            {t('register.login_link')}
          </Link>
        </p>
      </div>
    </div>
  );
}