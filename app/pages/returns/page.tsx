/**
 * Returns & Exchanges 页面
 * ─────────────────────────────────────────────────────────────────
 * 退换政策：30 天退货、退货流程、换货、退款处理
 */

import { type Metadata } from 'next';
import { type CSSProperties } from 'react';
import Breadcrumb from '@/components/Breadcrumb';

// ─── SEO 元数据 ──────────────────────────────────────────────────────────────
export function generateMetadata(): Metadata {
  return {
    title: 'Returns & Exchanges — VIONIS·XY',
    description:
      'Enjoy 30-day free returns on all VIONIS·XY orders. Hassle-free exchanges and full refunds — because your satisfaction is our priority.',
    openGraph: {
      title: 'Returns & Exchanges — VIONIS·XY',
      description: '30-day free returns. Hassle-free exchanges and full refunds.',
    },
  };
}

// ─── 样式常量 ────────────────────────────────────────────────────────────────
const page: CSSProperties = {
  backgroundColor: '#E8DFD6',
  minHeight: '100vh',
};

const container: CSSProperties = {
  maxWidth: 800,
  margin: '0 auto',
  padding: '100px 24px',
};

const heading: CSSProperties = {
  fontFamily: 'var(--font-cormorant)',
  fontSize: 36,
  fontWeight: 300,
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  color: '#1a1a1a',
  marginBottom: 48,
  lineHeight: 1.3,
};

const subheading: CSSProperties = {
  fontFamily: 'var(--font-cormorant)',
  fontSize: 24,
  fontWeight: 300,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  color: '#1a1a1a',
  marginTop: 56,
  marginBottom: 20,
  lineHeight: 1.3,
};

const body: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 15,
  fontWeight: 400,
  lineHeight: 1.8,
  color: '#555',
};

const divider: CSSProperties = {
  border: 'none',
  borderTop: '1px solid rgba(26,26,26,0.1)',
  margin: '56px 0',
};

const stepNumber: CSSProperties = {
  fontFamily: 'var(--font-cormorant)',
  fontSize: 20,
  fontWeight: 300,
  color: '#A05E46',
  marginRight: 12,
};

const stepItem: CSSProperties = {
  ...body,
  marginBottom: 16,
  display: 'flex',
  alignItems: 'baseline',
};

// ─── 页面组件 ────────────────────────────────────────────────────────────────
export default function ReturnsPage() {
  return (
    <main style={page}>
      <article style={container}>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Returns & Exchanges' },
          ]}
        />

        {/* 页面标题 */}
        <h1 style={{ ...heading, marginTop: 40 }}>Returns &amp; Exchanges</h1>

        {/* 退货政策 */}
        <section>
          <h2 style={subheading}>Return Policy</h2>
          <p style={body}>
            We want you to love every VIONIS·XY piece. If for any reason you are
            not completely satisfied, we offer complimentary returns within 30
            days of delivery — no questions asked. Items must be unworn,
            unwashed, and returned in their original packaging with all tags
            attached.
          </p>
          <p style={{ ...body, marginTop: 20 }}>
            Sale items and personalised pieces are final sale and cannot be
            returned or exchanged.
          </p>
        </section>

        <hr style={divider} />

        {/* 退货步骤 */}
        <section>
          <h2 style={subheading}>How to Return</h2>
          <p style={{ ...body, marginBottom: 24 }}>
            Returning is simple. Follow these three steps:
          </p>
          <div>
            <div style={stepItem}>
              <span style={stepNumber}>01</span>
              <span>
                Email us at{' '}
                <a
                  href="mailto:hello@vionisxy.com"
                  style={{ color: '#A05E46', textDecoration: 'none' }}
                >
                  hello@vionisxy.com
                </a>{' '}
                with your order number and the reason for return. We will
                respond within 24 hours with a prepaid return label.
              </span>
            </div>
            <div style={stepItem}>
              <span style={stepNumber}>02</span>
              <span>
                Pack the item securely in its original packaging. Attach the
                prepaid return label to the outside of the parcel.
              </span>
            </div>
            <div style={stepItem}>
              <span style={stepNumber}>03</span>
              <span>
                Drop the parcel at any designated carrier location. You will
                receive a confirmation email once we have received your return.
              </span>
            </div>
          </div>
        </section>

        <hr style={divider} />

        {/* 换货 */}
        <section>
          <h2 style={subheading}>Exchanges</h2>
          <p style={body}>
            Need a different size or colour? We are happy to arrange an
            exchange. Simply indicate your preferred alternative when you email
            us, and we will ship the replacement as soon as your return is
            received. Exchange shipping is complimentary.
          </p>
          <p style={{ ...body, marginTop: 20 }}>
            If the requested item is out of stock, we will issue a full refund
            to your original payment method.
          </p>
        </section>

        <hr style={divider} />

        {/* 退款处理 */}
        <section>
          <h2 style={subheading}>Refund Processing</h2>
          <p style={body}>
            Once we receive and inspect your return, a full refund will be
            issued to your original payment method within 5–7 business days. You
            will receive an email confirmation when your refund has been
            processed.
          </p>
          <p style={{ ...body, marginTop: 20 }}>
            Please note that depending on your bank or credit card provider, it
            may take an additional 2–5 business days for the refund to appear in
            your account.
          </p>
        </section>
      </article>
    </main>
  );
}
