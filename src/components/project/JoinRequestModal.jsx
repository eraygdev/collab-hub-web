import { useState, useEffect } from 'react';

// "Ekibe Katıl" modal'ı.
// - Premium değilse: direkt onay butonlu basit modal (mesaj yok)
// - Premium ise: mesaj yazma alanı açılır
export default function JoinRequestModal({
  isOpen,
  onClose,
  onConfirm,
  projectTitle,
  isPremium = false,
  submitting = false,
}) {
  const [message, setMessage] = useState('');

  // Modal açıldığında mesajı sıfırla
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-black">Ekibe Katıl</h2>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[280px]">
              {projectTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="p-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Kapat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            Bu projeye katkıda bulunmak için başvuru gönder. Proje sahibi
            onayladığında ekibe katılacaksın.
          </p>

          {/* Premium ise mesaj alanı */}
          {isPremium ? (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="join-message" className="block text-xs font-medium text-gray-700">
                  Neden katılmak istiyorsun?{' '}
                  <span className="text-purple-500 font-semibold">(Premium)</span>
                </label>
                <span
                  className={`text-[11px] tabular-nums ${
                    isOverLimit ? 'text-red-500 font-semibold' : 'text-gray-400'
                  }`}
                >
                  {message.length} / {MAX_MESSAGE}
                </span>
              </div>
              <textarea
                id="join-message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Kısaca kendinden ve ne katkı sağlayabileceğinden bahset..."
                rows={4}
                maxLength={MAX_MESSAGE + 50}
                disabled={submitting}
                className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 transition-all resize-y disabled:opacity-50 ${
                  isOverLimit ? 'border-red-400' : 'border-gray-200 focus:border-gray-400'
                }`}
              />
              <p className="mt-1 text-[11px] text-gray-400">
                Mesajın proje sahibine iletilir. Opsiyonel.
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <span className="text-base shrink-0">💡</span>
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Premium</strong> üyelik ile başvuruna kişisel bir mesaj
                ekleyebilirsin. Standart üyeler direkt başvuru gönderir.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={submitting || isOverLimit}
            className="px-4 py-2 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Gönderiliyor...' : 'Başvuru Gönder'}
          </button>
        </div>
      </div>
    </div>
  );
}