import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../i18n/LanguageContext';
import { useToast } from '../../components/ui/Toast';
import { extractErrorMessage } from '../../utils/errors';
import { formatCount } from '../../utils/format';
import PageBreadcrumb from '../../components/ui/PageBreadcrumb';
import JoinRequestModal from '../../components/project/JoinRequestModal';
import ContributorCard from '../../components/project/ContributorCard';
import LeaveConfirmModal from '../../components/project/LeaveConfirmModal';
import RemoveContributorModal from '../../components/project/RemoveContributorModal';
import ConfirmModal from '../../components/ui/ConfirmModal';
import * as Icon from '../../components/ui/Icons';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export default function ProjectDetail() {
  const { id } = useParams();
  const { user, setProjectCount } = useAuth();
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [starLoading, setStarLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const [joinStatus, setJoinStatus] = useState('none');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinSubmitting, setJoinSubmitting] = useState(false);

  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveSubmitting, setLeaveSubmitting] = useState(false);

  const [removeTarget, setRemoveTarget] = useState(null);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [removeSubmitting, setRemoveSubmitting] = useState(false);

  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError('');
    const token = localStorage.getItem('token');

    fetch(`${API}/api/projects/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((res) => {
        if (!res.ok) throw new Error('not_found');
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
      if (!res.ok) throw new Error('action_failed');
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

  // [DEĞİŞTİ] Delete — modal aç
  const handleDeleteClick = () => {
    if (deleting) return;
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    if (deleting) return;
    setIsDeleteModalOpen(false);
  };

  // [DEĞİŞTİ] Asıl silme işlemi — modal içinden çağrılır
  const handleConfirmDelete = async () => {
    if (deleting) return;

    setDeleting(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API}/api/projects/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        toast.error(await extractErrorMessage(res, t));
        setDeleting(false);
        return;
      }

      const data = await res.json();

      if (data.projectCount !== undefined) {
        setProjectCount(data.projectCount);
      }

      setIsDeleteModalOpen(false);
      navigate('/');
    } catch {
      toast.error(t('errors.server_error'));
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

      if (!res.ok) {
        toast.error(await extractErrorMessage(res, t));
        setJoinSubmitting(false);
        return;
      }

      setJoinStatus('pending');
      setIsJoinModalOpen(false);
      setJoinSubmitting(false);
    } catch {
      toast.error(t('errors.server_error'));
      setJoinSubmitting(false);
    }
  };

  const handleLeaveConfirm = async () => {
    if (!user?.user_id) {
      setLeaveSubmitting(false);
      setIsLeaveModalOpen(false);
      return;
    }

    setLeaveSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API}/api/projects/${id}/leave`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        toast.error(await extractErrorMessage(res, t));
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
      toast.error(t('errors.server_error'));
      setLeaveSubmitting(false);
      setIsLeaveModalOpen(false);
    }
  };

  const handleOpenRemoveModal = (contributor) => {
    setRemoveTarget(contributor);
    setIsRemoveModalOpen(true);
  };

  const handleCloseRemoveModal = () => {
    if (removeSubmitting) return;
    setIsRemoveModalOpen(false);
    setRemoveTarget(null);
  };

  const handleRemoveContributor = async () => {
    if (!removeTarget || removeSubmitting) return;

    setRemoveSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(
        `${API}/api/projects/${id}/contributors/${removeTarget.user_id}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
        toast.error(await extractErrorMessage(res, t));
        setRemoveSubmitting(false);
        return;
      }

      setProject((prev) => ({
        ...prev,
        contributorsList: (prev.contributorsList || []).filter(
          (c) => c.user_id !== removeTarget.user_id
        ),
      }));

      setIsRemoveModalOpen(false);
      setRemoveTarget(null);
      setRemoveSubmitting(false);
    } catch {
      toast.error(t('errors.server_error'));
      setRemoveSubmitting(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success(t('common.copied'));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t('details.share.copy_failed'));
    }
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString(locale, {
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
        <p className="text-body-sm text-text-muted font-mono">{t('details.loading')}</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="w-full bg-bg px-4 sm:px-6 lg:px-8 py-page min-h-[70vh] flex items-center justify-center relative overflow-hidden">
        {/* Glow blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-accent opacity-[0.05] blur-[120px] rounded-pill pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-pill border border-accent/15 bg-surface/50">
            <span className="w-1.5 h-1.5 rounded-pill bg-accent animate-pulse" />
            <span className="text-mono-sm font-mono tracking-wider text-text-muted uppercase">
              {t('details.not_found_eyebrow')}
            </span>
          </div>

          {/* #id — büyük mono */}
          <h1 className="text-h1 font-extrabold text-text tracking-tight mb-4 font-mono">
            #{id}
          </h1>

          {/* Açıklama */}
          <h2 className="text-h5 font-bold text-text mb-2">
            {t('details.not_found_title')}
          </h2>
          <p className="text-body-sm text-text-muted mb-8 max-w-md mx-auto leading-relaxed">
            {t('details.not_found_desc')}
          </p>

          {/* Buton */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-bg text-body-sm font-bold rounded-button border border-accent hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer font-mono"
          >
            <Icon.ArrowLeft className="w-4 h-4" />
            {t('details.back_home')}
          </Link>
        </div>
      </div>
    );
  }

  const isAuthor = user && project.authorId && user.user_id === project.authorId;

  let joinButtonLabel = t('details.cta.join');
  let joinButtonDisabled = false;
  let joinButtonIsLeave = false;

  if (!user) {
    joinButtonLabel = t('details.cta.join');
  } else if (isAuthor) {
    joinButtonLabel = t('details.cta.owner');
    joinButtonDisabled = true;
  } else if (joinStatus === 'pending') {
    joinButtonLabel = t('details.cta.pending');
    joinButtonDisabled = true;
  } else if (joinStatus === 'approved') {
    joinButtonLabel = t('details.cta.leave');
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
      <div className="max-w-wide mx-auto px-4 sm:px-6 lg:px-8 py-page">

        <PageBreadcrumb
          items={[
            { label: t('breadcrumb.home'), to: '/' },
            { label: t('breadcrumb.project', { id: project.id }) },
          ]}
        />

        {/* Yazar işlemleri */}
        {isAuthor && (
          <div className="mb-4 flex items-center gap-2">
            <Link
              to={`/project/${project.id}/edit`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-caption font-medium text-text-muted bg-transparent border border-accent/20 rounded-button hover:border-accent hover:text-text transition-all font-mono"
            >
              <Icon.Edit className="w-3.5 h-3.5" />
              {t('details.edit')}
            </Link>
            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-caption font-medium text-red-400 bg-transparent border border-red-400/30 rounded-button hover:bg-red-400/10 hover:border-red-400/60 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono"
            >
              <Icon.Trash className="w-3.5 h-3.5" />
              {deleting ? t('details.deleting') : t('details.delete')}
            </button>
          </div>
        )}

        {/* HERO — İki Sütun Bento */}
        <div className="bg-surface border border-accent/10 rounded-card overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2">

            <div className="relative bg-bg border-b lg:border-b-0 lg:border-r border-accent/10 min-h-[224px] lg:min-h-[280px] flex items-center justify-center">
              {project.imageUrl ? (
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  width="600"
                  height="400"
                  className="w-full h-full object-cover absolute inset-0"
                />
              ) : (
                <Icon.Image className="w-16 h-16 text-text-muted" />
              )}
            </div>

            <div className="p-6 sm:p-8 flex flex-col">

              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-caption font-semibold text-accent bg-accent/10 border border-accent/20 rounded-pill font-mono">
                  <span className="w-1.5 h-1.5 bg-accent rounded-pill animate-pulse"></span>
                  {project.status}
                </span>
              </div>

              <h1 className="text-h3 font-extrabold text-text tracking-tight mb-3 leading-tight">
                {project.title}
              </h1>

              <p className="text-body-sm text-text-muted leading-relaxed mb-5">
                {project.description}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 pb-5 border-b border-accent/10">
                <span className="inline-flex items-center gap-1.5 text-caption text-text-muted font-mono">
                  <Icon.Calendar className="w-3.5 h-3.5" />
                  {formatDate(project.createdAt)}
                </span>
                {project.author && (
                  <Link
                    to={`/profile/${project.author}`}
                    className="inline-flex items-center gap-1.5 text-caption text-text-muted hover:text-accent transition-colors font-mono group"
                  >
                    <div className="w-5 h-5 rounded-pill bg-bg border border-accent/15 overflow-hidden shrink-0">
                      {project.authorAvatar ? (
                        <img
                          src={project.authorAvatar}
                          alt={project.author}
                          loading="lazy"
                          decoding="async"
                          width="20"
                          height="20"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon.User className="w-3 h-3 text-text-muted" />
                        </div>
                      )}
                    </div>
                    <span className="group-hover:underline underline-offset-2">{project.author}</span>
                  </Link>
                )}
              </div>

              {project.categories && project.categories.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.categories.slice(0, 6).map((cat, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2.5 py-1 text-mono-sm font-medium text-text-muted bg-bg/60 border border-accent/15 rounded-pill font-mono"
                    >
                      {cat}
                    </span>
                  ))}
                  {project.categories.length > 6 && (
                    <span className="inline-flex items-center px-2.5 py-1 text-mono-sm font-medium text-text bg-bg border border-accent/20 rounded-pill font-mono">
                      +{project.categories.length - 6}
                    </span>
                  )}
                </div>
              )}

              <div className="mt-auto space-y-2">
                {isAuthor ? (
                  <div className="w-full px-4 py-2.5 bg-bg/60 text-text-muted text-body-sm font-medium rounded-button text-center border border-accent/10 font-mono inline-flex items-center justify-center gap-2">
                    <Icon.StarFilled className="w-4 h-4" />
                    {t('details.cta.your_project', { count: formatCount(project.stars) })}
                  </div>
                ) : (
                  <button
                    onClick={handleToggleStar}
                    disabled={starLoading}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-body-sm font-bold rounded-button border transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-mono ${
                      project.starred
                        ? 'bg-accent/10 text-accent border-accent/50 hover:bg-accent/15 hover:shadow-[0_0_20px_-5px_rgba(239,228,206,0.3)]'
                        : 'bg-transparent text-text border-accent/30 hover:border-accent hover:bg-surface'
                    }`}
                  >
                    {starLoading ? (
                      t('details.cta.starring')
                    ) : project.starred ? (
                      <>
                        <Icon.StarFilled className="w-4 h-4" />
                        {t('details.cta.starred', { count: formatCount(project.stars) })}
                      </>
                    ) : (
                      <>
                        <Icon.Star className="w-4 h-4" />
                        {t('details.cta.star', { count: formatCount(project.stars) })}
                      </>
                    )}
                  </button>
                )}

                {joinButtonIsLeave ? (
                  <button
                    onClick={handleLeaveClick}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-body-sm font-semibold text-red-400 bg-transparent border border-red-400/30 rounded-button hover:bg-red-400/10 hover:border-red-400/60 transition-all cursor-pointer font-mono"
                  >
                    <Icon.Logout className="w-4 h-4" />
                    {joinButtonLabel}
                  </button>
                ) : (
                  <button
                    onClick={handleJoinClick}
                    disabled={joinButtonDisabled}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-accent text-bg text-body-sm font-bold rounded-button border border-accent hover:bg-accent/90 transition-all hover:shadow-[0_0_30px_-5px_rgba(239,228,206,0.4)] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-accent disabled:hover:shadow-none font-mono"
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
          </div>
        </div>

        {/* ALT İÇERİK */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-8">

            {(project.githubUrl || project.demoUrl) && (
              <div>
                <h2 className="text-caption font-bold text-text uppercase tracking-wider mb-3 font-mono">
                  {t('details.section.links')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-body-sm font-medium text-text-muted bg-surface border border-accent/15 rounded-pill hover:border-accent hover:text-text transition-all font-mono"
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
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-body-sm font-medium text-text-muted bg-surface border border-accent/15 rounded-pill hover:border-accent hover:text-text transition-all font-mono"
                    >
                      <Icon.ExternalLink className="w-4 h-4" />
                      demo
                    </a>
                  )}
                </div>
              </div>
            )}

            {project.contributorsList && project.contributorsList.length > 0 && (
              <div>
                <h2 className="text-caption font-bold text-text uppercase tracking-wider mb-3 font-mono">
                  {t('details.section.contributors', {
                    count: project.contributorsList.length,
                    max: project.maxContributors,
                  })}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.contributorsList.map((contributor) => (
                    <ContributorCard
                      key={contributor.user_id}
                      contributor={contributor}
                      onRemove={
                        isAuthor
                          ? () => handleOpenRemoveModal(contributor)
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-caption font-bold text-text uppercase tracking-wider mb-3 font-mono">
                {t('details.section.about')}
              </h2>
              <p className="text-text-muted leading-relaxed text-body whitespace-pre-line">
                {project.longDescription || project.description}
              </p>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-20 space-y-4">

              <div className="bg-surface/50 border border-accent/10 rounded-card p-5">
                <h3 className="text-caption font-bold text-text uppercase tracking-wider mb-3 font-mono">
                  {t('details.section.info')}
                </h3>
                <dl className="space-y-2.5 text-body-sm">
                  <div className="flex items-center justify-between">
                    <dt className="text-text-muted font-mono">{t('details.meta.stars')}</dt>
                    <dd className="font-medium text-text font-mono tabular-nums inline-flex items-center gap-1">
                      <Icon.StarFilled className="w-3.5 h-3.5 text-text-muted" />
                      {formatCount(project.stars)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-text-muted font-mono">{t('details.meta.contributors')}</dt>
                    <dd className="font-medium text-text font-mono tabular-nums inline-flex items-center gap-1">
                      <Icon.Users className="w-3.5 h-3.5 text-text-muted" />
                      {project.contributorsList?.length || 0}
                      <span className="text-text-muted">/ {project.maxContributors}</span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between pt-2.5 border-t border-accent/10">
                    <dt className="text-text-muted font-mono">{t('details.meta.status')}</dt>
                    <dd className="font-medium text-accent font-mono">{project.status}</dd>
                  </div>
                </dl>
              </div>

              <div className="bg-surface/50 border border-accent/10 rounded-card p-5">
                <h3 className="text-caption font-bold text-text uppercase tracking-wider mb-3 font-mono">
                  {t('details.section.share')}
                </h3>
                <div className="flex items-center gap-2">

                  <button
                    onClick={handleCopyLink}
                    className="group relative flex flex-col items-center gap-1.5 flex-1 py-3 rounded-button bg-bg/60 border border-accent/15 hover:border-accent/60 hover:bg-bg transition-all cursor-pointer"
                    aria-label={t('details.share.copy')}
                  >
                    <span className="text-text-muted group-hover:text-accent transition-colors">
                      {copied ? (
                        <Icon.Check className="w-4 h-4" />
                      ) : (
                        <Icon.Link className="w-4 h-4" />
                      )}
                    </span>
                    <span className="text-mono-sm font-mono text-text-muted group-hover:text-text transition-colors">
                      {copied ? t('details.share.copied') : t('details.share.link')}
                    </span>
                  </button>

                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(project.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center gap-1.5 flex-1 py-3 rounded-button bg-bg/60 border border-accent/15 hover:border-accent/60 hover:bg-bg transition-all cursor-pointer"
                    aria-label={t('details.share.twitter')}
                  >
                    <span className="text-text-muted group-hover:text-accent transition-colors">
                      <Icon.Twitter className="w-4 h-4" />
                    </span>
                    <span className="text-mono-sm font-mono text-text-muted group-hover:text-text transition-colors">
                      {t('details.share.twitter')}
                    </span>
                  </a>
                </div>
              </div>

            </div>
          </aside>
        </div>

      </div>

      {/* Modallar */}
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

      <RemoveContributorModal
        isOpen={isRemoveModalOpen}
        onClose={handleCloseRemoveModal}
        onConfirm={handleRemoveContributor}
        username={removeTarget?.username || ''}
        submitting={removeSubmitting}
      />

      {/* [YENİ] Proje silme onay modalı — native confirm() yerine */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title={t('details.delete')}
        description={t('details.delete_confirm')}
        confirmLabel={t('details.delete')}
        submittingLabel={t('details.deleting')}
        submitting={deleting}
        variant="danger"
        icon="trash"
        countdown={3}
      />
    </div>
  );
}