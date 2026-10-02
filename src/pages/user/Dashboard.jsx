import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProjectCard from '../../components/project/ProjectCard';
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';
import { useProjectView } from '../../hooks/useProjectView';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { isCompact, view, setView } = useProjectView();

  const [tab, setTab] = useState('projects');

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [error, setError] = useState('');

  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestActionId, setRequestActionId] = useState(null);

  const userId = user?.user_id;

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
        if (!res.ok) throw new Error('Projeler yüklenemedi');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setProjects(Array.isArray(data) ? data : []);
        setProjectsLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message);
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
        if (!res.ok) throw new Error('Başvurular yüklenemedi');
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

      if (!res.ok) throw new Error('İşlem başarısız');

      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch {
      alert('İşlem başarısız oldu');
    } finally {
      setRequestActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-bg min-h-screen flex items-center justify-center">
        <p className="text-sm text-text-muted font-mono">yükleniyor...</p>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Breadcrumb */}
        <PageBreadcrumb
          items={[
            { label: 'ana sayfa', to: '/' },
            { label: 'dashboard' },
          ]}
        />

        {/* ═══════════════════════════════════════════
            HEADER
        ═══════════════════════════════════════════ */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text mb-1 tracking-tight">
              Merhaba, <span className="font-mono">{user.username}</span> 👋
            </h1>
            <p className="text-sm text-text-muted">
              Buradan projelerini yönetebilir, yeni proje oluşturabilirsin.
            </p>
          </div>

          <Link
            to="/create-project"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent text-bg text-sm font-bold rounded-xl border border-accent hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Yeni Proje
          </Link>
        </div>

        {/* ═══════════════════════════════════════════
            SEKMELER
        ═══════════════════════════════════════════ */}
        <div className="mb-6 border-b border-accent/10">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <button
                onClick={() => setTab('projects')}
                className={`pb-3 text-sm font-semibold transition-all cursor-pointer border-b-2 -mb-px font-mono ${
                  tab === 'projects'
                    ? 'text-text border-accent'
                    : 'text-text-muted border-transparent hover:text-text'
                }`}
              >
                /projelerim
              </button>
              <button
                onClick={() => setTab('requests')}
                className={`pb-3 text-sm font-semibold transition-all cursor-pointer border-b-2 -mb-px flex items-center gap-2 font-mono ${
                  tab === 'requests'
                    ? 'text-text border-accent'
                    : 'text-text-muted border-transparent hover:text-text'
                }`}
              >
                /gelen başvurular
                {pendingCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-bg bg-red-400 rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>
            </div>

            {/* Görünüm toggle — sadece Projelerim sekmesinde */}
            {tab === 'projects' && (
              <div className="inline-flex rounded-lg border border-accent/20 p-0.5 bg-surface/60 mb-3">
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
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            TAB: PROJELERİM
        ═══════════════════════════════════════════ */}
        {tab === 'projects' && (
          <>
            {projectsLoading && (
              <div className={gridClass}>
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`${
                      isCompact ? 'h-40' : 'h-72'
                    } rounded-2xl bg-surface/40 border border-accent/10 animate-pulse`}
                  />
                ))}
              </div>
            )}

            {error && !projectsLoading && (
              <div className="text-center py-20 rounded-2xl bg-surface/30 border border-accent/15">
                <div className="text-5xl mb-3">⚠️</div>
                <h3 className="text-lg font-bold text-text mb-1 font-mono">projeler yüklenemedi</h3>
                <p className="text-sm text-text-muted">{error}</p>
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
                  <div className="text-center py-20 rounded-2xl bg-surface/30 border border-dashed border-accent/20">
                    <div className="text-5xl mb-3">📦</div>
                    <h3 className="text-lg font-bold text-text mb-1 font-mono">
                      henüz projen yok
                    </h3>
                    <p className="text-sm text-text-muted mb-5">
                      İlk projeni oluşturarak başla.
                    </p>
                    <Link
                      to="/create-project"
                      className="inline-block px-5 py-2.5 text-sm font-bold bg-accent text-bg rounded-lg hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] font-mono"
                    >
                      proje oluştur
                    </Link>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════════
            TAB: GELEN BAŞVURULAR
        ═══════════════════════════════════════════ */}
        {tab === 'requests' && (
          <>
            {requestsLoading && (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-28 rounded-2xl bg-surface/40 border border-accent/10 animate-pulse"
                  />
                ))}
              </div>
            )}

            {!requestsLoading && requests.length === 0 && (
              <div className="text-center py-20 rounded-2xl bg-surface/30 border border-dashed border-accent/20">
                <div className="text-5xl mb-3">📭</div>
                <h3 className="text-lg font-bold text-text mb-1 font-mono">
                  bekleyen başvuru yok
                </h3>
                <p className="text-sm text-text-muted">
                  Projelerine katılmak isteyenler burada görünecek.
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
                      className="bg-surface border border-accent/10 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:border-accent/30 transition-all"
                    >
                      <Link
                        to={`/profile/${req.username}`}
                        className="w-12 h-12 rounded-full bg-bg border border-accent/15 overflow-hidden shrink-0"
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
                            <svg className="w-6 h-6 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          </div>
                        )}
                      </Link>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Link
                            to={`/profile/${req.username}`}
                            className="text-sm font-semibold text-text hover:text-accent transition-colors font-mono"
                          >
                            {req.username}
                          </Link>
                          <span className="text-xs text-text-muted">şu projeye katılmak istiyor:</span>
                          <Link
                            to={`/project/${req.project_id}`}
                            className="text-sm font-medium text-accent hover:text-accent/80 transition-colors truncate underline underline-offset-2"
                          >
                            {req.project_title}
                          </Link>
                        </div>
                        {req.message && (
                          <p className="text-xs text-text-muted bg-bg/60 border border-accent/10 rounded-lg p-2.5 mt-2 leading-relaxed whitespace-pre-line font-mono">
                            💬 {req.message}
                          </p>
                        )}
                        <p className="text-[11px] text-text-muted/70 mt-1.5 font-mono">
                          {new Date(req.created_at).toLocaleDateString('tr-TR', {
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
                          className="px-3.5 py-2 text-xs font-semibold text-red-400 bg-transparent border border-red-400/30 rounded-lg hover:bg-red-400/10 hover:border-red-400/60 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                        >
                          reddet
                        </button>
                        <button
                          onClick={() => handleRequestAction(req.id, 'approve')}
                          disabled={isProcessing}
                          className="px-3.5 py-2 text-xs font-bold text-bg bg-accent border border-accent rounded-lg hover:bg-accent/90 transition-all hover:shadow-[0_0_20px_-5px_rgba(239,228,206,0.4)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                        >
                          {isProcessing ? '...' : 'onayla'}
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