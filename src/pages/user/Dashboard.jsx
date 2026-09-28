import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProjectCard from '../../components/project/ProjectCard';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('projects'); // 'projects' | 'requests'

  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [error, setError] = useState('');

  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [requestActionId, setRequestActionId] = useState(null); // hangi başvuru işleniyor

  const userId = user?.user_id;

  // Auth yönlendirme
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Projeleri çek
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

  // Başvuruları çek
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
    // action: 'approve' | 'reject'
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

      // Listeden kaldır
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch {
      alert('İşlem başarısız oldu');
    } finally {
      setRequestActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 py-10 text-center text-sm text-gray-500">
        Yükleniyor...
      </div>
    );
  }

  if (!user) return null;

  const pendingCount = requests.length;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto">

        {/* Başlık */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-black mb-2">
              Merhaba, {user.username} 👋
            </h1>
            <p className="text-sm text-gray-500">
              Buradan projelerini yönetebilir, yeni proje oluşturabilirsin.
            </p>
          </div>
          <Link
            to="/create-project"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Yeni Proje
          </Link>
        </div>

        {/* Sekmeler */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setTab('projects')}
              className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-px ${
                tab === 'projects'
                  ? 'text-black border-black'
                  : 'text-gray-500 border-transparent hover:text-black'
              }`}
            >
              Projelerim
            </button>
            <button
              onClick={() => setTab('requests')}
              className={`pb-3 text-sm font-semibold transition-colors cursor-pointer border-b-2 -mb-px flex items-center gap-2 ${
                tab === 'requests'
                  ? 'text-black border-black'
                  : 'text-gray-500 border-transparent hover:text-black'
              }`}
            >
              Gelen Başvurular
              {pendingCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-white bg-red-500 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab: Projelerim */}
        {tab === 'projects' && (
          <>
            {projectsLoading && (
              <div className="text-center py-20 text-sm text-gray-500">
                Projeler yükleniyor...
              </div>
            )}

            {error && !projectsLoading && (
              <div className="text-center py-20">
                <div className="text-5xl mb-3">⚠️</div>
                <h3 className="text-lg font-bold text-black mb-1">Projeler yüklenemedi</h3>
                <p className="text-sm text-gray-500">{error}</p>
              </div>
            )}

            {!projectsLoading && !error && (
              <>
                {projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {projects.map((project) => (
                      <ProjectCard key={project.id} project={project} showAuthor={false} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
                    <div className="text-5xl mb-3">📦</div>
                    <h3 className="text-lg font-bold text-black mb-1">
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
          </>
        )}

        {/* Tab: Gelen Başvurular */}
        {tab === 'requests' && (
          <>
            {requestsLoading && (
              <div className="text-center py-20 text-sm text-gray-500">
                Başvurular yükleniyor...
              </div>
            )}

            {!requestsLoading && requests.length === 0 && (
              <div className="text-center py-20 border border-dashed border-gray-200 rounded-2xl">
                <div className="text-5xl mb-3">📭</div>
                <h3 className="text-lg font-bold text-black mb-1">
                  Bekleyen başvuru yok
                </h3>
                <p className="text-sm text-gray-500">
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
                      className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
                    >
                      {/* Avatar */}
                      <Link
                        to={`/profile/${req.username}`}
                        className="w-12 h-12 rounded-full bg-gray-200 border border-gray-200 overflow-hidden shrink-0"
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
                            <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                          </div>
                        )}
                      </Link>

                      {/* Bilgi */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <Link
                            to={`/profile/${req.username}`}
                            className="text-sm font-semibold text-black hover:underline"
                          >
                            {req.username}
                          </Link>
                          <span className="text-xs text-gray-400">şu projeye katılmak istiyor:</span>
                          <Link
                            to={`/project/${req.project_id}`}
                            className="text-sm font-medium text-gray-700 hover:underline truncate"
                          >
                            {req.project_title}
                          </Link>
                        </div>
                        {req.message && (
                          <p className="text-xs text-gray-600 bg-gray-50 border border-gray-100 rounded-lg p-2.5 mt-2 leading-relaxed whitespace-pre-line">
                            💬 {req.message}
                          </p>
                        )}
                        <p className="text-[11px] text-gray-400 mt-1.5">
                          {new Date(req.created_at).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>

                      {/* Aksiyonlar */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleRequestAction(req.id, 'reject')}
                          disabled={isProcessing}
                          className="px-3.5 py-2 text-xs font-semibold text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reddet
                        </button>
                        <button
                          onClick={() => handleRequestAction(req.id, 'approve')}
                          disabled={isProcessing}
                          className="px-3.5 py-2 text-xs font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isProcessing ? '...' : 'Onayla'}
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