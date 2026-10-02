import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProjectCard from '../../components/project/ProjectCard';
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';
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
      <div className="w-full bg-bg min-h-screen flex items-center justify-center">
        <p className="text-sm text-text-muted font-mono">profil yükleniyor...</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full bg-bg min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <PageBreadcrumb
            items={[
              { label: 'ana sayfa', to: '/' },
              { label: `profil:${username}` },
            ]}
          />
          <div className="text-center py-16 rounded-2xl bg-surface/30 border border-dashed border-accent/20">
            <div className="text-5xl mb-3">🔍</div>
            <h2 className="text-lg font-bold text-text mb-1 font-mono">
              kullanıcı bulunamadı
            </h2>
            <p className="text-sm text-text-muted mb-5">
              @{username} adlı kullanıcı sistemde yok.
            </p>
            <Link
              to="/"
              className="inline-block px-5 py-2.5 text-sm font-bold bg-accent text-bg rounded-lg hover:bg-accent/90 transition-all font-mono"
            >
              ← ana sayfaya dön
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const gridClass = isCompact
    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
    : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6';

  return (
    <div className="w-full bg-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <PageBreadcrumb
          items={[
            { label: 'ana sayfa', to: '/' },
            { label: isSelf ? 'profilim' : `profil:${profile.username}` },
          ]}
        />

        {/* ───── Profil Kartı ───── */}
        <div className="bg-surface border border-accent/10 rounded-2xl p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-bg border border-accent/15 overflow-hidden shrink-0">
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
                  <svg className="w-10 h-10 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-text mb-1">
                {isSelf ? 'Profilim' : profile.username}
              </h1>
              <p className="text-sm text-text-muted font-mono mb-1">
                @{profile.username}
              </p>
              {profile.bio && (
                <p className="text-sm text-text-muted leading-relaxed">
                  {profile.bio}
                </p>
              )}
            </div>
            {isSelf && (
              <Link
                to="/settings"
                className="px-4 py-2 text-sm font-semibold text-text bg-transparent border border-accent/20 rounded-lg hover:border-accent hover:bg-bg transition-all shrink-0 text-center font-mono"
              >
                ayarlar
              </Link>
            )}
          </div>
        </div>

        {/* ───── İstatistikler ───── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface border border-accent/10 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">
              /proje
            </p>
            <p className="text-2xl font-bold text-text font-mono tabular-nums">
              {profile.stats.totalProjects}
            </p>
          </div>
          <div className="bg-surface border border-accent/10 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">
              /toplam yıldız
            </p>
            <p className="text-2xl font-bold text-text font-mono tabular-nums">
              ⭐ {profile.stats.totalStars}
            </p>
          </div>
          <div className="bg-surface border border-accent/10 rounded-2xl p-5">
            <p className="text-xs uppercase tracking-wider text-text-muted mb-1 font-mono">
              /toplam katkıcı
            </p>
            <p className="text-2xl font-bold text-text font-mono tabular-nums">
              👥 {profile.stats.totalContributors}
            </p>
          </div>
        </div>

        {/* ───── Tab'lar (sadece kendi profilinde) ───── */}
        {isSelf && (
          <div className="mb-6 border-b border-accent/10">
            <div className="flex items-center gap-6">
              <button
                onClick={() => handleTabChange('projects')}
                className={`pb-3 text-sm font-semibold transition-all cursor-pointer border-b-2 -mb-px font-mono ${
                  tab === 'projects'
                    ? 'text-text border-accent'
                    : 'text-text-muted border-transparent hover:text-text'
                }`}
              >
                /projelerim
              </button>
              <button
                onClick={() => handleTabChange('contributions')}
                className={`pb-3 text-sm font-semibold transition-all cursor-pointer border-b-2 -mb-px font-mono ${
                  tab === 'contributions'
                    ? 'text-text border-accent'
                    : 'text-text-muted border-transparent hover:text-text'
                }`}
              >
                /katkıda bulunduğum
              </button>
            </div>
          </div>
        )}

        {/* ───── Başlık + Toggle + Sıralama ───── */}
        <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
            {!isSelf
              ? '/projeler'
              : tab === 'projects'
              ? '/projelerim'
              : '/katkıda bulunduğum projeler'}
          </h2>

          <div className="flex items-center gap-3">
            {/* Görünüm toggle */}
            <div className="inline-flex rounded-lg border border-accent/20 p-0.5 bg-surface/60">
              <button
                onClick={() => setView('normal')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  view === 'normal'
                    ? 'bg-accent text-bg shadow-sm'
                    : 'text-text-muted hover:text-text'
                }`}
                aria-label="Büyük kartlar"
                title="Büyük kartlar"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <button
                onClick={() => setView('compact')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  view === 'compact'
                    ? 'bg-accent text-bg shadow-sm'
                    : 'text-text-muted hover:text-text'
                }`}
                aria-label="Küçük kartlar"
                title="Küçük kartlar"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              </button>
            </div>

            {isSelf && tab === 'projects' && (
              <Link
                to="/create-project"
                className="text-xs font-medium text-text-muted hover:text-text transition-colors font-mono"
              >
                + yeni proje
              </Link>
            )}

            {tab === 'projects' && (
              <div className="inline-flex rounded-lg border border-accent/20 p-0.5 bg-surface/60">
                <button
                  onClick={() => handleSortChange('newest')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer font-mono ${
                    sort === 'newest'
                      ? 'bg-accent text-bg shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  en yeni
                </button>
                <button
                  onClick={() => handleSortChange('popular')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer font-mono ${
                    sort === 'popular'
                      ? 'bg-accent text-bg shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  en popüler
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ───── İçerik ───── */}
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
                      className="inline-flex items-center gap-2 px-6 py-3 bg-surface text-text text-sm font-semibold rounded-xl border border-accent/20 hover:border-accent/60 hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.25)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                    >
                      {loadingMore ? (
                        <>yükleniyor<span className="animate-pulse">...</span></>
                      ) : (
                        <>↓ daha fazla yükle</>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 rounded-2xl bg-surface/30 border border-dashed border-accent/20">
                <div className="text-5xl mb-3">📦</div>
                <h3 className="text-base font-bold text-text mb-1 font-mono">
                  {isSelf ? 'henüz projen yok' : 'henüz proje yok'}
                </h3>
                <p className="text-sm text-text-muted mb-4">
                  {isSelf
                    ? 'İlk projeni oluşturarak başla.'
                    : `@${profile.username} henüz proje paylaşmamış.`}
                </p>
                {isSelf && (
                  <Link
                    to="/create-project"
                    className="inline-block px-5 py-2.5 text-sm font-bold bg-accent text-bg rounded-lg hover:bg-accent/90 transition-all font-mono"
                  >
                    proje oluştur
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
              <div className="text-center py-16 rounded-2xl bg-surface/30 border border-dashed border-accent/20">
                <div className="text-5xl mb-3">🤝</div>
                <h3 className="text-base font-bold text-text mb-1 font-mono">
                  henüz bir projeye katkıda bulunmadın
                </h3>
                <p className="text-sm text-text-muted mb-4">
                  Keşfet sayfasından projelere göz at, ekibe katıl.
                </p>
                <Link
                  to="/"
                  className="inline-block px-5 py-2.5 text-sm font-bold bg-accent text-bg rounded-lg hover:bg-accent/90 transition-all font-mono"
                >
                  projeleri keşfet
                </Link>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}