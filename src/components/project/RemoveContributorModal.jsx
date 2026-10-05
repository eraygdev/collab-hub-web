import { useLanguage } from '../../i18n/LanguageContext';
import * as Icon from '../ui/Icons';

export default function RemoveContributorModal({
  isOpen,
  onClose,
  onConfirm,
  username,
  submitting = false,
}) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleCancel = () => {
    if (submitting) return;
    onClose();
  };

  const handleConfirm = () => {
    if (submitting) return;
    onConfirm();
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
          <div>
            <h2 className="text-h5 font-bold text-text">
              {t('remove_contributor.title')}
            </h2>
            <p className="text-caption text-text-muted mt-0.5 truncate max-w-[280px] font-mono">
              @{username}
            </p>
          </div>
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
          <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-button mb-4">
            <Icon.Warning className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
            <div className="text-caption text-red-200/90 leading-relaxed">
              <p className="font-semibold mb-1 text-red-200">
                {t('remove_contributor.warning_title')}
              </p>
              <p>{t('remove_contributor.warning_desc', { username })}</p>
            </div>
          </div>

          <p className="text-body-sm text-text-muted leading-relaxed">
            {t('remove_contributor.desc', { username })}
          </p>
        </div>

        <div className="px-6 py-4 border-t border-accent/10 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="px-4 py-2 text-body-sm font-semibold text-text bg-transparent border border-accent/20 rounded-button hover:bg-bg transition-colors cursor-pointer disabled:opacity-50"
          >
            {t('remove_contributor.cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting}
            className="px-4 py-2 text-body-sm font-semibold text-bg bg-red-400 rounded-button hover:bg-red-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]"
          >
            {submitting
              ? t('remove_contributor.submitting')
              : t('remove_contributor.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}