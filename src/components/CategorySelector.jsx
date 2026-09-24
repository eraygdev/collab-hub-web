import { useState } from 'react';
import CategoryModal from './CategoryModal';
import { PROJECT_LIMITS } from '../constants/limits';

// Chip listesi + "Daha fazla" modal ile çoklu kategori seçimi.
// categories: [{id, name, slug}]
// selected: [id, id, ...]
export default function CategorySelector({ categories, selected, onChange, disabled }) {
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
        <label className="block text-xs font-medium text-gray-700">
          Kategoriler
        </label>
        <span className="text-[11px] text-gray-400 tabular-nums">
          {selected.length} / {MAX_SELECTION}
        </span>
      </div>

      {categories.length === 0 ? (
        <p className="text-[11px] text-gray-400">Kategoriler yükleniyor...</p>
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
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                  isSelected
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
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
              className="px-3 py-1.5 text-xs font-medium rounded-full border border-dashed border-gray-300 text-gray-600 hover:border-gray-500 hover:text-black transition-colors cursor-pointer disabled:opacity-40"
            >
              +{categories.length - VISIBLE_LIMIT} daha
            </button>
          )}
        </div>
      )}

      <p className="mt-1 text-[11px] text-gray-400">
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