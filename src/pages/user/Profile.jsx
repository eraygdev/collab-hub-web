import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProjectCard from '../../components/project/ProjectCard';
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';
import * as Icon from '../../components/ui/Icons';
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
            <Icon.Search className="w-12 h-12 text-text-muted mx-auto mb-3" />
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

        {/* ═══════════════════════════════════════════
            PROFİL KARTI — Cover + Overlap
        ═══════════════════════════════════════════ */}
        <div className="bg-surface border border-accent/10 rounded-2xl mb-6">

          {/* COVER BANNER — daha kısa */}
          <div className="relative h-20 sm:h-24 overflow-hidden rounded-t-2xl">
            {/* Gradient zemin */}
            <div className="absolute inset-0 bg-gradient-to-br from-surface via-bg to-surface" />

            {/* Glow blob — üst yarıda */}
            <div className="absolute top-[-60px] left-1/4 w-[400px] h-[200px] bg-accent opacity-[0.1] blur-[100px] rounded-full pointer-events-none" />

            {/* Noktalı pattern — SADECE SAĞ ÜST KÖŞE (stats arkası) */}
            <div
              className="absolute top-0 right-0 w-72 h-full opacity-[0.25] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, var(--color-text-muted) 1px, transparent 1px)',
                backgroundSize: '18px 18px',
                maskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 70%)',
              }}
            />

            {/* İstatistikler — sağ üst, desktop */}
            <div className="hidden sm:flex absolute top-3 right-4 items-center gap-4 text-xs font-mono z-10">
              <div className="text-right">
                <p className="text-text-muted/60 uppercase tracking-wider text-[10px]">proje</p>
                <p className="inline-flex items-center gap-1 text-text font-bold tabular-nums text-sm">
                  <Icon.Folder className="w-3.5 h-3.5 text-text-muted" />
                  {profile.stats.totalProjects}
                </p>
              </div>
              <div className="w-px h-5 bg-accent/20" />
              <div className="text-right">
                <p className="text-text-muted/60 uppercase tracking-wider text-[10px]">yıldız</p>
                <p className="inline-flex items-center gap-1 text-text font-bold tabular-nums text-sm">
                  <Icon.Star className="w-3.5 h-3.5 text-text-muted" />
                  {profile.stats.totalStars}
                </p>
              </div>
              <div className="w-px h-5 bg-accent/20" />
              <div className="text-right">
                <p className="text-text-muted/60 uppercase tracking-wider text-[10px]">katkıcı</p>
                <p className="inline-flex items-center gap-1 text-text font-bold tabular-nums text-sm">
                  <Icon.Users className="w-3.5 h-3.5 text-text-muted" />
                  {profile.stats.totalContributors}
                </p>
              </div>
            </div>
          </div>

          {/* AVATAR + BİLGİLER */}
          <div className="px-6 sm:px-8 pb-6">

            {/* Avatar — overlap artırıldı (üst boşluk azalsın) */}
            <div className="relative z-10 -mt-12 sm:-mt-14 mb-4 flex items-end justify-between gap-4 flex-wrap">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-bg border-4 border-surface overflow-hidden shrink-0 shadow-lg">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.username}
                    loading="lazy"
                    decoding="async"
                    width="96"
                    height="96"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon.User className="w-10 h-10 text-text-muted" />
                  </div>
                )}
              </div>

              {isSelf && (
                <Link
                  to="/settings"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-text-muted bg-surface border border-accent/20 rounded-lg hover:border-accent hover:text-text transition-all font-mono"
                >
                  <Icon.Settings className="w-4 h-4" />
                  ayarlar
                </Link>
              )}
            </div>

            {/* Username + bio */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight mb-1">
                {isSelf ? 'Profilim' : profile.username}
              </h1>
              <p className="text-sm text-text-muted font-mono mb-3">
                @{profile.username}
              </p>
              {profile.bio ? (
                <p className="text-sm text-text-muted leading-relaxed max-w-2xl">
                  {profile.bio}
                </p>
              ) : (
                <p className="text-sm text-text-muted/60 italic font-mono">
                  henüz bir bio eklenmemiş.
                </p>
              )}
            </div>

            {/* İstatistikler — mobil */}
            <div className="sm:hidden mt-5 flex items-center gap-4 text-xs font-mono">
              <div>
                <p className="text-text-muted/60 uppercase tracking-wider text-[10px] mb-1">proje</p>
                <p className="inline-flex items-center gap-1 text-text font-bold tabular-nums text-base">
                  <Icon.Folder className="w-3.5 h-3.5 text-text-muted" />
                  {profile.stats.totalProjects}
                </p>
              </div>
              <div className="w-px h-8 bg-accent/20" />
              <div>
                <p className="text-text-muted/60 uppercase tracking-wider text-[10px] mb-1">yıldız</p>
                <p className="inline-flex items-center gap-1 text-text font-bold tabular-nums text-base">
                  <Icon.Star className="w-3.5 h-3.5 text-text-muted" />
                  {profile.stats.totalStars}
                </p>
              </div>
              <div className="w-px h-8 bg-accent/20" />
              <div>
                <p className="text-text-muted/60 uppercase tracking-wider text-[10px] mb-1">katkıcı</p>
                <p className="inline-flex items-center gap-1 text-text font-bold tabular-nums text-base">
                  <Icon.Users className="w-3.5 h-3.5 text-text-muted" />
                  {profile.stats.totalContributors}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* TAB'LAR */}
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

        {/* BAŞLIK + SIRALAMA + GÖRÜNÜM */}
        <div className="mb-4 flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-sm font-bold text-text uppercase tracking-wider font-mono">
            {!isSelf
              ? '/projeler'
              : tab === 'projects'
              ? '/projelerim'
              : '/katkıda bulunduğum projeler'}
          </h2>

          <div className="flex items-center gap-3">
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
                <Icon.List className="w-3.5 h-3.5" />
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
                <Icon.LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            {isSelf && tab === 'projects' && (
              <Link
                to="/create-project"
                className="inline-flex items-center gap-1 text-xs font-medium text-text-muted hover:text-text transition-colors font-mono"
              >
                <Icon.Plus className="w-3.5 h-3.5" />
                yeni proje
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

        {/* PROJELER */}
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
                        <>
                          <Icon.ChevronDown className="w-4 h-4" />
                          daha fazla yükle
                        </>
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 rounded-2xl bg-surface/30 border border-dashed border-accent/20">
                <Icon.Package className="w-12 h-12 text-text-muted mx-auto mb-3" />
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

        {/* KATKILAR */}
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
                <Icon.Users className="w-12 h-12 text-text-muted mx-auto mb-3" />
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