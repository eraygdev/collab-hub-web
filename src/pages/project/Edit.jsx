import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useDebounced } from '../../hooks/useDebounced';
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';
import CharCounter from '../../components/ui/CharCounter';
import CharWarning from '../../components/ui/CharWarning';
import InputClearButton from '../../components/ui/InputClearButton';
import ImagePreview from '../../components/project/ImagePreview';
import CategorySelector from '../../components/project/CategoryChips';
import * as Icon from '../../components/ui/Icons';
import { extractErrorMessage } from '../../utils/errors';
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
  const { limits } = useConfig();
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
    let cancelled = false;
    const token = localStorage.getItem('token');
    fetch(`${API}/api/projects/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error('not_found');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
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
        if (cancelled) return;
        setError('not_found');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const userId = user?.user_id;

  useEffect(() => {
    if (authLoading || loading) return;
    if (!user) {
      navigate('/login');
      return;
    }
    if (projectAuthorId !== null && userId !== projectAuthorId) {
      navigate(`/project/${id}`);
    }
  }, [userId, user, authLoading, loading, projectAuthorId, id, navigate]);

  const showWarning = (field, char) => {
    setWarnings((prev) => ({ ...prev, [field]: char }));
    setTimeout(() => {
      setWarnings((prev) => ({ ...prev, [field]: '' }));
    }, 3000);
  };

  const clearField = (name) => {
    setForm((prev) => ({ ...prev, [name]: '' }));
    setWarnings((prev) => ({ ...prev, [name]: '' }));
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
    if (charCount(value) > limits.title.max) return;
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
    if (limits[name]?.max && charCount(value) > limits[name].max) return;
    setForm({ ...form, [name]: value });
    setWarnings((prev) => ({ ...prev, [name]: '' }));
  };

  const handleUrlChange = (e) => {
    const { name, value } = e.target;
    if (limits[name]?.max && charCount(value) > limits[name].max) return;
    setForm({ ...form, [name]: value });
  };

  const overLimit = (key) => charCount(form[key]) > (limits[key]?.max || 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.title.trim() || !form.description.trim()) {
      setError(t('errors.title_and_description_required'));
      return;
    }

    if (charCount(form.title.trim()) < limits.title.min) {
      setError(t('errors.title_too_short'));
      return;
    }
    if (charCount(form.description.trim()) < limits.description.min) {
      setError(t('errors.description_too_short'));
      return;
    }

    const maxLimits = {
      title: limits.title.max,
      description: limits.description.max,
      longDescription: limits.longDescription.max,
      githubUrl: limits.githubUrl.max,
      demoUrl: limits.demoUrl.max,
      imageUrl: limits.imageUrl.max,
    };

    for (const [key, max] of Object.entries(maxLimits)) {
      if (form[key] && charCount(form[key]) > max) {
        setError(t('errors.generic'));
        return;
      }
    }

    if (!isValidUrl(form.githubUrl)) {
      setError(t('errors.invalid_github_url'));
      return;
    }
    if (!isValidUrl(form.demoUrl)) {
      setError(t('errors.invalid_demo_url'));
      return;
    }
    if (!isValidUrl(form.imageUrl)) {
      setError(t('errors.invalid_image_url'));
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

      if (!res.ok) {
        setError(await extractErrorMessage(res, t));
        setSubmitting(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate(`/project/${id}`);
      }, 700);
    } catch {
      setError(t('errors.server_error'));
      setSubmitting(false);
    }
  };

  const debouncedImageUrl = useDebounced(form.imageUrl, 400);

  if (authLoading || loading) {
    return (
      <div className="w-full bg-bg min-h-screen flex items-center justify-center">
        <p className="text-sm text-text-muted font-mono">{t('dashboard.loading')}</p>
      </div>
    );
  }

  if (!user) return null;

  if (error && !form.title) {
    return (
      <div className="w-full bg-bg min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <PageBreadcrumb
            items={[
              { label: t('breadcrumb.home'), to: '/' },
              { label: t('breadcrumb.project', { id }), to: `/project/${id}` },
              { label: t('breadcrumb.edit') },
            ]}
          />
          <div className="text-center py-16 rounded-2xl bg-surface/30 border border-dashed border-accent/20">
            <Icon.Warning className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <h2 className="text-lg font-bold text-text mb-1 font-mono">
              {t('edit.not_found_title')}
            </h2>
            <Link
              to="/"
              className="inline-block mt-5 px-5 py-2.5 text-sm font-bold bg-accent text-bg rounded-lg hover:bg-accent/90 transition-all font-mono"
            >
              {t('edit.back_home')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-bg min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <PageBreadcrumb
          items={[
            { label: t('breadcrumb.home'), to: '/' },
            { label: t('breadcrumb.project', { id }), to: `/project/${id}` },
            { label: t('breadcrumb.edit') },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-2 tracking-tight">
            {t('edit.title')}
          </h1>
          <p className="text-sm text-text-muted">
            {t('edit.subtitle')}
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
              <CharCounter value={form.title} max={limits.title.max} id="title-counter" />
            </div>
            <div className="relative">
              <input
                id="title"
                name="title"
                type="text"
                value={form.title}
                onChange={handleTitleChange}
                required
                disabled={submitting}
                className={`w-full px-3.5 py-2.5 pr-10 text-sm bg-bg border rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-50 font-mono ${
                  overLimit('title') ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
                }`}
              />
              <InputClearButton visible={!!form.title} onClick={() => clearField('title')} />
            </div>
            <CharWarning char={warnings.title} />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="description" className="block text-xs font-medium text-text">
                {t('create.description_label')} <span className="text-red-400">{t('common.required')}</span>
              </label>
              <CharCounter value={form.description} max={limits.description.max} id="description-counter" />
            </div>
            <div className="relative">
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleTextChange}
                required
                rows={3}
                disabled={submitting}
                className={`w-full px-3.5 py-2.5 pr-10 text-sm bg-bg border rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all resize-y disabled:opacity-50 ${
                  overLimit('description') ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
                }`}
              />
              <InputClearButton
                visible={!!form.description}
                onClick={() => clearField('description')}
                className="top-4 translate-y-0"
              />
            </div>
            <CharWarning char={warnings.description} />
          </div>

          {/* Long Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="longDescription" className="block text-xs font-medium text-text">
                {t('create.long_description_label')}
              </label>
              <CharCounter value={form.longDescription} max={limits.longDescription.max} id="long-description-counter" />
            </div>
            <div className="relative">
              <textarea
                id="longDescription"
                name="longDescription"
                value={form.longDescription}
                onChange={handleTextChange}
                rows={6}
                disabled={submitting}
                className={`w-full px-3.5 py-2.5 pr-10 text-sm bg-bg border rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all resize-y disabled:opacity-50 ${
                  overLimit('longDescription') ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
                }`}
              />
              <InputClearButton
                visible={!!form.longDescription}
                onClick={() => clearField('longDescription')}
                className="top-4 translate-y-0"
              />
            </div>
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
              <CharCounter value={form.githubUrl} max={limits.githubUrl.max} id="github-url-counter" />
            </div>
            <div className="relative">
              <input
                id="githubUrl"
                name="githubUrl"
                type="url"
                value={form.githubUrl}
                onChange={handleUrlChange}
                disabled={submitting}
                className={`w-full px-3.5 py-2.5 pr-10 text-sm bg-bg border rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-50 font-mono ${
                  overLimit('githubUrl') ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
                }`}
              />
              <InputClearButton visible={!!form.githubUrl} onClick={() => clearField('githubUrl')} />
            </div>
          </div>

          {/* Demo URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="demoUrl" className="block text-xs font-medium text-text">
                {t('create.demo_label')}
              </label>
              <CharCounter value={form.demoUrl} max={limits.demoUrl.max} id="demo-url-counter" />
            </div>
            <div className="relative">
              <input
                id="demoUrl"
                name="demoUrl"
                type="url"
                value={form.demoUrl}
                onChange={handleUrlChange}
                disabled={submitting}
                className={`w-full px-3.5 py-2.5 pr-10 text-sm bg-bg border rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-50 font-mono ${
                  overLimit('demoUrl') ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
                }`}
              />
              <InputClearButton visible={!!form.demoUrl} onClick={() => clearField('demoUrl')} />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="imageUrl" className="block text-xs font-medium text-text">
                {t('create.image_label')}
              </label>
              <CharCounter value={form.imageUrl} max={limits.imageUrl.max} id="image-url-counter" />
            </div>
            <div className="relative">
              <input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={form.imageUrl}
                onChange={handleUrlChange}
                disabled={submitting}
                className={`w-full px-3.5 py-2.5 pr-10 text-sm bg-bg border rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-50 font-mono ${
                  overLimit('imageUrl') ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
                }`}
              />
              <InputClearButton visible={!!form.imageUrl} onClick={() => clearField('imageUrl')} />
            </div>
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
              {t('edit.success')}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(`/project/${id}`)}
              disabled={submitting}
              className="flex-1 px-5 py-3 bg-transparent text-text text-sm font-semibold rounded-lg border border-accent/20 hover:bg-bg hover:border-accent/40 transition-all cursor-pointer disabled:opacity-50 font-mono"
            >
              {t('edit.cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-5 py-3 bg-accent text-bg text-sm font-bold rounded-lg border border-accent hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
            >
              {submitting ? t('edit.submitting') : t('edit.submit')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}