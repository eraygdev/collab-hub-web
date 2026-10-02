import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';
import JoinRequestModal from '../../components/project/JoinRequestModal';
import ContributorCard from '../../components/project/ContributorCard';
import LeaveConfirmModal from '../../components/project/LeaveConfirmModal';
import * as Icon from '../../components/ui/Icons';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [starLoading, setStarLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [joinStatus, setJoinStatus] = useState('none');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinSubmitting, setJoinSubmitting] = useState(false);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');

    fetch(`${API}/api/projects/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error('Proje bulunamadı');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        setProject(data);
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
  }, [id]);

  useEffect(() => {
    if (!user) {
      setJoinStatus('none');
      return;
    }

    const token = localStorage.getItem('token');
    let cancelled = false;

    fetch(`${API}/api/projects/${id}/my-join-status`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        setJoinStatus(data.status || 'none');
      })
      .catch(() => {
        if (cancelled) return;
        setJoinStatus('none');
      });

    return () => {
      cancelled = true;
    };
  }, [id, user]);

  const handleToggleStar = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (starLoading) return;

    const token = localStorage.getItem('token');
    const method = project.starred ? 'DELETE' : 'POST';

    setStarLoading(true);
    try {
      const res = await fetch(`${API}/api/projects/${id}/star`, {
        method,
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('İşlem başarısız');
      const data = await res.json();
      setProject((prev) => ({
        ...prev,
        stars: data.stars,
        starred: data.starred,
      }));
    } catch {
      // sessizce
    } finally {
      setStarLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Bu projeyi silmek istediğine emin misin? Bu işlem geri alınamaz.')) {
      return;
    }
    setDeleting(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const text = await res.text();
        let data = {};
        try { data = JSON.parse(text); } catch {}
        alert(data.error || 'Silme başarısız oldu');
        setDeleting(false);
        return;
      }
      navigate('/');
    } catch {
      alert('Sunucuya bağlanılamadı');
      setDeleting(false);
    }
  };

  const handleJoinSubmit = async (message) => {
    setJoinSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API}/api/projects/${id}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      const text = await res.text();
      let data = {};
      if (text) {
        try { data = JSON.parse(text); } catch {}
      }

      if (!res.ok) {
        alert(data.error || 'Başvuru gönderilemedi');
        setJoinSubmitting(false);
        return;
      }

      setJoinStatus('pending');
      setIsJoinModalOpen(false);
      setJoinSubmitting(false);
    } catch {
      alert('Sunucuya bağlanılamadı');
      setJoinSubmitting(false);
    }
  };

  const handleLeaveConfirm = async () => {
    setLeaveSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API}/api/projects/${id}/leave`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        let data = {};
        try { data = JSON.parse(text); } catch {}
        alert(data.error || 'Ayrılma başarısız');
        setLeaveSubmitting(false);
        setIsLeaveModalOpen(false);
        return;
      }

      setJoinStatus('none');
      setProject((prev) => ({
        ...prev,
        contributorsList: (prev.contributorsList || []).filter(
          (c) => c.user_id !== user.user_id
        ),
      }));
      setIsLeaveModalOpen(false);
      setLeaveSubmitting(false);
    } catch {
      alert('Sunucuya bağlanılamadı');
      setLeaveSubmitting(false);
      setIsLeaveModalOpen(false);
    }
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-bg min-h-screen flex items-center justify-center">
        <p className="text-sm text-text-muted font-mono">proje yükleniyor...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="w-full bg-bg min-h-screen">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <PageBreadcrumb
            items={[
              { label: 'ana sayfa', to: '/' },
              { label: `proje:${id}` },
            ]}
          />
          <div className="text-center py-16 rounded-2xl bg-surface/30 border border-dashed border-accent/20">
            <Icon.Search className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <h2 className="text-lg font-bold text-text mb-1 font-mono">proje bulunamadı</h2>
            <p className="text-sm text-text-muted mb-5">
              Aradığın proje silinmiş veya taşınmış olabilir.
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

  const isAuthor = user && project.authorId && user.user_id === project.authorId;

  let joinButtonLabel = 'ekibe katıl';
  let joinButtonDisabled = false;
  let joinButtonIsLeave = false;

  if (!user) {
    joinButtonLabel = 'ekibe katıl';
  } else if (isAuthor) {
    joinButtonLabel = 'bu projenin sahibisin';
    joinButtonDisabled = true;
  } else if (joinStatus === 'pending') {
    joinButtonLabel = 'başvurun onay bekliyor';
    joinButtonDisabled = true;
  } else if (joinStatus === 'approved') {
    joinButtonLabel = 'projeden ayrıl';
    joinButtonIsLeave = true;
  }

  const handleJoinClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (joinButtonDisabled) return;
    setIsJoinModalOpen(true);
  };

  const handleLeaveClick = () => {
    setIsLeaveModalOpen(true);
  };

  return (
    <div className="w-full bg-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <PageBreadcrumb
          items={[
            { label: 'ana sayfa', to: '/' },
            { label: `proje:${project.id}` },
          ]}
        />

        {/* Yazar işlemleri */}
        {isAuthor && (
          <div className="mb-4 flex items-center gap-2">
            <Link
              to={`/project/${project.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-text-muted bg-transparent border border-accent/20 rounded-lg hover:border-accent hover:text-text transition-all font-mono"
            >
              <Icon.Edit className="w-3.5 h-3.5" />
              düzenle
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-400 bg-transparent border border-red-400/30 rounded-lg hover:bg-red-400/10 hover:border-red-400/60 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
            >
              <Icon.Trash className="w-3.5 h-3.5" />
              {deleting ? 'siliniyor...' : 'sil'}
            </button>
          </div>
        )}

        {/* Başlık + Meta */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-accent bg-accent/10 border border-accent/20 rounded-full font-mono">
              <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></span>
              {project.status}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-text-muted font-mono">
              <Icon.Calendar className="w-3.5 h-3.5" />
              {formatDate(project.createdAt)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight mb-4">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-text-muted leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Kapak Görseli */}
        <div className="w-full h-64 sm:h-80 rounded-2xl mb-10 overflow-hidden bg-gradient-to-br from-surface via-bg to-surface border border-accent/10 flex items-center justify-center">
          {project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              loading="lazy"
              decoding="async"
              width="1200"
              height="600"
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon.Image className="w-16 h-16 text-text-muted" />
          )}
        </div>

        {/* Ana İçerik */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Sol Sütun */}
          <div className="lg:col-span-2">

            {project.categories && project.categories.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4 font-mono">
                  /teknolojiler & kategoriler
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.categories.map((cat, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-text-muted bg-surface border border-accent/15 rounded-full font-mono"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(project.githubUrl || project.demoUrl) && (
              <div className="mb-10">
                <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4 font-mono">
                  /bağlantılar
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-text-muted bg-surface border border-accent/15 rounded-full hover:border-accent hover:text-text transition-all font-mono"
                    >
                      <Icon.Github className="w-4 h-4" />
                      github
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-text-muted bg-surface border border-accent/15 rounded-full hover:border-accent hover:text-text transition-all font-mono"
                    >
                      <Icon.ExternalLink className="w-4 h-4" />
                      demo
                    </a>
                  )}
                </div>
              </div>
            )}

            {project.contributorsList && project.contributorsList.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4 font-mono">
                  /katkıcılar ({project.contributorsList.length})
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.contributorsList.map((contributor) => (
                    <ContributorCard
                      key={contributor.user_id}
                      contributor={contributor}
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xs font-bold text-text uppercase tracking-wider mb-4 font-mono">
                /proje hakkında
              </h2>
              <p className="text-text-muted leading-relaxed text-base whitespace-pre-line">
                {project.longDescription || project.description}
              </p>
            </div>
          </div>

          {/* Sağ Sütun */}
          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-20 space-y-4">

              {/* Yazar Kartı */}
              {project.author && (
                <Link
                  to={`/profile/${project.author}`}
                  className="block bg-surface border border-accent/10 rounded-2xl p-5 hover:border-accent/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-bg border border-accent/15 overflow-hidden shrink-0">
                      {project.authorAvatar ? (
                        <img
                          src={project.authorAvatar}
                          alt={project.author}
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
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-text-muted/70 mb-0.5 font-mono uppercase tracking-wider">yazar</p>
                      <p className="text-sm font-semibold text-text truncate group-hover:text-accent transition-colors font-mono">
                        {project.author}
                      </p>
                    </div>
                    <Icon.ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                  </div>
                </Link>
              )}

              {/* CTA Kartı */}
              <div className="bg-surface border border-accent/10 rounded-2xl p-6">
                <h3 className="text-base font-bold text-text mb-3 font-mono">
                  /bu projeye katıl
                </h3>
                <p className="text-sm text-text-muted leading-relaxed mb-6">
                  Katkıda bulunmak için ekibe katıl veya projeyi yıldızla.
                </p>
                <div className="space-y-2">
                  {isAuthor ? (
                    <div className="w-full px-4 py-2.5 bg-bg/60 text-text-muted text-sm font-medium rounded-lg text-center border border-accent/10 font-mono inline-flex items-center justify-center gap-2">
                      <Icon.StarFilled className="w-4 h-4" />
                      bu proje senin · {project.stars} yıldız
                    </div>
                  ) : (
                    <button
                      onClick={handleToggleStar}
                      disabled={starLoading}
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono ${
                        project.starred
                          ? 'bg-accent/10 text-accent border-accent/50 hover:bg-accent/15 hover:shadow-[0_0_20px_-5px_rgba(239,228,206,0.3)]'
                          : 'bg-transparent text-text border-accent/30 hover:border-accent hover:bg-surface'
                      }`}
                    >
                      {starLoading ? (
                        '...'
                      ) : project.starred ? (
                        <>
                          <Icon.StarFilled className="w-4 h-4" />
                          yıldızlandı ({project.stars})
                        </>
                      ) : (
                        <>
                          <Icon.Star className="w-4 h-4" />
                          yıldızla ({project.stars})
                        </>
                      )}
                    </button>
                  )}

                  {joinButtonIsLeave ? (
                    <button
                      onClick={handleLeaveClick}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-400 bg-transparent border border-red-400/30 rounded-lg hover:bg-red-400/10 hover:border-red-400/60 transition-all cursor-pointer font-mono"
                    >
                      <Icon.Logout className="w-4 h-4" />
                      {joinButtonLabel}
                    </button>
                  ) : (
                    <button
                      onClick={handleJoinClick}
                      disabled={joinButtonDisabled}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-bg text-sm font-bold rounded-lg border border-accent hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-accent disabled:hover:shadow-none font-mono"
                    >
                      {joinStatus === 'pending' ? (
                        <Icon.Clock className="w-4 h-4" />
                      ) : joinButtonDisabled ? (
                        <Icon.Star className="w-4 h-4" />
                      ) : (
                        <Icon.Plus className="w-4 h-4" />
                      )}
                      {joinButtonLabel}
                    </button>
                  )}
                </div>
              </div>

              {/* Bilgi Kartı */}
              <div className="bg-surface/50 border border-accent/10 rounded-2xl p-6">
                <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-4 font-mono">
                  /proje bilgileri
                </h3>
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-text-muted font-mono">yazar</dt>
                    <dd className="font-medium text-text font-mono">{project.author || 'anonim'}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-text-muted font-mono">yıldız</dt>
                    <dd className="font-medium text-text font-mono tabular-nums inline-flex items-center gap-1">
                      <Icon.StarFilled className="w-3.5 h-3.5 text-accent" />
                      {project.stars}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-text-muted font-mono">katkıcı</dt>
                    <dd className="font-medium text-text font-mono tabular-nums inline-flex items-center gap-1">
                      <Icon.Users className="w-3.5 h-3.5" />
                      {project.contributorsList?.length || 0}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-text-muted font-mono">durum</dt>
                    <dd className="font-medium text-accent font-mono">{project.status}</dd>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-accent/10">
                    <dt className="text-text-muted font-mono">oluşturulma</dt>
                    <dd className="font-medium text-text font-mono">{formatDate(project.createdAt)}</dd>
                  </div>
                </dl>
              </div>

              {/* Paylaş */}
              <div className="bg-surface/50 border border-accent/10 rounded-2xl p-6">
                <h3 className="text-xs font-bold text-text uppercase tracking-wider mb-3 font-mono">
                  /paylaş
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link kopyalandı!');
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-text-muted bg-bg/60 border border-accent/15 rounded-lg hover:border-accent hover:text-text transition-all cursor-pointer font-mono"
                  >
                    <Icon.Link className="w-3.5 h-3.5" />
                    link
                  </button>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(project.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-text-muted bg-bg/60 border border-accent/15 rounded-lg hover:border-accent hover:text-text transition-all cursor-pointer font-mono"
                  >
                    <Icon.Twitter className="w-3.5 h-3.5" />
                    twitter
                  </a>
                </div>
              </div>

            </div>
          </aside>
        </div>

      </div>

      <JoinRequestModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onConfirm={handleJoinSubmit}
        projectTitle={project.title}
        isPremium={user?.is_premium === true}
        submitting={joinSubmitting}
      />

      <LeaveConfirmModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={handleLeaveConfirm}
        projectTitle={project.title}
        submitting={leaveSubmitting}
      />
    </div>
  );
}