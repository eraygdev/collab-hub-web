import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const MAX_VISIBLE = 3;

function ProjectCard({ project, showAuthor = true }) {
  const categories = project.categories || [];
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const visibleCategories = useMemo(
    () => categories.slice(0, MAX_VISIBLE),
    [categories]
  );
  const hiddenCount = useMemo(
    () => Math.max(0, categories.length - MAX_VISIBLE),
    [categories]
  );

  const showImage = project.imageUrl && !imageError;

  return (
    <div
      onClick={() => navigate(`/project/${project.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/project/${project.id}`)}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
    >
      {/* Kapak görseli */}
      <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 shrink-0 overflow-hidden">
        {showImage ? (
          <img
            src={project.imageUrl}
            alt={project.title}
            loading="lazy"
            decoding="async"
            width="400"
            height="300"
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
        )}

        {/* Yıldız badge */}
        {project.stars !== undefined && (
          <div
            className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold backdrop-blur-sm rounded-full ${
              project.starred
                ? 'text-black bg-amber-400'
                : 'text-white bg-black/70'
            }`}
          >
            <span>{project.starred ? '★' : '⭐'}</span>
            <span className="tabular-nums">{project.stars}</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        {showAuthor && project.author && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="w-4 h-4 rounded-full bg-gray-200 overflow-hidden shrink-0">
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
                  <svg className="w-2.5 h-2.5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
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
              className="text-xs text-gray-500 hover:text-black hover:underline truncate cursor-pointer"
            >
              {project.author}
            </span>
          </div>
        )}

        <h3 className="text-base font-bold text-black mb-2 tracking-tight line-clamp-2 min-h-[3rem]">
          {project.title}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
          {project.description}
        </p>

        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
          {visibleCategories.map((cat, index) => (
            <span
              key={index}
              className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full shrink-0"
            >
              {cat}
            </span>
          ))}

          {hiddenCount > 0 && (
            <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-300 rounded-full shrink-0">
              +{hiddenCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// React.memo ile gereksiz render'ları önle
export default React.memo(ProjectCard);