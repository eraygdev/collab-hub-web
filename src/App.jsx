import React, { useState } from 'react';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-black selection:text-white">
      {/* Üst Bar (Navbar) */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Sol Bölüm: Hamburger Menü */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 transition-colors focus:outline-hidden cursor-pointer"
              aria-label="Menüyü Aç"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Orta Bölüm: Başlık */}
            <h1 className="text-xl font-bold tracking-tight text-black">
              Collab-Hub
            </h1>
          </div>

          {/* Sağ Bölüm: Sign In ve Avatar */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-black bg-transparent hover:bg-gray-100 rounded-lg transition-all cursor-pointer">
              Sign In
            </button>
            <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-black transition-all">
              <svg className="w-5 h-5 text-gray-500 mt-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>

        </div>
      </header>

      {/* Ana Sayfa İçeriği */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-xs">
          <h2 className="text-2xl font-semibold text-black mb-2">Hoş Geldiniz</h2>
          <p className="text-gray-500">Modern ve minimalist arayüz iskeleti başarıyla hazırlandı. Sol üstteki menü ikonunu kullanarak yan paneli açabilirsiniz.</p>
        </div>
      </main>

      {/* Sidebar Overlay (Arka Plan Karartması) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
        />
      )}

      {/* Açılır Menü (Sidebar / Drawer) */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-gray-100">
          <span className="font-bold text-lg text-black">Menü</span>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Menüyü Kapat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Sidebar Navigasyon Linkleri */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <a
            href="#kesfet"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Keşfet
          </a>
          <a
            href="#projeler"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Projeler
          </a>
          <a
            href="#basvurularim"
            onClick={() => setIsSidebarOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Başvurularım
          </a>
        </nav>
      </aside>
    </div>
  );
}