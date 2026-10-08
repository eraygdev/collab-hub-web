import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import { useLanguage } from '../../i18n/LanguageContext';
import Avatar from '../../components/ui/Avatar';
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

import { API } from '../../utils/api';

export default function Account() {
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
      setError(t('settings.account.error.empty_username'));
      return;
    }

    if (charCount(username.trim()) < limits.username.min) {
      setError(t('errors.username_too_short'));
      return;
    }

    if (charCount(username) > limits.username.max) {
      setError(t('settings.account.error.username_too_long', { max: limits.username.max }));
      return;
    }
    if (charCount(bio) > limits.bio.max) {
      setError(t('settings.account.error.bio_too_long', { max: limits.bio.max }));
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

      setSuccess(t('settings.account.success'));
      setSubmitting(false);
    } catch {
      setError(t('errors.server_error'));
      setSubmitting(false);
    }
  };

  if (loading || fetching) {
    return (
      <div className="bg-surface border border-accent/10 rounded-card p-8 flex items-center justify-center min-h-[200px]">
        <p className="text-body-sm text-text-muted font-mono">{t('dashboard.loading')}</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-surface border border-accent/10 rounded-card p-6 sm:p-8 space-y-5"
    >
      <div>
        <h2 className="text-caption font-bold text-text uppercase tracking-wider font-mono">
          {t('settings.account.section.profile')}
        </h2>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4">
        <Avatar src={user.avatar_url} username={user.username} size="xl" />
        <div className="text-caption text-text-muted font-mono">
          <p className="font-medium text-text">{t('settings.account.avatar_label')}</p>
          <p>{t('settings.account.avatar_hint')}</p>
        </div>
      </div>

      {/* Username */}
      <div>
        <label htmlFor="username" className="block text-caption font-medium text-text mb-1.5">
          {t('settings.account.username_label')}
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
            className="w-full px-3.5 py-2.5 pr-10 text-body-sm bg-bg border border-accent/15 rounded-button text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/40 transition-all disabled:opacity-50 font-mono"
          />
          <InputClearButton visible={!!username} onClick={() => clearField('username')} />
        </div>
        <p className="mt-1 text-mono-sm text-text-muted font-mono">
          {charCount(username)} / {limits.username.max}
        </p>
        <CharWarning char={warnings.username} />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-caption font-medium text-text mb-1.5">
          {t('settings.account.email_label')}
        </label>
        <input
          id="email"
          type="email"
          value={user.email || ''}
          readOnly
          disabled
          className="w-full px-3.5 py-2.5 text-body-sm bg-bg/60 border border-accent/10 rounded-button text-text-muted cursor-not-allowed font-mono"
        />
        <p className="mt-1 text-mono-sm text-text-muted font-mono">
          {t('settings.account.email_hint')}
        </p>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className="block text-caption font-medium text-text mb-1.5">
          {t('settings.account.bio_label')}
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
            placeholder={t('settings.account.bio_placeholder')}
            rows={4}
            disabled={submitting}
            className="w-full px-3.5 py-2.5 pr-10 text-body-sm bg-bg border border-accent/15 rounded-button text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/40 transition-all resize-y disabled:opacity-50"
          />
          <InputClearButton
            visible={!!bio}
            onClick={() => clearField('bio')}
            className="top-4 translate-y-0"
          />
        </div>
        <p className="mt-1 text-mono-sm text-text-muted font-mono">
          {charCount(bio)} / {limits.bio.max}
        </p>
        <CharWarning char={warnings.bio} />
      </div>

      {error && (
        <div
          role="alert"
          className="text-body-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-button px-4 py-2.5 font-mono inline-flex items-center gap-2"
        >
          <Icon.Warning className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="text-body-sm text-accent bg-accent/10 border border-accent/20 rounded-button px-4 py-2.5 font-mono inline-flex items-center gap-2"
        >
          <Icon.Check className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto px-6 py-3 bg-accent text-bg text-body-sm font-bold rounded-button border border-accent hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
        >
          {submitting ? t('settings.account.submitting') : t('settings.account.submit')}
        </button>
      </div>
    </form>
  );
}