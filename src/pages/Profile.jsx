import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Profile() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Kullanıcının projelerini çek.
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    fetch(`${API}/api/me/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Projeler yüklenemedi');
        return res.json();
      })
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [user]);

  if (authLoading) {
    return (
      <div className="w-full px-4 py-10 text-center text-sm text-gray-500">
        Yükleniyor...
      </div>
    );
  }

  if (!user) return null;

  // İstatistikleri hesapla.
  const totalStars = projects.reduce((sum, p) => sum + (p.stars || 0), 0);
  const totalContributors = projects.reduce((sum, p) => sum + (p.contributors || 0), 0);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black">
            Profilim.
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Hesap bilgilerin ve projelerin.
          </p>
        </div>

        {/* Kullanıcı kartı */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 border border-gray-300 overflow-hidden shrink-0">
              {user.avatar_url ? (
                <img
                src={user.avatar_url}
                alt={user.username}
                loading="lazy"
                decoding="async"
                width="64"
                height="64"
                className="w-full h-full object-cover"
              />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-black">{user.username}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <Link
              to="/settings"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shrink-0 text-center"
            >
              Ayarlar
            </Link>
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Proje</p>
            <p className="text-2xl font-bold text-black">{projects.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Toplam Yıldız</p>
            <p className="text-2xl font-bold text-black">⭐ {totalStars}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Katkıcı</p>
            <p className="text-2xl font-bold text-black">👥 {totalContributors}</p>
          </div>
        </div>

        {/* Projeler */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Projelerim
          </h2>
          <Link
            to="/create-project"
            className="text-xs font-medium text-gray-500 hover:text-black transition-colors"
          >
            + Yeni proje
          </Link>
        </div>

        {loading && (
          <div className="text-center py-16 text-sm text-gray-500">
            Projeler yükleniyor...
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-16 text-sm text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <ProjectCard key={project.id} project={project} showAuthor={false} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
                <div className="text-5xl mb-3">📦</div>
                <h3 className="text-base font-bold text-black mb-1">
                  Henüz projen yok
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  İlk projeni oluşturarak başla.
                </p>
                <Link
                  to="/create-project"
                  className="inline-block px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Proje Oluştur
                </Link>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}