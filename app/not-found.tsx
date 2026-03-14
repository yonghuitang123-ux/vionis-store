/**
 * 404 页面
 * ─────────────────────────────────────────────────────────────────
 * 保持品牌风格 #E8DFD6
 */

import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '70vh',
        background: '#E8DFD6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-cormorant), "Cormorant", serif',
          fontSize: 48,
          fontWeight: 300,
          color: '#1a1a1a',
          marginBottom: 16,
          letterSpacing: '0.05em',
        }}
      >
        404
      </h1>
      <p
        style={{
          fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
          fontSize: 14,
          color: '#555',
          marginBottom: 32,
          letterSpacing: '0.04em',
        }}
      >
        Page not found
      </p>
      <Link
        href="/"
        style={{
          padding: '12px 28px',
          border: '1px solid #1a1a1a',
          color: '#1a1a1a',
          fontFamily: 'var(--font-montserrat)',
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          transition: 'all 0.25s ease',
        }}
      >
        Return Home
      </Link>
    </div>
  );
}
