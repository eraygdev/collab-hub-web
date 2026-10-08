// Ortak chip bileşeni — kategori chip'leri, filter chip'leri vs.
//
// variant:
//   'default' — normal chip
//   'all'     — "all" / sıfırlama butonu (kalın border)
//   'dashed'  — "+N more" butonu (dashed border)
//
// tone:
//   'surface' — surface zemin üstünde (default) — Home, CategoryChips
//   'bg'      — bg zemin üstünde (modal içi) — CategoryPick
export default function Chip({
  children,
  active = false,
  variant = 'default',
  tone = 'surface',
  onClick,
  disabled = false,
  className = '',
  animationDelay,
  ...props
}) {
  const isAll = variant === 'all';

  // Base — tüm chip'ler için ortak
  const base = `
    animate-chip
    inline-flex items-center gap-1.5
    px-3 py-1.5
    text-caption
    rounded-pill
    border
    transition-all duration-200
    cursor-pointer
    font-mono
    disabled:opacity-40 disabled:cursor-not-allowed
  `;

  // Active — hepsinde aynı
  const activeStyles = `
    bg-accent text-bg border-accent font-semibold
    shadow-[0_0_16px_-4px_rgba(239,228,206,0.4)]
    scale-[1.02]
  `;

  let passiveStyles;

  if (variant === 'dashed') {
    passiveStyles = `
      bg-transparent
      text-text-muted
      border-dashed border-accent/30
      font-medium
      hover:border-accent hover:text-text hover:bg-accent/5
    `;
  } else if (isAll) {
    passiveStyles = `
      bg-transparent
      text-text
      border-2 border-accent/40
      font-semibold
      hover:border-accent hover:bg-accent/5
    `;
  } else {
    // Default — tone'a göre zemin
    const passiveBg = tone === 'bg'
      ? 'bg-linear-to-b from-bg to-bg/70'
      : 'bg-linear-to-b from-surface to-surface/70';

    passiveStyles = `
      ${passiveBg}
      text-text-muted
      border-accent/15
      font-medium
      shadow-[0_1px_0_0_rgba(239,228,206,0.03)_inset,0_1px_2px_0_rgba(0,0,0,0.15)]
      hover:border-accent/40
      hover:text-text
      hover:-translate-y-[1px]
      hover:shadow-[0_1px_0_0_rgba(239,228,206,0.05)_inset,0_2px_8px_-2px_rgba(239,228,206,0.15)]
    `;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={animationDelay !== undefined ? { animationDelay } : undefined}
      className={`${base} ${active ? activeStyles : passiveStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}