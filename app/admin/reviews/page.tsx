'use client';

/**
 * 评论后台管理页
 * ─────────────────────────────────────────────────────────────────
 * URL: /admin/reviews
 * 简单密码保护 → 三个标签页（待审核/已发布/已拒绝）
 * 操作：通过 / 拒绝 / 手动添加
 */

import { useState, useEffect, useCallback, useId } from 'react';
import { COUNTRIES } from '@/lib/countries';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AdminReview {
  id: string;
  productId: string;
  productTitle: string;
  author: string;
  displayName: string;
  email: string;
  country: string;
  countryFlag: string;
  rating: number;
  title: string;
  body: string;
  images: string[];
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  productInfo: string;
  createdAt: string;
}

type Tab = 'pending' | 'approved' | 'rejected';

// ─── Main Component ──────────────────────────────────────────────────────────

export default function AdminReviewsPage() {
  const scopeId = `ar${useId().replace(/:/g, '')}`;

  // Auth state
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState('');

  // Data state
  const [tab, setTab] = useState<Tab>('pending');
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Stored password
  const [storedPassword, setStoredPassword] = useState('');

  // Check sessionStorage for existing auth
  useEffect(() => {
    const saved = sessionStorage.getItem('review_admin_pw');
    if (saved) {
      setStoredPassword(saved);
      setAuthed(true);
    }
  }, []);

  // Fetch reviews when tab changes or after auth
  const fetchReviews = useCallback(
    async (status: Tab) => {
      const pw = storedPassword || password;
      if (!pw) return;
      setLoading(true);
      try {
        const res = await fetch(
          `/api/reviews/admin?status=${status}`,
          { headers: { 'x-admin-password': pw } },
        );
        if (res.status === 401) {
          setAuthed(false);
          setAuthError('Incorrect password');
          sessionStorage.removeItem('review_admin_pw');
          return;
        }
        const data = await res.json();
        setReviews(data);
      } catch {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    },
    [storedPassword, password],
  );

  useEffect(() => {
    if (authed) fetchReviews(tab);
  }, [authed, tab, fetchReviews]);

  // Login handler
  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError('');
      setLoading(true);
      try {
        const res = await fetch('/api/reviews/admin?status=pending', {
          headers: { 'x-admin-password': password },
        });
        if (res.status === 401) {
          setAuthError('Incorrect password');
          setLoading(false);
          return;
        }
        sessionStorage.setItem('review_admin_pw', password);
        setStoredPassword(password);
        setAuthed(true);
        const data = await res.json();
        setReviews(data);
      } catch {
        setAuthError('Network error');
      } finally {
        setLoading(false);
      }
    },
    [password],
  );

  // Update review status
  const updateStatus = useCallback(
    async (id: string, status: 'approved' | 'rejected') => {
      const pw = storedPassword || password;
      try {
        await fetch(`/api/reviews/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-admin-password': pw,
          },
          body: JSON.stringify({ status }),
        });
        fetchReviews(tab);
      } catch {
        /* ignore */
      }
    },
    [storedPassword, password, fetchReviews, tab],
  );

  // Format date
  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  // ── CSS ─────────────────────────────────────────────────────────────────
  const css = `
    #${scopeId}{font-family:var(--font-montserrat);max-width:960px;margin:0 auto;padding:0 24px 100px}

    /* Login */
    #${scopeId} .ar-login{max-width:360px;margin:80px auto;text-align:center}
    #${scopeId} .ar-login h1{font-family:var(--font-cormorant);font-size:28px;font-weight:300;color:#1a1a1a;margin:0 0 24px}
    #${scopeId} .ar-login input{width:100%;padding:14px 16px;border:1px solid rgba(0,0,0,0.12);font-family:var(--font-montserrat);font-size:14px;box-sizing:border-box;outline:none}
    #${scopeId} .ar-login input:focus{border-color:#1a1a1a}
    #${scopeId} .ar-login button{width:100%;margin-top:12px;padding:14px;background:#1a1a1a;color:#fff;border:none;font-family:var(--font-montserrat);font-weight:500;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer}
    #${scopeId} .ar-login .ar-error{color:#c44;font-size:12px;margin-top:10px}

    /* Header */
    #${scopeId} .ar-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;flex-wrap:wrap;gap:12px}
    #${scopeId} .ar-header h1{font-family:var(--font-cormorant);font-size:24px;font-weight:300;color:#1a1a1a;margin:0}
    #${scopeId} .ar-add-btn{padding:10px 24px;background:#1a1a1a;color:#fff;border:none;font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;font-family:var(--font-montserrat)}

    /* Tabs */
    #${scopeId} .ar-tabs{display:flex;gap:0;border-bottom:1px solid rgba(0,0,0,0.1);margin-bottom:24px}
    #${scopeId} .ar-tab{padding:12px 24px;background:none;border:none;border-bottom:2px solid transparent;font-family:var(--font-montserrat);font-size:11px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:#888;cursor:pointer;transition:all 0.2s}
    #${scopeId} .ar-tab.active{color:#1a1a1a;border-bottom-color:#1a1a1a}
    #${scopeId} .ar-tab:hover{color:#1a1a1a}
    #${scopeId} .ar-tab .ar-badge{display:inline-block;min-width:18px;height:18px;line-height:18px;text-align:center;border-radius:9px;background:rgba(0,0,0,0.06);font-size:10px;margin-left:6px;padding:0 5px}

    /* Review card */
    #${scopeId} .ar-card{border:1px solid rgba(0,0,0,0.08);padding:24px;margin-bottom:16px;background:#fff}
    #${scopeId} .ar-card-top{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap}
    #${scopeId} .ar-card-info{flex:1;min-width:200px}
    #${scopeId} .ar-card-stars{color:#C8B69E;font-size:16px;letter-spacing:2px}
    #${scopeId} .ar-card-author{font-weight:500;font-size:13px;color:#1a1a1a;margin-top:4px}
    #${scopeId} .ar-card-email{font-size:11px;color:#888;margin-top:2px}
    #${scopeId} .ar-card-country{font-size:12px;color:#888;margin-top:2px}
    #${scopeId} .ar-card-title{font-family:var(--font-cormorant);font-style:italic;font-size:17px;color:#1a1a1a;margin:12px 0 0}
    #${scopeId} .ar-card-body{font-size:13px;color:#555;line-height:1.7;margin:8px 0 0;font-weight:300}
    #${scopeId} .ar-card-product{font-size:11px;color:#888;margin-top:8px}
    #${scopeId} .ar-card-date{font-size:11px;color:#bbb;margin-top:8px}
    #${scopeId} .ar-card-images{display:flex;gap:8px;margin-top:12px;flex-wrap:wrap}
    #${scopeId} .ar-card-images img{width:64px;height:64px;object-fit:cover;border-radius:2px;cursor:pointer;border:1px solid rgba(0,0,0,0.06)}
    #${scopeId} .ar-card-verified{display:inline-block;font-size:10px;font-weight:500;letter-spacing:0.1em;color:#C8B69E;text-transform:uppercase;margin-top:8px}

    /* Actions */
    #${scopeId} .ar-actions{display:flex;gap:8px;flex-shrink:0;align-items:flex-start}
    #${scopeId} .ar-btn-approve{padding:8px 18px;background:#2d7a4f;color:#fff;border:none;font-size:11px;font-weight:500;letter-spacing:0.08em;cursor:pointer;font-family:var(--font-montserrat)}
    #${scopeId} .ar-btn-reject{padding:8px 18px;background:transparent;color:#c44;border:1px solid #c44;font-size:11px;font-weight:500;letter-spacing:0.08em;cursor:pointer;font-family:var(--font-montserrat)}

    /* Empty */
    #${scopeId} .ar-empty{text-align:center;padding:60px 0;color:#bbb;font-size:13px;font-weight:300}

    /* Loading */
    #${scopeId} .ar-loading{text-align:center;padding:40px 0;color:#bbb;font-size:13px}

    /* Modal overlay */
    #${scopeId} .ar-overlay{position:fixed;inset:0;z-index:9998;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;padding:24px}
    #${scopeId} .ar-modal{background:#fff;max-width:560px;width:100%;max-height:90vh;overflow-y:auto;padding:32px}
    #${scopeId} .ar-modal h2{font-family:var(--font-cormorant);font-size:22px;font-weight:300;margin:0 0 24px;color:#1a1a1a}
    #${scopeId} .ar-modal-field{margin-bottom:16px}
    #${scopeId} .ar-modal-label{display:block;font-size:11px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#1a1a1a;margin-bottom:6px}
    #${scopeId} .ar-modal input,#${scopeId} .ar-modal textarea,#${scopeId} .ar-modal select{width:100%;padding:10px 12px;border:1px solid rgba(0,0,0,0.12);font-family:var(--font-montserrat);font-size:13px;box-sizing:border-box;outline:none}
    #${scopeId} .ar-modal textarea{min-height:80px;resize:vertical;line-height:1.6}
    #${scopeId} .ar-modal select{appearance:none;cursor:pointer}
    #${scopeId} .ar-modal input:focus,#${scopeId} .ar-modal textarea:focus,#${scopeId} .ar-modal select:focus{border-color:#1a1a1a}
    #${scopeId} .ar-modal-row{display:flex;gap:12px}
    #${scopeId} .ar-modal-row>*{flex:1}
    #${scopeId} .ar-modal-check{display:flex;align-items:center;gap:8px;font-size:12px;color:#555}
    #${scopeId} .ar-modal-check input{width:auto}
    #${scopeId} .ar-modal-actions{display:flex;gap:12px;margin-top:24px}
    #${scopeId} .ar-modal-submit{flex:1;padding:12px;background:#1a1a1a;color:#fff;border:none;font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;font-family:var(--font-montserrat)}
    #${scopeId} .ar-modal-cancel{flex:1;padding:12px;background:transparent;color:#1a1a1a;border:1px solid rgba(0,0,0,0.15);font-size:11px;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;font-family:var(--font-montserrat)}

    /* Lightbox */
    #${scopeId} .ar-lightbox{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;cursor:zoom-out}
    #${scopeId} .ar-lightbox img{max-width:90vw;max-height:90vh;object-fit:contain}

    @media(max-width:768px){
      #${scopeId} .ar-card-top{flex-direction:column}
      #${scopeId} .ar-modal-row{flex-direction:column;gap:0}
    }
  `;

  // ── Render Stars ────────────────────────────────────────────────────────
  const renderStars = (rating: number) =>
    '★'.repeat(rating) + '☆'.repeat(5 - rating);

  // ── Login Screen ────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div id={scopeId}>
        <style dangerouslySetInnerHTML={{ __html: css }} />
        <div className="ar-login">
          <h1>Review Management</h1>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Verifying…' : 'Login'}
            </button>
            {authError && <p className="ar-error">{authError}</p>}
          </form>
        </div>
      </div>
    );
  }

  // ── Main Admin View ─────────────────────────────────────────────────────
  return (
    <div id={scopeId}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Lightbox */}
      {lightboxSrc && (
        <div className="ar-lightbox" onClick={() => setLightboxSrc(null)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={lightboxSrc} alt="Review image enlarged" />
        </div>
      )}

      {/* Header */}
      <div className="ar-header">
        <h1>Review Management</h1>
        <button
          type="button"
          className="ar-add-btn"
          onClick={() => setShowAddModal(true)}
        >
          + Add Review
        </button>
      </div>

      {/* Tabs */}
      <div className="ar-tabs">
        {(['pending', 'approved', 'rejected'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            className={`ar-tab${tab === t ? ' active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="ar-loading">Loading…</div>
      ) : reviews.length === 0 ? (
        <div className="ar-empty">No {tab} reviews</div>
      ) : (
        reviews.map((r) => (
          <div key={r.id} className="ar-card">
            <div className="ar-card-top">
              <div className="ar-card-info">
                <div className="ar-card-stars">{renderStars(r.rating)}</div>
                <div className="ar-card-author">
                  {r.author} ({r.displayName})
                </div>
                {r.email && (
                  <div className="ar-card-email">{r.email}</div>
                )}
                <div className="ar-card-country">
                  {r.countryFlag} {r.country}
                </div>
                {r.title && (
                  <div className="ar-card-title">{r.title}</div>
                )}
                <div className="ar-card-body">{r.body}</div>
                {r.productTitle && (
                  <div className="ar-card-product">
                    Product: {r.productTitle}
                    {r.productInfo ? ` — ${r.productInfo}` : ''}
                  </div>
                )}
                {r.verified && (
                  <div className="ar-card-verified">
                    Verified Buyer
                  </div>
                )}
                <div className="ar-card-date">{formatDate(r.createdAt)}</div>
                {r.images.length > 0 && (
                  <div className="ar-card-images">
                    {r.images.map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={i}
                        src={src}
                        alt={`Review image ${i + 1}`}
                        onClick={() => setLightboxSrc(src)}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="ar-actions">
                {r.status !== 'approved' && (
                  <button
                    type="button"
                    className="ar-btn-approve"
                    onClick={() => updateStatus(r.id, 'approved')}
                  >
                    Approve
                  </button>
                )}
                {r.status !== 'rejected' && (
                  <button
                    type="button"
                    className="ar-btn-reject"
                    onClick={() => updateStatus(r.id, 'rejected')}
                  >
                    Reject
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}

      {/* Add Review Modal */}
      {showAddModal && (
        <AddReviewModal
          scopeId={scopeId}
          password={storedPassword}
          onClose={() => setShowAddModal(false)}
          onCreated={() => {
            setShowAddModal(false);
            fetchReviews(tab);
          }}
        />
      )}
    </div>
  );
}

// ─── Add Review Modal ────────────────────────────────────────────────────────

interface SimpleProduct {
  id: string;
  title: string;
  handle: string;
  image: string;
}

function AddReviewModal({
  scopeId,
  password,
  onClose,
  onCreated,
}: {
  scopeId: string;
  password: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [form, setForm] = useState({
    productTitle: '',
    productId: '',
    author: '',
    country: '',
    rating: 5,
    title: '',
    body: '',
    verified: true,
    productInfo: '',
    createdAt: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [products, setProducts] = useState<SimpleProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // 加载产品列表
  useEffect(() => {
    fetch('/api/reviews/products', {
      headers: { 'x-admin-password': password },
    })
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(() => {})
      .finally(() => setProductsLoading(false));
  }, [password]);

  const update = (key: string, value: any) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleProductSelect = (productId: string) => {
    const p = products.find((x) => x.id === productId);
    if (p) {
      setForm((f) => ({
        ...f,
        productId: p.id,
        productTitle: p.title,
      }));
    } else {
      setForm((f) => ({ ...f, productId: '', productTitle: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.author || !form.country || !form.body) return;
    setSubmitting(true);
    try {
      const payload: any = {
        ...form,
        status: 'approved',
      };
      // 如果填了自定义日期，传给后端
      if (form.createdAt) {
        payload.createdAt = new Date(form.createdAt).toISOString();
      }
      delete payload.createdAt; // 先删掉，下面重新加
      if (form.createdAt) {
        payload.createdAt = new Date(form.createdAt).toISOString();
      }

      await fetch('/api/reviews/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password,
        },
        body: JSON.stringify(payload),
      });
      onCreated();
    } catch {
      /* ignore */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="ar-overlay" onClick={onClose}>
      <div className="ar-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add Review Manually</h2>
        <form onSubmit={handleSubmit}>
          {/* Product Selector */}
          <div className="ar-modal-field">
            <label className="ar-modal-label">Select Product</label>
            <select
              value={form.productId}
              onChange={(e) => handleProductSelect(e.target.value)}
            >
              <option value="">
                {productsLoading ? 'Loading products…' : '— Select a product —'}
              </option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="ar-modal-row">
            <div className="ar-modal-field">
              <label className="ar-modal-label">Customer Name</label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => update('author', e.target.value)}
                required
                placeholder="Camille Dupont"
              />
            </div>
            <div className="ar-modal-field">
              <label className="ar-modal-label">Country</label>
              <select
                value={form.country}
                onChange={(e) => update('country', e.target.value)}
                required
              >
                <option value="" disabled>
                  Select
                </option>
                {COUNTRIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rating */}
          <div className="ar-modal-field">
            <label className="ar-modal-label">Rating</label>
            <select
              value={form.rating}
              onChange={(e) => update('rating', Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {'★'.repeat(n)}{'☆'.repeat(5 - n)} ({n})
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="ar-modal-field">
            <label className="ar-modal-label">Review Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="My new everyday essential"
            />
          </div>

          {/* Body */}
          <div className="ar-modal-field">
            <label className="ar-modal-label">Review Content</label>
            <textarea
              value={form.body}
              onChange={(e) => update('body', e.target.value)}
              required
              placeholder="Write the review content…"
            />
          </div>

          {/* Product Variant Info */}
          <div className="ar-modal-field">
            <label className="ar-modal-label">
              Product Variant (Optional)
            </label>
            <input
              type="text"
              value={form.productInfo}
              onChange={(e) => update('productInfo', e.target.value)}
              placeholder="Oatmeal / S"
            />
          </div>

          {/* Date */}
          <div className="ar-modal-field">
            <label className="ar-modal-label">
              Review Date (leave empty for now)
            </label>
            <input
              type="datetime-local"
              value={form.createdAt}
              onChange={(e) => update('createdAt', e.target.value)}
            />
          </div>

          {/* Verified */}
          <div className="ar-modal-field">
            <label className="ar-modal-check">
              <input
                type="checkbox"
                checked={form.verified}
                onChange={(e) => update('verified', e.target.checked)}
              />
              Show &quot;Verified Buyer&quot; badge
            </label>
          </div>

          {/* Actions */}
          <div className="ar-modal-actions">
            <button
              type="button"
              className="ar-modal-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="ar-modal-submit"
              disabled={submitting}
            >
              {submitting ? 'Creating…' : 'Create Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
