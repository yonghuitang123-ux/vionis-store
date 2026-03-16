'use client';

/**
 * SizeSelector — 尺码选择器
 */

import type { CSSProperties } from 'react';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string | null;
  onSizeChange: (size: string) => void;
  /** 检查某尺码对应变体是否缺货 */
  isOutOfStock?: (size: string) => boolean;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSizeChange,
  isOutOfStock = () => false,
}: SizeSelectorProps) {
  if (sizes.length === 0) return null;

  return (
    <div style={wrapperStyle}>
      <div style={buttonRowStyle}>
        {sizes.map((val) => {
          const active = selectedSize === val;
          const outOfStock = isOutOfStock(val);

          return (
            <button
              key={val}
              type="button"
              onClick={() => !outOfStock && onSizeChange(val)}
              disabled={!!outOfStock}
              style={{
                ...buttonStyle,
                border: outOfStock
                  ? '1px solid #ddd'
                  : active
                    ? '1.5px solid #1a1a1a'
                    : '1px solid rgba(0,0,0,0.15)',
                backgroundColor: outOfStock ? '#e8e8e8' : active ? '#1a1a1a' : 'transparent',
                color: outOfStock ? '#767676' : active ? '#fff' : '#1a1a1a',
                cursor: outOfStock ? 'not-allowed' : 'pointer',
                textDecoration: outOfStock ? 'line-through' : 'none',
                opacity: outOfStock ? 0.7 : 1,
              }}
              aria-label={val}
              aria-pressed={active}
              aria-disabled={outOfStock}
            >
              {val}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const wrapperStyle: CSSProperties = {
  marginBottom: 24,
};

const buttonRowStyle: CSSProperties = {
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
};

const buttonStyle: CSSProperties = {
  minWidth: 48,
  padding: '10px 16px',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 12,
  fontWeight: 400,
  letterSpacing: '0.04em',
  transition: 'all 0.2s ease',
};
