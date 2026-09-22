import { useParams, Link } from 'react-router-dom';
import { getProjectById } from '../data/mockProjects';

export default function ProjectDetail() {
  const { id } = useParams();
  const project = getProjectById(id);

  if (!project) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-black mb-2">Proje bulunamadı</h2>
          <p className="text-gray-500 mb-6">Aradığın proje silinmiş veya taşınmış olabilir.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            🠔 Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-black transition-colors">Ana Sayfa</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium truncate">{project.title}</span>
        </nav>

        {/* Başlık + Meta */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              {project.status}
            </span>
            <span className="text-xs text-gray-500">📅 {project.createdAt}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight mb-4">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Kapak Görseli */}
        <div className="w-full h-64 sm:h-80 rounded-2xl mb-10 overflow-hidden bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        </div>

        {/* Ana İçerik */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Sol Sütun */}
          <div className="lg:col-span-2">
            {/* Kategoriler */}
            <div className="mb-10">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Teknolojiler & Kategoriler
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.categories.map((cat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-full transition-colors"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Detaylı Açıklama */}
            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Proje Hakkında
              </h2>
              <p className="text-gray-800 leading-relaxed text-base">
                {project.longDescription}
              </p>
            </div>
          </div>

          {/* Sağ Sütun - Sidebar */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">

              {/* CTA Kartı */}
              <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-black mb-3">Bu projeye katıl</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Katkıda bulunmak için ekibe katıl veya projeyi yıldızla.
                </p>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                    ⭐ Yıldızla ({project.stars})
                  </button>
                  <button className="w-full px-4 py-2.5 bg-white text-gray-900 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer">
                    👥 Ekibe Katıl
                  </button>
                </div>
              </div>

              {/* Bilgi Kartı */}
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-4">Proje Bilgileri</h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-gray-500">Yazar</dt>
                    <dd className="font-medium text-gray-900">{project.author}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-gray-500">Yıldız</dt>
                    <dd className="font-medium text-gray-900">⭐ {project.stars}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-gray-500">Katkıcı</dt>
                    <dd className="font-medium text-gray-900">👥 {project.contributors}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-gray-500">Durum</dt>
                    <dd className="font-medium text-emerald-600">{project.status}</dd>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <dt className="text-gray-500">Oluşturulma</dt>
                    <dd className="font-medium text-gray-900">{project.createdAt}</dd>
                  </div>
                </dl>
              </div>

              {/* Paylaş */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Paylaş</h3>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    🔗 Link
                  </button>
                  <button className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    🐦 Twitter
                  </button>
                </div>
              </div>

            </div>
          </aside>
        </div>

      </div>
    </div>
  );
}