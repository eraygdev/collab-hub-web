import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import * as Icon from '../ui/Icons';

const LANGS = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'tr', label: 'Türkçe', short: 'TR' },
];

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open]);

  const current = LANGS.find((l) => l.code === lang) || LANGS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-caption font-medium rounded-button text-text-muted hover:text-text hover:bg-surface transition-colors cursor-pointer font-mono"
        aria-label={t('language_switcher.aria')}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Icon.Globe className="w-3.5 h-3.5" />
        <span>{current.short}</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-40 bg-surface border border-accent/20 rounded-card shadow-2xl overflow-hidden z-[100] animate-dropdown"
        >
          {LANGS.map((l) => {
            const isActive = l.code === lang;
            return (
              <button
                key={l.code}
                role="menuitem"
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 text-body-sm transition-colors cursor-pointer font-mono ${
                  isActive
                    ? 'text-accent bg-accent/5'
                    : 'text-text-muted hover:text-text hover:bg-bg/60'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-mono-sm font-bold tracking-wider opacity-60">
                    {l.short}
                  </span>
                  <span>{l.label}</span>
                </span>
                {isActive && <Icon.Check className="w-3.5 h-3.5 text-accent" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}