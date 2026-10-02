import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import ProjectCard from '../../components/project/ProjectCard';
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';
import * as Icon from '../../components/ui/Icons';
import { useProjectView } from '../../hooks/useProjectView';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const LIMIT = 20;

export default function UserProfile() {
  const { username } = useParams();
  const { user } = useAuth();
  const { t } = useLanguage();
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
        if (res.status === 404) throw new Error('not_found');
        if (!res.ok) throw new Error('fetch_failed');
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
        if (!res.ok) throw new Error('fetch_failed');
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

      if (!res.ok) throw new Error('fetch_failed');

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
    // replace: false → tarayıcı geri tuşu önceki sıralamaya döner
    setSearchParams(params, { replace: false });
  };

  const handleTabChange = (newTab) => {
    const params = {};
    if (sort !== 'newest') params.sort = sort;
    if (newTab !== 'projects') params.tab = newTab;
    setSearchParams(params, { replace: false });
  };

  if (loading) {
    return (
      <div className="w-full bg-bg min-h-screen flex items-center justify-center">
        <p className="text-sm text-text-muted font-mono">{t('profile.loading')}</p>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="w-full bg-bg min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <PageBreadcrumb
            items={[
              { label: t('breadcrumb.home'), to: '/' },
              { label: t('breadcrumb.profile_other', { username }) },
            ]}
          />
          <div className="text-center py-16 rounded-2xl bg-surface/30 border border-dashed border-accent/20">
            <Icon.Search className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <h2 className="text-lg font-bold text-text mb-1 font-mono">
              {t('profile.not_found_title')}
            </h2>
            <p className="text-sm text-text-muted mb-5">
              {t('profile.not_found_desc', { username })}
            </p>
            <Link
              to="/"
              className="inline-block px-5 py-2.5 text-sm font-bold bg-accent text-bg rounded-lg hover:bg-accent/90 transition-all font-mono"
            >
              {t('profile.back_home')}
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
            { label: t('breadcrumb.home'), to: '/' },
            {
              label: isSelf
                ? t('breadcrumb.profile_self')
                : t('breadcrumb.profile_other', { username: profile.username }),
            },
          ]}
        />

        {/* PROFİL KARTI — Cover + Overlap */}
        <div className="bg-surface border border-accent/10 rounded-2xl mb-6">

          {/* COVER BANNER */}
          <div className="relative h-20 sm:h-24 overflow-hidden rounded-t-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-surface via-bg to-surface" />
            <div className="absolute top-[-60px] left-1/4 w-[400px] h-[200px] bg-accent opacity-[0.1] blur-[100px] rounded-full pointer-events-none" />

            <div
              className="absolute top-0 right-0 w-72 h-full opacity-[0.25] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, var(--color-text-muted) 1px, transparent 1px)',
                backgroundSize: '18px 18px',
                maskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 70%)',
                WebkitMaskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 70%)',
              }}
            />

            {/* İstatistikler */}
            <div className="hidden sm:flex absolute top-3 right-4 items-center gap-4 text-xs font-mono z-10">
              <div className="text-right">
                <p className="text-text-muted/60 uppercase tracking-wider text-[10px]">
                  {t('profile.stat.projects')}
                </p>
                <p className="inline-flex items-center gap-1 text-text font-bold tabular-nums text-sm">
                  <Icon.Folder className="w-3.5 h-3.5 text-text-muted" />
                  {profile.stats.totalProjects}
                </p>
              </div>
              <div className="w-px h-5 bg-accent/20" />
              <div className="text-right">
                <p className="text-text-muted/60 uppercase tracking-wider text-[10px]">
                  {t('profile.stat.stars')}
                </p>
                <p className="inline-flex items-center gap-1 text-text font-bold tabular-nums text-sm">
                  <Icon.Star className="w-3.5 h-3.5 text-text-muted" />
                  {profile.stats.totalStars}
                </p>
              </div>
              <div className="w-px h-5 bg-accent/20" />
              <div className="text-right">
                <p className="text-text-muted/60 uppercase tracking-wider text-[10px]">
                  {t('profile.stat.contributors')}
                </p>
                <p className="inline-flex items-center gap-1 text-text font-bold tabular-nums text-sm">
                  <Icon.Users className="w-3.5 h-3.5 text-text-muted" />
                  {profile.stats.totalContributors}
                </p>
              </div>
            </div>
          </div>

          {/* AVATAR + BİLGİLER */}
          <div className="px-6 sm:px-8 pb-6">

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
                  {t('profile.settings')}
                </Link>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight mb-1">
                {isSelf ? t('profile.title_self') : profile.username}
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
                  {t('profile.empty_bio')}
                </p>
              )}
            </div>

            {/* İstatistikler — mobil */}
            <div className="sm:hidden mt-5 flex items-center gap-4 text-xs font-mono">
              <div>
                <p className="text-text-muted/60 uppercase tracking-wider text-[10px] mb-1">
                  {t('profile.stat.projects')}
                </p>
                <p className="inline-flex items-center gap-1 text-text font-bold tabular-nums text-base">
                  <Icon.Folder className="w-3.5 h-3.5 text-text-muted" />
                  {profile.stats.totalProjects}
                </p>
              </div>
              <div className="w-px h-8 bg-accent/20" />
              <div>
                <p className="text-text-muted/60 uppercase tracking-wider text-[10px] mb-1">
                  {t('profile.stat.stars')}
                </p>
                <p className="inline-flex items-center gap-1 text-text font-bold tabular-nums text-base">
                  <Icon.Star className="w-3.5 h-3.5 text-text-muted" />
                  {profile.stats.totalStars}
                </p>
              </div>
              <div className="w-px h-8 bg-accent/20" />
              <div>
                <p className="text-text-muted/60 uppercase tracking-wider text-[10px] mb-1">
                  {t('profile.stat.contributors')}
                </p>
                <p className="inline-flex items-center gap-1 text-text font-bold tabular-nums text-base">
                  <Icon.Users className="w-3.5 h-3.5 text-text-muted" />
                  {profile.stats.totalContributors}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* TAB'LAR — sadece kendi profilinde */}
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
                {t('profile.tab.projects')}
              </button>
              <button
                onClick={() => handleTabChange('contributions')}
                className={`pb-3 text-sm font-semibold transition-all cursor-pointer border-b-2 -mb-px font-mono ${
                  tab === 'contributions'
                    ? 'text-text border-accent'
                    : 'text-text-muted border-transparent hover:text-text'
                }`}
              >
                {t('profile.tab.contributions')}
              </button>
            </div>
          </div>
        )}

        {/* BAŞLIK + SIRALAMA + GÖRÜNÜM */}
        <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
          {/* SOL: Başlık */}
          <h2 className="text-sm font-bold text-text uppercase tracking-wider font-mono shrink-0">
            {!isSelf
              ? t('profile.section.projects_other')
              : tab === 'projects'
              ? t('profile.section.projects_self')
              : t('profile.section.contributions')}
          </h2>

          {/* SAĞ: Kontroller — [+ yeni] [toggle] [sıralama] */}
          <div className="flex items-center gap-3 flex-wrap">

            {/* + Yeni proje — en solda, CTA */}
            {isSelf && tab === 'projects' && (
              <Link
                to="/create-project"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted bg-transparent border border-accent/20 rounded-lg hover:border-accent/50 hover:text-text transition-all font-mono"
              >
                <Icon.Plus className="w-3.5 h-3.5" />
                {t('profile.new_project')}
              </Link>
            )}

            {/* Görünüm toggle */}
            <div className="inline-flex rounded-lg border border-accent/20 p-0.5 bg-surface/60">
              <button
                onClick={() => setView('normal')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer ${
                  view === 'normal'
                    ? 'bg-accent text-bg shadow-sm'
                    : 'text-text-muted hover:text-text'
                }`}
                aria-label={t('profile.view_normal')}
                title={t('profile.view_normal')}
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
                aria-label={t('profile.view_compact')}
                title={t('profile.view_compact')}
              >
                <Icon.LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Sıralama */}
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
                  {t('profile.sort.newest')}
                </button>
                <button
                  onClick={() => handleSortChange('popular')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all cursor-pointer font-mono ${
                    sort === 'popular'
                      ? 'bg-accent text-bg shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {t('profile.sort.popular')}
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
                        <>{t('home.load_more_loading')}<span className="animate-pulse">...</span></>
                      ) : (
                        <>
                          <Icon.ChevronDown className="w-4 h-4" />
                          {t('home.load_more')}
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
                  {isSelf
                    ? t('profile.empty.projects_self_title')
                    : t('profile.empty.projects_other_title')}
                </h3>
                <p className="text-sm text-text-muted mb-4">
                  {isSelf
                    ? t('profile.empty.projects_self_desc')
                    : t('profile.empty.projects_other_desc', { username: profile.username })}
                </p>
                {isSelf && (
                  <Link
                    to="/create-project"
                    className="inline-block px-5 py-2.5 text-sm font-bold bg-accent text-bg rounded-lg hover:bg-accent/90 transition-all font-mono"
                  >
                    {t('profile.empty.projects_cta')}
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
                  {t('profile.empty.contributions_title')}
                </h3>
                <p className="text-sm text-text-muted mb-4">
                  {t('profile.empty.contributions_desc')}
                </p>
                <Link
                  to="/"
                  className="inline-block px-5 py-2.5 text-sm font-bold bg-accent text-bg rounded-lg hover:bg-accent/90 transition-all font-mono"
                >
                  {t('profile.empty.contributions_cta')}
                </Link>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}