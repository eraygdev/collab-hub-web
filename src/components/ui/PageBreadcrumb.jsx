import { Link } from 'react-router-dom';

// Sayfa breadcrumb'ı — tüm sayfalarda ortak.
//
// items: [{ label, to? }, ...] — son item aktif sayfa (to yok, pulse nokta)
//
// Örnek:
// <PageBreadcrumb items={[
//   { label: 'ana sayfa', to: '/' },
//   { label: 'dashboard', to: '/dashboard' },
//   { label: 'ayarlar' } // aktif
// ]} />
export default function PageBreadcrumb({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-body-sm mb-6 font-mono flex-wrap"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            {isLast ? (
              <span className="inline-flex items-center gap-2 text-text font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse shrink-0" />
                {item.label}
              </span>
            ) : (
              <Link
                to={item.to}
                className="text-text-muted hover:text-text transition-colors underline-offset-4 hover:underline"
              >
                {item.label}
              </Link>
            )}

            {!isLast && <span className="text-accent/30 select-none">/</span>}
          </div>
        );
      })}
    </nav>
  );
}