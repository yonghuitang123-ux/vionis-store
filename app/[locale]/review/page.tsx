'use client';

/**
 * 客户评论提交页
 * ─────────────────────────────────────────────────────────────────
 * URL: /review?token=xxx
 * token = base64url({ productId, productTitle, email? })
 *
 * 生成 token 示例（后台 / 邮件中使用）：
 *   btoa(JSON.stringify({ productId: 'gid://shopify/Product/123', productTitle: 'The Classic Cashmere Crew' }))
 */

import { useSearchParams } from 'next/navigation';
import { Suspense, useMemo } from 'react';
import ReviewForm from '@/components/reviews/ReviewForm';

function ReviewPageContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const decoded = useMemo(() => {
    if (!token) return null;
    try {
      // 支持 base64url 和标准 base64
      const json = atob(token.replace(/-/g, '+').replace(/_/g, '/'));
      const data = JSON.parse(json);
      if (!data.productId) return null;
      return data as {
        productId: string;
        productTitle: string;
        email?: string;
      };
    } catch {
      return null;
    }
  }, [token]);

  if (!token || !decoded) {
    return (
      <div
        style={{
          maxWidth: 480,
          margin: '0 auto',
          padding: '80px 30px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 28,
            fontWeight: 300,
            color: '#1a1a1a',
            margin: '0 0 16px',
          }}
        >
          Invalid Review Link
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: 14,
            fontWeight: 300,
            color: '#888',
            lineHeight: 1.7,
          }}
        >
          This review link is invalid or has expired.
          <br />
          Please use the link provided in your order confirmation email.
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 0 100px' }}>
      <ReviewForm
        productId={decoded.productId}
        productTitle={decoded.productTitle}
        email={decoded.email}
        verified={!!decoded.email}
      />
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            textAlign: 'center',
            padding: '80px 30px',
            fontFamily: 'var(--font-montserrat)',
            fontSize: 13,
            color: '#bbb',
          }}
        >
          Loading…
        </div>
      }
    >
      <ReviewPageContent />
    </Suspense>
  );
}
