import { useState } from 'react';
import * as Icon from './Icons';

// Ortak avatar bileşeni.
// - GitHub avatar'ı varsa gösterir, hata olursa User ikonuna düşer.
// - Yuvarlak (pill) veya kart (card) şeklinde olabilir.
//
// size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
// rounded: 'pill' (default) | 'card'
export default function Avatar({
  src,
  username,
  size = 'md',
  rounded = 'pill',
  className = '',
}) {
  const [error, setError] = useState(false);
  const showImage = src && !error;

  const SIZES = {
    xs:   { box: 'w-4 h-4',  icon: 'w-2.5 h-2.5', px: 16 },
    sm:   { box: 'w-5 h-5',  icon: 'w-3 h-3',     px: 20 },
    md:   { box: 'w-8 h-8',  icon: 'w-4 h-4',     px: 32 },
    lg:   { box: 'w-12 h-12', icon: 'w-6 h-6',    px: 48 },
    xl:   { box: 'w-16 h-16', icon: 'w-8 h-8',    px: 64 },
    '2xl': { box: 'w-20 h-20 sm:w-24 sm:h-24', icon: 'w-10 h-10', px: 96 },
  };

  const s = SIZES[size] || SIZES.md;
  const roundedClass = rounded === 'card' ? 'rounded-card' : 'rounded-pill';

  return (
    <div
      className={`${s.box} ${roundedClass} bg-bg border border-accent/15 overflow-hidden shrink-0 ${className}`}
    >
      {showImage ? (
        <img
          src={src}
          alt={username || ''}
          loading="lazy"
          decoding="async"
          width={s.px}
          height={s.px}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Icon.User className={`${s.icon} text-text-muted`} />
        </div>
      )}
    </div>
  );
}