'use client';

/**
 * ColorSelector — 奢华纽扣式颜色选择器
 * ─────────────────────────────────────────────────────────────────
 * 设计灵感：真实面料纽扣 + Loro Piana / Brunello Cucinelli 色卡
 * 每个色块为圆形，带有内阴影模拟凹面质感，选中时外圈显示优雅环形。
 * 底部显示颜色名称标签。
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

  const css = [
    `#${scopeId}{margin-bottom:24px}`,
    `#${scopeId} .cs-row{display:flex;gap:16px;flex-wrap:wrap}`,

    /* Outer ring container */
    `#${scopeId} .cs-item{`,
    `  display:flex;flex-direction:column;align-items:center;gap:8px;cursor:pointer`,
    `}`,

    /* Ring wrapper — provides the selection ring */
    `#${scopeId} .cs-ring{`,
    `  width:44px;height:44px;border-radius:50%;`,
    `  display:flex;align-items:center;justify-content:center;`,
    `  border:1.5px solid transparent;`,
    `  transition:border-color 0.3s ease;`,
    `  padding:3px`,
    `}`,
    `#${scopeId} .cs-ring.active{`,
    `  border-color:#1a1a1a`,
    `}`,

    /* The swatch "button" itself */
    `#${scopeId} .cs-swatch{`,
    `  width:100%;height:100%;border-radius:50%;`,
    `  background-size:cover;background-position:center;`,
    `  box-shadow:inset 0 2px 4px rgba(0,0,0,0.12),0 1px 3px rgba(0,0,0,0.06);`,
    `  border:0.5px solid rgba(0,0,0,0.08);`,
    `  transition:transform 0.2s ease,box-shadow 0.2s ease`,
    `}`,
    `#${scopeId} .cs-item:hover .cs-swatch{`,
    `  transform:scale(1.08);`,
    `  box-shadow:inset 0 2px 4px rgba(0,0,0,0.12),0 2px 8px rgba(0,0,0,0.1)`,
    `}`,
    `#${scopeId} .cs-ring.active .cs-swatch{`,
    `  box-shadow:inset 0 2px 4px rgba(0,0,0,0.15),0 1px 3px rgba(0,0,0,0.08)`,
    `}`,

    /* Color label */
    `#${scopeId} .cs-label{`,
    `  font-family:var(--font-montserrat);font-weight:400;font-size:9px;`,
    `  letter-spacing:0.06em;color:#aaa;text-transform:uppercase;`,
    `  transition:color 0.2s ease;white-space:nowrap;max-width:52px;`,
    `  overflow:hidden;text-overflow:ellipsis;text-align:center`,
    `}`,
    `#${scopeId} .cs-item:hover .cs-label{color:#888}`,
    `#${scopeId} .cs-ring.active+.cs-label{color:#1a1a1a;font-weight:500}`,

    /* Unavailable */
    `#${scopeId} .cs-swatch.unavailable{`,
    `  opacity:0.3;cursor:not-allowed`,
    `}`,
    `#${scopeId} .cs-unavailable-text{`,
    `  font-size:8px;font-weight:500;color:#1a1a1a;text-transform:capitalize;`,
    `  display:flex;align-items:center;justify-content:center;`,
    `  width:100%;height:100%;padding:0 2px;text-align:center;line-height:1.1`,
    `}`,
  ].join('\n');

  return (
    <div id={scopeId}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="cs-row">
        {colorOptions.map((opt) => {
          const active =
            selectedColor.toLowerCase().trim() === opt.name.toLowerCase().trim();
          const background = getSwatchBackground(opt.swatch);
          const available = !!background;

          return (
            <div
              key={opt.name}
              className="cs-item"
              onClick={() => available && onColorChange(opt.name)}
              role="button"
              tabIndex={0}
              aria-label={opt.name}
              aria-pressed={active}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && available) {
                  e.preventDefault();
                  onColorChange(opt.name);
                }
              }}
            >
              <div className={`cs-ring${active ? ' active' : ''}`}>
                <div
                  className={`cs-swatch${!available ? ' unavailable' : ''}`}
                  style={
                    available
                      ? { background: background! }
                      : { background: '#e8e8e8' }
                  }
                >
                  {!available && (
                    <span className="cs-unavailable-text">
                      {opt.name.replace(/-/g, ' ')}
                    </span>
                  )}
                </div>
              </div>
              <span className="cs-label">{opt.name.replace(/-/g, ' ')}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
