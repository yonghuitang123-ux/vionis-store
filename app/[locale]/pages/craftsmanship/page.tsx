/**
 * Craftsmanship 页面
 * ─────────────────────────────────────────────────────────────────
 * 工艺介绍：制作理念、材质工艺、无缝编织、品质检验
 */

import { type Metadata } from 'next';
import { type CSSProperties } from 'react';
import { buildAlternates, defaultOgImage } from '@/lib/seo';

// ─── SEO 元数据 ──────────────────────────────────────────────────────────────
export function generateMetadata(): Metadata {
  return {
    title: 'Craftsmanship — VIONIS·XY',
    description:
      'The art of making at VIONIS·XY. Discover how we transform the finest 15.5-micron cashmere and 18.5-micron merino into seamless, enduring knitwear.',
    alternates: buildAlternates('/pages/craftsmanship'),
    openGraph: {
      title: 'Craftsmanship — VIONIS·XY',
      description:
        'From raw fibre to finished garment — precision craft meets rare material.',
      siteName: 'VIONIS·XY',
      images: [defaultOgImage],
    },
  };
}

// ─── JSON-LD ─────────────────────────────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Craftsmanship — VIONIS·XY',
  description:
    'The art of making at VIONIS·XY. Discover how we transform the finest cashmere and merino into seamless, enduring knitwear.',
  url: 'https://vionisxy.com/pages/craftsmanship',
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

// ─── 页面组件 ────────────────────────────────────────────────────────────────
export default function CraftsmanshipPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main style={pageStyle}>
        <article style={container}>
          <h1 style={heading}>The Art of Making</h1>

          {/* 工艺理念 */}
          <section>
            <p style={body}>
              At VIONIS·XY, craftsmanship is not a selling point — it is a
              principle. Every garment we produce is the result of meticulous
              attention to material, construction, and finish. We believe that
              true quality reveals itself not in first impressions, but in the
              hundredth wear.
            </p>
          </section>

          <hr style={divider} />

          {/* 材质甄选 */}
          <section>
            <h2 style={subheading}>Fibre Selection</h2>
            <p style={body}>
              We source only the finest natural fibres: Grade A cashmere at 15.5
              microns from Alashan, Inner Mongolia, and ultrafine merino wool at
              18.5 microns from select Australian and New Zealand farms. Every
              batch is independently tested and SGS certified to guarantee 100%
              purity — no blends, no synthetics.
            </p>
            <p style={{ ...body, marginTop: 20 }}>
              These fibres are chosen not only for their extraordinary softness
              but for their natural performance: breathability, temperature
              regulation, and a hand-feel that improves with every wear.
            </p>
          </section>

          <hr style={divider} />

          {/* 无缝编织 */}
          <section>
            <h2 style={subheading}>Seamless Construction</h2>
            <p style={body}>
              Our merino base layers are produced using advanced Santoni seamless
              knitting technology. Each piece is knitted in a single continuous
              process, eliminating side seams entirely. The result is a garment
              that moves with the body, reduces friction, and delivers
              unparalleled comfort against the skin.
            </p>
            <p style={{ ...body, marginTop: 20 }}>
              For our cashmere pieces, we employ whole-garment knitting
              techniques that minimise waste and maximise the integrity of the
              fibre. Every stitch is calibrated for consistent tension, ensuring
              even drape and lasting shape retention.
            </p>
          </section>

          <hr style={divider} />

          {/* 品质检验 */}
          <section>
            <h2 style={subheading}>Quality Assurance</h2>
            <p style={body}>
              Each finished garment undergoes a rigorous multi-point inspection
              before leaving our workshop. We check for consistent gauge,
              colour uniformity, seam integrity, and surface finish. Only pieces
              that meet our exacting standards carry the VIONIS·XY label.
            </p>
            <p style={{ ...body, marginTop: 20 }}>
              We do not cut corners. We do not rush. Because a garment built
              with care is a garment that endures — and that is the only kind
              worth making.
            </p>
          </section>

          <hr style={divider} />

          {/* 可持续工艺 */}
          <section>
            <h2 style={subheading}>Responsible Production</h2>
            <p style={body}>
              Craftsmanship, for us, extends beyond the garment itself. We work
              with certified factories that uphold fair labour standards and
              invest in energy-efficient machinery. Our whole-garment knitting
              process reduces fabric waste by up to 30% compared to traditional
              cut-and-sew methods.
            </p>
            <p style={{ ...body, marginTop: 20 }}>
              Every decision — from fibre sourcing to finishing — is guided by a
              simple question: does this honour the material and the people who
              made it?
            </p>
          </section>
        </article>
      </main>
    </>
  );
}
