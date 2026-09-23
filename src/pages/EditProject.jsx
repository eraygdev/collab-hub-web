import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PROJECT_LIMITS } from '../constants/limits';
import { useDebounced } from '../hooks/useDebounced';
import CharCounter from '../components/CharCounter';
import ImagePreview from '../components/ImagePreview';
import CategorySelector from '../components/CategorySelector';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

function isValidUrl(str) {
  if (!str) return true;
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

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
  const [projectCategoryNames, setProjectCategoryNames] = useState([]);
  const [projectAuthorId, setProjectAuthorId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Kategorileri çek
  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  // Projeyi çek ve formu doldur
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

        setProjectCategoryNames(data.categories || []);
        setProjectAuthorId(data.authorId ?? null);
        setLoading(false);
      })
      .catch(() => {
        setError('Proje bulunamadı');
        setLoading(false);
      });
  }, [id]);

  // categories state'i geldiğinde name → id dönüşümü yap
  useEffect(() => {
    if (categories.length === 0 || projectCategoryNames.length === 0) return;
    const ids = categories
      .filter((c) => projectCategoryNames.includes(c.name))
      .map((c) => c.id);
    setSelectedCategories(ids);
  }, [categories, projectCategoryNames]);

  // Yetki kontrolü: giriş yapmamışsa login'e, yazar değilse proje sayfasına
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (PROJECT_LIMITS[name] && value.length > PROJECT_LIMITS[name]) return;
    setForm({ ...form, [name]: value });
  };

  const overLimit = (key) => form[key].length > PROJECT_LIMITS[key];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.title.trim() || !form.description.trim()) {
      setError('Başlık ve kısa açıklama zorunlu.');
      return;
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

          {/* Başlık */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="title" className="block text-xs font-medium text-gray-700">
                Proje Başlığı <span className="text-red-500">*</span>
              </label>
              <CharCounter current={form.title.length} max={PROJECT_LIMITS.title} id="title-counter" />
            </div>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              required
              maxLength={PROJECT_LIMITS.title}
              disabled={submitting}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all disabled:opacity-50 ${
                overLimit('title') ? 'border-red-400' : 'border-gray-200 focus:border-gray-400'
              }`}
            />
          </div>

          {/* Kısa Açıklama */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="description" className="block text-xs font-medium text-gray-700">
                Kısa Açıklama <span className="text-red-500">*</span>
              </label>
              <CharCounter current={form.description.length} max={PROJECT_LIMITS.description} id="description-counter" />
            </div>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={3}
              maxLength={PROJECT_LIMITS.description}
              disabled={submitting}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all resize-y disabled:opacity-50 ${
                overLimit('description') ? 'border-red-400' : 'border-gray-200 focus:border-gray-400'
              }`}
            />
          </div>

          {/* Uzun Açıklama */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="longDescription" className="block text-xs font-medium text-gray-700">
                Uzun Açıklama
              </label>
              <CharCounter current={form.longDescription.length} max={PROJECT_LIMITS.longDescription} id="long-description-counter" />
            </div>
            <textarea
              id="longDescription"
              name="longDescription"
              value={form.longDescription}
              onChange={handleChange}
              rows={6}
              maxLength={PROJECT_LIMITS.longDescription}
              disabled={submitting}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all resize-y disabled:opacity-50 ${
                overLimit('longDescription') ? 'border-red-400' : 'border-gray-200 focus:border-gray-400'
              }`}
            />
          </div>

          {/* Kategoriler */}
          <CategorySelector
            categories={categories}
            selected={selectedCategories}
            onChange={setSelectedCategories}
            disabled={submitting}
          />

          {/* GitHub URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="githubUrl" className="block text-xs font-medium text-gray-700">
                GitHub URL
              </label>
              <CharCounter current={form.githubUrl.length} max={PROJECT_LIMITS.githubUrl} id="github-url-counter" />
            </div>
            <input
              id="githubUrl"
              name="githubUrl"
              type="url"
              value={form.githubUrl}
              onChange={handleChange}
              maxLength={PROJECT_LIMITS.githubUrl}
              disabled={submitting}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all disabled:opacity-50 ${
                overLimit('githubUrl') ? 'border-red-400' : 'border-gray-200 focus:border-gray-400'
              }`}
            />
          </div>

          {/* Demo URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="demoUrl" className="block text-xs font-medium text-gray-700">
                Demo URL
              </label>
              <CharCounter current={form.demoUrl.length} max={PROJECT_LIMITS.demoUrl} id="demo-url-counter" />
            </div>
            <input
              id="demoUrl"
              name="demoUrl"
              type="url"
              value={form.demoUrl}
              onChange={handleChange}
              maxLength={PROJECT_LIMITS.demoUrl}
              disabled={submitting}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all disabled:opacity-50 ${
                overLimit('demoUrl') ? 'border-red-400' : 'border-gray-200 focus:border-gray-400'
              }`}
            />
          </div>

          {/* Görsel URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="imageUrl" className="block text-xs font-medium text-gray-700">
                Kapak Görseli URL
              </label>
              <CharCounter current={form.imageUrl.length} max={PROJECT_LIMITS.imageUrl} id="image-url-counter" />
            </div>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={handleChange}
              maxLength={PROJECT_LIMITS.imageUrl}
              disabled={submitting}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all disabled:opacity-50 ${
                overLimit('imageUrl') ? 'border-red-400' : 'border-gray-200 focus:border-gray-400'
              }`}
            />
            <ImagePreview url={form.imageUrl} debouncedUrl={debouncedImageUrl} />
          </div>

          {/* Hata */}
          {error && (
            <div role="alert" className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          {/* Başarı */}
          {success && (
            <div role="status" className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-4 py-2.5">
              Güncellendi! Yönlendiriliyorsun...
            </div>
          )}

          {/* Butonlar */}
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