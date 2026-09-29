import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProjectCard from '../../components/project/ProjectCard';
import { useProjectView } from '../../hooks/useProjectView';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const LIMIT = 20;

export default function UserProfile() {
  const { username } = useParams();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { isCompact, view, setView } = useProjectView();

  const sort = searchParams.get('sort') || 'newest';
  const tab = searchParams.get('tab') || 'projects';

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [projects, setProjects] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    setProjects([]);
    setContributions([]);

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
        if (cancelled) return;
        setProfile(data);
        setProjects(Array.isArray(data.projects) ? data.projects : []);
        setHasMore(!!data.hasMore);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [username, sort]);

  const isSelf = user?.user_id === profile?.user_id;

  useEffect(() => {
    if (!isSelf) return;
    if (tab !== 'contributions') return;
    if (contributions.length > 0) return;

    const token = localStorage.getItem('token');
    let cancelled = false;

    fetch(`${API}/api/me/contributions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Katkılar yüklenemedi');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setContributions(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (cancelled) return;
        setContributions([]);
      });

    return () => {
      cancelled = true;
    };
  }, [isSelf, tab, contributions.length]);

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
      // sessizce
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSortChange = (newSort) => {
    const params = {};
    if (newSort !== 'newest') params.sort = newSort;
    if (tab !== 'projects') params.tab = tab;
    setSearchParams(params);
  };

  const handleTabChange = (newTab) => {
    const params = {};
    if (sort !== 'newest') params.sort = sort;
    if (newTab !== 'projects') params.tab = newTab;
    setSearchParams(params);
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

  // Grid sınıfları
  const gridClass = isCompact
    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
    : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6';

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-5xl mx-auto">

        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-black transition-colors">Ana Sayfa</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-medium">
            {isSelf ? 'Profilim' : profile.username}
          </span>
        </nav>

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

        {isSelf && (
          <div className="mb-6 border-b border-gray-200">
            <div className="flex items-center gap-6">
              <button
                onClick={() => handleTabChange('projects')}
                className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-px ${
                  tab === 'projects'
                    ? 'text-black border-black'
                    : 'text-gray-500 border-transparent hover:text-black'
                }`}
              >
                Projelerim
              </button>
              <button
                onClick={() => handleTabChange('contributions')}
                className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-px ${
                  tab === 'contributions'
                    ? 'text-black border-black'
                    : 'text-gray-500 border-transparent hover:text-black'
                }`}
              >
                Katkıda Bulunduğum
              </button>
            </div>
          </div>
        )}

        {/* Başlık + Görünüm Toggle + Sıralama */}
        <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            {!isSelf
              ? 'Projeler'
              : tab === 'projects'
              ? 'Projelerim'
              : 'Katkıda Bulunduğum Projeler'}
          </h2>

          <div className="flex items-center gap-3">
            {/* Görünüm toggle */}
            <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
              <button
                onClick={() => setView('normal')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  view === 'normal'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-black'
                }`}
                aria-label="Normal görünüm"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setView('compact')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  view === 'compact'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-500 hover:text-black'
                }`}
                aria-label="Küçük görünüm"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {isSelf && tab === 'projects' && (
              <Link
                to="/create-project"
                className="text-xs font-medium text-gray-500 hover:text-black transition-colors"
              >
                + Yeni proje
              </Link>
            )}

            {tab === 'projects' && (
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
            )}
          </div>
        </div>

        {tab === 'projects' && (
          <>
            {projects.length > 0 ? (
              <>
                <div className={gridClass}>
                  {projects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      showAuthor={false}
                      compact={isCompact}
                    />
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
          </>
        )}

        {isSelf && tab === 'contributions' && (
          <>
            {contributions.length > 0 ? (
              <div className={gridClass}>
                {contributions.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    showAuthor={true}
                    compact={isCompact}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
                <div className="text-5xl mb-3">🤝</div>
                <h3 className="text-base font-bold text-black mb-1">
                  Henüz bir projeye katkıda bulunmadın
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Keşfet sayfasından projelere göz at, ekibe katıl.
                </p>
                <Link
                  to="/"
                  className="inline-block px-4 py-2 text-sm font-medium bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Projeleri Keşfet
                </Link>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}