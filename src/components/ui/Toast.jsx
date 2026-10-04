import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import * as Icon from './Icons';

// ═══════════════════════════════════════════════════════════
// TOAST SİSTEMİ
// ═══════════════════════════════════════════════════════════
//
// Kullanım:
//   const { toast } = useToast();
//   toast.success('Kaydedildi');
//   toast.error('Bir hata oluştu');
//   toast.info('Yeni özellik geldi');
//   toast.warning('Dikkat!');
//
// Özellikler:
//   - Sağ üstte çıkar
//   - 4 saniye sonra otomatik kaybolur
//   - Tıklayınca manuel kapanır
//   - Üst üste max 3 toast
//   - Yumuşak slide animasyonu

const ToastContext = createContext(null);

const DEFAULT_DURATION = 4000;
const MAX_TOASTS = 3;

// ─── Tek Toast Bileşeni ───
function ToastItem({ toast, onClose }) {
  const IconComponent = {
    success: Icon.Check,
    error: Icon.Warning,
    warning: Icon.Warning,
    info: Icon.Info,
  }[toast.type] || Icon.Info;

  const styles = {
    success: {
      border: 'border-accent/40',
      icon: 'text-accent',
      bg: 'bg-accent/10',
    },
    error: {
      border: 'border-red-400/40',
      icon: 'text-red-400',
      bg: 'bg-red-400/10',
    },
    warning: {
      border: 'border-amber-400/40',
      icon: 'text-amber-400',
      bg: 'bg-amber-400/10',
    },
    info: {
      border: 'border-accent/30',
      icon: 'text-accent',
      bg: 'bg-accent/5',
    },
  }[toast.type] || {};

  return (
    <div
      onClick={() => onClose(toast.id)}
      role="alert"
      className={`animate-toast-in group flex items-start gap-3 w-full sm:w-80 px-4 py-3 bg-surface border ${styles.border} rounded-card shadow-2xl cursor-pointer hover:shadow-[0_0_30px_-8px_rgba(239,228,206,0.2)] transition-all`}
    >
      {/* İkon */}
      <span className={`shrink-0 mt-0.5 ${styles.icon}`}>
        <IconComponent className="w-4 h-4" />
      </span>

      {/* Mesaj */}
      <p className="flex-1 text-body-sm text-text leading-snug font-mono break-words">
        {toast.message}
      </p>

      {/* Kapat */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onClose(toast.id);
        }}
        className="shrink-0 p-0.5 -mr-1 text-text-muted hover:text-text transition-colors cursor-pointer"
        aria-label="Close"
      >
        <Icon.Close className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Provider ───
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef(new Map());

  // Toast'ı kaldır
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  // Toast ekle
  const addToast = useCallback(
    (message, type = 'info', duration = DEFAULT_DURATION) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      setToasts((prev) => {
        // Max 3 — eskiyi çıkar
        const next = [...prev, { id, message, type }];
        if (next.length > MAX_TOASTS) {
          const removed = next.shift();
          const timer = timersRef.current.get(removed.id);
          if (timer) {
            clearTimeout(timer);
            timersRef.current.delete(removed.id);
          }
        }
        return next;
      });

      // Otomatik kapatma
      const timer = setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        timersRef.current.delete(id);
      }, duration);

      timersRef.current.set(id, timer);

      return id;
    },
    []
  );

  // Cleanup
  useEffect(() => {
    return () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current.clear();
    };
  }, []);

  // Kısayol API
  const toast = {
    success: (msg, dur) => addToast(msg, 'success', dur),
    error: (msg, dur) => addToast(msg, 'error', dur),
    warning: (msg, dur) => addToast(msg, 'warning', dur),
    info: (msg, dur) => addToast(msg, 'info', dur),
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* Toast Container — Sağ üst */}
      <div
        className="fixed top-20 right-4 sm:right-6 z-[200] flex flex-col gap-2 items-end pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onClose={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return ctx;
}