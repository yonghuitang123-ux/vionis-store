/**
 * Sustainability 页面
 * ─────────────────────────────────────────────────────────────────
 * 可持续发展：理念、牧场溯源、生产方式、包装、展望
 */

import { type Metadata } from 'next';
import { type CSSProperties } from 'react';
import { buildAlternates, defaultOgImage } from '@/lib/seo';

// ─── SEO 元数据 ──────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Sustainability — VIONIS·XY',
    description:
      'Nature is our supplier. Respect is our method. Learn how VIONIS·XY pursues sustainable cashmere and merino sourcing, responsible production, and minimal-waste packaging.',
    alternates: buildAlternates('/pages/sustainability', locale),
    openGraph: {
      title: 'Sustainability — VIONIS·XY',
      description:
        'Sustainable sourcing, responsible production, and packaging designed to protect the planet.',
      siteName: 'VIONIS·XY',
      images: [defaultOgImage],
    },
  };
}

// ─── JSON-LD ─────────────────────────────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Sustainability — VIONIS·XY',
  description:
    'Nature is our supplier. Respect is our method. Sustainable cashmere and merino sourcing from Inner Mongolia.',
  url: 'https://vionisxy.com/pages/sustainability',
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
export default function SustainabilityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main style={pageStyle}>
        <article style={container}>
          <h1 style={heading}>Sustainability</h1>

          {/* 理念 */}
          <section>
            <p style={body}>
              Nature is our supplier. Respect is our method. In a world of
              synthetic shortcuts and disposable fashion, VIONIS·XY takes the
              longer path — one that honours the land, the animals, and the
              communities that make our work possible.
            </p>
          </section>

          <hr style={divider} />

          {/* 牧场溯源 */}
          <section>
            <h2 style={subheading}>Traceable Sourcing</h2>
            <p style={body}>
              Our cashmere is sourced exclusively from free-ranging Alashan
              goats in the highlands of Inner Mongolia. Each spring, herders
              gently comb — never shear — the fine undercoat by hand, a
              centuries-old practice that protects the animal and yields the
              purest fibre. Every batch is fully traceable, from pasture to
              finished garment.
            </p>
            <p style={{ ...body, marginTop: 20 }}>
              We work directly with herding cooperatives, ensuring fair
              compensation and supporting sustainable grazing rotations that
              prevent overgrazing and protect the grassland ecosystem.
            </p>
          </section>

          <hr style={divider} />

          {/* 负责任生产 */}
          <section>
            <h2 style={subheading}>Responsible Production</h2>
            <p style={body}>
              Our factories are certified to international environmental and
              labour standards. We use whole-garment and seamless knitting
              technology that reduces fabric waste by up to 30% compared to
              traditional cut-and-sew manufacturing.
            </p>
            <p style={{ ...body, marginTop: 20 }}>
              We produce in small batches to avoid overproduction — one of the
              fashion industry&apos;s greatest sources of waste. Every piece is
              made with intention, not excess.
            </p>
          </section>

          <hr style={divider} />

          {/* 天然材质 */}
          <section>
            <h2 style={subheading}>Natural, Renewable Fibres</h2>
            <p style={body}>
              Both cashmere and merino wool are natural, renewable, and
              biodegradable. Unlike synthetic fabrics derived from petroleum,
              our fibres return to the earth at the end of their life cycle.
              They require no microplastic filters when washed and naturally
              resist odour, reducing the need for frequent laundering.
            </p>
          </section>

          <hr style={divider} />

          {/* 包装 */}
          <section>
            <h2 style={subheading}>Thoughtful Packaging</h2>
            <p style={body}>
              Our packaging is designed to be as considered as the garments
              inside. We use FSC-certified paper, recycled tissue, and
              compostable mailer bags. No single-use plastics. No unnecessary
              inserts. Just what is needed to deliver your order safely and
              beautifully.
            </p>
          </section>

          <hr style={divider} />

          {/* 展望 */}
          <section>
            <h2 style={subheading}>Our Commitment</h2>
            <p style={body}>
              Sustainability is not a destination — it is an ongoing practice.
              We are continuously working to reduce our carbon footprint,
              improve traceability across our supply chain, and invest in the
              communities that sustain our craft. We believe that luxury, at its
              best, should leave the world better than it found it.
            </p>
          </section>
        </article>
      </main>
    </>
  );
}
