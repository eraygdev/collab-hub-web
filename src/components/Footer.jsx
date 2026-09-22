import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-16 relative">

      {/* Üst Bant - CTA */}
      <div className="relative w-full bg-gray-900 text-white overflow-hidden">

        {/* Arka plan gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />

        {/* Dekoratif desen (noktalar) */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Üst geçiş — koyu bant başında yumuşak giriş */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-gray-50/20 to-transparent pointer-events-none" />

        {/* İçerik — SVG geçişi kadar altta boşluk bırakıyoruz (pb-12) */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20">
          {/* Başlık */}
          <div className="text-center mb-4">
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight mb-1">
              Projeni Paylaş, Ekibe Katıl
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Hesap oluştur, projeni yayınla ve topluluğa katıl.
            </p>
          </div>

          {/* Form Alanı */}
          <div className="flex flex-col sm:flex-row items-stretch gap-5 max-w-2xl mx-auto">
            {/* Ad Soyad */}
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Adınız Soyadınız"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
              />
            </div>

            {/* E-posta */}
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </span>
              <input
                type="email"
                placeholder="E-Posta Adresiniz"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
              />
            </div>

            {/* Gönder Butonu */}
            <button className="px-6 py-2.5 text-sm font-bold text-gray-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap">
              KAYIT OL
            </button>
          </div>
        </div>

        {/* Alt geçiş — SVG diagonal (koyu bandın bir parçası, absolute bottom-0) */}
        <svg
          className="absolute bottom-0 left-0 right-0 w-full h-12 text-gray-50"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          <path d="M0,48 L1440,0 L1440,48 Z" />
        </svg>
      </div>

      {/* Alt Bölüm - Link Sütunları */}
      <div className="w-full bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* 4 Sütun + Ortada Logo */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-6">

            {/* Kurumsal */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Kurumsal
              </h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black transition-colors">Ödeme Yöntemleri</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Hesap Bilgileri</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Sıkça Sorulan Sorular</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Kullanım Koşulları</a></li>
                <li><a href="#" className="hover:text-black transition-colors">KVKK ve Gizlilik</a></li>
              </ul>
            </div>

            {/* Hizmetler */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Hizmetler
              </h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black transition-colors">Keşfet</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Yeni Proje</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Katıl</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Proje Yönetimi</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Ekip Yönetimi</a></li>
                <li><a href="#" className="hover:text-black transition-colors">İşbirliği</a></li>
              </ul>
            </div>

            {/* Logo (Ortada) */}
            <div className="col-span-2 md:col-span-1 flex items-center justify-center order-first md:order-none">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  Collab<span className="text-amber-500">-Hub</span>
                </div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-gray-500 mt-0.5">
                  .com
                </div>
              </div>
            </div>

            {/* Medya */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Medya
              </h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black transition-colors">Haberler/Duyurular</a></li>
                <li><a href="#" className="hover:text-black transition-colors">E-Katalog</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Bültenler</a></li>
                <li><a href="#" className="hover:text-black transition-colors">S.S.S</a></li>
              </ul>
            </div>

            {/* İnsan Kaynakları */}
            <div>
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                İnsan Kaynakları
              </h3>
              <ul className="space-y-1.5 text-sm text-gray-600">
                <li><a href="#" className="hover:text-black transition-colors">Açık Pozisyonlar</a></li>
                <li><a href="#" className="hover:text-black transition-colors">İK Politikası</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Çalışan Profil Formu</a></li>
                <li><a href="#" className="hover:text-black transition-colors">Başvuru Formu</a></li>
              </ul>
            </div>
          </div>

          {/* Alt Copyright Alanı */}
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500 leading-snug mb-2">
              © {year} Collab-Hub Teknoloji A.Ş. Tüm Hakları Saklıdır. Bu web sitesindeki tüm içerik, marka ve logo Collab-Hub Teknoloji A.Ş.'ye aittir. İzinsiz kullanılamaz, kopyalanamaz ve çoğaltılamaz.
            </p>

            <p className="text-xs text-gray-500">
              Bilgi Toplumu Hizmetleri: <a href="#" className="text-gray-700 hover:text-black underline">Hesap Açıklama ve Kullanım Şartları</a> | <a href="#" className="text-gray-700 hover:text-black underline">Gizlilik</a>
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}