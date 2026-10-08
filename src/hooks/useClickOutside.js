import { useEffect } from "react";

// Bir elementin dışına tıklanınca veya ESC basılınca callback çalıştırır.
//
// Kullanım:
//   const ref = useRef(null);
//   useClickOutside(ref, () => setOpen(false), isOpen);
export function useClickOutside(ref, onOutside, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onOutside();
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") onOutside();
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [ref, onOutside, enabled]);
}
