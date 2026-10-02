import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="w-full bg-bg px-4 sm:px-6 lg:px-8 py-20 min-h-[70vh] flex items-center justify-center relative overflow-hidden">
      {/* Glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-3xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-accent/15 bg-surface/50">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider text-text-muted uppercase">
            hata · 404
          </span>
        </div>

        {/* Büyük 404 */}
        <h1 className="text-6xl sm:text-8xl font-extrabold text-text tracking-tight mb-4 font-mono">
          4 0 4
        </h1>

        {/* Açıklama */}
        <h2 className="text-xl font-bold text-text mb-2">
          Sayfa bulunamadı
        </h2>
        <p className="text-sm text-text-muted mb-8 max-w-md mx-auto leading-relaxed">
          Aradığın sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.
        </p>

        {/* Butonlar */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg text-sm font-bold rounded-xl border border-accent hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Ana Sayfaya Dön
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-transparent text-text text-sm font-bold rounded-xl border border-accent/30 hover:border-accent hover:bg-surface transition-all cursor-pointer"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}