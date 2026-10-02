// ═══════════════════════════════════════════════════════════
// TRANSLATIONS — Merkezi çeviri index'i
// ═══════════════════════════════════════════════════════════
//
// Yapı:
//   translations[lang][namespace][key] = 'metin'
//
// Diller ayrı dosyalarda:
//   en.js → İngilizce
//   tr.js → Türkçe
// ═══════════════════════════════════════════════════════════

import { en } from "./en";
import { tr } from "./tr";

export const translations = { en, tr };

// ═══════════════════════════════════════════════════════════
// YARDIMCI FONKSİYON: objeden key ile değer okuma
// ═══════════════════════════════════════════════════════════
export function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

// ═══════════════════════════════════════════════════════════
// YARDIMCI FONKSİYON: placeholder değiştirme
// ═══════════════════════════════════════════════════════════
export function interpolate(str, params) {
  if (!params || typeof str !== "string") return str;
  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return params[key] !== undefined ? params[key] : `{{${key}}}`;
  });
}
