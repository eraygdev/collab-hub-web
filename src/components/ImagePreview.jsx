import { useEffect, useState } from 'react';

// URL geçerli mi? (sadece http/https)
function isValidUrl(str) {
  if (!str) return true;
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

// image_url için canlı görsel önizleme.
export default function ImagePreview({ url, debouncedUrl }) {
  const [status, setStatus] = useState('idle'); // idle | loading | ok | error

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
      <div className="mt-2 w-full h-40 bg-gray-100 border border-gray-200 rounded-lg animate-pulse" />
    );
  }

  if (status === 'error') {
    return (
      <p className="mt-2 text-xs text-red-500">
        Görsel yüklenemedi. URL'yi kontrol et.
      </p>
    );
  }

  return (
    <img
      src={url}
      alt="Önizleme"
      className="mt-2 w-full max-h-56 object-cover rounded-lg border border-gray-200"
    />
  );
}