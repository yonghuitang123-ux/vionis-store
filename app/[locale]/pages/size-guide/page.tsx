/**
 * Size Guide 页面
 * ─────────────────────────────────────────────────────────────────
 * 尺码指南：设计理念、尺码表、测量方法、建议
 */

import { type Metadata } from 'next';
import { type CSSProperties } from 'react';
import { buildAlternates, defaultOgImage } from '@/lib/seo';

// ─── SEO 元数据 ──────────────────────────────────────────────────────────────
export function generateMetadata(): Metadata {
  return {
    title: 'Size Guide — VIONIS·XY',
    description:
      'Find your perfect fit. Our collections are designed with a relaxed, timeless silhouette. Consult our size guide for cashmere and merino knitwear measurements.',
    alternates: buildAlternates('/pages/size-guide'),
    openGraph: {
      title: 'Size Guide — VIONIS·XY',
      description:
        'Relaxed, timeless fit. Consult our size chart for cashmere and merino knitwear.',
      siteName: 'VIONIS·XY',
      images: [defaultOgImage],
    },
  };
}

// ─── JSON-LD ─────────────────────────────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Size Guide — VIONIS·XY',
  description:
    'Find your perfect fit with our size guide for cashmere and merino knitwear.',
  url: 'https://vionisxy.com/pages/size-guide',
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

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 14,
  marginTop: 24,
};

const thStyle: CSSProperties = {
  textAlign: 'left',
  fontWeight: 600,
  color: '#1a1a1a',
  padding: '12px 16px',
  borderBottom: '2px solid rgba(26,26,26,0.15)',
  fontSize: 13,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const tdStyle: CSSProperties = {
  padding: '12px 16px',
  color: '#555',
  borderBottom: '1px solid rgba(26,26,26,0.08)',
};

const emailLink: CSSProperties = {
  color: '#A05E46',
  textDecoration: 'none',
  fontWeight: 500,
};

// ─── 页面组件 ────────────────────────────────────────────────────────────────
export default function SizeGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main style={pageStyle}>
        <article style={container}>
          <h1 style={heading}>Fit &amp; Sizing</h1>

          {/* 设计理念 */}
          <section>
            <p style={body}>
              Our collections are designed with a relaxed, timeless silhouette
              that flatters without clinging. We favour a slightly oversized fit
              for our cashmere pieces and a body-skimming fit for our seamless
              merino base layers — each calibrated for effortless layering and
              all-day comfort.
            </p>
          </section>

          <hr style={divider} />

          {/* 上装尺码表 */}
          <section>
            <h2 style={subheading}>Tops &amp; Knitwear</h2>
            <p style={body}>
              Measurements are in centimetres. If you are between sizes, we
              recommend sizing up for a relaxed drape or sizing down for a
              closer fit.
            </p>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Size</th>
                  <th style={thStyle}>Chest</th>
                  <th style={thStyle}>Shoulder</th>
                  <th style={thStyle}>Length</th>
                  <th style={thStyle}>Sleeve</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>XS</td>
                  <td style={tdStyle}>92</td>
                  <td style={tdStyle}>40</td>
                  <td style={tdStyle}>64</td>
                  <td style={tdStyle}>58</td>
                </tr>
                <tr>
                  <td style={tdStyle}>S</td>
                  <td style={tdStyle}>98</td>
                  <td style={tdStyle}>42</td>
                  <td style={tdStyle}>66</td>
                  <td style={tdStyle}>60</td>
                </tr>
                <tr>
                  <td style={tdStyle}>M</td>
                  <td style={tdStyle}>104</td>
                  <td style={tdStyle}>44</td>
                  <td style={tdStyle}>68</td>
                  <td style={tdStyle}>62</td>
                </tr>
                <tr>
                  <td style={tdStyle}>L</td>
                  <td style={tdStyle}>110</td>
                  <td style={tdStyle}>46</td>
                  <td style={tdStyle}>70</td>
                  <td style={tdStyle}>64</td>
                </tr>
                <tr>
                  <td style={tdStyle}>XL</td>
                  <td style={tdStyle}>116</td>
                  <td style={tdStyle}>48</td>
                  <td style={tdStyle}>72</td>
                  <td style={tdStyle}>66</td>
                </tr>
              </tbody>
            </table>
          </section>

          <hr style={divider} />

          {/* 下装尺码表 */}
          <section>
            <h2 style={subheading}>Bottoms</h2>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Size</th>
                  <th style={thStyle}>Waist</th>
                  <th style={thStyle}>Hip</th>
                  <th style={thStyle}>Inseam</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={tdStyle}>XS</td>
                  <td style={tdStyle}>66</td>
                  <td style={tdStyle}>88</td>
                  <td style={tdStyle}>74</td>
                </tr>
                <tr>
                  <td style={tdStyle}>S</td>
                  <td style={tdStyle}>70</td>
                  <td style={tdStyle}>92</td>
                  <td style={tdStyle}>76</td>
                </tr>
                <tr>
                  <td style={tdStyle}>M</td>
                  <td style={tdStyle}>76</td>
                  <td style={tdStyle}>98</td>
                  <td style={tdStyle}>78</td>
                </tr>
                <tr>
                  <td style={tdStyle}>L</td>
                  <td style={tdStyle}>82</td>
                  <td style={tdStyle}>104</td>
                  <td style={tdStyle}>80</td>
                </tr>
                <tr>
                  <td style={tdStyle}>XL</td>
                  <td style={tdStyle}>88</td>
                  <td style={tdStyle}>110</td>
                  <td style={tdStyle}>82</td>
                </tr>
              </tbody>
            </table>
          </section>

          <hr style={divider} />

          {/* 测量方法 */}
          <section>
            <h2 style={subheading}>How to Measure</h2>
            <p style={body}>
              For the most accurate fit, measure yourself wearing light clothing
              with a soft tape measure:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: 20 }}>
              <li style={{ ...body, marginBottom: 12, paddingLeft: 8 }}>
                <strong style={{ color: '#1a1a1a' }}>Chest</strong> — Measure
                around the fullest part of your chest, keeping the tape level.
              </li>
              <li style={{ ...body, marginBottom: 12, paddingLeft: 8 }}>
                <strong style={{ color: '#1a1a1a' }}>Shoulder</strong> — Measure
                from one shoulder point to the other across the back.
              </li>
              <li style={{ ...body, marginBottom: 12, paddingLeft: 8 }}>
                <strong style={{ color: '#1a1a1a' }}>Waist</strong> — Measure
                around your natural waistline, just above the hip bone.
              </li>
              <li style={{ ...body, marginBottom: 12, paddingLeft: 8 }}>
                <strong style={{ color: '#1a1a1a' }}>Hip</strong> — Measure
                around the fullest part of your hips.
              </li>
            </ul>
          </section>

          <hr style={divider} />

          {/* 建议 */}
          <section>
            <h2 style={subheading}>Still Unsure?</h2>
            <p style={body}>
              If you need help finding your size, our team is happy to assist.
              Contact us at{' '}
              <a href="mailto:hello@vionisxy.com" style={emailLink}>
                hello@vionisxy.com
              </a>{' '}
              with your measurements and we will recommend the best fit for you.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}
