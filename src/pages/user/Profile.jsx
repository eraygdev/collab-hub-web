import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import LoadingScreen from '../../components/ui/LoadingScreen';
import NotFoundScreen from '../../components/ui/NotFoundScreen';
import EmptyState from '../../components/ui/EmptyState';
import ViewToggle from '../../components/ui/ViewToggle';
import TabNav from '../../components/ui/TabNav';
import ProjectCard from '../../components/project/ProjectCard';
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';
import Avatar from '../../components/ui/Avatar';
import * as Icon from '../../components/ui/Icons';
import { useProjectView } from '../../hooks/useProjectView';
import { formatCount } from '../../utils/format';
import { getHueFromUsername } from '../../utils/color';

import { API } from '../../utils/api';
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

  const hue = useMemo(
    () => getHueFromUsername(profile?.username || username),
    [profile?.username, username]
  );

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
    setSearchParams(params, { replace: false });
  };

  const handleTabChange = (newTab) => {
    const params = {};
    if (sort !== 'newest') params.sort = sort;
    if (newTab !== 'projects') params.tab = newTab;
    setSearchParams(params, { replace: false });
  };

  if (loading) {
    return <LoadingScreen message={t('profile.loading')} />;
  }

  if (error || !profile) {
    return (
      <NotFoundScreen
        eyebrow={t('profile.not_found_eyebrow')}
        bigText={`@${username}`}
        title={t('profile.not_found_title')}
        description={t('profile.not_found_desc', { username })}
        primaryCta={{ label: t('profile.back_home'), to: '/', icon: Icon.ArrowLeft }}
      />
    );
  }

  const gridClass = isCompact
    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
    : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6';

  return (
    <div className="w-full bg-bg min-h-screen">
      <div className="max-w-default mx-auto px-4 sm:px-6 lg:px-8 py-page">

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

        {/* ═══════════════════════════════════════════
            PROFİL KARTI — Bento Tarzı
        ═══════════════════════════════════════════ */}
        <div className="relative bg-surface border border-accent/10 rounded-card mb-6 overflow-hidden">

          <div
            className="absolute -top-30 -left-15 w-100 h-75 opacity-[0.12] blur-[100px] rounded-pill pointer-events-none"
            style={{ backgroundColor: `hsl(${hue} 55% 55%)` }}
          />

          <div
            className="absolute top-0 right-0 w-72 h-full opacity-[0.15] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--color-text-muted) 1px, transparent 1px)',
              backgroundSize: '18px 18px',
              maskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 70%)',
              WebkitMaskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 70%)',
            }}
          />

          <div className="relative p-6 sm:p-8">

            {/* ÜST SATIR — Avatar + İsim + Bio + Ayarlar */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-5 sm:gap-6">

              {/* Avatar */}
              <Avatar
                src={profile.avatar_url}
                username={profile.username}
                size="2xl"
                rounded="card"
                className="shadow-lg"
              />

              {/* İsim + Bio */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <h1 className="text-h3 font-extrabold text-text tracking-tight mb-1">
                      {isSelf ? t('profile.title_self') : profile.username}
                    </h1>
                    <p className="text-body-sm text-text-muted font-mono">
                      @{profile.username}
                    </p>
                  </div>

                  {isSelf && (
                    <Link
                      to="/settings"
                      className="inline-flex items-center gap-2 px-3.5 py-2 text-caption font-semibold text-text-muted bg-bg/60 border border-accent/20 rounded-button hover:border-accent hover:text-text transition-all font-mono shrink-0"
                    >
                      <Icon.Settings className="w-3.5 h-3.5" />
                      {t('profile.settings')}
                    </Link>
                  )}
                </div>

                {profile.bio ? (
                  <p className="text-body-sm text-text-muted leading-relaxed mt-3 max-w-2xl">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-body-sm text-text-muted/60 italic font-mono mt-3">
                    {t('profile.empty_bio')}
                  </p>
                )}
              </div>
            </div>

            {/* AYRAÇ */}
            <div className="mt-5 mb-4 h-px bg-linear-to-r from-accent/15 via-accent/10 to-transparent" />

            {/* ALT SATIR — İstatistikler */}
            <div className="flex items-center gap-5 sm:gap-10 flex-wrap -mb-1">
              {/* Proje */}
              <div className="flex items-center gap-3">
                <Icon.Folder className="w-4 h-4 text-text-muted shrink-0" />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-h5 font-bold text-text font-mono tabular-nums leading-none">
                    {profile.stats.totalProjects}
                  </span>
                  <span className="text-caption text-text-muted font-mono uppercase tracking-wider">
                    {t('profile.stat.projects')}
                  </span>
                </div>
              </div>

              <div className="w-px h-5 bg-accent/15" />

              {/* Yıldız */}
              <div className="flex items-center gap-3">
                <Icon.Star className="w-4 h-4 text-text-muted shrink-0" />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-h5 font-bold text-text font-mono tabular-nums leading-none">
                    {formatCount(profile.stats.totalStars)}
                  </span>
                  <span className="text-caption text-text-muted font-mono uppercase tracking-wider">
                    {t('profile.stat.stars')}
                  </span>
                </div>
              </div>

              <div className="w-px h-5 bg-accent/15" />

              {/* Katkıcı */}
              <div className="flex items-center gap-3">
                <Icon.Users className="w-4 h-4 text-text-muted shrink-0" />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-h5 font-bold text-text font-mono tabular-nums leading-none">
                    {profile.stats.totalContributors}
                  </span>
                  <span className="text-caption text-text-muted font-mono uppercase tracking-wider">
                    {t('profile.stat.contributors')}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* TAB'LAR — sadece kendi profilinde */}
        {isSelf && (
          <div className="mb-6">
            <TabNav
              items={[
                { key: 'projects', label: t('profile.tab.projects') },
                { key: 'contributions', label: t('profile.tab.contributions') },
              ]}
              active={tab}
              onChange={handleTabChange}
            />
          </div>
        )}

        {/* BAŞLIK + SIRALAMA + GÖRÜNÜM */}
        <div className="mb-4 flex items-center justify-between gap-4 flex-wrap">
          <h2 className="text-body-sm font-bold text-text uppercase tracking-wider font-mono shrink-0">
            {!isSelf
              ? t('profile.section.projects_other')
              : tab === 'projects'
              ? t('profile.section.projects_self')
              : t('profile.section.contributions')}
          </h2>

          <div className="flex items-center gap-3 flex-wrap">

            {isSelf && tab === 'projects' && (
              <Link
                to="/create-project"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-caption font-medium text-text-muted bg-transparent border border-accent/20 rounded-button hover:border-accent/50 hover:text-text transition-all font-mono"
              >
                <Icon.Plus className="w-3.5 h-3.5" />
                {t('profile.new_project')}
              </Link>
            )}

            <ViewToggle
              view={view}
              onChange={setView}
              labelNormal={t('profile.view_normal')}
              labelCompact={t('profile.view_compact')}
            />

            {tab === 'projects' && (
              <div className="inline-flex rounded-button border border-accent/20 p-0.5 bg-surface/60">
                <button
                  onClick={() => handleSortChange('newest')}
                  className={`px-3 py-1 text-caption font-medium rounded-button transition-all cursor-pointer font-mono ${
                    sort === 'newest'
                      ? 'bg-accent text-bg shadow-sm'
                      : 'text-text-muted hover:text-text'
                  }`}
                >
                  {t('profile.sort.newest')}
                </button>
                <button
                  onClick={() => handleSortChange('popular')}
                  className={`px-3 py-1 text-caption font-medium rounded-button transition-all cursor-pointer font-mono ${
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
                      className="inline-flex items-center gap-2 px-6 py-3 bg-surface text-text text-body-sm font-semibold rounded-button border border-accent/20 hover:border-accent/60 hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.25)] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
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
              <EmptyState
                icon={Icon.Package}
                title={
                  isSelf
                    ? t('profile.empty.projects_self_title')
                    : t('profile.empty.projects_other_title')
                }
                description={
                  isSelf
                    ? t('profile.empty.projects_self_desc')
                    : t('profile.empty.projects_other_desc', { username: profile.username })
                }
                cta={
                  isSelf
                    ? { label: t('profile.empty.projects_cta'), to: '/create-project' }
                    : undefined
                }
              />
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
              <EmptyState
                icon={Icon.Users}
                title={t('profile.empty.contributions_title')}
                description={t('profile.empty.contributions_desc')}
                cta={{ label: t('profile.empty.contributions_cta'), to: '/' }}
              />
            )}
          </>
        )}

      </div>
    </div>
  );
}