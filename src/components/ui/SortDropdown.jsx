import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import * as Icon from './Icons';

const OPTIONS = [
  { value: 'hot', labelKey: 'home.sort.hot' },
  { value: 'trending', labelKey: 'home.sort.trending' },
  { value: 'newest', labelKey: 'home.sort.newest' },
  { value: 'popular', labelKey: 'home.sort.popular' },
];

export default function SortDropdown({ value, onChange }) {
  const { t } = useLanguage();
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

  const current = OPTIONS.find((o) => o.value === value) || OPTIONS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1.5 px-3 py-1 text-caption font-medium rounded-button border border-accent/20 bg-surface/60 text-text-muted hover:text-text hover:border-accent/40 transition-colors cursor-pointer font-mono"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Icon.Sort className="w-3 h-3" />
        <span>{t(current.labelKey)}</span>
        {open ? (
          <Icon.ChevronUp className="w-3 h-3" />
        ) : (
          <Icon.ChevronDown className="w-3 h-3" />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 mt-2 w-40 bg-surface border border-accent/20 rounded-card shadow-2xl overflow-hidden z-[100] animate-dropdown"
        >
          {OPTIONS.map((option) => {
            const isActive = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                role="menuitem"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-body-sm transition-colors cursor-pointer font-mono ${
                  isActive
                    ? 'text-accent bg-accent/5'
                    : 'text-text-muted hover:text-text hover:bg-bg/60'
                }`}
              >
                <span
                  className={`shrink-0 w-1.5 h-1.5 rounded-pill ${
                    isActive ? 'bg-accent' : 'bg-transparent'
                  }`}
                  aria-hidden="true"
                />
                <span>{t(option.labelKey)}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}