// ═══════════════════════════════════════════════════════════
// ERROR HANDLING
// Backend'den gelen error code'ları kullanıcıya gösterilebilir
// mesaja çevirir. i18n `errors:` namespace'ini kullanır.
// ═══════════════════════════════════════════════════════════

// getErrorMessage backend error code'unu i18n'den çevirir.
// Bulunamazsa generic mesaj döner.
export function getErrorMessage(errorCode, t) {
  if (!errorCode || typeof errorCode !== "string") {
    return t("errors.generic");
  }

  const key = `errors.${errorCode}`;
  const msg = t(key);

  // t() çeviriyi bulamazsa key'i döner
  return msg === key ? t("errors.generic") : msg;
}

// extractErrorMessage — res objesinden error code çıkarır.
// Response 4xx/5xx ise JSON'dan error alır, yoksa generic.
export async function extractErrorMessage(res, t) {
  try {
    const data = await res.json();
    return getErrorMessage(data?.error, t);
  } catch {
    return t("errors.generic");
  }
}
