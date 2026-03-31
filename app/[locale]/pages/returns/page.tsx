/**
 * Returns & Exchanges 页面
 * ─────────────────────────────────────────────────────────────────
 * 退换货政策：退货条件、流程、退款方式、换货说明
 */

import { type Metadata } from 'next';
import { type CSSProperties } from 'react';
import { buildAlternates, defaultOgImage } from '@/lib/seo';

// ─── SEO 元数据 ──────────────────────────────────────────────────────────────
export function generateMetadata(): Metadata {
  return {
    title: 'Returns & Exchanges — VIONIS·XY',
    description:
      'Returns should be simple. Free returns within 30 days, no restocking fees. Learn about our hassle-free return and exchange policy for VIONIS·XY knitwear.',
    alternates: buildAlternates('/pages/returns'),
    openGraph: {
      title: 'Returns & Exchanges — VIONIS·XY',
      description:
        'Free returns within 30 days. No restocking fees. No final sale items.',
      siteName: 'VIONIS·XY',
      images: [defaultOgImage],
    },
  };
}

// ─── JSON-LD ─────────────────────────────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Returns & Exchanges — VIONIS·XY',
  description:
    'Free returns within 30 days, no restocking fees. Hassle-free return and exchange policy.',
  url: 'https://vionisxy.com/pages/returns',
};

// ─── 样式常量 ────────────────────────────────────────────────────────────────
const pageStyle: CSSProperties = {
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

const listItem: CSSProperties = {
  fontFamily: 'var(--font-montserrat)',
  fontSize: 15,
  fontWeight: 400,
  lineHeight: 1.8,
  color: '#555',
  marginBottom: 12,
  paddingLeft: 8,
};

const emailLink: CSSProperties = {
  color: '#A05E46',
  textDecoration: 'none',
  fontWeight: 500,
};

// ─── 页面组件 ────────────────────────────────────────────────────────────────
export default function ReturnsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main style={pageStyle}>
        <article style={container}>
          <h1 style={heading}>Returns &amp; Exchanges</h1>

          {/* 退货理念 */}
          <section>
            <p style={body}>
              Returns should be simple. We want you to genuinely love your
              VIONIS·XY pieces, and if something isn&apos;t right — whether
              it&apos;s the fit, the colour, or simply a change of heart — we
              make it easy to return or exchange.
            </p>
          </section>

          <hr style={divider} />

          {/* 退货政策 */}
          <section>
            <h2 style={subheading}>Return Policy</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li style={listItem}>
                <strong style={{ color: '#1a1a1a' }}>30-Day Window</strong> —
                Returns are accepted within 30 days of delivery.
              </li>
              <li style={listItem}>
                <strong style={{ color: '#1a1a1a' }}>Free Return Shipping</strong>{' '}
                — We cover the cost of return shipping for all domestic orders.
              </li>
              <li style={listItem}>
                <strong style={{ color: '#1a1a1a' }}>No Restocking Fees</strong> —
                We never charge restocking or processing fees.
              </li>
              <li style={listItem}>
                <strong style={{ color: '#1a1a1a' }}>No Final Sale Items</strong> —
                Every piece in our collection is eligible for return.
              </li>
            </ul>
          </section>

          <hr style={divider} />

          {/* 退货条件 */}
          <section>
            <h2 style={subheading}>Conditions</h2>
            <p style={body}>
              Items must be returned in their original condition: unworn,
              unwashed, and with all tags attached. We kindly ask that you
              return items in their original packaging whenever possible.
            </p>
            <p style={{ ...body, marginTop: 20 }}>
              Items that show signs of wear, alteration, or damage will not be
              accepted for return. If you are unsure whether your item qualifies,
              please contact us before shipping it back.
            </p>
          </section>

          <hr style={divider} />

          {/* 退货流程 */}
          <section>
            <h2 style={subheading}>How to Return</h2>
            <p style={body}>
              To initiate a return or exchange, please email us at{' '}
              <a href="mailto:support@vionisxy.com" style={emailLink}>
                support@vionisxy.com
              </a>{' '}
              with your order number and the reason for return. Our team will
              respond within 1–2 business days with a prepaid return label and
              instructions.
            </p>
          </section>

          <hr style={divider} />

          {/* 退款方式 */}
          <section>
            <h2 style={subheading}>Refunds</h2>
            <p style={body}>
              Once we receive and inspect your return, refunds are processed
              within 3–5 business days to your original payment method. You will
              receive an email confirmation once the refund has been issued.
            </p>
          </section>

          <hr style={divider} />

          {/* 换货 */}
          <section>
            <h2 style={subheading}>Exchanges</h2>
            <p style={body}>
              Need a different size or colour? We are happy to arrange an
              exchange. Simply mention your preferred replacement in your return
              request, and we will ship the new item as soon as your return is
              received — at no additional cost.
            </p>
            <p style={{ ...body, marginTop: 20 }}>
              For any questions, contact us at{' '}
              <a href="mailto:support@vionisxy.com" style={emailLink}>
                support@vionisxy.com
              </a>
              .
            </p>
          </section>
        </article>
      </main>
    </>
  );
}
