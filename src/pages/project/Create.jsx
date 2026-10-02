import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { PROJECT_LIMITS } from '../../constants/limits';
import { useDebounced } from '../../hooks/useDebounced';
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';
import CharCounter from '../../components/ui/CharCounter';
import CharWarning from '../../components/ui/CharWarning';
import ImagePreview from '../../components/project/ImagePreview';
import CategorySelector from '../../components/project/CategoryChips';
import * as Icon from '../../components/ui/Icons';
import {
  TITLE_REGEX,
  TEXT_REGEX,
  charCount,
  findInvalidChar,
  isValidUrl,
} from '../../utils/validators';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const DRAFT_KEY = 'createProjectDraft';

export default function CreateProject() {
  const { user, loading } = useAuth();
  const { t } = useLanguage();
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [warnings, setWarnings] = useState({});

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    fetch(`${API}/api/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories([]));
  }, []);

  const [draftLoaded, setDraftLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const { _selectedCategories, ...formData } = parsed;
        setForm((prev) => ({ ...prev, ...formData }));
        if (Array.isArray(_selectedCategories)) {
          setSelectedCategories(_selectedCategories);
        }
      }
    } catch {}
    setDraftLoaded(true);
  }, []);

  useEffect(() => {
    if (!draftLoaded) return;
    const t2 = setTimeout(() => {
      try {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({
            ...form,
            _selectedCategories: selectedCategories,
          })
        );
      } catch {}
    }, 800);
    return () => clearTimeout(t2);
  }, [form, selectedCategories, draftLoaded]);

  const debouncedImageUrl = useDebounced(form.imageUrl, 400);

  const showWarning = (field, char) => {
    setWarnings((prev) => ({ ...prev, [field]: char }));
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
      setError(t('create.error.title_required'));
      return;
    }

    for (const [key, max] of Object.entries(PROJECT_LIMITS)) {
      if (form[key] && charCount(form[key]) > max) {
        setError(t('create.error.too_long', { field: key, max }));
        return;
      }
    }

    if (!isValidUrl(form.githubUrl)) {
      setError(t('create.error.github_invalid'));
      return;
    }
    if (!isValidUrl(form.demoUrl)) {
      setError(t('create.error.demo_invalid'));
      return;
    }
    if (!isValidUrl(form.imageUrl)) {
      setError(t('create.error.image_invalid'));
      return;
    }

    setSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          categoryIds: selectedCategories,
        }),
      });

      if (!res.ok) {
        setError(t('create.error.generic'));
        setSubmitting(false);
        return;
      }

      const data = await res.json();

      localStorage.removeItem(DRAFT_KEY);
      setSelectedCategories([]);
      setSuccess(true);

      setTimeout(() => {
        navigate(`/project/${data.id}`);
      }, 700);
    } catch {
      setError(t('create.error.network'));
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (loading) {
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
            { label: t('breadcrumb.dashboard'), to: '/dashboard' },
            { label: t('breadcrumb.new_project') },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-2 tracking-tight">
            {t('create.title')}
          </h1>
          <p className="text-sm text-text-muted">
            {t('create.subtitle')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-surface border border-accent/10 rounded-2xl p-6 sm:p-8"
        >
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="title" className="block text-xs font-medium text-text">
                {t('create.title_label')} <span className="text-red-400">{t('common.required')}</span>
              </label>
              <CharCounter value={form.title} max={PROJECT_LIMITS.title} id="title-counter" />
            </div>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleTitleChange}
              placeholder={t('create.title_placeholder')}
              required
              disabled={submitting}
              aria-describedby="title-counter"
              aria-invalid={overLimit('title')}
              className={`w-full px-3.5 py-2.5 text-sm bg-bg border rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-50 font-mono ${
                overLimit('title') ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
              }`}
            />
            <CharWarning char={warnings.title} />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="description" className="block text-xs font-medium text-text">
                {t('create.description_label')} <span className="text-red-400">{t('common.required')}</span>
              </label>
              <CharCounter value={form.description} max={PROJECT_LIMITS.description} id="description-counter" />
            </div>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleTextChange}
              placeholder={t('create.description_placeholder')}
              required
              rows={3}
              disabled={submitting}
              aria-describedby="description-counter"
              aria-invalid={overLimit('description')}
              className={`w-full px-3.5 py-2.5 text-sm bg-bg border rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all resize-y disabled:opacity-50 ${
                overLimit('description') ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
              }`}
            />
            <CharWarning char={warnings.description} />
          </div>

          {/* Long Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="longDescription" className="block text-xs font-medium text-text">
                {t('create.long_description_label')}
              </label>
              <CharCounter value={form.longDescription} max={PROJECT_LIMITS.longDescription} id="long-description-counter" />
            </div>
            <textarea
              id="longDescription"
              name="longDescription"
              value={form.longDescription}
              onChange={handleTextChange}
              placeholder={t('create.long_description_placeholder')}
              rows={6}
              disabled={submitting}
              aria-describedby="long-description-counter"
              aria-invalid={overLimit('longDescription')}
              className={`w-full px-3.5 py-2.5 text-sm bg-bg border rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all resize-y disabled:opacity-50 ${
                overLimit('longDescription') ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
              }`}
            />
            <CharWarning char={warnings.longDescription} />
          </div>

          <CategorySelector
            categories={categories}
            selected={selectedCategories}
            onChange={setSelectedCategories}
            disabled={submitting}
          />

          {/* GitHub URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="githubUrl" className="block text-xs font-medium text-text">
                {t('create.github_label')}
              </label>
              <CharCounter value={form.githubUrl} max={PROJECT_LIMITS.githubUrl} id="github-url-counter" />
            </div>
            <input
              id="githubUrl"
              name="githubUrl"
              type="url"
              value={form.githubUrl}
              onChange={handleUrlChange}
              placeholder={t('create.github_placeholder')}
              disabled={submitting}
              aria-describedby="github-url-counter"
              aria-invalid={overLimit('githubUrl')}
              className={`w-full px-3.5 py-2.5 text-sm bg-bg border rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-50 font-mono ${
                overLimit('githubUrl') ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
              }`}
            />
          </div>

          {/* Demo URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="demoUrl" className="block text-xs font-medium text-text">
                {t('create.demo_label')}
              </label>
              <CharCounter value={form.demoUrl} max={PROJECT_LIMITS.demoUrl} id="demo-url-counter" />
            </div>
            <input
              id="demoUrl"
              name="demoUrl"
              type="url"
              value={form.demoUrl}
              onChange={handleUrlChange}
              placeholder={t('create.demo_placeholder')}
              disabled={submitting}
              aria-describedby="demo-url-counter"
              aria-invalid={overLimit('demoUrl')}
              className={`w-full px-3.5 py-2.5 text-sm bg-bg border rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-50 font-mono ${
                overLimit('demoUrl') ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
              }`}
            />
          </div>

          {/* Image URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="imageUrl" className="block text-xs font-medium text-text">
                {t('create.image_label')}
              </label>
              <CharCounter value={form.imageUrl} max={PROJECT_LIMITS.imageUrl} id="image-url-counter" />
            </div>
            <input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={form.imageUrl}
              onChange={handleUrlChange}
              placeholder={t('create.image_placeholder')}
              disabled={submitting}
              aria-describedby="image-url-counter image-url-hint"
              aria-invalid={overLimit('imageUrl')}
              className={`w-full px-3.5 py-2.5 text-sm bg-bg border rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-50 font-mono ${
                overLimit('imageUrl') ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
              }`}
            />
            <p id="image-url-hint" className="mt-1 text-[11px] text-text-muted font-mono">
              {t('create.image_hint')}
            </p>
            <ImagePreview url={form.imageUrl} debouncedUrl={debouncedImageUrl} />
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
              {t('create.success')}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="flex-1 px-5 py-3 bg-transparent text-text text-sm font-semibold rounded-lg border border-accent/20 hover:bg-bg hover:border-accent/40 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
            >
              {t('create.cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-5 py-3 bg-accent text-bg text-sm font-bold rounded-lg border border-accent hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
            >
              {submitting ? t('create.submitting') : t('create.submit')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}