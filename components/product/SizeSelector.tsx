'use client';

/**
 * SizeSelector — 尺码选择器（品牌化设计）
 * ─────────────────────────────────────────────────────────────────
 * 参考 Loro Piana / Brunello Cucinelli 风格：
 * 柔和边框、品牌色选中态、优雅过渡
 */

import { useId } from 'react';

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
  const scopeId = `ss${useId().replace(/:/g, '')}`;

  if (sizes.length === 0) return null;

  const css = `
    #${scopeId} { margin-bottom: 24px; }
    #${scopeId} .ss-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    #${scopeId} .ss-btn {
      min-width: 52px;
      height: 44px;
      padding: 0 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: var(--font-montserrat);
      font-size: 12px;
      font-weight: 400;
      letter-spacing: 0.06em;
      border: 1px solid rgba(0,0,0,0.12);
      background: transparent;
      color: #1a1a1a;
      cursor: pointer;
      transition: all 0.25s ease;
    }
    #${scopeId} .ss-btn:hover:not(.ss-active):not(.ss-oos) {
      border-color: #C8B69E;
      color: #C8B69E;
    }
    #${scopeId} .ss-btn.ss-active {
      background: #C8B69E;
      border-color: #C8B69E;
      color: #fff;
      font-weight: 500;
    }
    #${scopeId} .ss-btn.ss-oos {
      border-color: rgba(0,0,0,0.06);
      background: rgba(0,0,0,0.02);
      color: #bbb;
      cursor: not-allowed;
      text-decoration: line-through;
    }
  `;

  return (
    <div id={scopeId}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="ss-row">
        {sizes.map((val) => {
          const active = selectedSize === val;
          const outOfStock = isOutOfStock(val);

          return (
            <button
              key={val}
              type="button"
              className={`ss-btn${active ? ' ss-active' : ''}${outOfStock ? ' ss-oos' : ''}`}
              onClick={() => !outOfStock && onSizeChange(val)}
              disabled={!!outOfStock}
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
