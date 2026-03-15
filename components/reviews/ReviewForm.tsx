'use client';

/**
 * ReviewForm — 客户评论提交表单
 * ─────────────────────────────────────────────────────────────────
 * 通过 token 访问：/review?token=xxx
 * token 包含 productId + productTitle
 * 提交后显示感谢页面
 */

import { useId, useState, useCallback, useRef } from 'react';
import StarRating from './StarRating';
import { COUNTRIES } from '@/lib/countries';

// ─── Props ───────────────────────────────────────────────────────────────────

export interface ReviewFormProps {
  productId: string;
  productTitle: string;
  email?: string;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ReviewForm({
  productId,
  productTitle,
  email: initialEmail,
}: ReviewFormProps) {
  const scopeId = `rf${useId().replace(/:/g, '')}`;

  // Form state
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(initialEmail || '');
  const [country, setCountry] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Image upload handler
  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const remaining = 4 - images.length;
      const toProcess = Array.from(files).slice(0, remaining);

      toProcess.forEach((file) => {
        if (!file.type.startsWith('image/')) return;
        if (file.size > 5 * 1024 * 1024) return; // skip > 5MB

        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          setImages((prev) => {
            if (prev.length >= 4) return prev;
            return [...prev, result];
          });
        };
        reader.readAsDataURL(file);
      });

