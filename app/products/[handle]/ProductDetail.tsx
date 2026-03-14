'use client';

/**
 * ProductDetail — 产品详情交互区（客户端组件）
 * ─────────────────────────────────────────────────────────────────
 * 包含：图片画廊（hover 放大镜）、变体选择、数量调节、加入购物袋、立即购买、
 *       折叠信息面板（描述/材质/物流）、尺寸指南弹窗。
 *       URL 支持 ?variant=xxx 预选变体
 *
 * 设计参考：Loro Piana / Brunello Cucinelli 产品页
 * 大量留白 · 极简边框 · 精致排版
 */

import { useCallback, useEffect, useId, useMemo, useState, type CSSProperties } from 'react';
import { useSearchParams } from 'next/navigation';
import PlaceholderImage from '@/components/PlaceholderImage';
import SizeGuideModal from '@/components/SizeGuideModal';
import { useCart } from '@/lib/cart-context';

// ─── 类型定义 ──────────────────────────────────────────────────────────────────

interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

interface ProductImage {
  url: string;
  altText?: string | null;
  width?: number;
  height?: number;
}

interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable?: number;
  priceV2: MoneyV2;
  compareAtPriceV2?: MoneyV2 | null;
  selectedOptions: { name: string; value: string }[];
  image?: ProductImage | null;
}

interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

interface Product {
  id: string;
  title: string;
  handle: string;
  vendor?: string;
  descriptionHtml?: string;
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  priceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
  compareAtPriceRange?: {
    minVariantPrice: MoneyV2;
  } | null;
}

interface ProductDetailProps {
  product: Product;
}

// ─── 工具函数 ──────────────────────────────────────────────────────────────────

function formatMoney({ amount, currencyCode }: MoneyV2): string {
  const value = parseFloat(amount);
  if (Number.isNaN(value)) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

/** 根据已选 options 查找匹配的 variant */
function findVariant(
  variants: ProductVariant[],
  selections: Record<string, string>,
): ProductVariant | undefined {
  return variants.find((v) =>
    v.selectedOptions.every((opt) => selections[opt.name] === opt.value),
  );
}

// ─── 颜色词映射（用于 Color swatch 背景色） ──────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  black: '#1a1a1a',
  white: '#f5f5f0',
  ivory: '#fffff0',
  cream: '#f5f0e8',
  beige: '#d4c5a9',
  camel: '#c19a6b',
  sand: '#d2b48c',
  tan: '#d2b48c',
  brown: '#6b4226',
  chocolate: '#3e2723',
  espresso: '#3c1414',
  navy: '#1b2a4a',
  blue: '#3a5a8c',
  grey: '#8c8c8c',
  gray: '#8c8c8c',
  charcoal: '#36454f',
  red: '#8b2500',
  burgundy: '#5c1a1b',
  wine: '#722f37',
  green: '#3a5a3a',
  olive: '#556b2f',
  pink: '#d4a5a5',
  rose: '#b76e79',
  orange: '#c65d07',
  rust: '#a0522d',
  cocoa: '#5c3a21',
  oatmeal: '#c8b896',
  taupe: '#9e8e7e',
  khaki: '#bdb395',
  lavender: '#b4a7d6',
  fog: '#c8c8c0',
};

function getSwatchColor(colorValue: string): string {
  const key = colorValue.toLowerCase().trim();
  if (COLOR_MAP[key]) return COLOR_MAP[key];
  for (const [k, v] of Object.entries(COLOR_MAP)) {
    if (key.includes(k)) return v;
  }
  return '#ccc';
}

