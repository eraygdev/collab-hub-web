import { Link } from 'react-router-dom';

// Proje detay sayfasında katkıcı kartı (avatar + username).
export default function ContributorCard({ contributor }) {
  return (
    <Link
      to={`/profile/${contributor.username}`}
      className="flex items-center gap-2.5 px-3 py-2 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group"
    >
      <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-200 overflow-hidden shrink-0">
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
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-medium text-black truncate group-hover:text-gray-700 transition-colors">
          {contributor.username}
        </p>
        <p className="text-[10px] text-gray-400">Katkıcı</p>
      </div>
    </Link>
  );
}