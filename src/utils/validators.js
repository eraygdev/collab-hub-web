// Ortak form validasyon kuralları ve yardımcı fonksiyonlar.
// Tüm formlar (CreateProject, EditProject, Settings) buradan import eder.

// ✅ Başlık / Kullanıcı Adı: sadece harf, rakam, _ . ve boşluk
export const TITLE_REGEX = /^[a-zA-Z0-9çÇğĞıİöÖşŞüÜ_. ]*$/;
export const USERNAME_REGEX = /^[a-zA-Z0-9çÇğĞıİöÖşŞüÜ_.\- ]*$/;

// ✅ Açıklamalar / Bio: harf, rakam, noktalama, boşluk (emoji/CJK yok)
export const TEXT_REGEX =
  /^[a-zA-Z0-9çÇğĞıİöÖşŞüÜ.,!?;: ()\[\]{}|@#$%&*+=~\s\-]*$/;

export const BIO_REGEX =
  /^[a-zA-Z0-9çÇğĞıİöÖşŞüÜ.,!?;: ()\[\]{}|\/@#$%&*+=~\s\-]*$/;

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
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

// GitHub görsel URL'ini raw formata çevirir.
// Kullanıcı blob / raw / ?raw=true formatlarını yapıştırabilir.
// Geçersizse null döner.
export function normalizeGithubImageUrl(str) {
  if (!str) return "";
  let url = str.trim();

  // Protokol yoksa https:// ekle (sadece github domain'leri için)
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    if (
      url.startsWith("github.com/") ||
      url.startsWith("raw.githubusercontent.com/")
    ) {
      url = "https://" + url;
    }
  }

  url = url.split("?")[0].split("#")[0];

  if (url.startsWith("https://raw.githubusercontent.com/")) {
    return url;
  }

  const blobMatch = url.match(
    /^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/(blob|raw)\/(.+)$/,
  );
  if (blobMatch) {
    const [, user, repo, , rest] = blobMatch;
    return `https://raw.githubusercontent.com/${user}/${repo}/${rest}`;
  }

  return null;
}

// GitHub raw URL validasyonu. Boş string geçerli sayılır (opsiyonel alan).
export function isValidGithubImageUrl(str) {
  if (!str) return true;
  const normalized = normalizeGithubImageUrl(str);
  if (!normalized) return false;
  return /\.(png|jpe?g|gif|webp)$/i.test(normalized);
}

export const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

// Görselin boyutunu HEAD isteği ile kontrol eder.
// Fail-open: CORS/ağ hatasında ok: true döner (backend zaten kontrol ediyor).
export async function checkGithubImageSize(
  url,
  maxBytes = MAX_IMAGE_SIZE_BYTES,
) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (!res.ok) return { ok: true }; // fail-open
    const sizeHeader = res.headers.get("content-length");
    if (!sizeHeader) return { ok: true }; // bilinmiyorsa geç
    const size = parseInt(sizeHeader, 10);
    if (Number.isNaN(size)) return { ok: true };
    if (size > maxBytes) {
      return { ok: false, size };
    }
    return { ok: true, size };
  } catch {
    return { ok: true }; // CORS/ağ hatası → fail-open
  }
}

// GitHub repo URL'sini normalize eder.
// https:// olmadan da kabul eder, .git ve fazla path'i temizler.
export function normalizeGithubRepoUrl(str) {
  if (!str) return null;
  let url = str.trim();

  // Protokol yoksa https:// ekle
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    if (url.startsWith("github.com/")) {
      url = "https://" + url;
    }
  }

  // Query ve hash'i sil
  url = url.split("?")[0].split("#")[0];
  // .git ve sondaki / temizle
  url = url.replace(/\.git$/, "").replace(/\/$/, "");

  // github.com/user/repo formatını yakala
  const match = url.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) return null;

  return `https://github.com/${match[1]}/${match[2]}`;
}

// GitHub repo URL validasyonu (format kontrolü)
export function isValidGithubRepoUrl(str) {
  if (!str) return false;
  return normalizeGithubRepoUrl(str) !== null;
}
