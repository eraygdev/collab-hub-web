// Sekme navigasyonu. Dashboard ve Profile kullanır.
//
// items: [{ key, label, badge? }]  — badge sayı veya null
export default function TabNav({ items, active, onChange }) {
  return (
    <div className="border-b border-accent/10">
      <div className="flex items-center gap-6">
        {items.map((item) => {
          const isActive = item.key === active;
          const hasBadge = item.badge !== undefined && item.badge !== null;

          return (
            <button
              key={item.key}
              onClick={() => onChange(item.key)}
              className={`inline-flex items-center gap-2 pb-3 text-body-sm font-semibold transition-all cursor-pointer border-b-2 -mb-px font-mono ${
                isActive
                  ? 'text-text border-accent'
                  : 'text-text-muted border-transparent hover:text-text'
              }`}
            >
              {item.label}
              {hasBadge && (
                <span
                  className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-mono-sm font-bold rounded-pill font-mono ${
                    isActive ? 'bg-accent text-bg' : 'bg-accent/10 text-accent'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}