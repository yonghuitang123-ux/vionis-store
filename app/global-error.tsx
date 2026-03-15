'use client';

/**
 * 根级全局错误边界
 * ─────────────────────────────────────────────────────────────────
 * 当 root layout 本身崩溃时兜底，必须自带完整 <html><body>
 */

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          background: '#E8DFD6',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: '"Montserrat", system-ui, sans-serif',
          padding: 40,
        }}
      >
        <h1
          style={{
            fontFamily: '"Cormorant", serif',
            fontSize: 28,
            fontWeight: 400,
            color: '#1a1a1a',
            marginBottom: 12,
          }}
        >
          Something went wrong
        </h1>
        <p style={{ fontSize: 14, color: '#555', marginBottom: 24, textAlign: 'center' }}>
          An unexpected error occurred. Please try refreshing the page.
        </p>
        <button
          onClick={reset}
          style={{
            padding: '12px 28px',
            border: '1px solid #1a1a1a',
            background: 'transparent',
            color: '#1a1a1a',
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
