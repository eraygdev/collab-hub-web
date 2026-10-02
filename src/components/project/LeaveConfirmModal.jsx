import { useState, useEffect } from 'react';
import * as Icon from '../ui/Icons';

export default function LeaveConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  projectTitle,
  submitting = false,
}) {
  const [countdown, setCountdown] = useState(3);
  const [canConfirm, setCanConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(3);
      setCanConfirm(false);
      return;
    }

    setCountdown(3);
    setCanConfirm(false);

    let remaining = 3;
    const interval = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(interval);
        setCountdown(0);
        setCanConfirm(true);
      } else {
        setCountdown(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCancel = () => {
    if (submitting) return;
    onClose();
  };

  const handleConfirm = () => {
    if (!canConfirm || submitting) return;
    onConfirm();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/70 backdrop-blur-sm"
      onClick={handleCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md bg-surface border border-accent/20 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-accent/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-text">Emin misin?</h2>
            <p className="text-xs text-text-muted mt-0.5 truncate max-w-[280px] font-mono">
              {projectTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-bg transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Kapat"
          >
            <Icon.Close className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
            <Icon.Warning className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
            <div className="text-xs text-red-200/90 leading-relaxed">
              <p className="font-semibold mb-1 text-red-200">Bu projeden ayrılıyorsun.</p>
              <p>
                Katkıcı statün sona erecek. İstediğin zaman tekrar
                başvurabilirsin.
              </p>
            </div>
          </div>

          <p className="text-sm text-text-muted leading-relaxed">
            Devam etmek istediğinden emin misin?
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-accent/10 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold text-text bg-transparent border border-accent/20 rounded-lg hover:bg-bg transition-colors cursor-pointer disabled:opacity-50"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm || submitting}
            className="px-4 py-2 text-sm font-semibold text-bg bg-red-400 rounded-lg hover:bg-red-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
          >
            {submitting
              ? 'Ayrılıyor...'
              : !canConfirm
              ? `Bekle (${countdown}s)`
              : 'Evet, Ayrıl'}
          </button>
        </div>
      </div>
    </div>
  );
}