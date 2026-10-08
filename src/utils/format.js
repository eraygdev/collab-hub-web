// Büyük sayıları kısaltır.
// 1234 → "1.2K", 30000 → "30K", 1500000 → "1.5M", 3000000 → "3M"
// 1000 altındaki sayılar aynen döner: 42 → "42"
export function formatCount(num) {
  if (num === null || num === undefined) return "0";
  const n = Number(num);
  if (Number.isNaN(n)) return "0";

  if (n < 1000) return String(n);

  if (n < 1_000_000) {
    const k = n / 1000;
    // 30.0 → "30K", 1.5 → "1.5K", 1.23 → "1.2K"
    return (k < 10 ? k.toFixed(1).replace(/\.0$/, "") : Math.floor(k)) + "K";
  }

  if (n < 1_000_000_000) {
    const m = n / 1_000_000;
    return (m < 10 ? m.toFixed(1).replace(/\.0$/, "") : Math.floor(m)) + "M";
  }

  const b = n / 1_000_000_000;
  return (b < 10 ? b.toFixed(1).replace(/\.0$/, "") : Math.floor(b)) + "B";
}
