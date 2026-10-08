import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';
import { useLanguage } from '../../i18n/LanguageContext';
import NotFoundScreen from '../../components/ui/NotFoundScreen';
import LoadingScreen from '../../components/ui/LoadingScreen';
import { useDebounced } from '../../hooks/useDebounced';
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';
import CharCounter from '../../components/ui/CharCounter';
import CharWarning from '../../components/ui/CharWarning';
import InputClearButton from '../../components/ui/InputClearButton';
import FieldError from '../../components/ui/FieldError';
import ImagePreview from '../../components/project/ImagePreview';
import CategorySelector from '../../components/project/CategoryChips';
import FormBanner from '../../components/ui/FormBanner';
import * as Icon from '../../components/ui/Icons';
import { extractError } from '../../utils/errors';
import {
  TITLE_REGEX,
  TEXT_REGEX,
  charCount,
  findInvalidChar,
  isValidUrl,
  normalizeGithubImageUrl,
  isValidGithubImageUrl,
  checkGithubImageSize,
  normalizeGithubRepoUrl,
  isValidGithubRepoUrl,
} from '../../utils/validators';

import { API } from '../../utils/api';

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
  const [fieldErrors, setFieldErrors] = useState({});

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

  const clearFieldError = (fieldId) => {
    if (!fieldErrors[fieldId]) return;
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  };

  const clearField = (name) => {
    setForm((prev) => ({ ...prev, [name]: '' }));
    setWarnings((prev) => ({ ...prev, [name]: '' }));
    clearFieldError(name);
  };

  const handleTitleChange = (e) => {
    clearFieldError('title');
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
    clearFieldError(name);
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
    clearFieldError(name);
    if (limits[name]?.max && charCount(value) > limits[name].max) return;
    setForm({ ...form, [name]: value });
  };

  const overLimit = (key) => charCount(form[key]) > (limits[key]?.max || 0);

  const showFieldError = (fieldId, message) => {
    setFieldErrors({ [fieldId]: message });

    setTimeout(() => {
      const el = document.getElementById(fieldId);
      if (!el) return;

      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      setTimeout(() => {
        try {
          el.focus({ preventScroll: true });
        } catch {
          // localStorage erişilemezse sessizce geç (private mode, kota dolu)
        }
      }, 300);

      el.classList.remove('input-error-flash');
      void el.offsetWidth;
      el.classList.add('input-error-flash');
      setTimeout(() => el.classList.remove('input-error-flash'), 1100);
    }, 50);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});
    setSuccess(false);

    if (!form.title.trim()) {
      showFieldError('title', t('errors.title_and_description_required'));
      return;
    }
    if (!form.description.trim()) {
      showFieldError('description', t('errors.title_and_description_required'));
      return;
    }

    if (charCount(form.title.trim()) < limits.title.min) {
      showFieldError('title', t('errors.title_too_short'));
      return;
    }
    if (charCount(form.description.trim()) < limits.description.min) {
      showFieldError('description', t('errors.description_too_short'));
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
        showFieldError(key, t('errors.generic'));
        return;
      }
    }

    if (!form.githubUrl || !form.githubUrl.trim()) {
      showFieldError('githubUrl', t('errors.github_url_required'));
      return;
    }
    if (!isValidGithubRepoUrl(form.githubUrl)) {
      showFieldError('githubUrl', t('errors.invalid_github_url'));
      return;
    }

    if (!isValidUrl(form.demoUrl)) {
      showFieldError('demoUrl', t('errors.invalid_demo_url'));
      return;
    }

    if (form.imageUrl && !isValidGithubImageUrl(form.imageUrl)) {
      showFieldError('imageUrl', t('errors.image_url_must_be_github'));
      return;
    }

    if (form.imageUrl) {
      const normalized = normalizeGithubImageUrl(form.imageUrl);
      if (normalized) {
        const sizeCheck = await checkGithubImageSize(normalized);
        if (!sizeCheck.ok) {
          showFieldError('imageUrl', t('errors.image_too_large'));
          return;
        }
      }
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
          githubUrl: normalizeGithubRepoUrl(form.githubUrl),
          imageUrl: form.imageUrl ? normalizeGithubImageUrl(form.imageUrl) : '',
          categoryIds: selectedCategories,
        }),
      });

      if (!res.ok) {
        const { code, message } = await extractError(res, t);

        // Field'a özel hata kodları → input altında göster
        const githubFields = [
          'github_url_required',
          'invalid_github_url',
          'github_repo_not_accessible',
          'github_url_taken',
        ];
        const imageFields = ['image_url_must_be_github', 'image_too_large'];
        const demoFields = ['invalid_demo_url', 'demo_url_too_long'];
        const titleFields = ['title_too_short', 'title_too_long', 'title_invalid_char', 'title_profanity'];
        const descFields = ['description_too_short', 'description_too_long', 'description_invalid_char', 'description_profanity'];
        const longDescFields = ['longDescription_too_long', 'longDescription_invalid_char', 'longDescription_profanity'];

        if (githubFields.includes(code)) {
          showFieldError('githubUrl', message);
        } else if (imageFields.includes(code)) {
          showFieldError('imageUrl', message);
        } else if (demoFields.includes(code)) {
          showFieldError('demoUrl', message);
        } else if (titleFields.includes(code)) {
          showFieldError('title', message);
        } else if (descFields.includes(code)) {
          showFieldError('description', message);
        } else if (longDescFields.includes(code)) {
          showFieldError('longDescription', message);
        } else {
          setError(message);
        }
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
    return <LoadingScreen message={t('edit.loading')} />;
  }

  if (!user) return null;

  if (error && !form.title) {
    return (
      <NotFoundScreen
        eyebrow={t('edit.not_found_eyebrow')}
        bigText={`#${id}`}
        title={t('edit.not_found_title')}
        description={t('edit.not_found_desc')}
        primaryCta={{ label: t('edit.back_home'), to: '/', icon: Icon.ArrowLeft }}
      />
    );
  }

  return (
    <div className="w-full bg-bg min-h-screen">
      <div className="max-w-narrow mx-auto px-4 sm:px-6 lg:px-8 py-page">

        <PageBreadcrumb
          items={[
            { label: t('breadcrumb.home'), to: '/' },
            { label: t('breadcrumb.project', { id }), to: `/project/${id}` },
            { label: t('breadcrumb.edit') },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-h3 font-extrabold text-text mb-2 tracking-tight">
            {t('edit.title')}
          </h1>
          <p className="text-body-sm text-text-muted">
            {t('edit.subtitle')}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-surface border border-accent/10 rounded-card p-6 sm:p-8"
        >
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="title" className="block text-caption font-medium text-text">
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
                className={`w-full px-3.5 py-2.5 pr-10 text-body-sm bg-bg border rounded-button text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-50 font-mono ${
                  overLimit('title') ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
                }`}
              />
              <InputClearButton visible={!!form.title} onClick={() => clearField('title')} />
            </div>
            <FieldError message={fieldErrors.title} />
            <CharWarning char={warnings.title} />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="description" className="block text-caption font-medium text-text">
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
                className={`w-full px-3.5 py-2.5 pr-10 text-body-sm bg-bg border rounded-button text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all resize-y disabled:opacity-50 ${
                  overLimit('description') ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
                }`}
              />
              <InputClearButton
                visible={!!form.description}
                onClick={() => clearField('description')}
                className="top-4 translate-y-0"
              />
            </div>
            <FieldError message={fieldErrors.description} />
            <CharWarning char={warnings.description} />
          </div>

          {/* Long Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="longDescription" className="block text-caption font-medium text-text">
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
                className={`w-full px-3.5 py-2.5 pr-10 text-body-sm bg-bg border rounded-button text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all resize-y disabled:opacity-50 ${
                  overLimit('longDescription') ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
                }`}
              />
              <InputClearButton
                visible={!!form.longDescription}
                onClick={() => clearField('longDescription')}
                className="top-4 translate-y-0"
              />
            </div>
            <FieldError message={fieldErrors.longDescription} />
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
              <label htmlFor="githubUrl" className="block text-caption font-medium text-text">
                {t('create.github_label')} <span className="text-red-400">{t('common.required')}</span>
              </label>
              <CharCounter value={form.githubUrl} max={limits.githubUrl.max} id="github-url-counter" />
            </div>
            <div className="relative">
              <input
                id="githubUrl"
                name="githubUrl"
                type="text"
                value={form.githubUrl}
                onChange={handleUrlChange}
                disabled={submitting}
                required
                className={`w-full px-3.5 py-2.5 pr-10 text-body-sm bg-bg border rounded-button text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-50 font-mono ${
                  overLimit('githubUrl') ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
                }`}
              />
              <InputClearButton visible={!!form.githubUrl} onClick={() => clearField('githubUrl')} />
            </div>
            <FieldError message={fieldErrors.githubUrl} />
            <p className="mt-1 text-mono-sm text-text-muted font-mono">
              {t('create.github_hint')}
            </p>
          </div>

          {/* Demo URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="demoUrl" className="block text-caption font-medium text-text">
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
                className={`w-full px-3.5 py-2.5 pr-10 text-body-sm bg-bg border rounded-button text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-50 font-mono ${
                  overLimit('demoUrl') ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
                }`}
              />
              <InputClearButton visible={!!form.demoUrl} onClick={() => clearField('demoUrl')} />
            </div>
            <FieldError message={fieldErrors.demoUrl} />
          </div>

          {/* Image URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="imageUrl" className="block text-caption font-medium text-text">
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
                className={`w-full px-3.5 py-2.5 pr-10 text-body-sm bg-bg border rounded-button text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all disabled:opacity-50 font-mono ${
                  overLimit('imageUrl') ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
                }`}
              />
              <InputClearButton visible={!!form.imageUrl} onClick={() => clearField('imageUrl')} />
            </div>
            <FieldError message={fieldErrors.imageUrl} />
            <div className="mt-1 text-mono-sm text-text-muted font-mono space-y-0.5">
              <p>{t('create.image_hint')}</p>
              {t('create.image_hint_examples')?.map?.((line, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-accent shrink-0">✔</span>
                  <span>{line}</span>
                </div>
              ))}
            </div>
            <ImagePreview url={form.imageUrl} debouncedUrl={debouncedImageUrl} />
          </div>

          <FormBanner type="error" message={error} />

          {success && (
            <div
              role="status"
              className="text-body-sm text-accent bg-accent/10 border border-accent/20 rounded-button px-4 py-2.5 font-mono inline-flex items-center gap-2"
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
              className="flex-1 px-5 py-3 bg-transparent text-text text-body-sm font-semibold rounded-button border border-accent/20 hover:bg-bg hover:border-accent/40 transition-all cursor-pointer disabled:opacity-50 font-mono"
            >
              {t('edit.cancel')}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-5 py-3 bg-accent text-bg text-body-sm font-bold rounded-button border border-accent hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
            >
              {submitting ? t('edit.submitting') : t('edit.submit')}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}