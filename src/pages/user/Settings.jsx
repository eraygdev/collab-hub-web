import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';
import CharWarning from '../../components/ui/CharWarning';
import { PROFILE_LIMITS } from '../../constants/limits';
import {
  USERNAME_REGEX,
  BIO_REGEX,
  charCount,
  findInvalidChar,
} from '../../utils/validators';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Settings() {
  const { user, loading, refreshUser } = useAuth();

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
  }, [userId]);

  const showWarning = (field, char) => {
    setWarnings((prev) => ({ ...prev, [field]: char }));
    setTimeout(() => {
      setWarnings((prev) => ({ ...prev, [field]: '' }));
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim()) {
      setError('Kullanıcı adı boş olamaz.');
      return;
    }

    if (charCount(username) > PROFILE_LIMITS.username) {
      setError(`Kullanıcı adı en fazla ${PROFILE_LIMITS.username} karakter olabilir.`);
      return;
    }
    if (charCount(bio) > PROFILE_LIMITS.bio) {
      setError(`Hakkımda en fazla ${PROFILE_LIMITS.bio} karakter olabilir.`);
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

      const text = await res.text();
      let data = {};
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          data = { error: 'Sunucu geçersiz cevap döndü' };
        }
      }

      if (!res.ok) {
        setError(data.error || 'Bir hata oluştu');
        setSubmitting(false);
        return;
      }

      await refreshUser();

      setSuccess('Profil başarıyla güncellendi.');
      setSubmitting(false);
    } catch {
      setError('Sunucuya bağlanılamadı');
      setSubmitting(false);
    }
  };

  if (loading || fetching) {
    return (
      <div className="w-full bg-bg min-h-screen flex items-center justify-center">
        <p className="text-sm text-text-muted font-mono">yükleniyor...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full bg-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <PageBreadcrumb
          items={[
            { label: 'ana sayfa', to: '/' },
            { label: 'dashboard', to: '/dashboard' },
            { label: 'ayarlar' },
          ]}
        />

        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-2 tracking-tight">
            Ayarlar.
          </h1>
          <p className="text-sm text-text-muted">
            Hesap bilgilerini ve tercihlerini yönet.
          </p>
        </div>

        {/* ───── Profil Formu ───── */}
        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-accent/10 rounded-2xl p-6 sm:p-8 space-y-5"
        >
          <div>
            <h2 className="text-xs font-bold text-text uppercase tracking-wider font-mono">
              /profil bilgileri
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
                  <svg className="w-8 h-8 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="text-xs text-text-muted font-mono">
              <p className="font-medium text-text">Profil fotoğrafı</p>
              <p>GitHub hesabından otomatik geliyor.</p>
            </div>
          </div>

          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-xs font-medium text-text mb-1.5">
              Kullanıcı Adı
            </label>
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
                if (charCount(value) > PROFILE_LIMITS.username) return;
                setUsername(value);
                setWarnings((prev) => ({ ...prev, username: '' }));
              }}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 text-sm bg-bg border border-accent/15 rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/40 transition-all disabled:opacity-50 font-mono"
            />
            <p className="mt-1 text-[11px] text-text-muted font-mono">
              {charCount(username)} / {PROFILE_LIMITS.username}
            </p>
            <CharWarning char={warnings.username} />
          </div>

          {/* Email (readonly) */}
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-text mb-1.5">
              E-posta
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
              GitHub hesabından geliyor, değiştirilemez.
            </p>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-xs font-medium text-text mb-1.5">
              Hakkımda
            </label>
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
                if (charCount(value) > PROFILE_LIMITS.bio) return;
                setBio(value);
                setWarnings((prev) => ({ ...prev, bio: '' }));
              }}
              placeholder="Kendinden kısaca bahset..."
              rows={4}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 text-sm bg-bg border border-accent/15 rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent/40 transition-all resize-y disabled:opacity-50"
            />
            <p className="mt-1 text-[11px] text-text-muted font-mono">
              {charCount(bio)} / {PROFILE_LIMITS.bio}
            </p>
            <CharWarning char={warnings.bio} />
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5 font-mono"
            >
              ⚠ {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div
              role="status"
              className="text-sm text-accent bg-accent/10 border border-accent/20 rounded-lg px-4 py-2.5 font-mono"
            >
              ✓ {success}
            </div>
          )}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-3 bg-accent text-bg text-sm font-bold rounded-lg border border-accent hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
            >
              {submitting ? 'kaydediliyor...' : 'değişiklikleri kaydet'}
            </button>
          </div>
        </form>

        {/* ───── Tehlikeli Bölge ───── */}
        <div className="mt-6 bg-surface border border-red-400/20 rounded-2xl p-6 sm:p-8">
          <h2 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 font-mono">
            /tehlikeli bölge
          </h2>
          <p className="text-sm text-text-muted mb-4">
            Hesabını sildiğinde tüm projelerin ve verilerin kalıcı olarak silinir.
          </p>
          <button
            type="button"
            disabled
            className="px-5 py-2.5 text-sm font-semibold text-red-400 bg-transparent border border-red-400/30 rounded-lg opacity-50 cursor-not-allowed font-mono"
          >
            hesabı sil (yakında)
          </button>
        </div>

      </div>
    </div>
  );
}