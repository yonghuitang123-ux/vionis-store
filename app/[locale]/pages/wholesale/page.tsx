/**
 * Wholesale 页面
 * ─────────────────────────────────────────────────────────────────
 * B2B 批发合作：合作介绍、要求、申请流程、联系方式
 */

import { type Metadata } from 'next';
import { type CSSProperties } from 'react';
import { buildAlternates, defaultOgImage } from '@/lib/seo';

// ─── SEO 元数据 ──────────────────────────────────────────────────────────────
export function generateMetadata(): Metadata {
  return {
    title: 'Wholesale — VIONIS·XY',
    description:
      'Partner with VIONIS·XY for wholesale cashmere and merino knitwear. Premium quality, competitive pricing, and dedicated account support.',
    alternates: buildAlternates('/pages/wholesale'),
    openGraph: {
      title: 'Wholesale — VIONIS·XY',
      description:
        'B2B wholesale partnerships for luxury cashmere and merino knitwear.',
      siteName: 'VIONIS·XY',
      images: [defaultOgImage],
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

const listItem: CSSProperties = {
  ...body,
  marginBottom: 12,
  paddingLeft: 8,
};

const emailLink: CSSProperties = {
  color: '#A05E46',
  textDecoration: 'none',
  fontWeight: 500,
};

// ─── 页面组件 ────────────────────────────────────────────────────────────────
export default function WholesalePage() {
  return (
    <main style={page}>
      <article style={container}>
        <h1 style={heading}>Wholesale</h1>

        {/* 合作介绍 */}
        <section>
          <h2 style={subheading}>Partnership</h2>
          <p style={body}>
            VIONIS·XY welcomes inquiries from select retailers, concept stores,
            and boutique hotels who share our commitment to quality and quiet
            luxury. We offer a curated wholesale programme designed to bring the
            finest cashmere and merino knitwear to discerning customers
            worldwide.
          </p>
          <p style={{ ...body, marginTop: 20 }}>
            As a wholesale partner, you will benefit from competitive pricing,
            flexible minimum orders, dedicated account management, and access to
            seasonal collections before public launch. We work closely with each
            partner to ensure our brand is represented with the same care and
            attention that goes into every garment.
          </p>
        </section>

        <hr style={divider} />

        {/* 合作要求 */}
        <section>
          <h2 style={subheading}>Requirements</h2>
          <p style={{ ...body, marginBottom: 24 }}>
            To ensure alignment with our brand values, we look for partners who
            meet the following criteria:
          </p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li style={listItem}>
              <strong style={{ color: '#1a1a1a' }}>Retail Presence</strong> — An
              established physical or online store with a focus on premium or
              luxury fashion.
            </li>
            <li style={listItem}>
              <strong style={{ color: '#1a1a1a' }}>Brand Alignment</strong> — A
              curated product offering that values quality, craftsmanship, and
              understated design.
            </li>
            <li style={listItem}>
              <strong style={{ color: '#1a1a1a' }}>Minimum Order</strong> — An
              initial order of at least 20 units across styles and sizes.
            </li>
            <li style={listItem}>
              <strong style={{ color: '#1a1a1a' }}>Valid Business Licence</strong>{' '}
              — A registered business with a valid resale or tax identification
              number.
            </li>
          </ul>
        </section>

        <hr style={divider} />

        {/* 申请流程 */}
        <section>
          <h2 style={subheading}>How to Apply</h2>
          <p style={body}>
            If you are interested in becoming a VIONIS·XY stockist, please send
            an email to{' '}
            <a href="mailto:wholesale@vionisxy.com" style={emailLink}>
              wholesale@vionisxy.com
            </a>{' '}
            with the following information:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: 24 }}>
            <li style={listItem}>Your business name and website</li>
            <li style={listItem}>Physical store address(es), if applicable</li>
            <li style={listItem}>A brief description of your customer base</li>
            <li style={listItem}>The brands you currently carry</li>
            <li style={listItem}>Your estimated initial order volume</li>
          </ul>
          <p style={{ ...body, marginTop: 24 }}>
            Our wholesale team reviews every application personally and will
            respond within 5 business days. We look forward to exploring a
            partnership with you.
          </p>
        </section>

        <hr style={divider} />

        {/* 联系方式 */}
        <section>
          <h2 style={subheading}>Get in Touch</h2>
          <p style={body}>
            For all wholesale-related enquiries, please contact us directly:
          </p>
          <p style={{ ...body, marginTop: 20 }}>
            <a href="mailto:wholesale@vionisxy.com" style={emailLink}>
              wholesale@vionisxy.com
            </a>
          </p>
          <p style={{ ...body, marginTop: 8, fontSize: 13, color: '#666' }}>
            We typically respond within 1–2 business days.
          </p>
        </section>
      </article>
    </main>
  );
}
