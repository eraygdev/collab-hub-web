import { Link } from 'react-router-dom';

// Proje detay sayfasında katkıcı kartı (avatar + username).
export default function ContributorCard({ contributor }) {
  return (
    <Link
      to={`/profile/${contributor.username}`}
      className="flex items-center gap-2.5 px-3 py-2 bg-surface border border-accent/10 rounded-xl hover:border-accent/40 hover:bg-surface/80 transition-all group"
    >
      <div className="w-8 h-8 rounded-full bg-bg border border-accent/15 overflow-hidden shrink-0">
        {contributor.avatar_url ? (
          <img
            src={contributor.avatar_url}
            alt={contributor.username}
            loading="lazy"
            decoding="async"
            width="32"
            height="32"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-4 h-4 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-text truncate group-hover:text-accent transition-colors font-mono">
          {contributor.username}
        </p>
        <p className="text-[10px] text-text-muted font-mono">katkıcı</p>
      </div>
    </Link>
  );
}