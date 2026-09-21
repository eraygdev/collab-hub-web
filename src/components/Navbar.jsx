import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar({ onOpenSidebar }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-100 shadow-xs">
      {/* max-w-7xl ve mx-auto buradan kaldırıldı, tam genişlik sağlandı */}
      <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSidebar}
            className="p-2 rounded-lg text-gray-600 hover:text-black hover:bg-gray-100 transition-colors focus:outline-hidden cursor-pointer"
            aria-label="Menüyü Aç"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <Link 
            to="/" 
            className="text-[26px] font-extrabold tracking-tight text-gray-900/70 hover:text-gray-600 transition-colors cursor-pointer"
          >
            Collab-Hub
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 hover:text-black bg-transparent hover:bg-gray-100 rounded-lg transition-all cursor-pointer">
            Sign In
          </Link>
          <div className="w-9 h-9 rounded-full bg-gray-200 border border-gray-300 overflow-hidden flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-black transition-all">
            <svg className="w-5 h-5 text-gray-500 mt-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}