import { useLanguage } from '../../i18n/LanguageContext';
import * as Icon from '../ui/Icons';

export default function ContributorLimitPicker({
  value,
  onChange,
  disabled,
  options,
}) {
  const { t } = useLanguage();

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-caption font-medium text-text">
          {t('contributor_limit.label')}
        </label>
        <span className="text-mono-sm text-text-muted tabular-nums font-mono">
          {t('contributor_limit.selected', { count: value })}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((limit, index) => {
          const isSelected = limit === value;
          return (
            <button
              key={limit}
              type="button"
              onClick={() => onChange(limit)}
              disabled={disabled}
              style={{ animationDelay: `${index * 30}ms` }}
              className={`animate-chip px-4 py-1.5 text-caption font-medium rounded-pill border transition-all cursor-pointer font-mono disabled:opacity-40 disabled:cursor-not-allowed ${
                isSelected
                  ? 'bg-accent text-bg border-accent'
                  : 'bg-surface text-text-muted border-accent/15 hover:border-accent/40 hover:text-text'
              }`}
            >
              {limit}
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-mono-sm text-text-muted font-mono inline-flex items-center gap-1.5">
        <Icon.Lock className="w-3 h-3" />
        {t('contributor_limit.locked_hint')}
      </p>
    </div>
  );
}