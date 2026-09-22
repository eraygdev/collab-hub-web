import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-20">
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-black tracking-tight mb-3">
          404
        </h1>
        <h2 className="text-xl font-bold text-black mb-2">
          Sayfa bulunamadı
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Aradığın sayfa silinmiş, taşınmış veya hiç var olmamış olabilir.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
          >
            🠔 Ana Sayfaya Dön
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}