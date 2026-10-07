// ─────────────────────────────────────────────────────────
// RepoReef Design Tokens
// Tek kaynaktan tüm tasarım kararları
// ─────────────────────────────────────────────────────────

/**
 * PALETTE
 * Orijinal palette'ten türetilmiş B+ varyasyonu:
 * #222831 → #161A22 (koyu)
 * #393E46 → #252A33 (koyu)
 * #948979 → #9E9381 (açık)
 * #DFD0B8 → #EFE4CE (açık)
 */
export const colors = {
  // Zeminler
  bg: "#161A22", // Sayfa arkaplanı (en koyu)
  surface: "#252A33", // Kart, container, dropdown
  surfaceHover: "#2E3440", // Kart hover (opsiyonel)

  // Metin
  text: "#EFE4CE", // Ana metin, başlık (en açık)
  textMuted: "#9E9381", // İkincil metin, etiket
  textFaint: "#6F6656", // Çok soluk (opsiyonel)

  // Border / çerçeve
  border: "rgba(239, 228, 206, 0.10)", // Default ince çerçeve
  borderHover: "rgba(239, 228, 206, 0.40)", // Hover
  borderFocus: "rgba(239, 228, 206, 0.60)", // Focus

  // Glow
  glow: "rgba(239, 228, 206, 0.30)",
  glowStrong: "rgba(239, 228, 206, 0.50)",

  // Anlamsal
  danger: "#E57373",
  success: "#81C784",
};

/**
 * FONTS
 * index.html'de Google Fonts link'i ile yüklenir.
 */
export const fonts = {
  sans: "'Inter', 'Manrope', system-ui, -apple-system, sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', ui-monospace, monospace",
  display: "'Carter One', 'Inter', system-ui, sans-serif", // Logo için
};

/**
 * RADIUS
 */
export const radius = {
  sm: "0.5rem", // 8px
  md: "0.75rem", // 12px
  lg: "1rem", // 16px
  xl: "1.25rem", // 20px
  "2xl": "1.5rem", // 24px
};

/**
 * SHADOWS / GLOWS
 */
export const shadows = {
  glowSoft: "0 0 20px -5px rgba(239, 228, 206, 0.15)",
  glow: "0 0 30px -8px rgba(239, 228, 206, 0.20)",
  glowStrong: "0 0 40px -8px rgba(239, 228, 206, 0.30)",
  ring: "0 0 0 4px rgba(239, 228, 206, 0.08)",
};