// ─── 折叠面板组件 ──────────────────────────────────────────────────────────────

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 0',
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left',
    fontFamily: 'var(--font-montserrat)',
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#1a1a1a',
    borderTop: '1px solid rgba(0,0,0,0.1)',
  };

  const bodyStyle: CSSProperties = {
    maxHeight: open ? 600 : 0,
    overflow: 'hidden',
    transition: 'max-height 0.4s ease',
  };

  const innerStyle: CSSProperties = {
    paddingBottom: 20,
    fontFamily: 'var(--font-montserrat)',
    fontSize: 13,
    lineHeight: 1.8,
    color: '#555',
  };

  const chevronStyle: CSSProperties = {
    transition: 'transform 0.3s ease',
    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
    fontSize: 14,
    color: '#888',
  };

  return (
    <div>
      <button type="button" style={headerStyle} onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span style={chevronStyle}>▾</span>
      </button>
      <div style={bodyStyle}>
        <div style={innerStyle}>{children}</div>
      </div>
    </div>
  );
}

// ─── 主组件 ────────────────────────────────────────────────────────────────────

export default function ProductDetail({ product }: ProductDetailProps) {
  const scopeId = useId();
  const searchParams = useSearchParams();
  const { addItem, loading: cartLoading, checkoutUrl } = useCart();

  // ── 图片画廊状态 ──────────────────────────────────────────────────────────
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number } | null>(null);
  const images = product.images;
  const activeImage = images[activeImageIdx] ?? images[0];

  // ── 变体选择状态（支持 URL ?variant=xxx） ───────────────────────────────────
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      const variantId = searchParams.get('variant');
      if (variantId) {
        const v = product.variants.find((x) => x.id === variantId || x.id.endsWith(variantId));
        if (v?.selectedOptions) {
          v.selectedOptions.forEach((o) => { initial[o.name] = o.value; });
          return initial;
        }
      }
      product.options.forEach((opt) => {
        initial[opt.name] = opt.values[0] ?? '';
      });
      return initial;
    },
  );

  const selectedVariant = useMemo(
    () => findVariant(product.variants, selectedOptions),
    [product.variants, selectedOptions],
  );

  // URL 同步：选择变化时更新 ?variant=xxx
  useEffect(() => {
    if (!selectedVariant?.id) return;
    const url = new URL(window.location.href);
    const gid = selectedVariant.id.split('/').pop() ?? selectedVariant.id;
    url.searchParams.set('variant', gid);
    window.history.replaceState({}, '', url.toString());
  }, [selectedVariant?.id]);

  // 从 URL variant 加载时，同步主图到变体对应图片
  useEffect(() => {
    if (!selectedVariant?.image?.url) return;
    const idx = product.images.findIndex((img) => img.url === selectedVariant!.image!.url);
    if (idx >= 0) setActiveImageIdx(idx);
  }, [selectedVariant?.id]); // 仅当 variant 变化时更新主图（含 URL 初始化）

  // 选中变体对应的图片自动切换
  const handleOptionChange = useCallback(
    (optionName: string, value: string) => {
      setSelectedOptions((prev) => {
        const next = { ...prev, [optionName]: value };
        const variant = findVariant(product.variants, next);
        if (variant?.image?.url) {
          const idx = images.findIndex((img) => img.url === variant.image!.url);
          if (idx >= 0) setActiveImageIdx(idx);
        }
        return next;
      });
    },
    [product.variants, images],
  );

  // ── 数量状态 ──────────────────────────────────────────────────────────────
  const [quantity, setQuantity] = useState(1);
  const maxQuantity = selectedVariant?.quantityAvailable ?? 99;

  // ── 尺寸指南弹窗 ──────────────────────────────────────────────────────────
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  // ── 加入购物袋 ──────────────────────────────────────────────────────────
  const handleAddToBag = useCallback(async () => {
    if (!selectedVariant?.id || !selectedVariant.availableForSale) return;
    await addItem(selectedVariant.id, quantity);
  }, [selectedVariant, quantity, addItem]);

  // ── 立即购买（先加入购物车，再跳转结账） ───────────────────────────────
  const handleBuyNow = useCallback(async () => {
    if (!selectedVariant?.id || !selectedVariant.availableForSale) return;
    await addItem(selectedVariant.id, quantity);
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    }
  }, [selectedVariant, quantity, addItem, checkoutUrl]);

  // ── 价格展示 ──────────────────────────────────────────────────────────────
  const displayPrice = selectedVariant?.priceV2 ?? product.priceRange.minVariantPrice;
  const compareAtPrice = selectedVariant?.compareAtPriceV2;
  const hasDiscount =
    compareAtPrice &&
    parseFloat(compareAtPrice.amount) > 0 &&
    parseFloat(compareAtPrice.amount) > parseFloat(displayPrice.amount);

  const isAvailable = selectedVariant?.availableForSale ?? false;

  return (
    <>
      {/* 作用域样式 */}
      <style>{`
        .pdp-grid-${CSS.escape(scopeId)} {
          display: grid;
          grid-template-columns: 55fr 45fr;
          gap: 60px;
          align-items: start;
        }
        @media (max-width: 768px) {
          .pdp-grid-${CSS.escape(scopeId)} {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .pdp-main-img-${CSS.escape(scopeId)}:hover img { transform: none !important; }
        }
        .pdp-thumb-strip-${CSS.escape(scopeId)} {
          display: flex;
          gap: 8px;
          margin-top: 12px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .pdp-thumb-strip-${CSS.escape(scopeId)}::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      <section className={`pdp-grid-${CSS.escape(scopeId)}`} style={{ paddingBottom: 60 }}>
        {/* ═══ 左侧：图片画廊（hover 放大镜） ═══ */}
        <div>
          {/* 主图 + hover 放大 */}
          <div
            className={`pdp-main-img-${CSS.escape(scopeId)}`}
            style={{
              position: 'relative',
              width: '100%',
              aspectRatio: '4 / 5',
              overflow: 'hidden',
              backgroundColor: '#f0ebe4',
              cursor: zoomPos ? 'zoom-out' : 'zoom-in',
            }}
            onMouseEnter={() => setZoomPos({ x: 0.5, y: 0.5 })}
            onMouseLeave={() => setZoomPos(null)}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = (e.clientX - rect.left) / rect.width;
              const y = (e.clientY - rect.top) / rect.height;
              setZoomPos({ x, y });
            }}
          >
            {activeImage?.url && (
              <PlaceholderImage
                src={activeImage.url}
                alt={activeImage.altText ?? product.title}
                fill
                sizes="(max-width: 768px) 100vw, 55vw"
                style={{
                  objectFit: 'cover',
                  transform: zoomPos ? `scale(1.8)` : 'scale(1)',
                  transformOrigin: zoomPos ? `${zoomPos.x * 100}% ${zoomPos.y * 100}%` : 'center',
                  transition: zoomPos ? 'none' : 'transform 0.3s ease',
                }}
                priority
              />
            )}
          </div>

          {/* 缩略图条 */}
          {images.length > 1 && (
            <div className={`pdp-thumb-strip-${CSS.escape(scopeId)}`}>
              {images.map((img, idx) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setActiveImageIdx(idx)}
                  aria-label={`查看图片 ${idx + 1}`}
                  style={{
                    position: 'relative',
                    width: 60,
                    height: 75,
                    flexShrink: 0,
                    overflow: 'hidden',
                    border:
                      idx === activeImageIdx
                        ? '2px solid #1a1a1a'
                        : '2px solid transparent',
                    padding: 0,
                    background: '#f0ebe4',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <PlaceholderImage
                    src={img.url}
                    alt={img.altText ?? `${product.title} - ${idx + 1}`}
                    fill
                    sizes="60px"
                    style={{ objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ═══ 右侧：产品信息 ═══ */}
        <div style={{ position: 'sticky', top: 200 }}>
          {/* 品牌名 */}
          {product.vendor && (
            <p style={vendorStyle}>{product.vendor}</p>
          )}

          {/* 产品标题 */}
          <h1 style={titleStyle}>{product.title}</h1>

          {/* 价格 */}
          <div style={priceRowStyle}>
            {hasDiscount ? (
              <>
                <span style={salePriceStyle}>{formatMoney(displayPrice)}</span>
                <span style={compareAtStyle}>{formatMoney(compareAtPrice)}</span>
              </>
            ) : (
              <span>{formatMoney(displayPrice)}</span>
            )}
          </div>

          {/* ── 变体选择器 ─────────────────────────────────────────────────── */}
          <div style={{ marginTop: 32 }}>
            {product.options
              .filter((opt) => opt.values.length > 1 || opt.name !== 'Title')
              .map((opt) => {
                const isColor = opt.name.toLowerCase() === 'color' || opt.name.toLowerCase() === 'colour';

                return (
                  <div key={opt.id} style={{ marginBottom: 24 }}>
                    {/* 选项标签 */}
                    <p style={optionLabelStyle}>
                      {opt.name}
                      <span style={{ fontWeight: 400, marginLeft: 8, color: '#888' }}>
                        — {selectedOptions[opt.name]}
                      </span>
                    </p>

                    {isColor ? (
                      /* 颜色：圆形色块 */
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {opt.values.map((val) => {
                          const active = selectedOptions[opt.name] === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              title={val}
                              onClick={() => handleOptionChange(opt.name, val)}
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: '50%',
                                backgroundColor: getSwatchColor(val),
                                border: active
                                  ? '2px solid #1a1a1a'
                                  : '1px solid rgba(0,0,0,0.15)',
                                outline: active ? '2px solid #E8DFD6' : 'none',
                                outlineOffset: 1,
                                cursor: 'pointer',
                                padding: 0,
                                transition: 'border-color 0.2s, outline 0.2s',
                              }}
                              aria-label={val}
                            />
                          );
                        })}
                      </div>
                    ) : (
                      /* 其他选项（尺码等）：横排按钮 */
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {opt.values.map((val) => {
                          const active = selectedOptions[opt.name] === val;
                          // 检查这个选项值对应的变体是否有货
                          const tentative = { ...selectedOptions, [opt.name]: val };
                          const matchVariant = findVariant(product.variants, tentative);
                          const outOfStock = matchVariant && !matchVariant.availableForSale;

                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => !outOfStock && handleOptionChange(opt.name, val)}
                              disabled={!!outOfStock}
                              style={{
                                minWidth: 48,
                                padding: '10px 16px',
                                fontFamily: 'var(--font-montserrat)',
                                fontSize: 12,
                                fontWeight: active ? 500 : 400,
                                letterSpacing: '0.04em',
                                border: outOfStock
                                  ? '1px solid #ddd'
                                  : active
                                    ? '1.5px solid #1a1a1a'
                                    : '1px solid rgba(0,0,0,0.15)',
                                backgroundColor: outOfStock ? '#e8e8e8' : active ? '#1a1a1a' : 'transparent',
                                color: outOfStock ? '#999' : active ? '#fff' : '#1a1a1a',
                                cursor: outOfStock ? 'not-allowed' : 'pointer',
                                textDecoration: outOfStock ? 'line-through' : 'none',
                                opacity: outOfStock ? 0.7 : 1,
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* ── 尺寸指南链接 ──────────────────────────────────────────────── */}
          <button
            type="button"
            onClick={() => setSizeGuideOpen(true)}
            style={sizeGuideBtnStyle}
          >
            <span style={{ borderBottom: '1px solid currentColor' }}>Size Guide</span>
          </button>

          {/* ── 数量选择器 ────────────────────────────────────────────────── */}
          <div style={quantityRowStyle}>
            <span style={quantityLabelStyle}>Quantity</span>
            <div style={quantityControlStyle}>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                style={quantityBtnStyle}
                aria-label="减少数量"
              >
                −
              </button>
              <span style={quantityValueStyle}>{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                disabled={quantity >= maxQuantity}
                style={quantityBtnStyle}
                aria-label="增加数量"
              >
                +
              </button>
            </div>
          </div>

          {/* ── ADD TO BAG 按钮 ───────────────────────────────────────────── */}
          <button
            type="button"
            onClick={handleAddToBag}
            disabled={!isAvailable || cartLoading}
            style={{
              ...addToBagStyle,
              opacity: !isAvailable || cartLoading ? 0.5 : 1,
              cursor: !isAvailable ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (isAvailable && !cartLoading) {
                e.currentTarget.style.backgroundColor = '#1a1a1a';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#1a1a1a';
            }}
          >
            {cartLoading ? 'ADDING…' : !isAvailable ? 'SOLD OUT' : 'ADD TO BAG'}
          </button>

          {/* ── BUY NOW 按钮 ──────────────────────────────────────────────── */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!isAvailable || cartLoading}
            style={{
              ...buyNowStyle,
              opacity: !isAvailable || cartLoading ? 0.5 : 1,
              cursor: !isAvailable ? 'not-allowed' : 'pointer',
            }}
          >
            BUY NOW
          </button>

          {/* ── 折叠信息面板 ──────────────────────────────────────────────── */}
          <div style={{ marginTop: 40 }}>
            {product.descriptionHtml && (
              <Accordion title="Description" defaultOpen>
                <div
                  dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                />
              </Accordion>
            )}

            <Accordion title="Materials & Care">
              <p>
                This piece is crafted from the finest natural fibres, selected for
                exceptional softness and durability.
              </p>
              <ul style={{ paddingLeft: 18, marginTop: 8 }}>
                <li>Dry clean recommended</li>
                <li>Store folded in a cool, dry place</li>
                <li>Use a cashmere comb to remove pilling</li>
                <li>Avoid prolonged exposure to direct sunlight</li>
              </ul>
            </Accordion>

            <Accordion title="Shipping & Returns">
              <p>
                Complimentary shipping on all orders over $300.
                Standard delivery: 5–8 business days.
              </p>
              <p style={{ marginTop: 8 }}>
                We offer free returns within 30 days of delivery.
                Items must be unworn, unwashed, and in original packaging.
              </p>
            </Accordion>

            {/* 底部分隔线 */}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.1)' }} />
          </div>
        </div>
      </section>

      {/* 尺寸指南弹窗 */}
      <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </>
  );
}

// ─── 静态样式常量 ──────────────────────────────────────────────────────────────

const vendorStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  color: '#888',
  margin: '0 0 8px',
};

const titleStyle: CSSProperties = {
  fontFamily: 'var(--font-cormorant)',
  fontSize: 28,
  fontWeight: 300,
  lineHeight: 1.25,
  color: '#1a1a1a',
  margin: 0,
};

const priceRowStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 16,
  fontWeight: 400,
  color: '#1a1a1a',
  marginTop: 16,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
};

const salePriceStyle: CSSProperties = {
  color: '#A05E46',
};

const compareAtStyle: CSSProperties = {
  textDecoration: 'line-through',
  color: '#999',
  fontSize: 14,
};

const optionLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#1a1a1a',
  margin: '0 0 12px',
};

const sizeGuideBtnStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 11,
  fontWeight: 400,
  letterSpacing: '0.06em',
  color: '#888',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  marginBottom: 28,
  display: 'inline-block',
};

const quantityRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20,
};

const quantityLabelStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#1a1a1a',
};

const quantityControlStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  border: '1px solid rgba(0,0,0,0.15)',
};

const quantityBtnStyle: CSSProperties = {
  width: 40,
  height: 40,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 16,
  color: '#1a1a1a',
};

const quantityValueStyle: CSSProperties = {
  width: 44,
  textAlign: 'center',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 13,
  fontWeight: 500,
  color: '#1a1a1a',
  borderLeft: '1px solid rgba(0,0,0,0.1)',
  borderRight: '1px solid rgba(0,0,0,0.1)',
  lineHeight: '40px',
};

const addToBagStyle: CSSProperties = {
  width: '100%',
  padding: '16px 0',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: '#1a1a1a',
  backgroundColor: 'transparent',
  border: '1.5px solid #1a1a1a',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const buyNowStyle: CSSProperties = {
  width: '100%',
  marginTop: 10,
  padding: '16px 0',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: '#fff',
  backgroundColor: '#1a1a1a',
  border: '1.5px solid #1a1a1a',
  cursor: 'pointer',
  transition: 'opacity 0.3s ease',
};
