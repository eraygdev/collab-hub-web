import { useState, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import * as Icon from './Icons';

// Hero'nun altında görünen "aşağı kaydır" hint'i.
// - Sayfa en üstteyken görünür
// - Aşağı kaydırınca fade out
// - Tıklanınca hedefe yumuşak scroll
//
// label verilirse "results" modu → accent renkli, farklı threshold.
//
// offset: Hedefin üstünde kaç px boşluk kalacağı.
//   0   → en üste yapıştırır (en fazla aşağı atar)
//   200 → belirgin şekilde yukarıda durur (en az aşağı atar)
//
// onBeforeScroll: scrollTo'dan hemen önce çağrılır.
//   Parent burada hero'yu anında kapatabilir → hedef doğru hesaplanır.
export default function ScrollHint({
  targetId = 'explore',
  label,
  offset = 40,
  onBeforeScroll,
}) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(true);
  const isResults = !!label;

  useEffect(() => {
    const handleScroll = () => {
      const threshold = isResults ? 150 : 100;
      setVisible(window.scrollY < threshold);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isResults]);

  const handleClick = () => {
    // 1) Parent'a "hero'yu kapat" sinyali ver
    onBeforeScroll?.();

    // 2) İki frame bekle → React commit + layout oturur
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const target = document.getElementById(targetId);
        if (target) {
          const y =
            target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
        } else {
          window.scrollTo({
            top: window.innerHeight * 0.9,
            behavior: 'smooth',
          });
        }
      });
    });
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
      <span
        className={`text-[10px] font-mono tracking-wider uppercase transition-colors ${
          isResults
            ? 'text-accent group-hover:text-accent/80'
            : 'text-text-muted/70 group-hover:text-text-muted'
        }`}
      >
        {label || t('scroll_hint.label')}
      </span>

      <span
        className={`animate-bounce-slow transition-colors ${
          isResults
            ? 'text-accent'
            : 'text-text-muted group-hover:text-accent'
        }`}
      >
        <Icon.ChevronDown className="w-4 h-4" />
      </span>
    </button>
  );
}