/**
 * Size Guide 页面
 * ─────────────────────────────────────────────────────────────────
 * 从 siteConfig 读取尺码表数据，渲染尺码对照表 + 测量指引
 */

import { type Metadata } from 'next';
import { type CSSProperties } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import { siteConfig } from '@/config/site';

// ─── SEO 元数据 ──────────────────────────────────────────────────────────────
export function generateMetadata(): Metadata {
  return {
    title: 'Size Guide — VIONIS·XY',
    description:
      'Find your perfect fit with the VIONIS·XY size guide. Detailed measurements for cashmere and merino knitwear.',
    openGraph: {
      title: 'Size Guide — VIONIS·XY',
      description: 'Detailed sizing chart and measuring instructions.',
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

/* 表格样式 */
const tableWrap: CSSProperties = {
  overflowX: 'auto',
  marginTop: 24,
};

const table: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontFamily: 'var(--font-montserrat)',
  fontSize: 14,
  color: '#1a1a1a',
};

const thStyle: CSSProperties = {
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  padding: '14px 20px',
  borderBottom: '2px solid rgba(26,26,26,0.15)',
  textAlign: 'left',
  fontSize: 12,
};

const tdStyle: CSSProperties = {
  padding: '14px 20px',
  borderBottom: '1px solid rgba(26,26,26,0.08)',
  color: '#555',
  fontWeight: 400,
  fontSize: 14,
};

const tdSizeLabel: CSSProperties = {
  ...tdStyle,
  fontWeight: 500,
  color: '#1a1a1a',
  letterSpacing: '0.05em',
};

/* 列表样式 */
const listItem: CSSProperties = {
  ...body,
  marginBottom: 12,
  paddingLeft: 8,
};

// ─── 从 siteConfig 读取尺码数据 ──────────────────────────────────────────────
const { 单位, 尺码表 } = siteConfig.sizeGuide;
const sizes = Object.entries(尺码表) as [string, { 胸围: string; 腰围: string; 臀围: string }][];

// ─── 页面组件 ────────────────────────────────────────────────────────────────
export default function SizeGuidePage() {
  return (
    <main style={page}>
      <article style={container}>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Size Guide' },
          ]}
        />

        {/* 页面标题 */}
        <h1 style={{ ...heading, marginTop: 40 }}>Size Guide</h1>

        <p style={body}>
          All measurements are in centimetres ({单位}) and refer to body
          measurements, not garment dimensions. For the most accurate fit, we
          recommend taking your measurements over lightweight clothing.
        </p>

        {/* 尺码对照表 */}
        <div style={tableWrap}>
          <table style={table}>
            <thead>
              <tr>
                <th style={thStyle}>Size</th>
                <th style={thStyle}>Bust</th>
                <th style={thStyle}>Waist</th>
                <th style={thStyle}>Hip</th>
              </tr>
            </thead>
            <tbody>
              {sizes.map(([size, m]) => (
                <tr key={size}>
                  <td style={tdSizeLabel}>{size}</td>
                  <td style={tdStyle}>{m.胸围}</td>
                  <td style={tdStyle}>{m.腰围}</td>
                  <td style={tdStyle}>{m.臀围}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <hr style={divider} />

        {/* 如何测量 */}
        <section>
          <h2 style={subheading}>How to Measure</h2>
          <p style={body}>
            Use a soft measuring tape and stand in a relaxed, natural posture.
            Keep the tape snug but not tight against the body.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: 24 }}>
            <li style={listItem}>
              <strong style={{ color: '#1a1a1a' }}>Bust</strong> — Measure
              around the fullest part of your chest, keeping the tape level
              across the back.
            </li>
            <li style={listItem}>
              <strong style={{ color: '#1a1a1a' }}>Waist</strong> — Measure
              around your natural waistline, the narrowest part of your torso.
            </li>
            <li style={listItem}>
              <strong style={{ color: '#1a1a1a' }}>Hip</strong> — Measure
              around the widest part of your hips and buttocks.
            </li>
          </ul>
        </section>

        <hr style={divider} />

        {/* 尺码建议 */}
        <section>
          <h2 style={subheading}>Between Sizes?</h2>
          <p style={body}>
            If your measurements fall between two sizes, we recommend sizing up
            for a relaxed, effortless fit — in keeping with the VIONIS·XY
            aesthetic. Our knitwear is designed with a gentle ease that drapes
            beautifully without excess volume.
          </p>
          <p style={{ ...body, marginTop: 20 }}>
            For a more fitted silhouette, size down. If you have any questions,
            our styling team is happy to help — reach us at{' '}
            <a
              href="mailto:hello@vionisxy.com"
              style={{ color: '#A05E46', textDecoration: 'none' }}
            >
              hello@vionisxy.com
            </a>.
          </p>
        </section>
      </article>
    </main>
  );
}
