// Kart listesi yüklenirken gösterilen iskelet grid.
// Home, Dashboard, Profile hepsi aynı pattern'i kullanıyor.
export default function CardSkeletonGrid({ count = 8, isCompact = false, gridClass }) {
  const grid =
    gridClass ||
    (isCompact
      ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
      : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6');

  const height = isCompact ? 'h-40' : 'h-72';

  return (
    <div className={grid}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className={`${height} rounded-card bg-surface/40 border border-accent/10 animate-pulse`}
        />
      ))}
    </div>
  );
}