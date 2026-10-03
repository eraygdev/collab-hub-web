import { useLanguage } from '../../i18n/LanguageContext';

// Geçersiz karakter uyarısı.
// Varsayılan olarak `mt-1` kullanır (form input'un altında).
// UserSearch gibi özel pozisyon gereken yerlerde `className` ile override edilebilir.

export default function CharWarning({
  char,
  message,
  type = 'warning',
  className = 'mt-1',
}) {
  const { t } = useLanguage();

  if (!char && !message) return null;

  const styles = {
    warning: 'text-amber-400',
    error: 'text-red-400',
    info: 'text-accent',
  };

  const icons = {
    warning: '⚠',
    error: '✕',
    info: 'ℹ',
  };

  const text = message || t('errors.invalid_char', { char });

  return (
    <p role="alert" className={`text-[11px] ${styles[type]} ${className} font-mono`}>
      {icons[type]} {text}
    </p>
  );
}