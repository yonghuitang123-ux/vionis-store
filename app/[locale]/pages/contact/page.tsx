/**
 * Contact 页面
 * ─────────────────────────────────────────────────────────────────
 * 联系方式：客服邮箱、批发邮箱、响应时间、社交媒体
 */

import { type Metadata } from 'next';
import { type CSSProperties } from 'react';
import { buildAlternates, defaultOgImage } from '@/lib/seo';

// ─── SEO 元数据 ──────────────────────────────────────────────────────────────
export function generateMetadata(): Metadata {
  return {
    title: 'Contact — VIONIS·XY',
    description:
      'Get in touch with VIONIS·XY. Whether you have a question about sizing, an order, or a wholesale inquiry, our team is here to help.',
    alternates: buildAlternates('/pages/contact'),
    openGraph: {
      title: 'Contact — VIONIS·XY',
      description:
        'Questions about sizing, orders, or wholesale? We are here to help.',
      siteName: 'VIONIS·XY',
      images: [defaultOgImage],
    },
  };
}

// ─── JSON-LD ─────────────────────────────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact — VIONIS·XY',
  description:
    'Get in touch with VIONIS·XY for questions about sizing, orders, or wholesale partnerships.',
  url: 'https://vionisxy.com/pages/contact',
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

const emailLink: CSSProperties = {
  color: '#A05E46',
  textDecoration: 'none',
  fontWeight: 500,
};

// ─── 页面组件 ────────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main style={pageStyle}>
        <article style={container}>
          <h1 style={heading}>Get in Touch</h1>

          {/* 介绍 */}
          <section>
            <p style={body}>
              We are here to help. Whether you have a question about sizing, need
              assistance with an order, or would like to explore a wholesale
              partnership, our team is happy to assist.
            </p>
          </section>

          <hr style={divider} />

          {/* 客服 */}
          <section>
            <h2 style={subheading}>Customer Care</h2>
            <p style={body}>
              For questions about orders, shipping, returns, or product care:
            </p>
            <p style={{ ...body, marginTop: 16 }}>
              <a href="mailto:support@vionisxy.com" style={emailLink}>
                support@vionisxy.com
              </a>
            </p>
            <p style={{ ...body, marginTop: 8, fontSize: 13, color: '#666' }}>
              We typically respond within 1–2 business days.
            </p>
          </section>

          <hr style={divider} />

          {/* 批发 */}
          <section>
            <h2 style={subheading}>Wholesale Inquiries</h2>
            <p style={body}>
              Interested in stocking VIONIS·XY? We welcome inquiries from select
              retailers, concept stores, and boutique hotels:
            </p>
            <p style={{ ...body, marginTop: 16 }}>
              <a href="mailto:wholesale@vionisxy.com" style={emailLink}>
                wholesale@vionisxy.com
              </a>
            </p>
          </section>

          <hr style={divider} />

          {/* 媒体 */}
          <section>
            <h2 style={subheading}>Press &amp; Media</h2>
            <p style={body}>
              For press inquiries, editorial collaborations, or media requests:
            </p>
            <p style={{ ...body, marginTop: 16 }}>
              <a href="mailto:press@vionisxy.com" style={emailLink}>
                press@vionisxy.com
              </a>
            </p>
          </section>

          <hr style={divider} />

          {/* 社交媒体 */}
          <section>
            <h2 style={subheading}>Follow Us</h2>
            <p style={body}>
              Stay connected and discover our latest collections, behind-the-scenes
              stories, and styling inspiration on social media. You can find us on
              Instagram, Pinterest, and Facebook.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}
