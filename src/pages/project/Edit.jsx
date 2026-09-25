import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PROJECT_LIMITS } from '../../constants/limits';
import { useDebounced } from '../../hooks/useDebounced';
import CharCounter from '../../components/ui/CharCounter';
import ImagePreview from '../../components/project/ImagePreview';
import CategorySelector from '../../components/project/CategoryChips';
import {
  TITLE_REGEX,
  TEXT_REGEX,
  charCount,
  findInvalidChar,
  isValidUrl,
} from '../../utils/validators';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function EditProject() {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    longDescription: '',
    githubUrl: '',
    demoUrl: '',
    imageUrl: '',
  });
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [projectAuthorId, setProjectAuthorId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [warnings, setWarnings] = useState({});

  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch(`${API}/api/projects/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error('Proje bulunamadı');
        return res.json();
      })
      .then((data) => {
        setForm({
          title: data.title || '',
          description: data.description || '',
          longDescription: data.longDescription || '',
          githubUrl: data.githubUrl || '',
          demoUrl: data.demoUrl || '',
          imageUrl: data.imageUrl || '',
        });

        setSelectedCategories(Array.isArray(data.categoryIds) ? data.categoryIds : []);
        setProjectAuthorId(data.authorId ?? null);
        setLoading(false);
      })
      .catch(() => {
        setError('Proje bulunamadı');
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (authLoading || loading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    if (projectAuthorId !== null && user.user_id !== projectAuthorId) {
      navigate(`/project/${id}`);
    }
  }, [user, authLoading, loading, projectAuthorId, id, navigate]);

  const showWarning = (field, char) => {
    setWarnings((prev) => ({ ...prev, [field]: `Geçersiz karakter: "${char}"` }));
    setTimeout(() => {
      setWarnings((prev) => ({ ...prev, [field]: '' }));
    }, 3000);
  };

  const handleTitleChange = (e) => {
    const value = e.target.value;
    if (value === '') {
      setForm({ ...form, title: '' });
      setWarnings((prev) => ({ ...prev, title: '' }));
      return;
    }
    if (!TITLE_REGEX.test(value)) {
      const bad = findInvalidChar(value, TITLE_REGEX);
      if (bad) showWarning('title', bad);
      return;
    }
    if (charCount(value) > PROJECT_LIMITS.title) return;
    setForm({ ...form, title: value });
    setWarnings((prev) => ({ ...prev, title: '' }));
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    if (value === '') {
      setForm({ ...form, [name]: '' });
      setWarnings((prev) => ({ ...prev, [name]: '' }));
      return;
    }
    if (!TEXT_REGEX.test(value)) {
      const bad = findInvalidChar(value, TEXT_REGEX);
      if (bad) showWarning(name, bad);
      return;
    }
    if (PROJECT_LIMITS[name] && charCount(value) > PROJECT_LIMITS[name]) return;
    setForm({ ...form, [name]: value });
    setWarnings((prev) => ({ ...prev, [name]: '' }));
  };

  const handleUrlChange = (e) => {
    const { name, value } = e.target;
    if (PROJECT_LIMITS[name] && charCount(value) > PROJECT_LIMITS[name]) return;
    setForm({ ...form, [name]: value });
  };

  const overLimit = (key) => charCount(form[key]) > PROJECT_LIMITS[key];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.title.trim() || !form.description.trim()) {
      setError('Başlık ve kısa açıklama zorunlu.');
      return;
    }

    for (const [key, max] of Object.entries(PROJECT_LIMITS)) {
      if (form[key] && charCount(form[key]) > max) {
        setError(`${key} alanı en fazla ${max} karakter olabilir.`);
        return;
      }
    }

    if (!isValidUrl(form.githubUrl)) {
      setError('GitHub URL geçersiz.');
      return;
    }
    if (!isValidUrl(form.demoUrl)) {
      setError('Demo URL geçersiz.');
      return;
    }
    if (!isValidUrl(form.imageUrl)) {
      setError('Görsel URL geçersiz.');
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API}/api/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          categoryIds: selectedCategories,
        }),
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

      setSuccess(true);
      setTimeout(() => {
        navigate(`/project/${id}`);
      }, 700);
    } catch {
      setError('Sunucuya bağlanılamadı');
      setSubmitting(false);
    }
  };

  const debouncedImageUrl = useDebounced(form.imageUrl, 400);

  if (authLoading || loading) {
    return (
      <div className="w-full px-4 py-10 text-center text-sm text-gray-500">
        Yükleniyor...
      </div>
    );
  }

  if (!user) return null;

  if (error && !form.title) {
    return (
      <div className="w-full px-4 py-20 text-center">
        <p className="text-sm text-gray-500">{error}</p>
        <Link to="/" className="mt-4 inline-block text-sm underline">
          Ana sayfaya dön
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">
            Projeyi düzenle.
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Değişiklikleri kaydet veya iptal et.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="title" className="block text-xs font-medium text-gray-700">
                Proje Başlığı <span className="text-red-500">*</span>
              </label>
              <CharCounter value={form.title} max={PROJECT_LIMITS.title} id="title-counter" />
            </div>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleTitleChange}
              required
              disabled={submitting}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all disabled:opacity-50 ${
                overLimit('title') ? 'border-red-400' : 'border-gray-200 focus:border-gray-400'
              }`}
            />
            {warnings.title && (
              <p role="alert" className="mt-1 text-[11px] text-amber-600">
                ⚠️ {warnings.title} — sadece harf, rakam, nokta ve alt çizgi kullanabilirsin.
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="description" className="block text-xs font-medium text-gray-700">
                Kısa Açıklama <span className="text-red-500">*</span>
              </label>
              <CharCounter value={form.description} max={PROJECT_LIMITS.description} id="description-counter" />
            </div>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleTextChange}
              required
              rows={3}
              disabled={submitting}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all resize-y disabled:opacity-50 ${
                overLimit('description') ? 'border-red-400' : 'border-gray-200 focus:border-gray-400'
              }`}
            />
            {warnings.description && (
              <p role="alert" className="mt-1 text-[11px] text-amber-600">
                ⚠️ {warnings.description} — emoji ve özel semboller kullanılamaz.
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="longDescription" className="block text-xs font-medium text-gray-700">
                Uzun Açıklama
              </label>
              <CharCounter value={form.longDescription} max={PROJECT_LIMITS.longDescription} id="long-description-counter" />
            </div>
            <textarea
              id="longDescription"
              name="longDescription"
              value={form.longDescription}
              onChange={handleTextChange}
              rows={6}
              disabled={submitting}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all resize-y disabled:opacity-50 ${
                overLimit('longDescription') ? 'border-red-400' : 'border-gray-200 focus:border-gray-400'
              }`}
            />
            {warnings.longDescription && (
              <p role="alert" className="mt-1 text-[11px] text-amber-600">
                ⚠️ {warnings.longDescription} — emoji ve özel semboller kullanılamaz.
              </p>
            )}
          </div>

          <CategorySelector
            categories={categories}
            selected={selectedCategories}
            onChange={setSelectedCategories}
            disabled={submitting}
          />

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="githubUrl" className="block text-xs font-medium text-gray-700">
                GitHub URL
              </label>
              <CharCounter value={form.githubUrl} max={PROJECT_LIMITS.githubUrl} id="github-url-counter" />
            </div>
            <input
              id="githubUrl"
              name="githubUrl"
              type="url"
              value={form.githubUrl}
              onChange={handleUrlChange}
              disabled={submitting}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all disabled:opacity-50 ${
                overLimit('githubUrl') ? 'border-red-400' : 'border-gray-200 focus:border-gray-400'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="demoUrl" className="block text-xs font-medium text-gray-700">
                Demo URL
              </label>
              <CharCounter value={form.demoUrl} max={PROJECT_LIMITS.demoUrl} id="demo-url-counter" />
            </div>
            <input
              id="demoUrl"
              name="demoUrl"
              type="url"
              value={form.demoUrl}
              onChange={handleUrlChange}
              disabled={submitting}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all disabled:opacity-50 ${
                overLimit('demoUrl') ? 'border-red-400' : 'border-gray-200 focus:border-gray-400'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="imageUrl" className="block text-xs font-medium text-gray-700">
                Kapak Görseli URL
              </label>
              <CharCounter value={form.imageUrl} max={PROJECT_LIMITS.imageUrl} id="image-url-counter" />
            </div>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={handleUrlChange}
              disabled={submitting}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all disabled:opacity-50 ${
                overLimit('imageUrl') ? 'border-red-400' : 'border-gray-200 focus:border-gray-400'
              }`}
            />
            <ImagePreview url={form.imageUrl} debouncedUrl={debouncedImageUrl} />
          </div>

          {error && (
            <div role="alert" className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          {success && (
            <div role="status" className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2.5">
              Güncellendi! Yönlendiriliyorsun...
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(`/project/${id}`)}
              disabled={submitting}
              className="flex-1 px-5 py-3 bg-white text-gray-700 text-sm font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-5 py-3 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}