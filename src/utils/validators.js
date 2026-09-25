// Ortak form validasyon kuralları ve yardımcı fonksiyonlar.
// Tüm formlar (CreateProject, EditProject, Settings) buradan import eder.

// ✅ Başlık / Kullanıcı Adı: sadece harf, rakam, _ . ve boşluk
export const TITLE_REGEX = /^[a-zA-Z0-9çÇğĞıİöÖşŞüÜ_. ]*$/;
export const USERNAME_REGEX = /^[a-zA-Z0-9çÇğĞıİöÖşŞüÜ_. ]*$/;

// ✅ Açıklamalar / Bio: harf, rakam, noktalama, boşluk (emoji/CJK yok)
export const TEXT_REGEX = /^[a-zA-Z0-9çÇğĞıİöÖşŞüÜ.,!?;:'"()\[\]{}\-_/|@#$%&*+=~\s]*$/;
export const BIO_REGEX = /^[a-zA-Z0-9çÇğĞıİöÖşŞüÜ.,!?;:'"()\[\]{}\-_/|@#$%&*+=~\s]*$/;

// ✅ Artık özel karakter/emoji girilemediği için length güvenli
export function charCount(str) {
  return str.length;
}

// ✅ Geçersiz karakteri bulur (uyarı mesajı için)
export function findInvalidChar(value, regex) {
  for (const char of value) {
    if (!regex.test(char)) return char;
  }
  return null;
}

// ✅ URL geçerli mi? (sadece http/https)
export function isValidUrl(str) {
  if (!str) return true;
  try {
    const u = new URL(str);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}