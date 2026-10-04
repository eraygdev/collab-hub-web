import { useLanguage } from '../../i18n/LanguageContext';
import * as Icon from '../../components/ui/Icons';

export default function Danger() {
  const { t } = useLanguage();

  return (
    <div className="bg-surface border border-red-400/20 rounded-card p-6 sm:p-8">
      <h2 className="text-caption font-bold text-red-400 uppercase tracking-wider mb-4 font-mono">
        {t('settings.danger.section')}
      </h2>

      <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-button mb-5">
        <Icon.Warning className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
        <p className="text-caption text-red-200/90 leading-relaxed">
          {t('settings.danger.desc')}
        </p>
      </div>

      <button
        type="button"
        disabled
        className="px-5 py-2.5 text-body-sm font-semibold text-red-400 bg-transparent border border-red-400/30 rounded-button opacity-50 cursor-not-allowed font-mono"
      >
        {t('settings.danger.button')}
      </button>
    </div>
  );
}