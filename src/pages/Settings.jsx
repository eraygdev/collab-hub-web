import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PROFILE_LIMITS } from '../constants/limits';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// ✅ Kullanıcı adı: sadece harf, rakam, _ . ve boşluk
const ALLOWED_USERNAME_REGEX = /^[a-zA-Z0-9çÇğĞıİöÖşŞüÜ_. ]*$/;

// ✅ Bio: harf, rakam, noktalama, boşluk, satır sonu (emoji/CJK yok)
const ALLOWED_BIO_REGEX = /^[a-zA-Z0-9çÇğĞıİöÖşŞüÜ.,!?;:'"()\[\]{}\-_/|@#$%&*+=~\s]*$/;

function charCount(str) {
  return str.length;
}

// ✅ Geçersiz karakteri bulur (uyarı mesajı için)
function findInvalidChar(value, regex) {
  for (const char of value) {
    if (!regex.test(char)) return char;
  }
  return null;
}

export default function Settings() {
  const { user, loading, refreshUser } = useAuth();

  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [fetching, setFetching] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ✅ Alan bazlı geçersiz karakter uyarıları
  const [warnings, setWarnings] = useState({});

  useEffect(() => {
    if (!user) {
      setFetching(false);
      return;
    }

    const token = localStorage.getItem('token');
    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsername(data.username || '');
        setBio(data.bio || '');
        setFetching(false);
      })
      .catch(() => setFetching(false));
  }, [user]);

  // ✅ Uyarıyı göster ve 3 saniye sonra otomatik temizle
  const showWarning = (field, char) => {
    setWarnings((prev) => ({ ...prev, [field]: `Geçersiz karakter: "${char}"` }));
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
      <div className="w-full px-4 py-10 text-center text-sm text-gray-500">
        Yükleniyor...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">
            Ayarlar.
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Hesap bilgilerini ve tercihlerini yönet.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5"
        >
          <div>
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Profil Bilgileri
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 border border-gray-300 overflow-hidden shrink-0">
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
                  <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500">
              <p className="font-medium text-gray-700">Profil fotoğrafı</p>
              <p>GitHub hesabından otomatik geliyor.</p>
            </div>
          </div>

          <div>
            <label htmlFor="username" className="block text-xs font-medium text-gray-700 mb-1.5">
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
                if (!ALLOWED_USERNAME_REGEX.test(value)) {
                  const bad = findInvalidChar(value, ALLOWED_USERNAME_REGEX);
                  if (bad) showWarning('username', bad);
                  return;
                }
                if (value.length > PROFILE_LIMITS.username) return;
                setUsername(value);
                setWarnings((prev) => ({ ...prev, username: '' }));
              }}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all disabled:opacity-50"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              {username.length} / {PROFILE_LIMITS.username}
            </p>
            {warnings.username && (
              <p role="alert" className="mt-1 text-[11px] text-amber-600">
                ⚠️ {warnings.username} — sadece harf, rakam, nokta ve alt çizgi kullanabilirsin.
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-medium text-gray-700 mb-1.5">
              E-posta
            </label>
            <input
              id="email"
              type="email"
              value={user.email || ''}
              readOnly
              disabled
              className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              GitHub hesabından geliyor, değiştirilemez.
            </p>
          </div>

          <div>
            <label htmlFor="bio" className="block text-xs font-medium text-gray-700 mb-1.5">
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
                if (!ALLOWED_BIO_REGEX.test(value)) {
                  const bad = findInvalidChar(value, ALLOWED_BIO_REGEX);
                  if (bad) showWarning('bio', bad);
                  return;
                }
                if (value.length > PROFILE_LIMITS.bio) return;
                setBio(value);
                setWarnings((prev) => ({ ...prev, bio: '' }));
              }}
              placeholder="Kendinden kısaca bahset..."
              rows={4}
              disabled={submitting}
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-400 transition-all resize-y disabled:opacity-50"
            />
            <p className="mt-1 text-[11px] text-gray-400">
              {bio.length} / {PROFILE_LIMITS.bio}
            </p>
            {warnings.bio && (
              <p role="alert" className="mt-1 text-[11px] text-amber-600">
                ⚠️ {warnings.bio} — emoji ve özel semboller kullanılamaz.
              </p>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5"
            >
              {error}
            </div>
          )}

          {success && (
            <div
              role="status"
              className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2.5"
            >
              {success}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-6 py-3 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </form>

        <div className="mt-6 bg-white border border-red-100 rounded-2xl p-6 sm:p-8">
          <h2 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-2">
            Tehlikeli Bölge
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Hesabını sildiğinde tüm projelerin ve verilerin kalıcı olarak silinir.
          </p>
          <button
            type="button"
            disabled
            className="px-5 py-2.5 text-sm font-semibold text-red-600 bg-white border border-red-200 rounded-lg opacity-50 cursor-not-allowed"
          >
            Hesabı Sil (yakında)
          </button>
        </div>

      </div>
    </div>
  );
}