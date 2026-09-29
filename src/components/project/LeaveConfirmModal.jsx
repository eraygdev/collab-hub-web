import { useState, useEffect } from 'react';

// Projeden ayrılma onay modalı.
// - "Onayla" butonu 3 saniye boyunca disabled (geri sayım gösterir)
// - 3 saniye sonra aktif olur
// - Onaylayınca onConfirm() çağrılır
export default function LeaveConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  projectTitle,
  submitting = false,
}) {
  const [countdown, setCountdown] = useState(3);
  const [canConfirm, setCanConfirm] = useState(false);

  // Modal açıldığında geri sayımı başlat
  useEffect(() => {
    if (!isOpen) {
      // Kapalıyken state sıfırla (bir sonraki açılışta taze başlasın)
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
            <h2 className="text-lg font-bold text-black">Emin misin?</h2>
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
          <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-lg mb-4">
            <span className="text-base shrink-0">⚠️</span>
            <div className="text-xs text-red-800 leading-relaxed">
              <p className="font-semibold mb-1">Bu projeden ayrılıyorsun.</p>
              <p>
                Katkıcı statün sona erecek. İstediğin zaman tekrar
                başvurabilirsin.
              </p>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">
            Devam etmek istediğinden emin misin?
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50"
          >
            Vazgeç
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={!canConfirm || submitting}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
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