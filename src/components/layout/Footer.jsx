import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Footer() {
  const year = new Date().getFullYear();
  const { user } = useAuth();

  return (
    <footer className="w-full relative">

      {/* ─────────────────────────────────────────
          ÜST BANT — CTA (koyu gradient)
      ───────────────────────────────────────── */}
      <div className="relative w-full bg-bg text-text overflow-hidden border-t border-accent/10">

        {/* GRADIENT — üstten alta koyu geçiş */}
        <div className="absolute inset-0 bg-gradient-to-br from-bg via-surface to-bg" />

        {/* Üst kenar hafif accent gradient */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-accent/[0.04] to-transparent pointer-events-none" />

        {/* Noktalı pattern — accent rengi */}
        <div
          className="absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--color-accent) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-6">
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight mb-1 text-text">
              {user ? `Hoş geldin, ${user.username}` : 'Projeni Paylaş, Ekibe Katıl'}
            </h2>
            <p className="text-xs sm:text-sm text-text-muted font-mono">
              {user
                ? 'Yeni bir proje oluştur veya paneline göz at.'
                : 'Hesap oluştur, projeni yayınla ve topluluğa katıl.'}
            </p>
          </div>

          {user ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <Link
                to="/create-project"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-bg bg-accent hover:bg-accent/90 rounded-lg transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Proje Oluştur
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-text bg-transparent hover:bg-surface border border-accent/30 hover:border-accent rounded-lg transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-center max-w-md mx-auto">
              <button
                onClick={() => (window.location.href = `${API}/api/auth/github/login`)}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-text bg-transparent hover:bg-surface border border-accent/30 hover:border-accent rounded-lg transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 015.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.13 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z" />
                </svg>
                GitHub ile Başla
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────
          ALT BÖLÜM — 4 SÜTUNLU DÜZEN
      ───────────────────────────────────────── */}
      <div className="relative w-full bg-bg overflow-hidden border-t border-accent/10">

        {/* Noktalı pattern — alt bant */}
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--color-text-muted) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">

          {/* 4 Sütun */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

            {/* Sütun 1 — Marka */}
            <div className="col-span-2 md:col-span-1">
              <Link
                to="/"
                className="font-display text-2xl text-text hover:text-accent transition-colors inline-block mb-3"
              >
                Collab-Hub
              </Link>
              <p className="text-sm text-text-muted leading-relaxed mb-4">
                Geliştiricilerin projelerini paylaştığı, keşfettiği ve ekibe katıldığı açık kaynak platform.
              </p>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://github.com/eraygdev"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profili"
                  className="w-9 h-9 rounded-lg bg-surface border border-accent/15 flex items-center justify-center text-text-muted hover:text-bg hover:bg-accent hover:border-accent transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 015.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.13 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z" />
                  </svg>
                </a>
                <a
                  href="mailto:retadeveloper@gmail.com"
                  aria-label="E-posta"
                  className="w-9 h-9 rounded-lg bg-surface border border-accent/15 flex items-center justify-center text-text-muted hover:text-bg hover:bg-accent hover:border-accent transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-9 h-9 rounded-lg bg-surface border border-accent/15 flex items-center justify-center text-text-muted hover:text-bg hover:bg-accent hover:border-accent transition-all"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Sütun 2 — Ürün */}
            <div>
              <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-4 font-mono">
                /ürün
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/" className="text-text-muted hover:text-text transition-colors">
                    Keşfet
                  </Link>
                </li>
                <li>
                  <Link to="/create-project" className="text-text-muted hover:text-text transition-colors">
                    Proje Oluştur
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-text-muted hover:text-text transition-colors">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sütun 3 — Kaynaklar */}
            <div>
              <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-4 font-mono">
                /kaynaklar
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <a
                    href="https://github.com/eraygdev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    Geliştirici
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:retadeveloper@gmail.com"
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    İletişim
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-muted hover:text-text transition-colors"
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>

            {/* Sütun 4 — Şirket */}
            <div>
              <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-4 font-mono">
                /şirket
              </h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/about" className="text-text-muted hover:text-text transition-colors">
                    Hakkımızda
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-text-muted hover:text-text transition-colors">
                    Gizlilik
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-text-muted hover:text-text transition-colors">
                    Kullanım Şartları
                  </Link>
                </li>
              </ul>
            </div>

          </div>

          {/* Alt Bant: Copyright + Linkler */}
          <div className="pt-5 border-t border-accent/10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-text-muted font-mono">
              © {year} Collab-Hub · by Reta
            </p>
            <div className="flex items-center gap-3 text-xs text-text-muted font-mono">
              <Link to="/privacy" className="hover:text-text transition-colors">
                gizlilik
              </Link>
              <span className="text-accent/30">·</span>
              <Link to="/terms" className="hover:text-text transition-colors">
                şartlar
              </Link>
              <span className="text-accent/30">·</span>
              <Link to="/cookies" className="hover:text-text transition-colors">
                çerezler
              </Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}