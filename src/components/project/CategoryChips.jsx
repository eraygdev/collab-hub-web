import { useState } from 'react';
import CategoryModal from './CategoryPick';
import * as Icon from '../ui/Icons';
import { PROJECT_LIMITS } from '../../constants/limits';

export default function CategoryChips({ categories, selected, onChange, disabled }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const MAX_SELECTION = PROJECT_LIMITS.maxCategories;
  const VISIBLE_LIMIT = PROJECT_LIMITS.visibleCategories;

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
        <label className="block text-xs font-medium text-text">
          Kategoriler
        </label>
        <span className="text-[11px] text-text-muted tabular-nums font-mono">
          {selected.length} / {MAX_SELECTION}
        </span>
      </div>

      {categories.length === 0 ? (
        <p className="text-[11px] text-text-muted font-mono">Kategoriler yükleniyor...</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {visibleCategories.map((cat) => {
            const isSelected = selected.includes(cat.id);
            const isDisabled = !isSelected && selected.length >= MAX_SELECTION;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggle(cat.id)}
                disabled={disabled || isDisabled}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed font-mono ${
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
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full border border-dashed border-accent/30 text-text-muted hover:border-accent hover:text-text transition-all cursor-pointer disabled:opacity-40 font-mono"
            >
              <Icon.Plus className="w-3 h-3" />
              {categories.length - VISIBLE_LIMIT} daha
            </button>
          )}
        </div>
      )}

      <p className="mt-1.5 text-[11px] text-text-muted/70 font-mono">
        En fazla {MAX_SELECTION} kategori seçebilirsin. (Opsiyonel)
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