import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProjectCard from '../../components/ProjectCard';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const LIMIT = 20;

export default function UserProfile() {
  const { username } = useParams();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const sort = searchParams.get('sort') || 'newest';

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [error, setError] = useState('');

  // Profil + ilk sayfa projeleri çek
  useEffect(() => {
    setLoading(true);
    setError('');
    setProjects([]);

    const token = localStorage.getItem('token');
    const params = new URLSearchParams({ sort, limit: LIMIT, offset: 0 });

    fetch(`${API}/api/users/${encodeURIComponent(username)}?${params}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (res.status === 404) throw new Error('Kullanıcı bulunamadı');
        if (!res.ok) throw new Error('Profil yüklenemedi');
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setProjects(Array.isArray(data.projects) ? data.projects : []);
        setHasMore(!!data.hasMore);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [username, sort]);

  // Daha fazla yükle
  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);

    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams({
        sort,
        limit: LIMIT,
        offset: projects.length,
      });

      const res = await fetch(
        `${API}/api/users/${encodeURIComponent(username)}?${params}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (!res.ok) throw new Error('Yüklenemedi');

      const data = await res.json();
      setProjects((prev) => [...prev, ...(data.projects || [])]);
      setHasMore(!!data.hasMore);
    } catch {
      // sessizce geç
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSortChange = (newSort) => {
    setSearchParams({ sort: newSort });
  };

  if (loading) {
    return (
      <div className="w-full px-4 py-10 text-center text-sm text-gray-500">
        Profil yükleniyor...
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-black mb-2">Kullanıcı bulunamadı</h2>
          <p className="text-gray-500 mb-6">
            @{username} adlı kullanıcı sistemde yok.
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

  const isSelf = user && user.user_id === profile.user_id;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-5xl mx-auto">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-black transition-colors">Ana Sayfa</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">
            {isSelf ? 'Profilim' : profile.username}
          </span>
        </nav>

        {/* Profil Kartı */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-200 border border-gray-300 overflow-hidden shrink-0">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.username}
                  loading="lazy"
                  decoding="async"
                  width="80"
                  height="80"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-black mb-1">
                {isSelf ? 'Profilim' : profile.username}
              </h1>
              <p className="text-sm text-gray-500 mb-1">@{profile.username}</p>
              {profile.bio && (
                <p className="text-sm text-gray-600 leading-relaxed">{profile.bio}</p>
              )}
            </div>
            {isSelf && (
              <Link
                to="/settings"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shrink-0 text-center"
              >
                Ayarlar
              </Link>
            )}
          </div>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Proje</p>
            <p className="text-2xl font-bold text-black">{profile.stats.totalProjects}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Toplam Yıldız</p>
            <p className="text-2xl font-bold text-black">⭐ {profile.stats.totalStars}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">Toplam Katkıcı</p>
            <p className="text-2xl font-bold text-black">👥 {profile.stats.totalContributors}</p>
          </div>
        </div>

        {/* Projeler Başlık + Sıralama + Yeni Proje */}
        <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            {isSelf ? 'Projelerim' : 'Projeler'}
          </h2>

          <div className="flex items-center gap-3">
            {isSelf && (
              <Link
                to="/create-project"
                className="text-xs font-medium text-gray-500 hover:text-black transition-colors"
              >
                + Yeni proje
              </Link>
            )}

            <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
              <button
                onClick={() => handleSortChange('newest')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  sort === 'newest'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                En Yeni
              </button>
              <button
                onClick={() => handleSortChange('popular')}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  sort === 'popular'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                En Popüler
              </button>
            </div>
          </div>
        </div>

        {/* Projeler Listesi */}
        {projects.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} showAuthor={false} />
              ))}
            </div>

            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-3 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loadingMore ? 'Yükleniyor...' : 'Daha Fazla Yükle'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
            <div className="text-5xl mb-3">📦</div>
            <h3 className="text-base font-bold text-black mb-1">
              {isSelf ? 'Henüz projen yok' : 'Henüz proje yok'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {isSelf
                ? 'İlk projeni oluşturarak başla.'
                : `@${profile.username} henüz proje paylaşmamış.`}
            </p>
            {isSelf && (
              <Link
                to="/create-project"
                className="inline-block px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                Proje Oluştur
              </Link>
            )}
          </div>
        )}

      </div>
    </div>
  );
}