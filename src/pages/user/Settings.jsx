import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from "../../context/ConfigContext";
import { useLanguage } from '../../i18n/LanguageContext';
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';
import CharWarning from '../../components/ui/CharWarning';
import InputClearButton from '../../components/ui/InputClearButton';
import * as Icon from '../../components/ui/Icons';
import { extractErrorMessage } from '../../utils/errors';
import {
  USERNAME_REGEX,
  BIO_REGEX,
  charCount,
  findInvalidChar,
} from '../../utils/validators';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Settings() {
  const { user, loading, refreshUser } = useAuth();
  const { limits } = useConfig();
  const { t } = useLanguage();

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [warnings, setWarnings] = useState({});

  const userId = user?.user_id;

  useEffect(() => {
    if (!userId) {
      setFetching(false);
      return;
    }

    if (user?.username && user?.bio !== undefined) {
      setUsername(user.username || '');
      setBio(user.bio || '');
      setFetching(false);
      return;
    }

    const token = localStorage.getItem('token');
    let cancelled = false;

    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        setUsername(data.username || '');
        setBio(data.bio || '');
        setFetching(false);
      })
      .catch(() => {
        if (cancelled) return;
        setFetching(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, user?.username, user?.bio]);

  const showWarning = (field, char) => {
    setWarnings((prev) => ({ ...prev, [field]: char }));
    setTimeout(() => {
      setWarnings((prev) => ({ ...prev, [field]: '' }));
    }, 3000);
  };

  const clearField = (name) => {
    if (name === 'username') setUsername('');
    if (name === 'bio') setBio('');
    setWarnings((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim()) {
      setError(t('settings.error.empty_username'));
      return;
    }

    if (charCount(username.trim()) < limits.username.min) {
      setError(t('errors.username_too_short'));
      return;
    }

    if (charCount(username) > limits.username.max) {
      setError(t('settings.error.username_too_long', { max: limits.username.max }));
      return;
    }
    if (charCount(bio) > limits.bio.max) {
      setError(t('settings.error.bio_too_long', { max: limits.bio.max }));
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API}/api/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: username.trim(), bio: bio.trim() }),
      });

      if (!res.ok) {
        setError(await extractErrorMessage(res, t));
        setSubmitting(false);
        return;
      }

      await refreshUser();

      setSuccess(t('settings.success'));
      setSubmitting(false);
    } catch {
      setError(t('errors.server_error'));
      setSubmitting(false);
    }
  };

  if (loading || fetching) {
    return (
      <div className="w-full bg-bg min-h-screen flex items-center justify-center">
        <p className="text-sm text-text-muted font-mono">{t('dashboard.loading')}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full bg-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <PageBreadcrumb
          items={[
            { label: t('breadcrumb.home'), to: '/' },
            { label: t('breadcrumb.profile_self'), to: `/profile/${user.username}` },
            { label: t('breadcrumb.settings') },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-2 tracking-tight">
            {t('settings.title')}
          </h1>
          <p className="text-sm text-text-muted">
            {t('settings.subtitle')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-accent/10 rounded-2xl p-6 sm:p-8 space-y-5"
        >
          <div>
            <h2 className="text-xs font-bold text-text uppercase tracking-wider font-mono">
              {t('settings.section.profile')}
            </h2>
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-bg border border-accent/15 overflow-hidden shrink-0">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.username}
                  loading="lazy"
                  decoding="async"
                  width="64"
                  height="64"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon.User className="w-8 h-8 text-text-muted" />
                </div>
              )}
            </div>
            <div className="text-xs text-text-muted font-mono">
              <p className="font-medium text-text">{t('settings.avatar_label')}</p>
              <p>{t('settings.avatar_hint')}</p>
            </div>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-xs font-medium text-text mb-1.5">
              {t('settings.username_label')}
            </label>
            <div className="relative">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setUsername('');
                    setWarnings((prev) => ({ ...prev, username: '' }));
                    return;
                  }
                  if (!USERNAME_REGEX.test(value)) {
                    const bad = findInvalidChar(value, USERNAME_REGEX);
                    if (bad) showWarning('username', bad);
                    return;
                  }
                  if (charCount(value) > limits.username.max) return;
                  setUsername(value);
                  setWarnings((prev) => ({ ...prev, username: '' }));
                }}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 pr-10 text-sm bg-bg border border-accent/15 rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/40 transition-all disabled:opacity-50 font-mono"
              />
              <InputClearButton visible={!!username} onClick={() => clearField('username')} />
            </div>
            <p className="mt-1 text-[11px] text-text-muted font-mono">
              {charCount(username)} / {limits.username.max}
            </p>
            <CharWarning char={warnings.username} />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-text mb-1.5">
              {t('settings.email_label')}
            </label>
            <input
              id="email"
              type="email"
              value={user.email || ''}
              readOnly
              disabled
              className="w-full px-3.5 py-2.5 text-sm bg-bg/60 border border-accent/10 rounded-lg text-text-muted cursor-not-allowed font-mono"
            />
            <p className="mt-1 text-[11px] text-text-muted font-mono">
              {t('settings.email_hint')}
            </p>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-xs font-medium text-text mb-1.5">
              {t('settings.bio_label')}
            </label>
            <div className="relative">
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '') {
                    setBio('');
                    setWarnings((prev) => ({ ...prev, bio: '' }));
                    return;
                  }
                  if (!BIO_REGEX.test(value)) {
                    const bad = findInvalidChar(value, BIO_REGEX);
                    if (bad) showWarning('bio', bad);
                    return;
                  }
                  if (charCount(value) > limits.bio.max) return;
                  setBio(value);
                  setWarnings((prev) => ({ ...prev, bio: '' }));
                }}
                placeholder={t('settings.bio_placeholder')}
                rows={4}
                disabled={submitting}
                className="w-full px-3.5 py-2.5 pr-10 text-sm bg-bg border border-accent/15 rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/40 transition-all resize-y disabled:opacity-50"
              />
              <InputClearButton
                visible={!!bio}
                onClick={() => clearField('bio')}
                className="top-4 translate-y-0"
              />
            </div>
            <p className="mt-1 text-[11px] text-text-muted font-mono">
              {charCount(bio)} / {limits.bio.max}
            </p>
            <CharWarning char={warnings.bio} />
          </div>

          {error && (
            <div
              role="alert"
              className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5 font-mono inline-flex items-center gap-2"
            >
              <Icon.Warning className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="text-sm text-accent bg-accent/10 border border-accent/20 rounded-lg px-4 py-2.5 font-mono inline-flex items-center gap-2"
            >
              <Icon.Check className="w-4 h-4 shrink-0" />
              {success}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-3 bg-accent text-bg text-sm font-bold rounded-lg border border-accent hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
            >
              {submitting ? t('settings.submitting') : t('settings.submit')}
            </button>
          </div>
        </form>

        {/* Tehlikeli Bölge */}
        <div className="mt-6 bg-surface border border-red-400/20 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 font-mono">
            {t('settings.danger.title')}
          </h2>
          <p className="text-sm text-text-muted mb-4">
            {t('settings.danger.desc')}
          </p>
          <button
            type="button"
            disabled
            className="px-5 py-2.5 text-sm font-semibold text-red-400 bg-transparent border border-red-400/30 rounded-lg opacity-50 cursor-not-allowed font-mono"
          >
            {t('settings.danger.button')}
          </button>
        </div>

      </div>
    </div>
  );
}