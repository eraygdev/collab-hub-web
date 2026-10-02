import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

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
          <svg
            className={compact ? 'w-6 h-6' : 'w-10 h-10'}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        )}

        {/* ✅ Yıldız badge — dolu/boş net ayrım */}
        {project.stars !== undefined && (
          <div
            className={`absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono font-semibold rounded-full border backdrop-blur-sm transition-all ${
              project.starred
                ? 'text-accent bg-accent/10 border-accent/50 shadow-[0_0_12px_-2px_rgba(239,228,206,0.3)]'
                : 'text-text-muted bg-bg/70 border-accent/20'
            }`}
          >
            {project.starred ? (
              /* Dolu yıldız — starred */
              <svg
                className="w-3 h-3 text-accent drop-shadow-[0_0_4px_rgba(239,228,206,0.6)]"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12 2.5l3.09 6.26L22 9.77l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.64l-5-4.87 6.91-1.01L12 2.5z" />
              </svg>
            ) : (
              /* Outline yıldız — not starred */
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.5a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
              </svg>
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
                  <svg className="w-2.5 h-2.5 text-text-muted" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
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