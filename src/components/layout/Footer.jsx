import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import * as Icon from '../ui/Icons';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Footer() {
  const year = new Date().getFullYear();
  const { user } = useAuth();

  return (
    <footer className="w-full relative">

      {/* ÜST BANT — CTA */}
      <div className="relative w-full bg-bg text-text overflow-hidden border-t border-accent/10">
        <div className="absolute inset-0 bg-gradient-to-br from-bg via-surface to-bg" />
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-accent/[0.04] to-transparent pointer-events-none" />
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
                <Icon.Plus className="w-4 h-4" />
                Proje Oluştur
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-text bg-transparent hover:bg-surface border border-accent/30 hover:border-accent rounded-lg transition-all cursor-pointer"
              >
                <Icon.LayoutGrid className="w-4 h-4" />
                Dashboard
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-center max-w-md mx-auto">
              <button
                onClick={() => (window.location.href = `${API}/api/auth/github/login`)}
                className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 text-sm font-bold text-text bg-transparent hover:bg-surface border border-accent/30 hover:border-accent rounded-lg transition-all cursor-pointer"
              >
                <Icon.Github className="w-4 h-4" />
                GitHub ile Başla
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ALT BÖLÜM — 4 SÜTUN */}
      <div className="relative w-full bg-bg overflow-hidden border-t border-accent/10">
        <div
          className="absolute inset-0 opacity-[0.35] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--color-text-muted) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">

            {/* Marka */}
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
                  <Icon.Github className="w-4 h-4" />
                </a>
                <a
                  href="mailto:retadeveloper@gmail.com"
                  aria-label="E-posta"
                  className="w-9 h-9 rounded-lg bg-surface border border-accent/15 flex items-center justify-center text-text-muted hover:text-bg hover:bg-accent hover:border-accent transition-all"
                >
                  <Icon.Mail className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="w-9 h-9 rounded-lg bg-surface border border-accent/15 flex items-center justify-center text-text-muted hover:text-bg hover:bg-accent hover:border-accent transition-all"
                >
                  <Icon.Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Ürün */}
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

            {/* Kaynaklar */}
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

            {/* Şirket */}
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

          {/* Copyright */}
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