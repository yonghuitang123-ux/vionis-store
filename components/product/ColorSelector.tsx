'use client';

/**
 * ColorSelector — 颜色选择器（Shopify 原生 swatch）
 * ─────────────────────────────────────────────────────────────────
 * 使用 optionValues[].swatch：image 用图片背景，color 用 RGB/hex 背景。
 * 与 swatch.liquid / swatch-input.liquid 逻辑一致。
 */

import { getSwatchBackground } from '@/utils/getSwatchBackground';
import type { CSSProperties } from 'react';

export interface OptionValueWithSwatch {
  name: string;
  swatch?: {
    image?: { previewImage?: { url: string } };
    color?: string;
  } | null;
}

interface ColorSelectorProps {
  /** 从 options 中提取的 Color 选项的 optionValues（含 swatch） */
  colorOptions: OptionValueWithSwatch[];
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorSelector({
  colorOptions,
  selectedColor,
  onColorChange,
}: ColorSelectorProps) {
  if (colorOptions.length === 0) return null;

  return (
    <div style={wrapperStyle}>
      <div style={swatchRowStyle}>
        {colorOptions.map((opt) => {
          const active =
            selectedColor.toLowerCase().trim() === opt.name.toLowerCase().trim();
          const background = getSwatchBackground(opt.swatch);

          return (
            <button
              key={opt.name}
              type="button"
              title={opt.name}
              onClick={() => onColorChange(opt.name)}
              style={
                {
                  ...swatchBtnStyle,
                  '--swatch-background': background ?? 'transparent',
                  outline: active ? '2px solid #1a1a1a' : '2px solid transparent',
                  outlineOffset: 2,
                  opacity: !background ? 0.4 : 1,
                  cursor: !background ? 'not-allowed' : 'pointer',
                } as CSSProperties & { '--swatch-background'?: string }
              }
              className={!background ? 'swatch-btn--unavailable' : ''}
              aria-label={opt.name}
              aria-pressed={active}
              disabled={!background}
            >
              {!background && (
                <span style={fallbackTextStyle}>{opt.name.replace(/-/g, ' ')}</span>
              )}
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

const swatchRowStyle: CSSProperties = {
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap',
};

const swatchBtnStyle: CSSProperties = {
  width: 32,
  height: 32,
  padding: 0,
  border: '1px solid rgba(0,0,0,0.15)',
  borderRadius: '50%',
  overflow: 'hidden',
  background: 'var(--swatch-background)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transition: 'outline 0.2s ease',
};

const fallbackTextStyle: CSSProperties = {
  fontSize: 9,
  fontWeight: 500,
  color: '#1a1a1a',
  textTransform: 'capitalize',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  padding: '0 2px',
  textAlign: 'center',
  lineHeight: 1.2,
};
