import { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import * as Icon from './Icons';

// Hero'nun altında görünen "aşağı kaydır" hint'i.
// - Sayfa en üstteyken görünür (scrollY < 100)
// - Aşağı kaydırınca fade out
// - Tıklanınca hedefe yumuşak scroll
export default function ScrollHint({ targetId = 'explore' }) {
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
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // Fallback: bir ekran boyu aşağı
      window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label={t('scroll_hint.aria')}
      className={`group mt-12 inline-flex flex-col items-center gap-2 transition-all duration-500 cursor-pointer ${
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <span className="text-[10px] font-mono tracking-wider text-text-muted/70 uppercase group-hover:text-text-muted transition-colors">
        {t('scroll_hint.label')}
      </span>

      {/* Bounce animasyonlu ikon */}
      <span className="animate-bounce-slow text-text-muted group-hover:text-accent transition-colors">
        <Icon.ChevronDown className="w-4 h-4" />
      </span>
    </button>
  );
}