      // Reset input
      if (fileRef.current) fileRef.current.value = '';
    },
    [images.length],
  );

  const removeImage = useCallback((index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Submit handler
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');

      if (rating === 0) {
        setError('Please select a star rating');
        return;
      }
      if (!body.trim()) {
        setError('Please write your review');
        return;
      }
      if (!name.trim()) {
        setError('Please enter your name');
        return;
      }
      if (!country) {
        setError('Please select your country');
        return;
      }

      setSubmitting(true);

      try {
        const res = await fetch('/api/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId,
            productTitle,
            author: name.trim(),
            email: email.trim(),
            country,
            rating,
            title: title.trim(),
            body: body.trim(),
            images,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to submit review');
        }

        setSubmitted(true);
      } catch (err: any) {
        setError(err.message || 'Something went wrong. Please try again.');
      } finally {
        setSubmitting(false);
      }
    },
    [rating, title, body, name, email, country, images, productId, productTitle],
  );

  // ── Scoped CSS ──────────────────────────────────────────────────────────
  const css = [
    `#${scopeId}{max-width:640px;margin:0 auto;padding:0 30px}`,

    /* Header */
    `#${scopeId} .rf-header{text-align:center;margin-bottom:48px}`,
    `#${scopeId} .rf-title{`,
    `  font-family:var(--font-cormorant);font-weight:300;font-size:32px;`,
    `  color:#1a1a1a;margin:0 0 8px;line-height:1.3`,
    `}`,
    `#${scopeId} .rf-subtitle{`,
    `  font-family:var(--font-montserrat);font-weight:300;font-size:13px;`,
    `  color:#888;letter-spacing:0.04em`,
    `}`,

    /* Form fields */
    `#${scopeId} .rf-field{margin-bottom:28px}`,
    `#${scopeId} .rf-label{`,
    `  display:block;font-family:var(--font-montserrat);font-weight:500;`,
    `  font-size:11px;letter-spacing:0.08em;text-transform:uppercase;`,
    `  color:#1a1a1a;margin-bottom:10px`,
    `}`,
    `#${scopeId} .rf-input,#${scopeId} .rf-textarea,#${scopeId} .rf-select{`,
    `  width:100%;padding:14px 16px;`,
    `  font-family:var(--font-montserrat);font-weight:300;font-size:14px;`,
    `  color:#1a1a1a;background:#fff;`,
    `  border:1px solid rgba(0,0,0,0.12);border-radius:0;`,
    `  outline:none;transition:border-color 0.2s;`,
    `  box-sizing:border-box`,
    `}`,
    `#${scopeId} .rf-input:focus,#${scopeId} .rf-textarea:focus,#${scopeId} .rf-select:focus{`,
    `  border-color:#1a1a1a`,
    `}`,
    `#${scopeId} .rf-textarea{resize:vertical;min-height:120px;line-height:1.7}`,
    `#${scopeId} .rf-select{appearance:none;cursor:pointer;`,
    `  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");`,
    `  background-repeat:no-repeat;background-position:right 16px center`,
    `}`,

    /* Star rating area */
    `#${scopeId} .rf-stars{`,
    `  display:flex;align-items:center;gap:8px;padding:4px 0`,
    `}`,
    `#${scopeId} .rf-stars-hint{`,
    `  font-family:var(--font-montserrat);font-weight:300;font-size:12px;color:#bbb`,
    `}`,

    /* Image upload */
    `#${scopeId} .rf-images{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}`,
    `#${scopeId} .rf-img-thumb{`,
    `  width:72px;height:72px;border-radius:2px;object-fit:cover;`,
    `  border:1px solid rgba(0,0,0,0.08);position:relative`,
    `}`,
    `#${scopeId} .rf-img-wrap{position:relative;display:inline-block}`,
    `#${scopeId} .rf-img-remove{`,
    `  position:absolute;top:-6px;right:-6px;width:20px;height:20px;`,
    `  border-radius:50%;background:#1a1a1a;color:#fff;border:none;`,
    `  font-size:11px;cursor:pointer;display:flex;align-items:center;`,
    `  justify-content:center;line-height:1`,
    `}`,
    `#${scopeId} .rf-img-add{`,
    `  width:72px;height:72px;border:1px dashed rgba(0,0,0,0.15);`,
    `  display:flex;align-items:center;justify-content:center;`,
    `  cursor:pointer;font-size:24px;color:#bbb;transition:border-color 0.2s;`,
    `  background:transparent;border-radius:2px`,
    `}`,
    `#${scopeId} .rf-img-add:hover{border-color:#888;color:#888}`,

    /* Row layout */
    `#${scopeId} .rf-row{display:flex;gap:16px}`,
    `#${scopeId} .rf-row>*{flex:1}`,

    /* Submit */
    `#${scopeId} .rf-submit{`,
    `  width:100%;padding:16px 0;margin-top:12px;`,
    `  font-family:var(--font-montserrat);font-weight:500;font-size:12px;`,
    `  letter-spacing:0.16em;text-transform:uppercase;`,
    `  color:#fff;background:#1a1a1a;border:1.5px solid #1a1a1a;`,
    `  cursor:pointer;transition:opacity 0.2s`,
    `}`,
    `#${scopeId} .rf-submit:disabled{opacity:0.5;cursor:not-allowed}`,
    `#${scopeId} .rf-submit:not(:disabled):hover{opacity:0.85}`,

    /* Error */
    `#${scopeId} .rf-error{`,
    `  font-family:var(--font-montserrat);font-weight:400;font-size:12px;`,
    `  color:#c44;margin-bottom:16px;text-align:center`,
    `}`,

    /* Thank you */
    `#${scopeId} .rf-thanks{text-align:center;padding:60px 0}`,
    `#${scopeId} .rf-thanks-icon{font-size:48px;margin-bottom:20px}`,
    `#${scopeId} .rf-thanks-title{`,
    `  font-family:var(--font-cormorant);font-weight:300;font-size:28px;`,
    `  color:#1a1a1a;margin:0 0 12px`,
    `}`,
    `#${scopeId} .rf-thanks-text{`,
    `  font-family:var(--font-montserrat);font-weight:300;font-size:14px;`,
    `  color:#888;line-height:1.7`,
    `}`,

    /* Mobile */
    `@media(max-width:768px){`,
    `  #${scopeId} .rf-row{flex-direction:column;gap:0}`,
    `}`,
  ].join('\n');

  // ── Thank You Screen ───────────────────────────────────────────────────
  if (submitted) {
    return (
      <div id={scopeId}>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="rf-thanks">
          <div className="rf-thanks-icon">✨</div>
          <h2 className="rf-thanks-title">Thank You</h2>
          <p className="rf-thanks-text">
            Your review has been submitted and will be published
            <br />
            after a brief review by our team.
          </p>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────
  return (
    <div id={scopeId}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="rf-header">
        <h1 className="rf-title">Share Your Experience</h1>
        <p className="rf-subtitle">{productTitle}</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Star Rating */}
        <div className="rf-field">
          <label className="rf-label">Your Rating</label>
          <div className="rf-stars">
            <StarRating
              rating={rating}
              size="large"
              interactive
              onChange={setRating}
            />
            <span className="rf-stars-hint">
              {rating > 0 ? `${rating} / 5` : 'Click to rate'}
            </span>
          </div>
        </div>

        {/* Title */}
        <div className="rf-field">
          <label className="rf-label">Review Title (Optional)</label>
          <input
            type="text"
            className="rf-input"
            placeholder="Summarise your experience"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={120}
          />
        </div>

        {/* Body */}
        <div className="rf-field">
          <label className="rf-label">Your Review</label>
          <textarea
            className="rf-textarea"
            placeholder="Tell us about the quality, fit, and how you wear it…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={2000}
            required
          />
        </div>

        {/* Images */}
        <div className="rf-field">
          <label className="rf-label">Photos (Optional, max 4)</label>
          <div className="rf-images">
            {images.map((src, i) => (
              <div key={i} className="rf-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Upload ${i + 1}`} className="rf-img-thumb" />
                <button
                  type="button"
                  className="rf-img-remove"
                  onClick={() => removeImage(i)}
                  aria-label="Remove image"
                >
                  ×
                </button>
              </div>
            ))}
            {images.length < 4 && (
              <button
                type="button"
                className="rf-img-add"
                onClick={() => fileRef.current?.click()}
                aria-label="Add photo"
              >
                +
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageSelect}
            style={{ display: 'none' }}
          />
        </div>

        {/* Name + Country */}
        <div className="rf-row">
          <div className="rf-field">
            <label className="rf-label">Your Name</label>
            <input
              type="text"
              className="rf-input"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={60}
            />
          </div>
          <div className="rf-field">
            <label className="rf-label">Country</label>
            <select
              className="rf-select"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            >
              <option value="" disabled>
                Select country
              </option>
              {COUNTRIES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Email (optional) */}
        <div className="rf-field">
          <label className="rf-label">Email (Optional, not displayed)</label>
          <input
            type="email"
            className="rf-input"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={120}
          />
        </div>

        {/* Error */}
        {error && <p className="rf-error">{error}</p>}

        {/* Submit */}
        <button
          type="submit"
          className="rf-submit"
          disabled={submitting}
        >
          {submitting ? 'SUBMITTING…' : 'SUBMIT REVIEW'}
        </button>
      </form>
    </div>
  );
}
