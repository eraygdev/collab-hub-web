import { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import * as Icon from '../ui/Icons';

export default function JoinRequestModal({
  isOpen,
  onClose,
  onConfirm,
  projectTitle,
  isPremium = false,
  submitting = false,
}) {
  const { t } = useLanguage();
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isOpen) setMessage('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(isPremium ? message.trim() : '');
  };

  const handleCancel = () => {
    setMessage('');
    onClose();
  };

  const MAX_MESSAGE = 300;
  const isOverLimit = message.length > MAX_MESSAGE;

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
        <div className="px-6 py-4 border-b border-accent/10 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-text">{t('join_request.title')}</h2>
            <p className="text-xs text-text-muted mt-0.5 truncate max-w-[280px] font-mono">
              {projectTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="p-2 rounded-lg text-text-muted hover:text-text hover:bg-bg transition-colors cursor-pointer disabled:opacity-50"
            aria-label={t('category_picker.close')}
          >
            <Icon.Close className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5">
          <p className="text-sm text-text leading-relaxed mb-4">
            {t('join_request.desc')}
          </p>

          {isPremium ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="join-message" className="block text-xs font-medium text-text">
                  {t('join_request.premium_label')}{' '}
                  <span className="text-accent font-semibold">
                    {t('join_request.premium_badge')}
                  </span>
                </label>
                <span
                  className={`text-[11px] tabular-nums font-mono ${
                    isOverLimit ? 'text-red-400 font-semibold' : 'text-text-muted'
                  }`}
                >
                  {message.length} / {MAX_MESSAGE}
                </span>
              </div>
              <textarea
                id="join-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={t('join_request.message_placeholder')}
                rows={4}
                maxLength={MAX_MESSAGE + 50}
                disabled={submitting}
                className={`w-full px-3.5 py-2.5 text-sm bg-bg border rounded-lg text-text placeholder-text-muted/70 focus:outline-none focus:ring-2 focus:ring-accent/10 transition-all resize-y disabled:opacity-50 ${
                  isOverLimit ? 'border-red-400' : 'border-accent/15 focus:border-accent/40'
                }`}
              />
              <p className="mt-1 text-[11px] text-text-muted">
                {t('join_request.message_hint')}
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <Icon.Sparkles className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200/90 leading-relaxed">
                <strong className="text-amber-200">
                  {t('join_request.premium_warning_strong')}
                </strong>{' '}
                {t('join_request.premium_warning')}
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-accent/10 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold text-text bg-transparent border border-accent/20 rounded-lg hover:bg-bg transition-colors cursor-pointer disabled:opacity-50"
          >
            {t('join_request.cancel')}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting || isOverLimit}
            className="px-4 py-2 text-sm font-semibold text-bg bg-accent rounded-lg hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? t('join_request.submitting') : t('join_request.submit')}
          </button>
        </div>
      </div>
    </div>
  );
}