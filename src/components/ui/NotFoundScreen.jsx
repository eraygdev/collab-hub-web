import { Link } from 'react-router-dom';

// Ortak "not found" ekranı.
// NotFound, Profile, Details, Edit hepsi bunu kullanır.
//
// Kullanım:
//   <NotFoundScreen
//     eyebrow="proje · bulunamadı"
//     bigText="#42"
//     title="proje bulunamadı"
//     description="..."
//     primaryCta={{ label: 'Ana Sayfaya Dön', to: '/', icon: Icon.ArrowLeft }}
//   />
export default function NotFoundScreen({
  eyebrow,
  bigText,
  title,
  description,
  primaryCta,
  secondaryCta,
}) {
  const PrimaryIcon = primaryCta?.icon;
  const SecondaryIcon = secondaryCta?.icon;

  return (
    <div className="w-full bg-bg px-4 sm:px-6 lg:px-8 py-page min-h-[70vh] flex items-center justify-center relative overflow-hidden">
      {/* Glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-75 bg-accent opacity-[0.05] blur-[120px] rounded-pill pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Eyebrow */}
        {eyebrow && (
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-pill border border-accent/15 bg-surface/50">
            <span className="w-1.5 h-1.5 rounded-pill bg-accent animate-pulse" />
            <span className="text-mono-sm font-mono tracking-wider text-text-muted uppercase">
              {eyebrow}
            </span>
          </div>
        )}

        {/* Büyük mono (404, @username, #id) */}
        {bigText && (
          <h1 className="text-h1 font-extrabold text-text tracking-tight mb-4 font-mono break-all">
            {bigText}
          </h1>
        )}

        {/* Başlık + açıklama */}
        <h2 className="text-h5 font-bold text-text mb-2">{title}</h2>
        {description && (
          <p className="text-body-sm text-text-muted mb-8 max-w-md mx-auto leading-relaxed">
            {description}
          </p>
        )}

        {/* CTA'lar */}
        <div className="flex flex-wrap justify-center gap-3">
          {primaryCta && (
            <Link
              to={primaryCta.to}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg text-body-sm font-bold rounded-button border border-accent hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer font-mono"
            >
              {PrimaryIcon && <PrimaryIcon className="w-4 h-4" />}
              {primaryCta.label}
            </Link>
          )}
          {secondaryCta && (
            <Link
              to={secondaryCta.to}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent text-text text-body-sm font-bold rounded-button border border-accent/30 hover:border-accent hover:bg-surface transition-all cursor-pointer font-mono"
            >
              {SecondaryIcon && <SecondaryIcon className="w-4 h-4" />}
              {secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}