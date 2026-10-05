import { Link } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';
import * as Icon from '../ui/Icons';

export default function ContributorCard({ contributor, onRemove }) {
  const { t } = useLanguage();

  return (
    <div className="relative group">
      <Link
        to={`/profile/${contributor.username}`}
        className="flex items-center gap-2.5 px-3 py-2 bg-surface border border-accent/10 rounded-card hover:border-accent/40 hover:bg-surface/80 transition-all"
      >
        <div className="w-8 h-8 rounded-pill bg-bg border border-accent/15 overflow-hidden shrink-0">
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
              <Icon.User className="w-4 h-4 text-text-muted" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-body-sm font-medium text-text truncate group-hover:text-accent transition-colors font-mono">
            {contributor.username}
          </p>
          <p className="text-mono-sm text-text-muted font-mono">
            {t('contributor_card.label')}
          </p>
        </div>
      </Link>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={t('remove_contributor.aria', { username: contributor.username })}
          className="absolute -top-1.5 -right-1.5 z-10 w-5 h-5 rounded-pill bg-surface border border-red-400/40 text-red-400 hover:bg-red-400 hover:text-bg hover:border-red-400 transition-all flex items-center justify-center cursor-pointer shadow-md"
        >
          <Icon.Close className="w-3 h-3" strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}