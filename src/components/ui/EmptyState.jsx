import { Link } from 'react-router-dom';

// Ortak boş durum bileşeni.
// - Home, Dashboard, Profile ve diğer yerlerde kullanılır.
// - min-h ile sayfa yüksekliği korunur, footer yukarı zıplamaz.
// - Ortalanmış ikon + başlık + açıklama + opsiyonel CTA.
//
// Kullanım:
//   <EmptyState
//     icon={Icon.Package}
//     title="henüz proje yok"
//     description="İlk projeni oluşturarak başla."
//     cta={{ label: 'proje oluştur', to: '/create-project' }}
//   />
export default function EmptyState({
  icon: IconComponent,
  title,
  description,
  cta,            // { label, to } veya { label, onClick, icon }
  compact = false,
}) {
  const CtaIcon = cta?.icon;
  const minH = compact ? 'min-h-[240px]' : 'min-h-[320px]';

  const ctaClasses =
    'inline-flex items-center gap-2 px-5 py-2.5 text-body-sm font-bold bg-accent text-bg rounded-button hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] font-mono';

  return (
    <div
      className={`relative flex items-center justify-center rounded-card bg-surface/30 border border-dashed border-accent/20 overflow-hidden ${minH}`}
    >
      {/* Hafif glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-50 bg-accent opacity-[0.04] blur-[80px] rounded-pill pointer-events-none" />

      <div className="relative text-center px-6">
        {IconComponent && (
          <div className="w-14 h-14 mx-auto mb-4 rounded-card bg-bg/60 border border-accent/15 flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-text-muted" />
          </div>
        )}

        <h3 className="text-body font-bold text-text mb-1.5 font-mono">
          {title}
        </h3>

        {description && (
          <p className="text-body-sm text-text-muted max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        )}

        {cta && (
          <div className="mt-5">
            {cta.to ? (
              <Link to={cta.to} className={ctaClasses}>
                {CtaIcon && <CtaIcon className="w-4 h-4" />}
                {cta.label}
              </Link>
            ) : (
              <button type="button" onClick={cta.onClick} className={`${ctaClasses} cursor-pointer`}>
                {CtaIcon && <CtaIcon className="w-4 h-4" />}
                {cta.label}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}