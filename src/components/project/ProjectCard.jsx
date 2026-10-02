import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icon from '../ui/Icons';

const MAX_VISIBLE = 3;
const MAX_VISIBLE_COMPACT = 2;

function ProjectCard({ project, showAuthor = true, compact = false }) {
  const categories = project.categories || [];
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const visibleCategories = useMemo(
    () => categories.slice(0, compact ? MAX_VISIBLE_COMPACT : MAX_VISIBLE),
    [categories, compact]
  );
  const hiddenCount = useMemo(
    () => Math.max(0, categories.length - (compact ? MAX_VISIBLE_COMPACT : MAX_VISIBLE)),
    [categories, compact]
  );

  const showImage = project.imageUrl && !imageError;

  return (
    <div
      onClick={() => navigate(`/project/${project.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/project/${project.id}`)}
      className="group/card bg-surface border border-accent/10 rounded-2xl overflow-hidden hover:border-accent/40 hover:shadow-[0_0_30px_-8px_rgba(239,228,206,0.2)] hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {/* Kapak görseli */}
      <div
        className={`relative w-full bg-bg flex items-center justify-center text-text-muted shrink-0 overflow-hidden border-b border-accent/10 ${
          compact ? 'h-28' : 'h-48'
        }`}
      >
        {showImage ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            loading="lazy"
            decoding="async"
            width="400"
            height="300"
            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <Icon.Image className={compact ? 'w-6 h-6' : 'w-10 h-10'} />
        )}

        {/* Yıldız badge */}
        {project.stars !== undefined && (
          <div
            className={`absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono font-semibold rounded-full border backdrop-blur-sm transition-all ${
              project.starred
                ? 'text-accent bg-accent/10 border-accent/50 shadow-[0_0_12px_-2px_rgba(239,228,206,0.3)]'
                : 'text-text-muted bg-bg/70 border-accent/20'
            }`}
          >
            {project.starred ? (
              <Icon.StarFilled className="w-3 h-3 text-accent drop-shadow-[0_0_4px_rgba(239,228,206,0.6)]" />
            ) : (
              <Icon.Star className="w-3 h-3" />
            )}
            <span className="tabular-nums">{project.stars}</span>
          </div>
        )}
      </div>

      <div className={`${compact ? 'p-3' : 'p-4'} flex flex-col flex-1`}>
        {/* Yazar */}
        {!compact && showAuthor && project.author && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-4 h-4 rounded-full bg-bg border border-accent/20 overflow-hidden shrink-0">
              {project.authorAvatar ? (
                <img
                  src={project.authorAvatar}
                  alt={project.author}
                  loading="lazy"
                  decoding="async"
                  width="16"
                  height="16"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Icon.User className="w-2.5 h-2.5 text-text-muted" />
                </div>
              )}
            </div>
            <span
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${project.author}`);
              }}
              className="text-xs text-text-muted hover:text-text transition-colors truncate cursor-pointer font-mono"
            >
              {project.author}
            </span>
          </div>
        )}

        {/* Başlık */}
        <h3
          className={`font-bold text-text tracking-tight ${
            compact
              ? 'text-sm line-clamp-2 min-h-[2.5rem] mb-2'
              : 'text-base line-clamp-2 min-h-[3rem] mb-2'
          }`}
        >
          {project.title}
        </h3>

        {/* Açıklama */}
        {!compact && (
          <p className="text-sm text-text-muted line-clamp-2 leading-relaxed mb-4">
            {project.description}
          </p>
        )}

        {/* Kategoriler */}
        <div
          className={`mt-auto ${
            compact ? 'pt-2' : 'pt-3'
          } border-t border-accent/10 flex items-center gap-1.5 overflow-hidden whitespace-nowrap`}
        >
          {visibleCategories.map((cat, index) => (
            <span
              key={index}
              className={`${
                compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
              } font-mono text-text-muted bg-bg/60 border border-accent/15 rounded-full shrink-0`}
            >
              {cat}
            </span>
          ))}

          {hiddenCount > 0 && (
            <span
              className={`${
                compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-xs'
              } font-mono font-semibold text-text bg-bg border border-accent/20 rounded-full shrink-0`}
            >
              +{hiddenCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default React.memo(ProjectCard);