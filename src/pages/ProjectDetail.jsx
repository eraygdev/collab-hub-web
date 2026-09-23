import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [starLoading, setStarLoading] = useState(false);

  // Projeyi API'den çek (token'ı da gönder ki "ben yıldızladım mı?" bilgisi gelsin).
  useEffect(() => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');

    fetch(`${API}/api/projects/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error('Proje bulunamadı');
        return res.json();
      })
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  // Yıldızla / yıldızı geri al.
  const handleToggleStar = async () => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (starLoading) return;

    const token = localStorage.getItem('token');
    const method = project.starred ? 'DELETE' : 'POST';

    setStarLoading(true);

    try {
      const res = await fetch(`${API}/api/projects/${id}/star`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('İşlem başarısız');

      const data = await res.json();
      // Anında güncelle: stars ve starred
      setProject((prev) => ({
        ...prev,
        stars: data.stars,
        starred: data.starred,
      }));
    } catch {
      // Sessizce başarısız
    } finally {
      setStarLoading(false);
    }
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 py-20 text-center text-sm text-gray-500">
        Proje yükleniyor...
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-black mb-2">Proje bulunamadı</h2>
          <p className="text-gray-500 mb-6">
            Aradığın proje silinmiş veya taşınmış olabilir.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            ← Ana Sayfaya Dön
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
            <span className="text-xs text-gray-500">📅 {formatDate(project.createdAt)}</span>
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
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          )}
        </div>

        {/* Ana İçerik */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Sol Sütun */}
          <div className="lg:col-span-2">

            {project.categories && project.categories.length > 0 && (
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
            )}

            {(project.githubUrl || project.demoUrl) && (
              <div className="mb-10">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                  Bağlantılar
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-full transition-colors"
                    >
                      🐙 GitHub
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-800 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-full transition-colors"
                    >
                      🔗 Demo
                    </a>
                  )}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
                Proje Hakkında
              </h2>
              <p className="text-gray-800 leading-relaxed text-base whitespace-pre-line">
                {project.longDescription || project.description}
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
                  <button
                    onClick={handleToggleStar}
                    disabled={starLoading}
                    className={`w-full px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      project.starred
                        ? 'bg-amber-400 text-black border border-amber-500 hover:bg-amber-500'
                        : 'bg-black text-white hover:bg-gray-800'
                    }`}
                  >
                    {starLoading
                      ? '...'
                      : project.starred
                      ? `★ Yıldızlandı (${project.stars})`
                      : `☆ Yıldızla (${project.stars})`}
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
                    <dd className="font-medium text-gray-900">{project.author || 'Anonim'}</dd>
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
                    <dd className="font-medium text-gray-900">{formatDate(project.createdAt)}</dd>
                  </div>
                </dl>
              </div>

              {/* Paylaş */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Paylaş</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link kopyalandı!');
                    }}
                    className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    🔗 Link
                  </button>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(project.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-center"
                  >
                    🐦 Twitter
                  </a>
                </div>
              </div>

            </div>
          </aside>
        </div>

      </div>
    </div>
  );
}