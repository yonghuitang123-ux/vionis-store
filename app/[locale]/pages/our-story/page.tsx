/**
 * Our Story 页面
 * ─────────────────────────────────────────────────────────────────
 * 品牌创立故事、内蒙古溯源、品牌理念 — 纯服务端组件
 */

import { type Metadata } from 'next';
import { type CSSProperties } from 'react';

// ─── SEO 元数据 ──────────────────────────────────────────────────────────────
export function generateMetadata(): Metadata {
  return {
    title: 'Our Story — VIONIS·XY',
    description:
      'Founded with the belief that true luxury is felt, not seen. Discover how VIONIS·XY sources the world\'s finest cashmere and merino from Inner Mongolia.',
    openGraph: {
      title: 'Our Story — VIONIS·XY',
      description:
        'Rare cashmere and seamless merino — crafted for quiet confidence.',
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
export default function OurStoryPage() {
  return (
    <main style={page}>
      <article style={container}>
        <h1 style={heading}>Our Story</h1>

        {/* 创立理念 */}
        <section>
          <p style={body}>
            VIONIS·XY was founded with a single, unwavering belief: true luxury
            is felt, not seen. In a world saturated with logos and fast fashion,
            we chose a quieter path — one guided by the purity of material, the
            precision of craft, and the confidence that comes from knowing
            exactly what you wear.
          </p>
        </section>

        <hr style={divider} />

        {/* 内蒙古溯源 */}
        <section>
          <h2 style={subheading}>From Inner Mongolia</h2>
          <p style={body}>
            Our journey begins in the vast highlands of Inner Mongolia, where
            winter temperatures plunge to −30°C. It is in this extreme cold that
            Alashan cashmere goats develop the extraordinarily fine undercoat
            that becomes the world&apos;s most coveted fibre. Each spring, herders
            gently comb — never shear — the precious down by hand, yielding
            only 150 to 200 grams per goat per year.
          </p>
          <p style={{ ...body, marginTop: 20 }}>
            We work directly with these pastoral communities, ensuring fair
            compensation and sustainable grazing practices that have sustained
            the land for centuries. Every fibre we source is fully traceable,
            from pasture to finished garment.
          </p>
        </section>

        <hr style={divider} />

        {/* 材质承诺 */}
        <section>
          <h2 style={subheading}>The Finest Natural Fibres</h2>
          <p style={body}>
            We use only premium natural fibres: cashmere at 15.5 microns and
            merino wool at 18.5 microns — both significantly finer than a human
            hair. Every batch is independently tested and SGS certified to
            guarantee 100% purity. No blends. No synthetics. No compromise.
          </p>
          <p style={{ ...body, marginTop: 20 }}>
            The result is knitwear of extraordinary softness, natural
            temperature regulation, and a hand-feel that improves with every
            wear. These are garments designed not just for a season, but for
            years of quiet, dependable luxury.
          </p>
        </section>

        <hr style={divider} />

        {/* 品牌使命 */}
        <section>
          <h2 style={subheading}>Crafted for Quiet Confidence</h2>
          <p style={body}>
            At VIONIS·XY, we believe elegance speaks softly. Our designs strip
            away the unnecessary — no conspicuous branding, no fleeting trends —
            to reveal the essential beauty of exceptional material and precise
            construction.
          </p>
          <p style={{ ...body, marginTop: 20 }}>
            Each piece is crafted for those who appreciate substance over
            spectacle, who find confidence not in what the world sees, but in
            what they feel against their skin. This is our promise: luxury that
            is intimate, enduring, and unmistakably real.
          </p>
        </section>

        <hr style={divider} />

        {/* 展望 */}
        <section>
          <h2 style={subheading}>Looking Ahead</h2>
          <p style={body}>
            As we grow, our commitment remains unchanged. We continue to invest
            in sustainable sourcing, to support the herding communities who make
            our work possible, and to refine every detail of our craft. Because
            for us, luxury is not a destination — it is a discipline.
          </p>
        </section>
      </article>
    </main>
  );
}
