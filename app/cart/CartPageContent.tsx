'use client';

/**
 * CartPageContent — 购物车完整页面（客户端组件）
 * ─────────────────────────────────────────────────────────────────
 * 使用 useCart() 获取购物车状态，支持数量增减、删除、结算跳转。
 * 桌面端为表格式布局，移动端为卡片式堆叠。
 */

import { type CSSProperties } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/lib/cart-context';

// ─── 货币格式化 ──────────────────────────────────────────────────────────────

function formatMoney(amount: string, currencyCode: string): string {
  const value = parseFloat(amount);
  if (Number.isNaN(value)) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

// ─── 样式常量 ────────────────────────────────────────────────────────────────

const pageStyle: CSSProperties = {
  backgroundColor: '#E8DFD6',
  minHeight: '100vh',
};

const containerStyle: CSSProperties = {
  maxWidth: 1000,
  margin: '0 auto',
  padding: '40px 40px 80px',
};

const headingStyle: CSSProperties = {
  fontFamily: 'var(--font-cormorant)',
  fontSize: 36,
  fontWeight: 400,
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  color: '#1a1a1a',
  textAlign: 'center',
  margin: '0 0 40px',
};

const tableHeaderStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '100px 1fr 140px 120px 40px',
  gap: 16,
  alignItems: 'center',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 11,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: '#888',
  borderBottom: '1px solid rgba(0,0,0,0.1)',
  paddingBottom: 12,
  marginBottom: 0,
};

const lineItemStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '100px 1fr 140px 120px 40px',
  gap: 16,
  alignItems: 'center',
  padding: '20px 0',
  borderBottom: '1px solid rgba(0,0,0,0.06)',
};

const imageCellStyle: CSSProperties = {
  width: 80,
  height: 100,
  position: 'relative',
  backgroundColor: '#f5f0eb',
  overflow: 'hidden',
  flexShrink: 0,
};

const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-cormorant)',
  fontSize: 16,
  fontWeight: 500,
  color: '#1a1a1a',
  margin: 0,
  lineHeight: 1.3,
};

const variantStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 12,
  color: '#888',
  margin: '4px 0 0',
};

const unitPriceStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 13,
  color: '#555',
  margin: '4px 0 0',
};

const qtyWrapperStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 0,
  border: '1px solid rgba(0,0,0,0.15)',
  width: 'fit-content',
};

const qtyBtnStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 16,
  fontWeight: 300,
  width: 36,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: '#1a1a1a',
  transition: 'background 0.2s',
};

const qtyDisplayStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 13,
  fontWeight: 500,
  width: 40,
  textAlign: 'center',
  color: '#1a1a1a',
  borderLeft: '1px solid rgba(0,0,0,0.15)',
  borderRight: '1px solid rgba(0,0,0,0.15)',
  lineHeight: '36px',
};

const lineTotalStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 14,
  fontWeight: 500,
  color: '#1a1a1a',
};

const removeBtnStyle: CSSProperties = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontSize: 18,
  color: '#999',
  padding: 4,
  lineHeight: 1,
  transition: 'color 0.2s',
};

const summaryStyle: CSSProperties = {
  marginTop: 40,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 16,
};

const subtotalRowStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  width: 280,
  fontFamily: 'var(--font-montserrat)',
  fontSize: 14,
  color: '#1a1a1a',
};

const subtotalLabelStyle: CSSProperties = {
  fontWeight: 400,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const subtotalValueStyle: CSSProperties = {
  fontWeight: 600,
  fontSize: 16,
};

const checkoutBtnStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 13,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  padding: '16px 48px',
  backgroundColor: '#1a1a1a',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  textDecoration: 'none',
  display: 'inline-block',
  textAlign: 'center',
  transition: 'background 0.3s',
};

const emptyStyle: CSSProperties = {
  textAlign: 'center',
  padding: '80px 0',
};

const emptyTextStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 15,
  color: '#888',
  marginBottom: 24,
};

const continueLinkStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 13,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  color: '#1a1a1a',
  textDecoration: 'none',
  borderBottom: '1px solid #1a1a1a',
  paddingBottom: 2,
};

// ─── 组件 ────────────────────────────────────────────────────────────────────

