// Username'den deterministik hue üretir.
// Aynı kullanıcı her zaman aynı rengi alır. Marka paletiyle uyumlu 2 hue.
export function getHueFromUsername(username) {
  if (!username) return 40;
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hues = [40, 215];
  return hues[Math.abs(hash) % hues.length];
}
