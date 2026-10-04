import { useEffect, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import * as Icon from '../ui/Icons';

function isValidUrl(str) {
  if (!str) return true;
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function ImagePreview({ url, debouncedUrl }) {
  const { t } = useLanguage();
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (!debouncedUrl) {
      setStatus('idle');
      return;
    }
    if (!isValidUrl(debouncedUrl)) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    const img = new Image();
    img.onload = () => setStatus('ok');
    img.onerror = () => setStatus('error');
    img.src = debouncedUrl;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [debouncedUrl]);

  if (status === 'idle') return null;

  if (status === 'loading') {
    return (
      <div className="mt-2 w-full h-40 bg-surface border border-accent/10 rounded-button animate-pulse" />
    );
  }

  if (status === 'error') {
    return (
      <p className="mt-2 text-caption text-red-400 font-mono inline-flex items-center gap-1.5">
        <Icon.Warning className="w-3 h-3" />
        {t('image_preview.error')}
      </p>
    );
  }

  return (
    <img
      src={debouncedUrl}
      alt="Preview"
      loading="lazy"
      decoding="async"
      width="800"
      height="450"
      className="mt-2 w-full max-h-56 object-cover rounded-button border border-accent/15"
    />
  );
}