'use client';

import React, { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface StarRatingProps {
  rating: number;
  size?: 'small' | 'medium' | 'large';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const SIZE_MAP = { small: 14, medium: 18, large: 24 } as const;
const FILLED = '#C8B69E';
const EMPTY = 'rgba(200,182,158,0.25)';

// ─── Single Star SVG ─────────────────────────────────────────────────────────

function Star({
  filled,
  half,
  px,
  onClick,
  onMouseEnter,
  interactive,
}: {
  filled: boolean;
  half: boolean;
  px: number;
  onClick?: () => void;
  onMouseEnter?: () => void;
  interactive?: boolean;
}) {
  const id = React.useId();
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={{ cursor: interactive ? 'pointer' : 'default', display: 'block' }}
      aria-hidden
    >
      {half && (
        <defs>
          <linearGradient id={`half-${id}`}>
            <stop offset="50%" stopColor={FILLED} />
            <stop offset="50%" stopColor={EMPTY} />
          </linearGradient>
        </defs>
      )}
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.27 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z"
        fill={half ? `url(#half-${id})` : filled ? FILLED : EMPTY}
      />
    </svg>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function StarRating({
  rating,
  size = 'medium',
  interactive = false,
  onChange,
}: StarRatingProps) {
  const px = SIZE_MAP[size];
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div
      style={{ display: 'inline-flex', gap: Math.round(px * 0.12) }}
      onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
      role={interactive ? 'radiogroup' : undefined}
      aria-label={interactive ? 'Select rating' : `${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = displayRating >= star;
        const half = !filled && displayRating >= star - 0.5;
        return (
          <Star
            key={star}
            filled={filled}
            half={half}
            px={px}
            interactive={interactive}
            onClick={interactive ? () => onChange?.(star) : undefined}
            onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
          />
        );
      })}
    </div>
  );
}
