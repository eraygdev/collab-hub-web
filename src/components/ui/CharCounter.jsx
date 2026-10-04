// Karakter sayacı — palette uyumlu renkler + orantılı eşik.
//
// Eşik mantığı:
//   remaining > max * 0.1   → normal (text-muted)
//   remaining <= max * 0.1  → uyarı (accent)
//   remaining < 0           → aşım (kırmızı)
export default function CharCounter({ value = '', max, id }) {
  const current = value.length;
  const remaining = max - current;

  // Eşik: max'ın %10'u (en az 5, en fazla 20)
  const warnThreshold = Math.min(Math.max(Math.floor(max * 0.1), 5), 20);

  const isNearLimit = remaining <= warnThreshold && remaining >= 0;
  const isOverLimit = remaining < 0;

  return (
    <span
      id={id}
      className={`text-mono-sm tabular-nums font-mono transition-colors ${
        isOverLimit
          ? 'text-red-400 font-semibold'
          : isNearLimit
          ? 'text-accent'
          : 'text-text-muted'
      }`}
    >
      {current} / {max}
    </span>
  );
}