'use client';

/**
 * ProductDetail — 产品详情交互区（客户端组件）
 * ─────────────────────────────────────────────────────────────────
 * 包含：图片画廊（按颜色过滤）、变体选择、数量调节、加入购物袋、立即购买、
 *       折叠信息面板（描述/材质/物流）、尺寸指南弹窗。
 *       URL 支持 ?variant=xxx 预选变体
 *
 * 设计参考：Loro Piana / Brunello Cucinelli 产品页
 * 大量留白 · 极简边框 · 精致排版
 */

import { useCallback, useEffect, useId, useMemo, useState, type CSSProperties } from 'react';
import { useSearchParams } from 'next/navigation';
import SizeGuideModal from '@/components/SizeGuideModal';
import { useCart } from '@/lib/cart-context';
import { useProductVariant } from '@/hooks/useProductVariant';
import ProductGallery from '@/components/product/ProductGallery';
import ColorSelector from '@/components/product/ColorSelector';
import ReviewSummary from '@/components/reviews/ReviewSummary';
import ReviewList from '@/components/reviews/ReviewList';
import ReviewForm from '@/components/reviews/ReviewForm';
import SizeSelector from '@/components/product/SizeSelector';
import { getAvailableColors } from '@/utils/getAvailableColors';
import { useReviews } from '@/hooks/useReviews';
import WishlistButton from '@/components/WishlistButton';
import { sanitizeShopifyHtml } from '@/utils/sanitizeShopifyHtml';

// ─── Shopify Metafield Keys ──────────────────────────────────────────────────
const METAFIELD_KEYS = {
  FABRIC: '1234',
  CARE: '123456',
  SIZE: '1123',
} as const;

// ─── 类型定义 ──────────────────────────────────────────────────────────────────

interface MoneyV2 {
  amount: string;
  currencyCode: string;
}

