import { useEffect, useState } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  normalizeGithubImageUrl,
  checkGithubImageSize,
} from '../../utils/validators';
import * as Icon from '../ui/Icons';

export default function ImagePreview({ url, debouncedUrl }) {
  const { t } = useLanguage();
  const [status, setStatus] = useState('idle');
  const [src, setSrc] = useState('');

  useEffect(() => {
    if (!debouncedUrl) {
      setStatus('idle');
      setSrc('');
      return;
    }

    const normalized = normalizeGithubImageUrl(debouncedUrl);
    if (!normalized) {
      setStatus('error');
      setSrc('');
      return;
    }

    let cancelled = false;
    setStatus('loading');
    setSrc(normalized);

    (async () => {
      const sizeCheck = await checkGithubImageSize(normalized);
      if (cancelled) return;

      if (!sizeCheck.ok) {
        setStatus('too_large');
        return;
      }

      const img = new Image();
      img.onload = () => {
        if (!cancelled) setStatus('ok');
      };
      img.onerror = () => {
        if (!cancelled) setStatus('error');
      };
      img.src = normalized;
    })();

    return () => {
      cancelled = true;
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

  if (status === 'too_large') {
    return (
      <p className="mt-2 text-caption text-red-400 font-mono inline-flex items-center gap-1.5">
        <Icon.Warning className="w-3 h-3" />
        {t('image_preview.too_large')}
      </p>
    );
  }

  return (
    <img
      src={src}
      alt="Preview"
      loading="lazy"
      decoding="async"
      width="800"
      height="450"
      className="mt-2 w-full max-h-56 object-cover rounded-button border border-accent/15"
    />
  );
}