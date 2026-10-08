import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "reporeef:scale";
const DEFAULT_SCALE = "md";

// Desteklenen ölçek seviyeleri: --scale-factor değerleri
const SCALE_VALUES = {
  sm: 0.9,
  md: 1,
  lg: 1.15,
};

// localStorage'dan oku
function readScale() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SCALE_VALUES[stored] !== undefined) return stored;
  } catch {
    // localStorage erişilemezse sessizce geç (private mode, kota dolu)
  }
  return DEFAULT_SCALE;
}

// DOM'a uygula
function applyScale(scaleKey) {
  const factor = SCALE_VALUES[scaleKey] ?? 1;
  document.documentElement.style.setProperty("--scale-factor", String(factor));
}

// Yazı boyutu tercihini yönetir.
// Kullanım:
//   const { scale, setScale, reset } = useScale();
//   setScale('lg'); // büyük
export function useScale() {
  const [scale, setScaleState] = useState(readScale);

  // Mount'ta uygula (FOUC önleme için index.html'de de inline script olabilir)
  useEffect(() => {
    applyScale(scale);
  }, [scale]);

  const setScale = useCallback((next) => {
    if (SCALE_VALUES[next] === undefined) return;
    setScaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage erişilemezse sessizce geç (private mode, kota dolu)
    }
  }, []);

  const reset = useCallback(() => {
    setScaleState(DEFAULT_SCALE);
    try {
      localStorage.setItem(STORAGE_KEY, DEFAULT_SCALE);
    } catch {
      // localStorage erişilemezse sessizce geç (private mode, kota dolu)
    }
  }, []);

  return { scale, setScale, reset };
}

// Uygulama başlarken çağrılır (main.jsx veya App.jsx içinde).
// Sayfa yüklenmeden önce doğru ölçeği uygular.
export function initScale() {
  const initial = readScale();
  applyScale(initial);
  return initial;
}
