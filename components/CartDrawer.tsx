'use client';

/**
 * 购物车侧边抽屉组件
 * ─────────────────────────────────────────────────────────────────
 * 从右侧滑入的购物车面板，展示商品列表、数量调整、小计、结算按钮。
 * 使用 useCart() 获取全局购物车状态。
 */

import { useCart } from '@/lib/cart-context';
import PlaceholderImage from '@/components/PlaceholderImage';
import { useCallback, useEffect, useId, useState } from 'react';

// ─── 品牌设计 Token ──────────────────────────────────────────────────────────
const BG       = '#FFFFFF';
const BG_PAGE  = '#E8DFD6';
const TEXT     = '#1a1a1a';
const ACCENT   = '#A05E46';
const HEADING  = 'var(--font-cormorant), "Cormorant", serif';
const BODY     = 'var(--font-montserrat), "Montserrat", sans-serif';

// ─── 主组件 ──────────────────────────────────────────────────────────────────

export default function CartDrawer() {
  const {
    drawerOpen,
    closeDrawer,
    lines,
    subtotalAmount,
    localizedCheckoutUrl,
    loading,
    updateItem,
    removeItem,
  } = useCart();

  const uid    = useId();
  const scopeId = `cd${uid.replace(/:/g, '')}`;

  // ESC 键关闭抽屉
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [drawerOpen, closeDrawer]);

  // 抽屉打开时禁止页面滚动
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleQuantity = useCallback(
    (lineId: string, current: number, delta: number) => {
      const next = current + delta;
      if (next < 1) {
        setRemovingId(lineId);
        setTimeout(() => {
          removeItem(lineId);
          setRemovingId(null);
        }, 320);
      } else {
        updateItem(lineId, next);
      }
    },
    [updateItem, removeItem],
  );

  const handleRemove = useCallback(
    (lineId: string) => {
      setRemovingId(lineId);
      setTimeout(() => {
        removeItem(lineId);
        setRemovingId(null);
      }, 320);
    },
    [removeItem],
  );

  // 格式化价格
  const fmtPrice = (amount: string, currency: string) => {
    const num = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(num);
  };

  // ─── 响应式样式 ────────────────────────────────────────────────────────────
  const css = `
    #${scopeId} .cd-panel {
      position: fixed; top: 0; right: 0; bottom: 0;
      width: 420px; max-width: 100%;
      background: ${BG};
      z-index: 1001;
      display: flex; flex-direction: column;
      transform: translateX(${drawerOpen ? '0' : '100%'});
      transition: transform 0.35s ease;
      box-shadow: ${drawerOpen ? '-4px 0 24px rgba(0,0,0,0.08)' : 'none'};
    }
    #${scopeId} .cd-backdrop {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.35);
      z-index: 1000;
      opacity: ${drawerOpen ? 1 : 0};
      pointer-events: ${drawerOpen ? 'auto' : 'none'};
      transition: opacity 0.3s ease;
    }
    @media (max-width: 768px) {
      #${scopeId} .cd-panel { width: 100%; max-width: 100%; }
    }
  `;

  return (
    <div id={scopeId}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* 背景遮罩 */}
      <div className="cd-backdrop" onClick={closeDrawer} aria-hidden />

      {/* 抽屉面板 */}
      <aside className="cd-panel" role="dialog" aria-label="Shopping cart">

        {/* 加载中遮罩 */}
        {loading && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 10,
            background: 'rgba(255,255,255,0.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 28, height: 28,
              border: `2px solid ${BG_PAGE}`,
              borderTopColor: ACCENT,
              borderRadius: '50%',
              animation: 'cd-spin 0.7s linear infinite',
            }} />
            <style dangerouslySetInnerHTML={{ __html: `@keyframes cd-spin{to{transform:rotate(360deg)}}` }} />
          </div>
        )}

        {/* 顶栏 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid rgba(0,0,0,0.08)',
        }}>
          <h2 style={{
            fontFamily: HEADING,
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: '0.12em',
            color: TEXT,
            margin: 0,
          }}>
            YOUR CART
          </h2>
          <button
            onClick={closeDrawer}
            aria-label="Close cart"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 6, lineHeight: 1, color: TEXT,
            }}
          >
            {/* 关闭 × 图标 */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="1" y1="1" x2="17" y2="17" />
              <line x1="17" y1="1" x2="1" y2="17" />
            </svg>
          </button>
        </div>

        {/* 商品列表 / 空态 */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {lines.length === 0 ? (
            <div style={{
              textAlign: 'center', paddingTop: 80,
              fontFamily: BODY, fontSize: 14, color: TEXT, opacity: 0.55,
              letterSpacing: '0.04em',
            }}>
              <p style={{ marginBottom: 8 }}>Your cart is empty.</p>
              <p style={{ fontSize: 12 }}>Discover our curated collection.</p>
            </div>
          ) : (
            lines.map((line) => (
              <div
                key={line.id}
                className="cd-line"
                style={{
                  display: 'flex', gap: 16,
                  paddingBottom: removingId === line.id ? 0 : 20,
                  marginBottom: removingId === line.id ? 0 : 20,
                  borderBottom: '1px solid rgba(0,0,0,0.06)',
                  opacity: removingId === line.id ? 0 : 1,
                  transform: removingId === line.id ? 'translateX(20px)' : 'translateX(0)',
                  maxHeight: removingId === line.id ? 0 : 200,
                  overflow: 'hidden',
                  transition: 'opacity 0.3s ease, transform 0.3s ease, max-height 0.3s ease, margin 0.3s ease, padding 0.3s ease',
                }}
              >
                {/* 产品图 */}
                <div style={{
                  width: 86, height: 108, flexShrink: 0,
                  position: 'relative', overflow: 'hidden',
                  background: BG_PAGE,
                }}>
                  {line.image?.url ? (
                    <PlaceholderImage
                      src={line.image.url}
                      alt={line.image.altText ?? line.title}
                      fill
                      sizes="86px"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: BG_PAGE,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/logo1.png"
                        alt=""
                        style={{ width: 36, height: 'auto', opacity: 0.25 }}
                      />
                    </div>
                  )}
                </div>

                {/* 信息区 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{
                      fontFamily: BODY, fontSize: 13, fontWeight: 500,
                      color: TEXT, margin: '0 0 4px', lineHeight: 1.4,
                      letterSpacing: '0.02em',
                    }}>
                      {line.title}
                    </p>
                    {line.variantTitle && line.variantTitle !== 'Default Title' && (
                      <p style={{
                        fontFamily: BODY, fontSize: 11, color: TEXT,
                        opacity: 0.55, margin: 0, letterSpacing: '0.03em',
                      }}>
                        {line.variantTitle}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    {/* 数量控制 */}
                    <div style={{
                      display: 'flex', alignItems: 'center',
                      border: '1px solid rgba(0,0,0,0.12)',
                      height: 30,
                    }}>
                      <button
                        onClick={() => handleQuantity(line.id, line.quantity, -1)}
                        aria-label="Decrease quantity"
                        style={{
                          width: 30, height: '100%',
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontFamily: BODY, fontSize: 14, color: TEXT,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        −
                      </button>
                      <span style={{
                        width: 28, textAlign: 'center',
                        fontFamily: BODY, fontSize: 12, color: TEXT,
                        borderLeft: '1px solid rgba(0,0,0,0.12)',
                        borderRight: '1px solid rgba(0,0,0,0.12)',
                        lineHeight: '30px',
                      }}>
                        {line.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantity(line.id, line.quantity, 1)}
                        aria-label="Increase quantity"
                        style={{
                          width: 30, height: '100%',
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontFamily: BODY, fontSize: 14, color: TEXT,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        +
                      </button>
                    </div>

                    {/* 价格 + 删除 */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{
                        fontFamily: BODY, fontSize: 13, fontWeight: 500,
                        color: TEXT, letterSpacing: '0.02em',
                      }}>
                        {fmtPrice(
                          (parseFloat(line.price.amount) * line.quantity).toFixed(2),
                          line.price.currencyCode,
                        )}
                      </span>
                      <button
                        onClick={() => handleRemove(line.id)}
                        aria-label="Remove item"
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          padding: 2, color: TEXT, opacity: 0.4,
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                          <line x1="1" y1="1" x2="13" y2="13" />
                          <line x1="13" y1="1" x2="1" y2="13" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 底栏：小计 + 操作按钮 */}
        {lines.length > 0 && (
          <div style={{
            padding: '20px 24px 24px',
            borderTop: '1px solid rgba(0,0,0,0.08)',
          }}>
            {/* 小计行 */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              marginBottom: 18,
            }}>
              <span style={{
                fontFamily: BODY, fontSize: 12, fontWeight: 500,
                color: TEXT, letterSpacing: '0.12em', textTransform: 'uppercase',
              }}>
                Subtotal
              </span>
              <span style={{
                fontFamily: BODY, fontSize: 15, fontWeight: 600,
                color: TEXT, letterSpacing: '0.02em',
              }}>
                {subtotalAmount
                  ? fmtPrice(subtotalAmount.amount, subtotalAmount.currencyCode)
                  : '—'}
              </span>
            </div>

            {/* 结算按钮 */}
            <a
              href={localizedCheckoutUrl ?? '#'}
              style={{
                display: 'block', width: '100%', padding: '14px 0',
                background: TEXT, color: '#fff',
                fontFamily: BODY, fontSize: 13, fontWeight: 600,
                letterSpacing: '0.18em', textTransform: 'uppercase',
                textAlign: 'center', textDecoration: 'none',
                transition: 'opacity 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
            >
              CHECKOUT
            </a>

            {/* 继续购物 */}
            <button
              onClick={closeDrawer}
              style={{
                display: 'block', width: '100%', marginTop: 12,
                padding: '10px 0',
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: BODY, fontSize: 12, fontWeight: 400,
                color: TEXT, opacity: 0.6,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                textDecoration: 'underline', textUnderlineOffset: '3px',
              }}
            >
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
