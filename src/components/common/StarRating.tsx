import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number | null;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (val: number) => void;
  showText?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onChange,
  showText = true,
}) => {
  const currentRating = rating ?? 0;

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    const isFull = currentRating >= i;
    const isHalf = !isFull && currentRating >= i - 0.5;

    stars.push(
      <button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => {
          if (interactive && onChange) {
            // If already clicking same star, allow toggling half or full
            if (currentRating === i) {
              onChange(i - 0.5);
            } else {
              onChange(i);
            }
          }
        }}
        className={`relative transition-transform ${
          interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
        } focus:outline-none`}
        title={`${i} Stars`}
      >
        {isFull ? (
          <Star className={`${starSizes[size]} fill-amber-400 text-amber-400`} />
        ) : isHalf ? (
          <div className="relative">
            <Star className={`${starSizes[size]} text-slate-300`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${starSizes[size]} fill-amber-400 text-amber-400`} />
            </div>
          </div>
        ) : (
          <Star className={`${starSizes[size]} text-slate-300`} />
        )}
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 select-none">
      <div className="flex items-center gap-0.5">{stars}</div>
      {showText && (
        <span className="text-xs font-bold text-slate-700 ml-0.5">
          {rating !== null ? Number(rating).toFixed(1) : 'Not rated'}
        </span>
      )}
    </div>
  );
};
