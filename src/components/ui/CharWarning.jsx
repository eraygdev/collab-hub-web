// Geçersiz karakter uyarısı.
// Varsayılan olarak `mt-1` kullanır (form input'un altında).
// UserSearch gibi özel pozisyon gereken yerlerde `className` ile override edilebilir.

export default function CharWarning({
  char,
  message,
  type = 'warning',
  className = 'mt-1',
}) {
  if (!char && !message) return null;

  const styles = {
    warning: 'text-amber-600',
    error: 'text-red-500',
    info: 'text-blue-500',
  };

  const icons = {
    warning: '⚠️',
    error: '❌',
    info: 'ℹ️',
  };

  const text = message
    ? message
    : `Geçersiz karakter: "${char}" — sadece harf, rakam, nokta ve alt çizgi kullanabilirsin.`;

  return (
    <p role="alert" className={`text-[11px] ${styles[type]} ${className}`}>
      {icons[type]} {text}
    </p>
  );
}