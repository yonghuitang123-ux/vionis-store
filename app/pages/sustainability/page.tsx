/**
 * Sustainability 页面
 * ─────────────────────────────────────────────────────────────────
 * 可持续发展承诺、负责任采购、天然纤维、包装、未来展望
 */

import { type Metadata } from 'next';
import { type CSSProperties } from 'react';
import Breadcrumb from '@/components/Breadcrumb';

// ─── SEO 元数据 ──────────────────────────────────────────────────────────────
export function generateMetadata(): Metadata {
  return {
    title: 'Sustainability — VIONIS·XY',
    description:
      'Our commitment to responsible sourcing, natural fibres, and minimal environmental impact. Luxury that respects the planet.',
    openGraph: {
      title: 'Sustainability — VIONIS·XY',
      description:
        'Ethical cashmere and merino — sustainability at the heart of VIONIS·XY.',
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
export default function SustainabilityPage() {
  return (
    <main style={page}>
      <article style={container}>
        {/* 面包屑导航 */}
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Sustainability' },
          ]}
        />

        {/* 页面标题 */}
        <h1 style={{ ...heading, marginTop: 40 }}>Sustainability</h1>

        {/* 承诺声明 */}
        <section>
          <h2 style={subheading}>Our Commitment</h2>
          <p style={body}>
            At VIONIS·XY, sustainability is not a marketing strategy — it is a
            founding principle. We believe that true luxury must be kind to the
            earth, to the animals, and to the communities that make it possible.
            Every decision we make, from fibre selection to packaging, is guided
            by a deep respect for the natural world.
          </p>
        </section>

        <hr style={divider} />

        {/* 负责任采购 */}
        <section>
          <h2 style={subheading}>Responsible Sourcing</h2>
          <p style={body}>
            We source our cashmere exclusively from free-roaming Alashan goats
            in Inner Mongolia, where traditional herding practices have been
            sustained for generations. Our herders practice rotational grazing
            to prevent land degradation, and the cashmere is harvested by hand
            combing — a gentle, stress-free process for the animals.
          </p>
          <p style={{ ...body, marginTop: 20 }}>
            Our merino wool comes from certified ethical farms that meet strict
            animal welfare standards. We maintain full supply chain
            transparency, and every fibre is traceable from its source to the
            finished garment.
          </p>
        </section>

        <hr style={divider} />

        {/* 天然纤维 */}
        <section>
          <h2 style={subheading}>Natural Fibres</h2>
          <p style={body}>
            Both cashmere and merino wool are entirely natural, renewable, and
            biodegradable. Unlike synthetic fabrics derived from petroleum, our
            fibres return to the earth at the end of their long life. They
            require no microplastic-shedding washes, and their natural
            temperature-regulating properties reduce the need for
            energy-intensive climate control.
          </p>
          <p style={{ ...body, marginTop: 20 }}>
            By choosing natural over synthetic, we reduce our reliance on
            fossil fuels and minimize the microplastic pollution that harms our
            oceans and ecosystems.
          </p>
        </section>

        <hr style={divider} />

        {/* 包装 */}
        <section>
          <h2 style={subheading}>Packaging</h2>
          <p style={body}>
            Our packaging is designed with the same philosophy as our garments:
            nothing unnecessary. We use recycled and recyclable materials —
            unbleached cardboard boxes, tissue paper from FSC-certified forests,
            and compostable garment bags. We have eliminated all single-use
            plastics from our supply chain.
          </p>
          <p style={{ ...body, marginTop: 20 }}>
            Every VIONIS·XY parcel is thoughtfully presented without excess. We
            believe that a beautiful unboxing experience and environmental
            responsibility are not mutually exclusive.
          </p>
        </section>

        <hr style={divider} />

        {/* 未来展望 */}
        <section>
          <h2 style={subheading}>Looking Forward</h2>
          <p style={body}>
            We are continually working to deepen our commitment. Current
            initiatives include carbon-neutral shipping partnerships, expanding
            our use of natural dyes, and investing in grassland restoration
            projects in Inner Mongolia. Sustainability is a journey, and we are
            transparent about both our progress and the challenges that remain.
          </p>
          <p style={{ ...body, marginTop: 20 }}>
            We invite you to join us. By choosing fewer, finer garments — pieces
            made to last — you become part of a quieter, more considered
            approach to dressing. That, we believe, is the most sustainable
            choice of all.
          </p>
        </section>
      </article>
    </main>
  );
}
