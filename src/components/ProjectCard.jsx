import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const categories = project.categories || [];
  const navigate = useNavigate();

  const [visibleCount, setVisibleCount] = useState(categories.length);
  const containerRef = useRef(null);
  const badgeRefs = useRef([]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const GAP = 6; // gap-1.5
    const PLUS_BADGE_WIDTH = 40; // +X badge'inin yaklaşık genişliği

    const calculate = () => {
      const containerWidth = container.offsetWidth;
      const badges = badgeRefs.current.filter(Boolean);
      if (!badges.length) return;

      // Adım 1: Tüm badge'ler + gap toplamı sığıyor mu? (X olmadan)
      const widths = badges.map((b) => b.offsetWidth);
      const totalAll = widths.reduce((sum, w) => sum + w, 0) + GAP * (widths.length - 1);

      if (totalAll <= containerWidth) {
        setVisibleCount(categories.length);
        return;
      }

      // Adım 2: Sığmıyorsa, +X için yer ayırarak hesapla
      let used = 0;
      let count = 0;
      for (let i = 0; i < widths.length; i++) {
        const isLast = i === widths.length - 1;
        const gapCost = i > 0 ? GAP : 0;
        const reserveForPlus = !isLast ? PLUS_BADGE_WIDTH + GAP : 0;

        if (used + gapCost + widths[i] + reserveForPlus <= containerWidth) {
          used += gapCost + widths[i];
          count++;
        } else {
          break;
        }
      }

      setVisibleCount(Math.max(1, count));
    };

    // İlk ölçümü bir sonraki frame'e ertele (fontlar vs. yüklensin)
    const rafId = requestAnimationFrame(calculate);

    const observer = new ResizeObserver(calculate);
    observer.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [categories]);

  const visibleCategories = categories.slice(0, visibleCount);
  const hiddenCount = categories.length - visibleCount;

  return (
    <div
      onClick={() => navigate(`/project/${project.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/project/${project.id}`)}
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
    >
      <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400 shrink-0">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-base font-bold text-black mb-2 tracking-tight line-clamp-2 min-h-[3rem]">
          {project.title}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
          {project.description}
        </p>

        <div
          ref={containerRef}
          className="mt-auto pt-3 border-t border-gray-100 flex items-center gap-1.5 overflow-hidden whitespace-nowrap"
        >
          {/* Tüm badge'ler DOM'da kalır, sadece görsel olarak gizlenir → ölçüm doğru olur */}
          {categories.map((cat, index) => (
            <span
              key={index}
              ref={(el) => (badgeRefs.current[index] = el)}
              className={`px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full shrink-0 ${
                index < visibleCount ? '' : 'invisible absolute'
              }`}
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