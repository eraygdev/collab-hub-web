import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full relative">

      {/* Üst Bant - CTA */}
      <div className="relative w-full bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />

        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-50/20 to-transparent pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
          <div className="text-center mb-4">
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight mb-1">
              Projeni Paylaş, Ekibe Katıl
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Hesap oluştur, projeni yayınla ve topluluğa katıl.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-5 max-w-2xl mx-auto">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Adınız Soyadınız"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="E-Posta Adresiniz"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-transparent transition-all"
              />
            </div>

            <button className="px-6 py-2.5 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded-lg transition-colors cursor-pointer whitespace-nowrap border border-white/10">
              KAYIT OL
            </button>
          </div>
        </div>

        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-12 text-gray-50"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,48 L1440,0 L1440,48 Z" />
        </svg>
      </div>

      {/* Alt Bölüm — logo + iletişim + copyright */}
        <div className="w-full bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            <div className="text-xl font-extrabold text-gray-900 font-dm">
                Collab-Hub.
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
                <a
                href="https://github.com/eraygdev/web-collab-hub"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-black transition-colors inline-flex items-center gap-1.5"
                >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.69 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 015.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.42-2.69 5.39-5.25 5.68.41.35.78 1.05.78 2.12 0 1.53-.01 2.76-.01 3.13 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.73 18.27.5 12 .5z" />
                </svg>
                GitHub
                </a>

                <span className="text-gray-300">·</span>

                <a
                href="mailto:retadeveloper@gmail.com"
                className="hover:text-black transition-colors"
                >
                retadeveloper@gmail.com
                </a>

                <span className="text-gray-300 hidden sm:inline">·</span>

                <p className="text-gray-500 hidden sm:inline">
                © {year} RETA
                </p>
            </div>

            {/* Mobilde copyright ayrı satırda görünsün */}
            <p className="text-xs text-gray-500 sm:hidden">
                © {year} RETA
            </p>
            </div>
        </div>
        </div>
    </footer>
  );
}