interface ProductImage {
  url: string;
  alt?: string | null;
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

interface OptionValueWithSwatch {
  name: string;
  swatch?: { image?: { previewImage?: { url: string } }; color?: string } | null;
}

interface ProductOption {
  id: string;
  name: string;
  values: string[];
  optionValues?: OptionValueWithSwatch[];
}

interface Product {
  id: string;
  title: string;
  handle: string;
  vendor?: string;
  tags?: string[];
  descriptionHtml?: string;
  images: ProductImage[];
  media?: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  metafields?: { namespace: string; key: string; value: string; html?: string }[];
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

/** 根据已选 options 查找匹配的 variant（用于 isOutOfStock 等） */
function findVariant(
  variants: ProductVariant[],
  selections: Record<string, string>,
): ProductVariant | undefined {
  return variants.find((v) =>
    v.selectedOptions.every((opt) => selections[opt.name] === opt.value),
  );
}

// ─── 折叠面板组件 ──────────────────────────────────────────────────────────────

function WriteReviewToggle({ productId, productTitle }: { productId: string; productTitle: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginTop: 64, textAlign: 'center' }}>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontWeight: 500,
            fontSize: 12,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#1a1a1a',
            background: 'none',
            border: '1.5px solid #1a1a1a',
            padding: '14px 48px',
            cursor: 'pointer',
            transition: 'background 0.2s, color 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#1a1a1a'; }}
        >
          Write a Review
        </button>
      )}
      {open && (
        <div style={{ textAlign: 'left' }}>
          <ReviewForm productId={productId} productTitle={productTitle} />
        </div>
      )}
    </div>
  );
}

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
    color: '#666',
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
  const { addItem, loading: cartLoading, localizedCheckoutUrl } = useCart();

  const variantIdFromUrl = searchParams.get('variant');
  const { reviews, loading: reviewsLoading } = useReviews(product.id);
  const media = product.media ?? product.images;
  const availableColors = useMemo(
    () => getAvailableColors(media),
    [media],
  );

  const colorOption = product.options.find(
    (o) => o.name.toLowerCase() === 'color' || o.name.toLowerCase() === 'colour',
  );
  const colorOptionsWithSwatch = useMemo(
    () =>
      colorOption?.optionValues?.length
        ? colorOption.optionValues
        : (colorOption?.values ?? []).map((name) => ({ name, swatch: null })),
    [colorOption],
  );
  const {
    selectedOptions,
    setOption,
    selectedVariant,
    selectedColor,
    setSelectedColor,
    selectedSize,
    setSelectedSize,
    sizeOptions,
  } = useProductVariant({
    product,
    media,
    initialVariantId: variantIdFromUrl,
  });

  const sizeOpt = product.options.find(
    (o) => o.name.toLowerCase() === 'size',
  );

  const isOutOfStock = useCallback(
    (size: string) => {
      if (!sizeOpt) return false;
      const tentative = { ...selectedOptions, [sizeOpt.name]: size };
      const v = findVariant(product.variants, tentative);
      return v ? !v.availableForSale : false;
    },
    [selectedOptions, product.variants, sizeOpt],
  );

  // URL 同步：选择变化时更新 ?variant=xxx
  useEffect(() => {
    if (!selectedVariant?.id) return;
    const url = new URL(window.location.href);
    const gid = selectedVariant.id.split('/').pop() ?? selectedVariant.id;
    url.searchParams.set('variant', gid);
    window.history.replaceState({}, '', url.toString());
  }, [selectedVariant?.id]);

  const handleOptionChange = useCallback(
    (optionName: string, value: string) => {
      setOption(optionName, value);
    },
    [setOption],
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
    if (localizedCheckoutUrl) {
      window.location.href = localizedCheckoutUrl;
    }
  }, [selectedVariant, quantity, addItem, localizedCheckoutUrl]);

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
          width: 100%;
          max-width: 100%;
          min-width: 0;
        }
        @media (max-width: 768px) {
          .pdp-grid-${CSS.escape(scopeId)} {
            grid-template-columns: 1fr;
            gap: 24px;
            overflow: visible;
          }
          .pdp-grid-${CSS.escape(scopeId)} > div:nth-child(2) {
            padding: 0 20px;
          }
        }
      `}</style>

      <section className={`pdp-grid-${CSS.escape(scopeId)}`} style={{ paddingBottom: 60, overflow: 'hidden' }} id={`pdp-${scopeId}`}>
        {/* ═══ 左侧：图片画廊（按颜色过滤，无放大镜） ═══ */}
        <ProductGallery
          media={media}
          selectedColor={selectedColor}
          productTitle={product.title}
        />

        {/* ═══ 右侧：产品信息 ═══ */}
        <div style={{ position: 'sticky', top: 200 }}>
          {/* 品牌名 */}
          {product.vendor && (
            <p style={vendorStyle}>{product.vendor}</p>
          )}

          {/* 产品标题 + 收藏 */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <h1 style={{ ...titleStyle, flex: 1 }}>{product.title}</h1>
            <WishlistButton
              product={{
                productId: product.id,
                handle: product.handle,
                title: product.title,
                price: displayPrice.amount,
                currencyCode: displayPrice.currencyCode,
                compareAtPrice: compareAtPrice?.amount,
                image: product.images[0]?.url,
                imageAlt: product.images[0]?.alt ?? product.images[0]?.altText ?? undefined,
              }}
              size={20}
            />
          </div>

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
            {colorOptionsWithSwatch.length > 0 && (
              <div>
                <p style={optionLabelStyle}>
                  Color
                  <span style={{ fontWeight: 400, marginLeft: 8, color: '#666' }}>
                    — {selectedColor || ''}
                  </span>
                </p>
                <ColorSelector
                  colorOptions={colorOptionsWithSwatch}
                  selectedColor={selectedColor}
                  onColorChange={setSelectedColor}
                />
              </div>
            )}

            {sizeOptions.length > 0 && (
              <div>
                <p style={optionLabelStyle}>
                  Size
                  <span style={{ fontWeight: 400, marginLeft: 8, color: '#666' }}>
                    — {selectedSize ?? ''}
                  </span>
                </p>
                <SizeSelector
                  sizes={sizeOptions}
                  selectedSize={selectedSize}
                  onSizeChange={setSelectedSize}
                  isOutOfStock={isOutOfStock}
                />
              </div>
            )}

            {/* 其他选项（非 Color/Size） */}
            {product.options
              .filter(
                (opt) =>
                  (opt.values.length > 1 || opt.name !== 'Title') &&
                  opt.name.toLowerCase() !== 'color' &&
                  opt.name.toLowerCase() !== 'colour' &&
                  opt.name.toLowerCase() !== 'size',
              )
              .map((opt) => (
                <div key={opt.id} style={{ marginBottom: 24 }}>
                  <p style={optionLabelStyle}>
                    {opt.name}
                    <span style={{ fontWeight: 400, marginLeft: 8, color: '#666' }}>
                      — {selectedOptions[opt.name]}
                    </span>
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {opt.values.map((val) => {
                      const active = selectedOptions[opt.name] === val;
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
                            color: outOfStock ? '#767676' : active ? '#fff' : '#1a1a1a',
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
                </div>
              ))}
          </div>

          {/* ── 尺寸指南链接 ──────────────────────────────────────────────── */}
          <button
            type="button"
            onClick={() => setSizeGuideOpen(true)}
            style={sizeGuideBtnStyle}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" style={{ marginRight: 5, verticalAlign: -1 }}>
              <rect x="1" y="6" width="22" height="12" rx="1" />
              <line x1="6" y1="6" x2="6" y2="12" />
              <line x1="10" y1="6" x2="10" y2="10" />
              <line x1="14" y1="6" x2="14" y2="12" />
              <line x1="18" y1="6" x2="18" y2="10" />
            </svg>
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
            className="pdp-atb-btn"
            style={{
              ...addToBagStyle,
              opacity: !isAvailable || cartLoading ? 0.5 : 1,
              cursor: !isAvailable ? 'not-allowed' : 'pointer',
            }}
          >
            {cartLoading ? 'ADDING…' : !isAvailable ? 'SOLD OUT' : 'ADD TO BAG'}
          </button>

          {/* ── BUY NOW 按钮 ──────────────────────────────────────────────── */}
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={!isAvailable || cartLoading}
            className="pdp-buy-btn"
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
                  dangerouslySetInnerHTML={{ __html: sanitizeShopifyHtml(product.descriptionHtml) }}
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                />
              </Accordion>
            )}

            {(() => {
              const fabricMeta = product.metafields?.find((m) => m.key === METAFIELD_KEYS.FABRIC);
              return fabricMeta?.html ? (
                <Accordion title="Materials & Care">
                  <div
                    dangerouslySetInnerHTML={{ __html: sanitizeShopifyHtml(fabricMeta.html) }}
                    style={metafieldHtmlStyle}
                  />
                </Accordion>
              ) : null;
            })()}

            {(() => {
              const careMeta = product.metafields?.find((m) => m.key === METAFIELD_KEYS.CARE);
              return careMeta?.html ? (
                <Accordion title="Care Guide">
                  <div
                    dangerouslySetInnerHTML={{ __html: sanitizeShopifyHtml(careMeta.html) }}
                    style={metafieldHtmlStyle}
                  />
                </Accordion>
              ) : null;
            })()}

            {(() => {
              const sizeMeta = product.metafields?.find((m) => m.key === METAFIELD_KEYS.SIZE);
              return sizeMeta?.html ? (
                <Accordion title="Size & Fit">
                  <div
                    dangerouslySetInnerHTML={{ __html: sanitizeShopifyHtml(sizeMeta.html) }}
                    style={metafieldHtmlStyle}
                  />
                </Accordion>
              ) : null;
            })()}

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

      {/* ── Reviews ── */}
      <section style={{ paddingTop: 64, paddingBottom: 80 }}>
        <ReviewSummary productId={product.id} reviews={reviews} loading={reviewsLoading} />
        <div style={{ marginTop: 48 }}>
          <ReviewList productId={product.id} reviews={reviews} loading={reviewsLoading} />
        </div>
        <WriteReviewToggle productId={product.id} productTitle={product.title} />
      </section>

      {/* ── Mobile fixed bottom buy bar ── */}
      <div className="pdp-mobile-bar">
        <div className="pdp-mobile-bar-inner">
          <div className="pdp-mobile-bar-left">
            <span className="pdp-mobile-bar-price">
              {formatMoney(displayPrice)}
            </span>
            <span className="pdp-mobile-bar-variant">
              {[selectedColor, selectedSize].filter(Boolean).join(' / ')}
            </span>
          </div>
          <button
            type="button"
            className="pdp-mobile-bar-btn"
            onClick={handleAddToBag}
            disabled={!isAvailable || cartLoading}
          >
            {cartLoading ? 'ADDING…' : !isAvailable ? 'SOLD OUT' : 'ADD TO BAG'}
          </button>
        </div>
      </div>

      <style>{`
        .pdp-atb-btn:hover:not(:disabled){
          background:#A89880!important;
          border-color:#A89880!important;
          color:#fff!important;
        }
        .pdp-buy-btn:hover:not(:disabled){
          background:#A89880!important;
          border-color:#A89880!important;
        }
        .pdp-mobile-bar{display:none}
        @media(max-width:768px){
          .pdp-mobile-bar{
            display:block;
            position:fixed;
            bottom:0;left:0;right:0;
            z-index:100;
            background:#FAF8F4;
            border-top:1px solid rgba(0,0,0,0.08);
            padding:12px 20px;
            padding-bottom:calc(12px + env(safe-area-inset-bottom));
          }
          .pdp-mobile-bar-inner{
            display:flex;
            align-items:center;
            justify-content:space-between;
          }
          .pdp-mobile-bar-left{
            display:flex;
            flex-direction:column;
            gap:2px;
          }
          .pdp-mobile-bar-price{
            font-family:var(--font-cormorant);
            font-style:italic;
            font-size:20px;
            color:#1a1a1a;
            line-height:1.2;
          }
          .pdp-mobile-bar-variant{
            font-family:var(--font-montserrat);
            font-weight:300;
            font-size:11px;
            color:#888;
          }
          .pdp-mobile-bar-btn{
            width:160px;
            height:44px;
            background:#1a1a1a;
            color:#fff;
            border:none;
            font-family:var(--font-montserrat);
            font-weight:500;
            font-size:11px;
            letter-spacing:0.16em;
            text-transform:uppercase;
            cursor:pointer;
            flex-shrink:0;
            transition:opacity 0.2s;
          }
          .pdp-mobile-bar-btn:disabled{
            opacity:0.5;
            cursor:not-allowed;
          }
          /* Add bottom padding to prevent content being hidden behind bar */
          .pdp-grid-${CSS.escape(scopeId)}{
            padding-bottom:80px!important;
          }
        }
      `}</style>

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
  color: '#666',
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
  color: '#767676',
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
  color: '#767676',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  marginBottom: 28,
  display: 'inline-flex',
  alignItems: 'center',
  transition: 'color 0.2s ease',
};

const quantityRowStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 24,
  paddingBottom: 24,
  borderBottom: '1px solid rgba(0,0,0,0.06)',
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
  border: '1px solid rgba(0,0,0,0.12)',
};

const quantityBtnStyle: CSSProperties = {
  width: 42,
  height: 42,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 16,
  fontWeight: 300,
  color: '#1a1a1a',
  transition: 'background 0.2s ease',
};

const quantityValueStyle: CSSProperties = {
  width: 48,
  textAlign: 'center',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 13,
  fontWeight: 500,
  color: '#1a1a1a',
  borderLeft: '1px solid rgba(0,0,0,0.08)',
  borderRight: '1px solid rgba(0,0,0,0.08)',
  lineHeight: '42px',
};

const addToBagStyle: CSSProperties = {
  width: '100%',
  padding: '17px 0',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: '#1a1a1a',
  backgroundColor: 'transparent',
  border: '1.5px solid #1a1a1a',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const buyNowStyle: CSSProperties = {
  width: '100%',
  marginTop: 12,
  padding: '17px 0',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: '#fff',
  backgroundColor: '#C8B69E',
  border: '1.5px solid #C8B69E',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
};

const metafieldHtmlStyle: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
};
