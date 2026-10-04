import { useLanguage } from '../../i18n/LanguageContext';
import { useScale } from '../../hooks/useScale';
import * as Icon from '../../components/ui/Icons';

const LANGS = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'tr', label: 'Türkçe', short: 'TR' },
];

const SCALES = [
  { key: 'sm', labelKey: 'scale_small', preview: 'Aa' },
  { key: 'md', labelKey: 'scale_medium', preview: 'Aa' },
  { key: 'lg', labelKey: 'scale_large', preview: 'Aa' },
];

export default function Appearance() {
  const { lang, setLang, t } = useLanguage();
  const { scale, setScale } = useScale();

  return (
    <div className="bg-surface border border-accent/10 rounded-card p-6 sm:p-8">

      {/* ─── DİL ─── */}
      <div>
        <h2 className="text-caption font-bold text-text uppercase tracking-wider font-mono mb-4">
          {t('settings.appearance.language_section')}
        </h2>

        <label className="block text-caption font-medium text-text mb-2">
          {t('settings.appearance.language_label')}
        </label>

        <div className="grid grid-cols-2 gap-2 max-w-md">
          {LANGS.map((l) => {
            const isActive = l.code === lang;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className={`flex items-center justify-between px-4 py-3 rounded-button border transition-all cursor-pointer font-mono ${
                  isActive
                    ? 'bg-accent/10 border-accent/50 text-text'
                    : 'bg-bg border-accent/15 text-text-muted hover:border-accent/40 hover:text-text'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-mono-sm font-bold tracking-wider opacity-60">
                    {l.short}
                  </span>
                  <span className="text-body-sm">{l.label}</span>
                </span>
                {isActive && <Icon.Check className="w-4 h-4 text-accent" />}
              </button>
            );
          })}
        </div>

        <p className="mt-2 text-mono-sm text-text-muted font-mono">
          {t('settings.appearance.language_hint')}
        </p>
      </div>

      {/* AYRAÇ */}
      <div className="my-8 h-px bg-accent/10" />

      {/* ─── YAZI BOYUTU ─── */}
      <div>
        <h2 className="text-caption font-bold text-text uppercase tracking-wider font-mono mb-4">
          {t('settings.appearance.scale_section')}
        </h2>

        <label className="block text-caption font-medium text-text mb-2">
          {t('settings.appearance.scale_label')}
        </label>

        <div className="grid grid-cols-3 gap-2 max-w-md">
          {SCALES.map((s) => {
            const isActive = s.key === scale;
            // Her seçenek kendi önizleme boyutunu gösterir
            const previewSize =
              s.key === 'sm' ? 'text-body-sm' : s.key === 'lg' ? 'text-h5' : 'text-body';

            return (
              <button
                key={s.key}
                type="button"
                onClick={() => setScale(s.key)}
                className={`flex flex-col items-center justify-center gap-1.5 py-4 rounded-button border transition-all cursor-pointer font-mono ${
                  isActive
                    ? 'bg-accent/10 border-accent/50 text-text'
                    : 'bg-bg border-accent/15 text-text-muted hover:border-accent/40 hover:text-text'
                }`}
                aria-pressed={isActive}
              >
                <span className={`${previewSize} font-bold leading-none`}>
                  {s.preview}
                </span>
                <span className="text-mono-sm opacity-80">
                  {t(`settings.appearance.${s.labelKey}`)}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-2 text-mono-sm text-text-muted font-mono">
          {t('settings.appearance.scale_hint')}
        </p>
      </div>

      {/* AYRAÇ */}
      <div className="my-8 h-px bg-accent/10" />

      {/* ─── TEMA ─── */}
      <div>
        <h2 className="text-caption font-bold text-text uppercase tracking-wider font-mono mb-4">
          {t('settings.appearance.theme_section')}
        </h2>

        <label className="block text-caption font-medium text-text mb-2">
          {t('settings.appearance.theme_label')}
        </label>

        <div className="inline-flex items-center gap-2 px-4 py-3 rounded-button bg-bg/60 border border-accent/10 text-text-muted font-mono text-body-sm">
          <Icon.Sparkles className="w-4 h-4 text-accent" />
          {t('settings.appearance.theme_locked')}
        </div>

        <p className="mt-2 text-mono-sm text-text-muted font-mono">
          {t('settings.appearance.theme_hint')}
        </p>
      </div>

    </div>
  );
}