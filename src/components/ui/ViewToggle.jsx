import * as Icon from './Icons';

// Normal/Kompakt görünüm toggle'ı.
// useProjectView hook'uyla birlikte kullanılır.
export default function ViewToggle({ view, onChange, labelNormal, labelCompact }) {
  const btn = (active) =>
    `px-2.5 py-1 text-caption font-medium rounded-button transition-all cursor-pointer ${
      active ? 'bg-accent text-bg shadow-sm' : 'text-text-muted hover:text-text'
    }`;

  return (
    <div className="inline-flex rounded-button border border-accent/20 p-0.5 bg-surface/60">
      <button
        onClick={() => onChange('normal')}
        className={btn(view === 'normal')}
        aria-label={labelNormal}
        title={labelNormal}
      >
        <Icon.List className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onChange('compact')}
        className={btn(view === 'compact')}
        aria-label={labelCompact}
        title={labelCompact}
      >
        <Icon.LayoutGrid className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}