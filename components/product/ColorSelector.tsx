'use client';

/**
 * ColorSelector — 颜色选择器（色块 swatch）
 */

import { getSwatchColor } from '@/constants/colorSwatches';
import type { CSSProperties } from 'react';

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string | null;
  onColorChange: (color: string) => void;
}

export default function ColorSelector({
  colors,
  selectedColor,
  onColorChange,
}: ColorSelectorProps) {
  if (colors.length === 0) return null;

  return (
    <div style={wrapperStyle}>
      <div style={swatchRowStyle}>
        {colors.map((val) => {
          const active = selectedColor === val;
          return (
            <button
              key={val}
              type="button"
              title={val}
              onClick={() => onColorChange(val)}
              style={{
                ...swatchStyle,
                backgroundColor: getSwatchColor(val),
                border: active
                  ? '2px solid #1a1a1a'
                  : '1px solid rgba(0,0,0,0.15)',
                outline: active ? '2px solid #E8DFD6' : 'none',
                outlineOffset: 1,
              }}
              aria-label={val}
              aria-pressed={active}
            />
          );
        })}
      </div>
    </div>
  );
}

const wrapperStyle: CSSProperties = {
  marginBottom: 24,
};

const swatchRowStyle: CSSProperties = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
};

const swatchStyle: CSSProperties = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  padding: 0,
  cursor: 'pointer',
  transition: 'border-color 0.2s, outline 0.2s',
};
