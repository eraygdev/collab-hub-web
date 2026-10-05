import { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import * as Icon from '../ui/Icons';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  submittingLabel,
  submitting = false,
  variant = 'danger', // 'danger' | 'default'
  icon = 'warning',   // 'warning' | 'trash'
  countdown = 0,      // 0 → geri sayım yok, >0 → o saniyeden başlar
}) {
  const { t } = useLanguage();
  const [remaining, setRemaining] = useState(countdown);
  const [canConfirm, setCanConfirm] = useState(countdown === 0);

  // Modal açıldığında / kapandığında countdown'ı sıfırla
  useEffect(() => {
    if (!isOpen) {
      setRemaining(countdown);
      setCanConfirm(countdown === 0);
      return;
    }

    if (countdown === 0) {
      setRemaining(0);
      setCanConfirm(true);
      return;
    }

    setRemaining(countdown);
    setCanConfirm(false);

    let left = countdown;
    const interval = setInterval(() => {
      left -= 1;
      if (left <= 0) {
        clearInterval(interval);
        setRemaining(0);
        setCanConfirm(true);
      } else {
        setRemaining(left);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, countdown]);

  if (!isOpen) return null;

  const handleCancel = () => {
    if (submitting) return;
    onClose();
  };

  const handleConfirm = () => {
    if (!canConfirm || submitting) return;
    onConfirm();
  };

  const isDanger = variant === 'danger';
  const IconComponent = icon === 'trash' ? Icon.Trash : Icon.Warning;

  const styles = isDanger
    ? {
        box: 'bg-red-500/10 border-red-500/20',
        icon: 'text-red-300',
        text: 'text-red-200/90',
        button: 'bg-red-400 text-bg hover:bg-red-500',
      }
    : {
        box: 'bg-accent/10 border-accent/20',
        icon: 'text-accent',
        text: 'text-text-muted',
        button: 'bg-accent text-bg hover:bg-accent/90 hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)]',
      };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/70 backdrop-blur-sm animate-overlay-in"
      onClick={handleCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md bg-surface border border-accent/20 rounded-card shadow-2xl overflow-hidden animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-accent/10 flex items-center justify-between">
          <h2 className="text-h5 font-bold text-text">{title}</h2>
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="p-2 rounded-button text-text-muted hover:text-text hover:bg-bg transition-colors cursor-pointer disabled:opacity-50"
            aria-label={t('category_picker.close')}
          >
            <Icon.Close className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          {isDanger ? (
            <div className={`flex items-start gap-3 p-3 ${styles.box} rounded-button`}>
              <IconComponent className={`w-4 h-4 ${styles.icon} shrink-0 mt-0.5`} />
              <p className={`text-caption ${styles.text} leading-relaxed`}>
                {description}
              </p>
            </div>
          ) : (
            <p className="text-body-sm text-text-muted leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="px-6 py-4 border-t border-accent/10 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="px-4 py-2 text-body-sm font-semibold text-text bg-transparent border border-accent/20 rounded-button hover:bg-bg transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelLabel || t('common.cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm || submitting}
            className={`px-4 py-2 text-body-sm font-semibold rounded-button transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] ${styles.button}`}
          >
            {submitting
              ? submittingLabel || '...'
              : !canConfirm
              ? t('common.wait', { count: remaining })
              : confirmLabel || t('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}