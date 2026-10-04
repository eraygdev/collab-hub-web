import { useState } from 'react';
import CategoryModal from './CategoryPick';
import { useLanguage } from '../../i18n/LanguageContext';
import { useConfig } from '../../context/ConfigContext';
import * as Icon from '../ui/Icons';

export default function CategoryChips({ categories, selected, onChange, disabled }) {
  const { t } = useLanguage();
  const { limits } = useConfig();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const MAX_SELECTION = limits.maxCategories;
  const VISIBLE_LIMIT = limits.visibleCategories;

  const visibleCategories = categories.slice(0, VISIBLE_LIMIT);

  const toggle = (id) => {
    if (disabled) return;
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      if (selected.length >= MAX_SELECTION) return;
      onChange([...selected, id]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-caption font-medium text-text">
          {t('category_chips.label')}
        </label>
        <span className="text-mono-sm text-text-muted tabular-nums font-mono">
          {t('category_chips.counter', { count: selected.length, max: MAX_SELECTION })}
        </span>
      </div>

      {categories.length === 0 ? (
        <p className="text-mono-sm text-text-muted font-mono">{t('category_chips.loading')}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {visibleCategories.map((cat, index) => {
            const isSelected = selected.includes(cat.id);
            const isDisabled = !isSelected && selected.length >= MAX_SELECTION;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggle(cat.id)}
                disabled={disabled || isDisabled}
                style={{ animationDelay: `${index * 30}ms` }}
                className={`animate-chip px-3 py-1.5 text-caption font-medium rounded-pill border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed font-mono ${
                  isSelected
                    ? 'bg-accent text-bg border-accent'
                    : 'bg-surface text-text-muted border-accent/15 hover:border-accent/40 hover:text-text'
                }`}
              >
                {cat.name}
              </button>
            );
          })}

          {categories.length > VISIBLE_LIMIT && (
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              disabled={disabled}
              style={{ animationDelay: `${Math.min(VISIBLE_LIMIT, 12) * 30}ms` }}
              className="animate-chip inline-flex items-center gap-1 px-3 py-1.5 text-caption font-medium rounded-pill border border-dashed border-accent/30 text-text-muted hover:border-accent hover:text-text transition-all cursor-pointer disabled:opacity-40 font-mono"
            >
              <Icon.Plus className="w-3 h-3" />
              {t('category_chips.more', { count: categories.length - VISIBLE_LIMIT })}
            </button>
          )}
        </div>
      )}

      <p className="mt-1.5 text-mono-sm text-text-muted/70 font-mono">
        {t('category_chips.hint', { max: MAX_SELECTION })}
      </p>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={onChange}
        categories={categories}
        selectedCategories={selected}
        maxSelection={MAX_SELECTION}
      />
    </div>
  );
}