'use client';

/**
 * 全屏搜索弹窗组件
 * ─────────────────────────────────────────────────────────────────
 * 半透明全屏遮罩，居中搜索框 + 防抖请求 + 产品网格结果展示。
 * 通过 isOpen / onClose 由父组件控制显隐。
 */

import { searchProducts } from '@/lib/shopify';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

// ─── 品牌设计 Token ──────────────────────────────────────────────────────────
const BG_PAGE = '#E8DFD6';
const TEXT    = '#1a1a1a';
const ACCENT  = '#A05E46';
const HEADING = 'var(--font-cormorant), "Cormorant", serif';
const BODY    = 'var(--font-montserrat), "Montserrat", sans-serif';

// ─── 搜索结果产品类型 ────────────────────────────────────────────────────────
interface SearchProduct {
  id: string;
  title: string;
  handle: string;
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  images: {
    edges: { node: { url: string; altText?: string } }[];
  };
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── 主组件 ──────────────────────────────────────────────────────────────────

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery]       = useState('');
  const [results, setResults]   = useState<SearchProduct[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const uid      = useId();
  const scopeId  = `sm${uid.replace(/:/g, '')}`;

  // 打开时聚焦输入框、重置状态
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResults([]);
      setSearched(false);
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen]);

  // ESC 键关闭
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // 打开时禁止页面滚动
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // 防抖搜索（400ms）
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { products } = await searchProducts(query.trim(), 12);
        setResults(products);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
        setSearched(true);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  // 点击结果后关闭弹窗
  const handleResultClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const fmtPrice = (amount: string, currency: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(parseFloat(amount));

  // ─── 响应式样式 ────────────────────────────────────────────────────────────
  const css = `
    #${scopeId} { display: ${isOpen ? 'flex' : 'none'}; }
    #${scopeId} .sm-overlay {
      position: fixed; inset: 0; z-index: 1100;
      background: rgba(0,0,0,0.55);
      display: flex; flex-direction: column; align-items: center;
      padding: 0 20px;
      overflow-y: auto;
      animation: sm-fade 0.25s ease;
    }
    @keyframes sm-fade { from { opacity: 0; } to { opacity: 1; } }
    #${scopeId} .sm-container {
      width: 100%; max-width: 900px;
      margin-top: 10vh;
      margin-bottom: 40px;
    }
    #${scopeId} .sm-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }
    @media (min-width: 640px) {
      #${scopeId} .sm-grid { grid-template-columns: repeat(4, 1fr); }
    }
    #${scopeId} .sm-card:hover .sm-card-img img {
      transform: scale(1.04);
    }
    #${scopeId} a { color: inherit; text-decoration: none; }
  `;

  return (
    <div id={scopeId}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <div className="sm-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="sm-container">

          {/* 搜索栏 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 12,
            marginBottom: 36,
          }}>
            {/* 搜索图标 */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="1.6" style={{ flexShrink: 0 }}>
              <circle cx="8.5" cy="8.5" r="6.5" />
              <line x1="13.5" y1="13.5" x2="18" y2="18" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products…"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.4)',
                padding: '10px 0',
                fontFamily: BODY,
                fontSize: 18,
                fontWeight: 300,
                color: '#fff',
                outline: 'none',
                letterSpacing: '0.06em',
              }}
            />
            <button
              onClick={onClose}
              aria-label="Close search"
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 4, color: '#fff', flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="2" y1="2" x2="18" y2="18" />
                <line x1="18" y1="2" x2="2" y2="18" />
              </svg>
            </button>
          </div>

          {/* 加载状态 */}
          {loading && (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{
                width: 24, height: 24, margin: '0 auto',
                border: '2px solid rgba(255,255,255,0.2)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                animation: 'sm-spin 0.7s linear infinite',
              }} />
              <style dangerouslySetInnerHTML={{ __html: `@keyframes sm-spin{to{transform:rotate(360deg)}}` }} />
            </div>
          )}

          {/* 无结果 */}
          {!loading && searched && results.length === 0 && (
            <p style={{
              textAlign: 'center', padding: '40px 0',
              fontFamily: BODY, fontSize: 14, color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.05em',
            }}>
              No results found for &ldquo;{query}&rdquo;
            </p>
          )}

          {/* 结果网格 */}
          {!loading && results.length > 0 && (
            <div className="sm-grid">
              {results.map((product) => {
                const imgNode = product.images?.edges?.[0]?.node;
                const price   = product.priceRange.minVariantPrice;
                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.handle}`}
                    onClick={handleResultClick}
                    className="sm-card"
                    style={{ display: 'block' }}
                  >
                    {/* 产品图片 4:5 */}
                    <div
                      className="sm-card-img"
                      style={{
                        position: 'relative', overflow: 'hidden',
                        aspectRatio: '4/5',
                        background: BG_PAGE,
                        marginBottom: 10,
                      }}
                    >
                      {imgNode && (
                        <Image
                          src={imgNode.url}
                          alt={imgNode.altText ?? product.title}
                          fill
                          sizes="(max-width: 639px) 45vw, 22vw"
                          style={{
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                          }}
                        />
                      )}
                    </div>
                    <p style={{
                      fontFamily: BODY, fontSize: 12, fontWeight: 500,
                      color: '#fff', margin: '0 0 3px',
                      letterSpacing: '0.03em', lineHeight: 1.4,
                    }}>
                      {product.title}
                    </p>
                    <p style={{
                      fontFamily: BODY, fontSize: 12, fontWeight: 400,
                      color: 'rgba(255,255,255,0.7)', margin: 0,
                    }}>
                      {fmtPrice(price.amount, price.currencyCode)}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
