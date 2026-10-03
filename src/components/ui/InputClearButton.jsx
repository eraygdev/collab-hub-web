import * as Icon from './Icons';

// Input/textarea sağ üstünde görünen X butonu.
export default function InputClearButton({
  onClick,
  visible,
  className = '',
  ariaLabel = 'Clear',
  size = 'md',
}) {
  if (!visible) return null;

  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';
  const padding = size === 'sm' ? 'p-1' : 'p-1.5';

  return (
    <button
      type="button"
      onClick={onClick}
      tabIndex={-1}
      className={`absolute right-2.5 top-1/2 -translate-y-1/2 ${padding} rounded-md text-text-muted hover:text-text hover:bg-bg/60 transition-colors cursor-pointer z-10 ${className}`}
      aria-label={ariaLabel}
    >
      <Icon.Close className={iconSize} />
    </button>
  );
}