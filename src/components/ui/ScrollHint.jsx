import { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import * as Icon from './Icons';

// Hero'nun altında görünen "aşağı kaydır" hint'i.
// - Sayfa en üstteyken görünür (scrollY < 100)
// - Aşağı kaydırınca fade out
// - Tıklanınca hedefe yumuşak scroll
//
// Prop'lar:
//   targetId  — scroll edilecek element id (default: 'explore')
//   label     — opsiyonel ReactNode. Verilmezse t('scroll_hint.label')
//   showIcon  — ok ikonu gösterilsin mi (default: true)
//   disabled  — tıklanamaz yapar, ikon gizler
export default function ScrollHint({
  targetId = 'explore',
  label,
  showIcon = true,
  disabled = false,
}) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY < 100);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    if (disabled) return;
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  };

  const iconVisible = showIcon && !disabled;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={t('scroll_hint.aria')}
      className={`group mt-12 inline-flex flex-col items-center gap-2 transition-all duration-500 ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      } ${disabled ? 'cursor-default' : 'cursor-pointer'}`}
    >
      <span
        className={`text-mono-sm font-mono tracking-wider uppercase transition-colors ${
          disabled
            ? 'text-text-muted/70'
            : 'text-text-muted/70 group-hover:text-text-muted'
        }`}
      >
        {label ?? t('scroll_hint.label')}
      </span>

      {iconVisible && (
        <span className="animate-bounce-slow text-text-muted group-hover:text-accent transition-colors">
          <Icon.ChevronDown className="w-4 h-4" />
        </span>
      )}
    </button>
  );
}