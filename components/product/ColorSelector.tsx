'use client';

/**
 * ColorSelector — 纯色纽扣式颜色选择器
 * ─────────────────────────────────────────────────────────────────
 * 每个色块为纯色圆形，选中时外圈显示品牌金色环。
 * 不使用 Shopify swatch image，只用纯色值。
 */

import { useId } from 'react';
import { getSwatchBackground } from '@/utils/getSwatchBackground';

export interface OptionValueWithSwatch {
  name: string;
  swatch?: {
    image?: { previewImage?: { url: string } };
    color?: string;
  } | null;
}

interface ColorSelectorProps {
  colorOptions: OptionValueWithSwatch[];
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export default function ColorSelector({
  colorOptions,
  selectedColor,
  onColorChange,
}: ColorSelectorProps) {
  const scopeId = `cs${useId().replace(/:/g, '')}`;

  if (colorOptions.length === 0) return null;

  const css = `
    #${scopeId}{margin-bottom:24px}
    #${scopeId} .cs-row{display:flex;gap:16px;flex-wrap:wrap}
    #${scopeId} .cs-item{
      display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer
    }
    #${scopeId} .cs-ring{
      width:48px;height:48px;border-radius:50%;
      display:flex;align-items:center;justify-content:center;
      border:2px solid transparent;
      transition:border-color 0.3s ease;
      padding:3px
    }
    #${scopeId} .cs-ring.active{
      border-color:#C8B69E
    }
    #${scopeId} .cs-swatch{
      width:100%;height:100%;border-radius:50%;
      box-shadow:inset 0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.05);
      border:1px solid rgba(0,0,0,0.1);
      transition:transform 0.2s ease,box-shadow 0.2s ease
    }
    #${scopeId} .cs-item:hover .cs-swatch{
      transform:scale(1.08);
      box-shadow:inset 0 2px 4px rgba(0,0,0,0.12),0 2px 8px rgba(0,0,0,0.1)
    }
    #${scopeId} .cs-ring.active .cs-swatch{
      box-shadow:inset 0 2px 4px rgba(0,0,0,0.15),0 1px 3px rgba(0,0,0,0.08)
    }
    #${scopeId} .cs-label{
      font-family:var(--font-montserrat);font-weight:400;font-size:9px;
      letter-spacing:0.06em;color:#aaa;text-transform:uppercase;
      transition:color 0.2s ease;white-space:nowrap;max-width:56px;
      overflow:hidden;text-overflow:ellipsis;text-align:center
    }
    #${scopeId} .cs-item:hover .cs-label{color:#888}
    #${scopeId} .cs-ring.active+.cs-label{color:#1a1a1a;font-weight:500}
  `;

  return (
    <div id={scopeId}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="cs-row">
        {colorOptions.map((opt) => {
          const active =
            selectedColor.toLowerCase().trim() === opt.name.toLowerCase().trim();
          const bg = getSwatchBackground(opt.swatch, opt.name);

          return (
            <div
              key={opt.name}
              className="cs-item"
              onClick={() => onColorChange(opt.name)}
              role="button"
              tabIndex={0}
              aria-label={opt.name}
              aria-pressed={active}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onColorChange(opt.name);
                }
              }}
            >
              <div className={`cs-ring${active ? ' active' : ''}`}>
                <div
                  className="cs-swatch"
                  style={{ backgroundColor: bg ?? '#b0a99f' }}
                />
              </div>
              <span className="cs-label">{opt.name.replace(/-/g, ' ')}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
