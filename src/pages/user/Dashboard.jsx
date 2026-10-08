import { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useToast } from '../../components/ui/Toast';
import { extractErrorMessage } from '../../utils/errors';
import ProjectCard from '../../components/project/ProjectCard';
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';
import * as Icon from '../../components/ui/Icons';
import { useProjectView } from '../../hooks/useProjectView';
import { formatCount } from '../../utils/format';
import { getHueFromUsername } from '../../utils/color';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isCompact, view, setView } = useProjectView();

  const [tab, setTab] = useState('projects');

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ projects: 0, stars: 0, contributors: 0 });

  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestActionId, setRequestActionId] = useState(null);

  const userId = user?.user_id;
  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';

  const hue = useMemo(
    () => getHueFromUsername(user?.username),
    [user?.username]
  );

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem('token');
    let cancelled = false;

    setProjectsLoading(true);
    fetch(`${API}/api/me/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('fetch_failed');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.projects)
          ? data.projects
          : [];
        setProjects(list);
        setStats((prev) => ({
          ...prev,
          projects: list.length,
          stars: data?.totalStars ?? prev.stars,
          contributors: data?.totalContributors ?? prev.contributors,
        }));
        setProjectsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setError('fetch_failed');
        setProjectsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem('token');
    let cancelled = false;

    setRequestsLoading(true);
    fetch(`${API}/api/me/contributor-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('fetch_failed');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setRequests(Array.isArray(data) ? data : []);
        setRequestsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setRequests([]);
        setRequestsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const handleRequestAction = async (requestId, action) => {
    if (requestActionId) return;
    setRequestActionId(requestId);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(
        `${API}/api/contributor-requests/${requestId}/${action}`,
        {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        toast.error(await extractErrorMessage(res, t));
        return;
      }

      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch {
      toast.error(t('errors.server_error'));
    } finally {
      setRequestActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-bg min-h-screen flex items-center justify-center">
        <p className="text-body-sm text-text-muted font-mono">{t('dashboard.loading')}</p>
      </div>
    );
  }

  if (!user) return null;

  const pendingCount = requests.length;

  const gridClass = isCompact
    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
    : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6';

  return (
    <div className="w-full bg-bg min-h-screen">
      <div className="max-w-wide mx-auto px-4 sm:px-6 lg:px-8 py-page">

        {/* Breadcrumb */}
        <PageBreadcrumb
          items={[
            { label: t('breadcrumb.home'), to: '/' },
            { label: t('breadcrumb.dashboard') },
          ]}
        />

        {/* ═══════════════════════════════════════════
            BENTO HERO — Başlık + Stats tek kartta
        ═══════════════════════════════════════════ */}
        <div className="relative bg-surface border border-accent/10 rounded-card mb-8 overflow-hidden">

          {/* Glow blob — kullanıcıya özel hue */}
          <div
            className="absolute -top-30 -left-15 w-100 h-75 opacity-[0.12] blur-[100px] rounded-pill pointer-events-none"
            style={{ backgroundColor: `hsl(${hue} 55% 55%)` }}
          />

          {/* Noktalı pattern — sağ üst */}
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

            {/* ÜST SATIR — Başlık + Profil butonu */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
              <div className="min-w-0">
                <h1 className="text-h3 font-extrabold text-text tracking-tight mb-1">
                  {t('dashboard.greeting', { username: user.username })}
                </h1>
                <p className="text-body-sm text-text-muted max-w-lg leading-relaxed">
                  {t('dashboard.subtitle')}
                </p>
              </div>

              <Link
                to={`/profile/${user.username}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-caption font-semibold text-text-muted bg-bg/60 border border-accent/20 rounded-button hover:border-accent hover:text-text transition-all font-mono shrink-0 self-start"
              >
                <Icon.User className="w-3.5 h-3.5" />
                {t('dashboard.view_profile')}
              </Link>
            </div>

            {/* AYRAÇ */}
            <div className="mb-5 h-px bg-linear-to-r from-accent/15 via-accent/10 to-transparent" />

            {/* ALT SATIR — 4 Stat */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 sm:gap-8">

              {/* Proje */}
              <div className="flex items-center gap-3">
                <Icon.Folder className="w-4 h-4 text-text-muted shrink-0" />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-h5 font-bold text-text font-mono tabular-nums leading-none">
                    {stats.projects}
                  </span>
                  <span className="text-caption text-text-muted font-mono uppercase tracking-wider">
                    {t('dashboard.stat.projects')}
                  </span>
                </div>
              </div>

              {/* Yıldız */}
              <div className="flex items-center gap-3">
                <Icon.Star className="w-4 h-4 text-text-muted shrink-0" />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-h5 font-bold text-text font-mono tabular-nums leading-none">
                    {formatCount(stats.stars)}
                  </span>
                  <span className="text-caption text-text-muted font-mono uppercase tracking-wider">
                    {t('dashboard.stat.stars')}
                  </span>
                </div>
              </div>

              {/* Katkıcı */}
              <div className="flex items-center gap-3">
                <Icon.Users className="w-4 h-4 text-text-muted shrink-0" />
                <div className="flex items-baseline gap-1.5">
                  <span className="text-h5 font-bold text-text font-mono tabular-nums leading-none">
                    {stats.contributors}
                  </span>
                  <span className="text-caption text-text-muted font-mono uppercase tracking-wider">
                    {t('dashboard.stat.contributors')}
                  </span>
                </div>
              </div>

              {/* Bekleyen — özel vurgu */}
              <div className="flex items-center gap-3">
                <Icon.Mail
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    pendingCount > 0
                      ? 'text-accent animate-pulse'
                      : 'text-text-muted'
                  }`}
                />
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={`text-h5 font-bold font-mono tabular-nums leading-none ${
                      pendingCount > 0 ? 'text-accent' : 'text-text'
                    }`}
                  >
                    {pendingCount}
                  </span>
                  <span
                    className={`text-caption font-mono uppercase tracking-wider ${
                      pendingCount > 0 ? 'text-accent' : 'text-text-muted'
                    }`}
                  >
                    {t('dashboard.stat.pending')}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* TAB'LAR */}
        <div className="mb-6 border-b border-accent/10">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setTab('projects')}
              className={`inline-flex items-center gap-2 pb-3 text-body-sm font-semibold transition-all cursor-pointer border-b-2 -mb-px font-mono ${
                tab === 'projects'
                  ? 'text-text border-accent'
                  : 'text-text-muted border-transparent hover:text-text'
              }`}
            >
              {t('dashboard.tab.projects')}
              <span
                className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-mono-sm font-bold rounded-pill font-mono ${
                  tab === 'projects'
                    ? 'bg-accent text-bg'
                    : 'bg-accent/10 text-accent'
                }`}
              >
                {stats.projects}
              </span>
            </button>

            <button
              onClick={() => setTab('requests')}
              className={`inline-flex items-center gap-2 pb-3 text-body-sm font-semibold transition-all cursor-pointer border-b-2 -mb-px font-mono ${
                tab === 'requests'
                  ? 'text-text border-accent'
                  : 'text-text-muted border-transparent hover:text-text'
              }`}
            >
              {t('dashboard.tab.requests')}
              {pendingCount > 0 && (
                <span className="inline-flex items-center gap-1 min-w-[20px] h-5 px-1.5 text-mono-sm font-bold rounded-pill font-mono bg-accent text-bg">
                  {tab !== 'requests' && (
                    <span className="w-1 h-1 rounded-pill bg-bg animate-pulse" />
                  )}
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ALT BAŞLIK + TOGGLE + YENİ PROJE */}
        <div className="mb-4 flex items-center justify-between gap-4 flex-wrap min-h-[32px]">
          <h2 className="text-body-sm font-bold text-text uppercase tracking-wider font-mono shrink-0">
            {tab === 'projects' ? t('dashboard.tab.projects') : t('dashboard.tab.requests')}
          </h2>

          <div className="flex items-center gap-3 min-h-[26px]">

            <Link
              to="/create-project"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-caption font-medium text-text-muted bg-transparent border border-accent/20 rounded-button hover:border-accent/50 hover:text-text transition-all font-mono ${
                tab === 'projects' ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-hidden={tab !== 'projects'}
              tabIndex={tab === 'projects' ? 0 : -1}
            >
              <Icon.Plus className="w-3.5 h-3.5" />
              {t('profile.new_project')}
            </Link>

            <div
              className={`inline-flex rounded-button border border-accent/20 p-0.5 bg-surface/60 transition-opacity ${
                tab === 'projects' ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-hidden={tab !== 'projects'}
            >
              <button
                onClick={() => setView('normal')}
                className={`px-2.5 py-1 text-caption font-medium rounded-button transition-all cursor-pointer ${
                  view === 'normal'
                    ? 'bg-accent text-bg shadow-sm'
                    : 'text-text-muted hover:text-text'
                }`}
                aria-label={t('dashboard.view_normal')}
                title={t('dashboard.view_normal')}
                tabIndex={tab === 'projects' ? 0 : -1}
              >
                <Icon.List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setView('compact')}
                className={`px-2.5 py-1 text-caption font-medium rounded-button transition-all cursor-pointer ${
                  view === 'compact'
                    ? 'bg-accent text-bg shadow-sm'
                    : 'text-text-muted hover:text-text'
                }`}
                aria-label={t('dashboard.view_compact')}
                title={t('dashboard.view_compact')}
                tabIndex={tab === 'projects' ? 0 : -1}
              >
                <Icon.LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* TAB: PROJELERİM */}
        {tab === 'projects' && (
          <>
            {projectsLoading && (
              <div className={gridClass}>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`${
                      isCompact ? 'h-40' : 'h-72'
                    } rounded-card bg-surface/40 border border-accent/10 animate-pulse`}
                  />
                ))}
              </div>
            )}

            {error && !projectsLoading && (
              <div className="text-center py-20 rounded-card bg-surface/30 border border-accent/15">
                <Icon.Warning className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <h3 className="text-h5 font-bold text-text mb-1 font-mono">
                  {t('dashboard.error')}
                </h3>
              </div>
            )}

            {!projectsLoading && !error && (
              <>
                {projects.length > 0 ? (
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
                ) : (
                  <div className="text-center py-20 rounded-card bg-surface/30 border border-dashed border-accent/20">
                    <Icon.Package className="w-12 h-12 text-text-muted mx-auto mb-3" />
                    <h3 className="text-h5 font-bold text-text mb-1 font-mono">
                      {t('dashboard.projects.empty_title')}
                    </h3>
                    <p className="text-body-sm text-text-muted mb-5">
                      {t('dashboard.projects.empty_desc')}
                    </p>
                    <Link
                      to="/create-project"
                      className="inline-block px-5 py-2.5 text-body-sm font-bold bg-accent text-bg rounded-button hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] font-mono"
                    >
                      {t('dashboard.projects.empty_cta')}
                    </Link>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* TAB: GELEN BAŞVURULAR */}
        {tab === 'requests' && (
          <>
            {requestsLoading && (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 rounded-card bg-surface/40 border border-accent/10 animate-pulse"
                  />
                ))}
              </div>
            )}

            {!requestsLoading && requests.length === 0 && (
              <div className="text-center py-20 rounded-card bg-surface/30 border border-dashed border-accent/20">
                <Icon.Inbox className="w-12 h-12 text-text-muted mx-auto mb-3" />
                <h3 className="text-h5 font-bold text-text mb-1 font-mono">
                  {t('dashboard.requests.empty_title')}
                </h3>
                <p className="text-body-sm text-text-muted">
                  {t('dashboard.requests.empty_desc')}
                </p>
              </div>
            )}

            {!requestsLoading && requests.length > 0 && (
              <div className="space-y-3">
                {requests.map((req) => {
                  const isProcessing = requestActionId === req.id;
                  return (
                    <div
                      key={req.id}
                      className="bg-surface border border-accent/10 rounded-card p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-accent/30 transition-all"
                    >
                      <Link
                        to={`/profile/${req.username}`}
                        className="w-12 h-12 rounded-pill bg-bg border border-accent/15 overflow-hidden shrink-0"
                      >
                        {req.avatar_url ? (
                          <img
                            src={req.avatar_url}
                            alt={req.username}
                            loading="lazy"
                            decoding="async"
                            width="48"
                            height="48"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon.User className="w-6 h-6 text-text-muted" />
                          </div>
                        )}
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Link
                            to={`/profile/${req.username}`}
                            className="text-body-sm font-semibold text-text hover:text-accent transition-colors font-mono"
                          >
                            {req.username}
                          </Link>
                          <span className="text-caption text-text-muted">
                            {t('dashboard.request.wants_to_join')}
                          </span>
                          <Link
                            to={`/project/${req.project_id}`}
                            className="text-body-sm font-medium text-accent hover:text-accent/80 transition-colors truncate underline underline-offset-2"
                          >
                            {req.project_title}
                          </Link>
                        </div>
                        {req.message && (
                          <div className="flex items-start gap-2 mt-2 p-2.5 bg-bg/60 border border-accent/10 rounded-button">
                            <Icon.Mail className="w-3.5 h-3.5 text-text-muted shrink-0 mt-0.5" />
                            <p className="text-caption text-text-muted leading-relaxed whitespace-pre-line font-mono">
                              {req.message}
                            </p>
                          </div>
                        )}
                        <p className="text-mono-sm text-text-muted/70 mt-1.5 font-mono">
                          {new Date(req.created_at).toLocaleDateString(locale, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleRequestAction(req.id, 'reject')}
                          disabled={isProcessing}
                          className="px-3.5 py-2 text-caption font-semibold text-red-400 bg-transparent border border-red-400/30 rounded-button hover:bg-red-400/10 hover:border-red-400/60 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                        >
                          {t('dashboard.request.reject')}
                        </button>
                        <button
                          onClick={() => handleRequestAction(req.id, 'approve')}
                          disabled={isProcessing}
                          className="px-3.5 py-2 text-caption font-bold text-bg bg-accent border border-accent rounded-button hover:bg-accent/90 transition-all hover:shadow-[0_0_20px_-5px_rgba(239,228,206,0.4)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                        >
                          {isProcessing ? '...' : t('dashboard.request.approve')}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}