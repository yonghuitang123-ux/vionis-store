'use client';

/**
 * 回到顶部按钮组件
 * ─────────────────────────────────────────────────────────────────
 * 固定在右下角的圆形按钮，当页面滚动超过 400px 时显示，
 * 点击后平滑滚动到页面顶部。
 */

import { useCallback, useEffect, useState } from 'react';

// ─── 品牌设计 Token ──────────────────────────────────────────────────────────
const TEXT = '#1a1a1a';

// ─── 主组件 ──────────────────────────────────────────────────────────────────

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  // 监听滚动位置
  useEffect(() => {
    const handler = () => setShow(window.scrollY > 400);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      style={{
        position: 'fixed',
        right: 30,
        bottom: 30,
        zIndex: 900,
        width: 44,
        height: 44,
        borderRadius: '50%',
        border: '1px solid rgba(0,0,0,0.15)',
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(6px)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 0,
        opacity: show ? 1 : 0,
        pointerEvents: show ? 'auto' : 'none',
        transform: show ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        color: TEXT,
      }}
    >
      {/* 向上箭头 SVG */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="8" y1="14" x2="8" y2="3" />
        <polyline points="3,7 8,2 13,7" />
      </svg>
    </button>
  );
}