export default function CartPageContent() {
  const {
    lines,
    subtotalAmount,
    checkoutUrl,
    loading,
    updateItem,
    removeItem,
  } = useCart();

  // 空购物车
  if (lines.length === 0 && !loading) {
    return (
      <main style={pageStyle}>
        <div style={containerStyle}>
          <h1 style={headingStyle}>Shopping Cart</h1>
          <div style={emptyStyle}>
            <p style={emptyTextStyle}>Your cart is empty.</p>
            <Link href="/" style={continueLinkStyle}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div className="cart-container">
        <h1 style={headingStyle}>Shopping Cart</h1>

        {/* 桌面端表头（移动端隐藏） */}
        <div className="cart-table-header" style={tableHeaderStyle}>
          <span />
          <span>Product</span>
          <span>Quantity</span>
          <span>Total</span>
          <span />
        </div>

        {/* 购物车条目 */}
        {lines.map((line) => {
          const lineTotal = (parseFloat(line.price.amount) * line.quantity).toFixed(2);
          const showVariant =
            line.variantTitle && line.variantTitle !== 'Default Title';

          return (
            <div key={line.id} className="cart-line-item" style={lineItemStyle}>
              {/* 商品图片 */}
              <div style={imageCellStyle}>
                {line.image?.url && (
                  <Image
                    src={line.image.url}
                    alt={line.image.altText || line.title}
                    fill
                    sizes="80px"
                    style={{ objectFit: 'cover' }}
                  />
                )}
              </div>

              {/* 产品信息 */}
              <div>
                <Link
                  href={`/products/${line.handle}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <p style={titleStyle}>{line.title}</p>
                </Link>
                {showVariant && <p style={variantStyle}>{line.variantTitle}</p>}
                <p style={unitPriceStyle}>
                  {formatMoney(line.price.amount, line.price.currencyCode)}
                </p>
              </div>

              {/* 数量控制 */}
              <div style={qtyWrapperStyle}>
                <button
                  type="button"
                  style={qtyBtnStyle}
                  disabled={loading}
                  onClick={() =>
                    line.quantity > 1
                      ? updateItem(line.id, line.quantity - 1)
                      : removeItem(line.id)
                  }
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span style={qtyDisplayStyle}>{line.quantity}</span>
                <button
                  type="button"
                  style={qtyBtnStyle}
                  disabled={loading}
                  onClick={() => updateItem(line.id, line.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* 行合计 */}
              <span style={lineTotalStyle}>
                {formatMoney(lineTotal, line.price.currencyCode)}
              </span>

              {/* 删除按钮 */}
              <button
                type="button"
                style={removeBtnStyle}
                disabled={loading}
                onClick={() => removeItem(line.id)}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#1a1a1a';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#999';
                }}
                aria-label={`Remove ${line.title}`}
              >
                ×
              </button>
            </div>
          );
        })}

        {/* 底部汇总 */}
        <div className="cart-summary" style={summaryStyle}>
          {subtotalAmount && (
            <div style={subtotalRowStyle}>
              <span style={subtotalLabelStyle}>Subtotal</span>
              <span style={subtotalValueStyle}>
                {formatMoney(subtotalAmount.amount, subtotalAmount.currencyCode)}
              </span>
            </div>
          )}

          <p
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: 12,
              color: '#888',
              margin: 0,
              textAlign: 'right',
            }}
          >
            Shipping & taxes calculated at checkout
          </p>

          {checkoutUrl && (
            <a
              href={checkoutUrl}
              style={checkoutBtnStyle}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#A05E46';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#1a1a1a';
              }}
            >
              Proceed to Checkout
            </a>
          )}

          <Link href="/" style={{ ...continueLinkStyle, marginTop: 4 }}>
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* 加载遮罩 */}
      {loading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(232,223,214,0.5)',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'all',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-montserrat)',
              fontSize: 13,
              color: '#1a1a1a',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Updating…
          </span>
        </div>
      )}

      {/* 响应式样式 */}
      <style>{`
        .cart-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 40px 80px;
        }
        @media (max-width: 768px) {
          .cart-container {
            padding: 20px 20px 60px;
          }
          .cart-table-header {
            display: none !important;
          }
          .cart-line-item {
            display: flex !important;
            flex-wrap: wrap;
            gap: 12px !important;
            grid-template-columns: unset !important;
            padding: 20px 0 !important;
          }
          .cart-line-item > div:first-child {
            width: 72px !important;
            height: 90px !important;
          }
          .cart-line-item > div:nth-child(2) {
            flex: 1;
            min-width: 0;
          }
          .cart-line-item > div:nth-child(3) {
            order: 4;
          }
          .cart-line-item > span {
            order: 5;
            margin-left: auto;
          }
          .cart-line-item > button:last-child {
            order: 3;
            margin-left: auto;
            margin-top: -28px;
          }
          .cart-summary {
            align-items: stretch !important;
          }
          .cart-summary > div {
            width: 100% !important;
          }
          .cart-summary a[href] {
            text-align: center;
          }
        }
      `}</style>
    </main>
  );
}
