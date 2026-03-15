'use client';

/**
 * 收藏按钮 — 产品卡片 / 产品详情页用
 * ─────────────────────────────────────────────────────────────────
 * 小爱心图标，点击切换收藏状态
 * 已收藏时填充 #C8B69E，未收藏时空心
 */

import { useWishlist, type WishlistItem } from '@/lib/wishlist-context';
import { useCallback, useState } from 'react';

interface WishlistButtonProps {
  product: Omit<WishlistItem, 'addedAt'>;
  size?: number;
  /** 按钮样式变体 */
  variant?: 'icon' | 'floating';
  className?: string;
}

export default function WishlistButton({
  product,
  size = 18,
  variant = 'icon',
  className = '',
}: WishlistButtonProps) {
  const { isInWishlist, toggleItem } = useWishlist();
  const active = isInWishlist(product.productId);
  const [animating, setAnimating] = useState(false);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setAnimating(true);
      toggleItem(product);
      setTimeout(() => setAnimating(false), 400);
    },
    [product, toggleItem],
  );

  if (variant === 'floating') {
    return (
      <button
        onClick={handleClick}
        className={className}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 2,
          background: 'rgba(255,255,255,0.85)',
          border: 'none',
          borderRadius: '50%',
          width: 36,
          height: 36,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(4px)',
          transition: 'transform 0.3s ease, background 0.2s',
          transform: animating ? 'scale(1.2)' : 'scale(1)',
        }}
        aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={active ? '#C8B69E' : 'none'}
          stroke={active ? '#C8B69E' : '#1a1a1a'}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transition: 'all 0.3s ease',
          }}
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 20.9l7.84-7.84a5.5 5.5 0 0 0 0-7.45z" />
        </svg>
      </button>
    );
  }

  // Default: icon variant (for header, product detail page)
  return (
    <button
      onClick={handleClick}
      className={className}
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 4,
        lineHeight: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.3s ease',
        transform: animating ? 'scale(1.25)' : 'scale(1)',
      }}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={active ? '#C8B69E' : 'none'}
        stroke={active ? '#C8B69E' : 'currentColor'}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ transition: 'all 0.3s ease' }}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 20.9l7.84-7.84a5.5 5.5 0 0 0 0-7.45z" />
      </svg>
    </button>
  );
}
