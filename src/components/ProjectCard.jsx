import React, { useState, useRef, useEffect } from 'react';

export default function ProjectCard({ project }) {
  const categories = project.categories || [];
  
  const [visibleCount, setVisibleCount] = useState(categories.length);
  const containerRef = useRef(null);

  useEffect(() => {
    function calculateVisible() {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.offsetWidth;
      
      let currentWidth = 0;
      let count = 0;
      const badgeWidthEstimate = 75; 
      const plusBadgeWidth = 40;

      for (let i = 0; i < categories.length; i++) {
        const needed = currentWidth + badgeWidthEstimate + (i < categories.length - 1 ? plusBadgeWidth : 0);
        if (needed <= containerWidth) {
          currentWidth += badgeWidthEstimate + 6; // gap-1.5 (yaklaşık 6px)
          count++;
        } else {
          break;
        }
      }

      setVisibleCount(Math.max(1, count));
    }

    calculateVisible();
    window.addEventListener('resize', calculateVisible);
    return () => window.removeEventListener('resize', calculateVisible);
  }, [categories]);

  const visibleCategories = categories.slice(0, visibleCount);
  const hiddenCount = categories.length - visibleCount;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer h-full">
      {/* Görsel Yer Tutucusu */}
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 shrink-0">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>

      {/* Kart Gövdesi */}
      <div className="p-4 flex flex-col flex-1">
        {/* Başlık */}
        <h3 className="text-base font-bold text-black mb-2 tracking-tight line-clamp-2 min-h-[3rem]">
          {project.title}
        </h3>

        {/* Açıklama */}
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Kategori Baloncukları Alanı */}
        <div ref={containerRef} className="mt-auto pt-3 border-t border-gray-100 flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
          {visibleCategories.map((cat, index) => (
            <span
              key={index}
              className="px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-800 rounded-full truncate shrink-0"
            >
              {cat}
            </span>
          ))}
          
          {hiddenCount > 0 && (
            <span className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-400 rounded-full shrink-0">
              +{hiddenCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}