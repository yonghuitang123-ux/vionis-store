'use client';

import { useId } from 'react';
import StarRating from './StarRating';
import type { Review } from './ReviewList';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ReviewSummaryProps {
  reviews: Review[];
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ReviewSummary({ reviews }: ReviewSummaryProps) {
  const scopeId = `rs${useId().replace(/:/g, '')}`;

  // ── Calculate stats ─────────────────────────────────────────────────────
  const total = reviews.length;
  const avg = total > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / total
    : 0;
  const avgDisplay = avg.toFixed(1);

  // Distribution: count per star
  const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    const star = Math.round(r.rating);
    if (dist[star] !== undefined) dist[star]++;
  });

  // ── Scoped CSS ──────────────────────────────────────────────────────────
  const css = [
    `#${scopeId}{padding:0 30px;max-width:800px;margin:0 auto}`,

    /* Section heading */
    `#${scopeId} .rs-heading{`,
    `  font-family:var(--font-montserrat);font-weight:500;font-size:11px;`,
    `  letter-spacing:0.2em;color:#888;text-align:center;`,
    `  text-transform:uppercase;margin-bottom:48px`,
    `}`,

    /* Two-column layout */
    `#${scopeId} .rs-grid{display:flex;gap:60px;align-items:center}`,

    /* Left: score */
    `#${scopeId} .rs-score{flex-shrink:0;text-align:center;min-width:120px}`,
    `#${scopeId} .rs-avg{`,
    `  font-family:var(--font-cormorant);font-style:italic;font-weight:300;`,
    `  font-size:72px;line-height:1;color:#1a1a1a`,
    `}`,
    `#${scopeId} .rs-stars{display:flex;justify-content:center;margin-top:12px}`,
    `#${scopeId} .rs-count{`,
    `  font-family:var(--font-montserrat);font-weight:300;font-size:12px;`,
    `  color:#888;letter-spacing:0.1em;margin-top:8px`,
    `}`,

    /* Right: distribution bars */
    `#${scopeId} .rs-bars{flex:1;display:flex;flex-direction:column;gap:10px}`,
    `#${scopeId} .rs-bar-row{display:flex;align-items:center;gap:12px}`,
    `#${scopeId} .rs-bar-label{`,
    `  font-family:var(--font-montserrat);font-weight:300;font-size:12px;`,
    `  color:#888;width:14px;text-align:right;flex-shrink:0`,
    `}`,
    `#${scopeId} .rs-bar-track{`,
    `  flex:1;height:2px;background:rgba(0,0,0,0.08);border-radius:1px;overflow:hidden`,
    `}`,
    `#${scopeId} .rs-bar-fill{`,
    `  height:100%;background:#C4A882;border-radius:1px;`,
    `  transition:width 0.6s ease`,
    `}`,
    `#${scopeId} .rs-bar-pct{`,
    `  font-family:var(--font-montserrat);font-weight:300;font-size:11px;`,
    `  color:#bbb;width:32px;text-align:right;flex-shrink:0`,
    `}`,

    /* Mobile: stack vertically */
    `@media(max-width:768px){`,
    `  #${scopeId} .rs-grid{flex-direction:column;gap:36px;align-items:stretch}`,
    `  #${scopeId} .rs-score{text-align:center}`,
    `  #${scopeId} .rs-bars{width:100%}`,
    `}`,
  ].join('\n');

  if (total === 0) return null;

  return (
    <div id={scopeId}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <p className="rs-heading">What Our Clients Say</p>

      <div className="rs-grid">
        {/* Left: average score */}
        <div className="rs-score">
          <div className="rs-avg">{avgDisplay}</div>
          <div className="rs-stars">
            <StarRating rating={avg} size="medium" />
          </div>
          <div className="rs-count">
            {total} review{total !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Right: distribution bars */}
        <div className="rs-bars">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = dist[star];
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={star} className="rs-bar-row">
                <span className="rs-bar-label">{star}</span>
                <div className="rs-bar-track">
                  <div className="rs-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="rs-bar-pct">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
