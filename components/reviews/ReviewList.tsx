'use client';

import { useId, useState, useCallback } from 'react';
import StarRating from './StarRating';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  author: string;
  country: string;
  countryFlag: string;
  rating: number;
  title?: string;
  body: string;
  date: string;
  verified: boolean;
  images?: string[];
  productInfo?: string;
}

export interface ReviewListProps {
  reviews: Review[];
}

// ─── Lightbox ────────────────────────────────────────────────────────────────

function Lightbox({
  src,
  onClose,
}: {
  src: string;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'zoom-out',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Review photo enlarged"
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh',
          objectFit: 'contain',
          borderRadius: 2,
        }}
      />
    </div>
  );
}

// ─── Single Review Card ──────────────────────────────────────────────────────

function ReviewItem({ review }: { review: Review }) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <>
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}

      <article className="rl-item">
        {/* Row 1: Stars + Author */}
        <div className="rl-row1">
          <StarRating rating={review.rating} size="small" />
          <div className="rl-author">
            <span className="rl-author-name">{review.author}</span>
            {' '}
            <span className="rl-author-country">
              {review.countryFlag} {review.country}
            </span>
          </div>
        </div>

        {/* Row 2: Title */}
        {review.title && (
          <h3 className="rl-title">{review.title}</h3>
        )}

        {/* Row 3: Body */}
        <p className="rl-body">{review.body}</p>

        {/* Row 4: Verified + Date */}
        <div className="rl-meta">
          {review.verified && (
            <span className="rl-verified">VERIFIED PURCHASE</span>
          )}
          <span className="rl-date">{review.date}</span>
        </div>

        {/* Row 5: Images */}
        {review.images && review.images.length > 0 && (
          <div className="rl-images">
            {review.images.map((src, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={i}
                src={src}
                alt={`Review photo ${i + 1}`}
                className="rl-img"
                onClick={() => setLightboxSrc(src)}
              />
            ))}
          </div>
        )}

        {/* Row 6: Product info */}
        {review.productInfo && (
          <p className="rl-product">{review.productInfo}</p>
        )}
      </article>
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ReviewList({ reviews }: ReviewListProps) {
  const scopeId = `rl${useId().replace(/:/g, '')}`;

  const css = [
    `#${scopeId}{padding:0 30px;max-width:800px;margin:0 auto}`,

    /* Each review item */
    `#${scopeId} .rl-item{`,
    `  border-top:1px solid rgba(0,0,0,0.08);`,
    `  padding:40px 0`,
    `}`,

    /* Row 1 */
    `#${scopeId} .rl-row1{`,
    `  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px`,
    `}`,
    `#${scopeId} .rl-author{display:flex;align-items:center;gap:4px}`,
    `#${scopeId} .rl-author-name{`,
    `  font-family:var(--font-montserrat);font-weight:500;font-size:13px;color:#1a1a1a`,
    `}`,
    `#${scopeId} .rl-author-country{`,
    `  font-family:var(--font-montserrat);font-weight:300;font-size:12px;color:#888`,
    `}`,

    /* Title */
    `#${scopeId} .rl-title{`,
    `  font-family:var(--font-cormorant);font-style:italic;font-weight:300;`,
    `  font-size:18px;color:#1a1a1a;margin:12px 0 0;line-height:1.4`,
    `}`,

    /* Body */
    `#${scopeId} .rl-body{`,
    `  font-family:var(--font-montserrat);font-weight:300;font-size:14px;`,
    `  color:#555;line-height:1.8;margin:8px 0 0`,
    `}`,

    /* Meta row */
    `#${scopeId} .rl-meta{`,
    `  display:flex;align-items:center;justify-content:space-between;`,
    `  margin:16px 0 0;flex-wrap:wrap;gap:8px`,
    `}`,
    `#${scopeId} .rl-verified{`,
    `  font-family:var(--font-montserrat);font-weight:500;font-size:10px;`,
    `  letter-spacing:0.12em;color:#C4A882;text-transform:uppercase`,
    `}`,
    `#${scopeId} .rl-date{`,
    `  font-family:var(--font-montserrat);font-weight:300;font-size:11px;color:#bbb`,
    `}`,

    /* Images */
    `#${scopeId} .rl-images{`,
    `  display:flex;gap:8px;margin:16px 0 0;flex-wrap:wrap`,
    `}`,
    `#${scopeId} .rl-img{`,
    `  width:80px;height:80px;object-fit:cover;border-radius:2px;`,
    `  cursor:zoom-in;transition:opacity 0.2s`,
    `}`,
    `#${scopeId} .rl-img:hover{opacity:0.8}`,

    /* Product info */
    `#${scopeId} .rl-product{`,
    `  font-family:var(--font-montserrat);font-weight:300;font-size:11px;`,
    `  color:#888;letter-spacing:0.06em;margin:8px 0 0`,
    `}`,

    /* Mobile */
    `@media(max-width:768px){`,
    `  #${scopeId} .rl-item{padding:28px 0}`,
    `}`,
  ].join('\n');

  if (reviews.length === 0) return null;

  return (
    <div id={scopeId}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
      {/* Bottom divider */}
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }} />
    </div>
  );
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

export const mockReviews: Review[] = [
  {
    id: '1',
    author: 'Camille D.',
    country: 'France',
    countryFlag: '🇫🇷',
    rating: 5,
    title: 'Softer than anything I own',
    body: 'The cashmere is incredibly soft and the fit is exactly as described. I ordered my usual size and it drapes beautifully. The oatmeal colour is warm and versatile — I have worn it every day since it arrived.',
    date: 'March 2, 2026',
    verified: true,
    images: [
      'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/2_b5b746b0-b008-4593-9da3-f06952603f17.webp?v=1769206938',
    ],
    productInfo: 'The Classic Cashmere Crew — Oatmeal / S',
  },
  {
    id: '2',
    author: 'Yuki T.',
    country: 'Japan',
    countryFlag: '🇯🇵',
    rating: 4,
    body: 'Very high quality merino. Lightweight yet warm. The only reason for 4 stars is the delivery took a bit longer than expected to Tokyo, but the product itself is perfect.',
    date: 'February 18, 2026',
    verified: true,
    productInfo: 'The Cloud-Soft Merino Layer — Ivory / M',
  },
  {
    id: '3',
    author: 'Sarah M.',
    country: 'United States',
    countryFlag: '🇺🇸',
    rating: 5,
    title: 'My new everyday essential',
    body: 'I was skeptical about spending this much on a base layer but it is worth every penny. The merino regulates temperature beautifully and it feels luxurious against the skin. Already planning my next order.',
    date: 'January 29, 2026',
    verified: true,
    images: [
      'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/1_449b9768-3f31-4671-ac0c-c5bbc73d9f2e.webp?v=1769206854',
      'https://cdn.shopify.com/s/files/1/0961/1965/2627/files/d2d364e9304d84eac1f3f4037b6f3638.webp?v=1768383731',
    ],
    productInfo: 'The Signature Cashmere Base Layer — Charcoal / S',
  },
];
