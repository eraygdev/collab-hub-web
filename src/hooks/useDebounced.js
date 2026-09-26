import { useState, useEffect, useRef } from 'react';

// Bir değeri geciktirerek döner (debounce) — her karakterde işlem yapmayı önler.
export function useDebounced(value, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  const timerRef = useRef(null);

  useEffect(() => {
    // ✅ Önceki timer'ı temizle
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [value, delay]);

  return debounced;
}