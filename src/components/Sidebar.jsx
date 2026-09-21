import { Link } from 'react-router-dom';

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
        />
      )}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 px-6 flex items-center justify-between border-b border-gray-100">
          <span className="font-bold text-lg text-black">Menü</span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Menüyü Kapat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors"
          >
            Keşfet
          </Link>
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors"
          >
            Projeler
          </Link>
          <Link
            to="/create-project"
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors"
          >
            Başvurularım
          </Link>
        </nav>
      </aside>
    </>
  );
}