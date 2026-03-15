'use client';

import { useId, useState } from 'react';
import StarRating from './StarRating';
import type { PublicReview } from '@/hooks/useReviews';

// ─── Props ───────────────────────────────────────────────────────────────────

export interface ReviewListProps {
  productId: string;
  reviews?: PublicReview[];
  loading?: boolean;
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

// ─── Format Date ─────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return iso;
  }
}

// ─── Single Review Card ──────────────────────────────────────────────────────

function ReviewItem({ review }: { review: PublicReview }) {
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
            <span className="rl-author-name">{review.displayName}</span>{' '}
            <span className="rl-author-country">
              {review.countryFlag} {review.country}
            </span>
          </div>
        </div>

        {/* Row 2: Title */}
        {review.title && <h3 className="rl-title">{review.title}</h3>}

        {/* Row 3: Body */}
        <p className="rl-body">{review.body}</p>

        {/* Row 4: Verified + Date */}
        <div className="rl-meta">
          {review.verified && (
            <span className="rl-verified">Verified Purchase</span>
          )}
          <span className="rl-date">{formatDate(review.createdAt)}</span>
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

const PAGE_SIZE = 3;

export default function ReviewList({
  reviews = [],
  loading,
}: ReviewListProps) {
  const scopeId = `rl${useId().replace(/:/g, '')}`;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visibleReviews = reviews.slice(0, visibleCount);
  const hasMore = visibleCount < reviews.length;

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

    /* Load more button */
    `#${scopeId} .rl-load-more{`,
    `  display:block;margin:40px auto 0;`,
    `  font-family:var(--font-montserrat);font-weight:500;font-size:11px;`,
    `  letter-spacing:0.2em;text-transform:uppercase;`,
    `  color:#1a1a1a;background:transparent;`,
    `  border:1px solid rgba(0,0,0,0.15);`,
    `  border-radius:0;padding:14px 40px;`,
    `  cursor:pointer;transition:border-color 0.2s`,
    `}`,
    `#${scopeId} .rl-load-more:hover{border-color:#1a1a1a}`,

    /* Loading */
    `#${scopeId} .rl-loading{`,
    `  text-align:center;padding:40px 0;`,
    `  font-family:var(--font-montserrat);font-weight:300;font-size:12px;color:#bbb`,
    `}`,

    /* Mobile */
    `@media(max-width:768px){`,
    `  #${scopeId} .rl-item{padding:28px 0}`,
    `}`,
  ].join('\n');

  if (loading) {
    return (
      <div id={scopeId}>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="rl-loading">Loading reviews…</div>
      </div>
    );
  }

  if (reviews.length === 0) return null;

  return (
    <div id={scopeId}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {visibleReviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
      {/* Bottom divider */}
      <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }} />

      {hasMore && (
        <button
          type="button"
          className="rl-load-more"
          onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
        >
          LOAD MORE REVIEWS
        </button>
      )}
    </div>
  );
}
