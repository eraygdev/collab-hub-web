// Kalan karakteri gösteren küçük yardımcı bileşen.
export default function CharCounter({ current, max, id }) {
  const remaining = max - current;
  const isNearLimit = remaining <= 20 && remaining >= 0;
  const isOverLimit = remaining < 0;

  return (
    <span
      id={id}
      className={`text-[11px] tabular-nums ${
        isOverLimit
          ? 'text-red-500 font-semibold'
          : isNearLimit
          ? 'text-amber-600'
          : 'text-gray-400'
      }`}
    >
      {current} / {max}
    </span>
  );
}