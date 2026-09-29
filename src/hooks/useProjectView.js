import { useState, useCallback } from "react";

const STORAGE_KEY = "projectView";
const DEFAULT_VIEW = "normal";

// localStorage'dan güvenli okuma
function readView() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "normal" || stored === "compact") return stored;
  } catch {}
  return DEFAULT_VIEW;
}

// Proje kartı görünüm tercihi: 'normal' | 'compact'
export function useProjectView() {
  const [view, setViewState] = useState(readView);

  const setView = useCallback((newView) => {
    if (newView !== "normal" && newView !== "compact") return;
    setViewState(newView);
    try {
      localStorage.setItem(STORAGE_KEY, newView);
    } catch {}
  }, []);

  return {
    view, // 'normal' | 'compact'
    isCompact: view === "compact",
    setView,
  };
}
