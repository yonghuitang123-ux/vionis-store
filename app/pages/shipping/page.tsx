/**
 * Shipping 页面
 * ─────────────────────────────────────────────────────────────────
 * 配送政策：免费配送、处理时间、国际配送、物流追踪
 */

import { type Metadata } from 'next';
import { type CSSProperties } from 'react';
import Breadcrumb from '@/components/Breadcrumb';

// ─── SEO 元数据 ──────────────────────────────────────────────────────────────
export function generateMetadata(): Metadata {
  return {
    title: 'Shipping — VIONIS·XY',
    description:
      'Complimentary worldwide shipping on orders over $300. Learn about delivery times, tracking, and international shipping for VIONIS·XY luxury knitwear.',
    openGraph: {
      title: 'Shipping — VIONIS·XY',
      description:
        'Free shipping on orders over $300. Worldwide delivery in 2–5 business days.',
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

// ─── 页面组件 ────────────────────────────────────────────────────────────────
export default function ShippingPage() {
  return (
    <main style={page}>
      <article style={container}>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Shipping' },
          ]}
        />

        {/* 页面标题 */}
        <h1 style={{ ...heading, marginTop: 40 }}>Shipping</h1>

        {/* 免费配送 */}
        <section>
          <h2 style={subheading}>Complimentary Shipping</h2>
          <p style={body}>
            We are pleased to offer complimentary standard shipping on all
            orders over $300. For orders below this threshold, a flat-rate
            shipping fee of $15 applies. Every parcel is carefully wrapped in
            our signature packaging to ensure your VIONIS·XY pieces arrive in
            perfect condition.
          </p>
        </section>

        <hr style={divider} />

        {/* 处理时间 */}
        <section>
          <h2 style={subheading}>Processing Time</h2>
          <p style={body}>
            Orders are processed within 1–2 business days. Once dispatched,
            standard delivery typically takes 2–5 business days depending on
            your location. During peak seasons or promotional periods,
            processing may take an additional 1–2 days.
          </p>
          <p style={{ ...body, marginTop: 20 }}>
            You will receive a confirmation email with tracking details as soon
            as your order has been shipped.
          </p>
        </section>

        <hr style={divider} />

        {/* 国际配送 */}
        <section>
          <h2 style={subheading}>International Shipping</h2>
          <p style={body}>
            VIONIS·XY delivers worldwide. International orders are shipped via
            trusted express carriers and typically arrive within 5–10 business
            days. Please note that customs duties and import taxes are the
            responsibility of the recipient and are not included in the order
            total.
          </p>
          <p style={{ ...body, marginTop: 20 }}>
            We currently ship to over 50 countries. If your country is not
            available at checkout, please contact us at{' '}
            <a
              href="mailto:hello@vionisxy.com"
              style={{ color: '#A05E46', textDecoration: 'none' }}
            >
              hello@vionisxy.com
            </a>{' '}
            and we will do our best to accommodate your order.
          </p>
        </section>

        <hr style={divider} />

        {/* 物流追踪 */}
        <section>
          <h2 style={subheading}>Tracking Your Order</h2>
          <p style={body}>
            Every shipment includes a tracking number, which you will receive
            via email once your order is dispatched. You can use this number to
            monitor your delivery in real time through our carrier&apos;s
            tracking portal.
          </p>
          <p style={{ ...body, marginTop: 20 }}>
            If you have any questions about your delivery, our customer care
            team is available at{' '}
            <a
              href="mailto:hello@vionisxy.com"
              style={{ color: '#A05E46', textDecoration: 'none' }}
            >
              hello@vionisxy.com
            </a>{' '}
            — we are happy to help.
          </p>
        </section>
      </article>
    </main>
  );
}
