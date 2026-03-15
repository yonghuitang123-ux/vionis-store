'use client';

/**
 * 全局错误边界
 * ─────────────────────────────────────────────────────────────────
 * 捕获未处理的错误，展示友好提示
 */

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: '60vh',
        background: '#E8DFD6',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-cormorant), "Cormorant", serif',
          fontSize: 24,
          fontWeight: 400,
          color: '#1a1a1a',
          marginBottom: 12,
        }}
      >
        Something went wrong
      </h2>
      <p
        style={{
          fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
          fontSize: 14,
          color: '#555',
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        We apologize for the inconvenience. Please try again.
      </p>
      <button
        onClick={reset}
        style={{
          padding: '12px 28px',
          border: '1px solid #1a1a1a',
          background: 'transparent',
          color: '#1a1a1a',
          fontFamily: 'var(--font-montserrat)',
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.25s ease',
        }}
      >
        Try again
      </button>
    </div>
  );
}
