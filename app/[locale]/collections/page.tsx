/**
 * Collections 索引页 — 展示所有系列
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { getCollections } from '@/lib/shopify';
import { buildAlternates, defaultOgImage } from '@/lib/seo';

export function generateMetadata(): Metadata {
  return {
    title: 'Collections — VIONIS·XY',
    description: 'Explore our curated collections of luxury cashmere and merino wool.',
    alternates: buildAlternates('/collections'),
    openGraph: {
      title: 'Collections — VIONIS·XY',
      description: 'Explore our curated collections of luxury cashmere and merino wool.',
      siteName: 'VIONIS·XY',
      images: [defaultOgImage],
    },
  };
}

export default async function CollectionsPage() {
  const collections = await getCollections();

  const visibleCollections = (collections ?? []).filter(
    (c: any) => c.title && c.handle && !c.handle.startsWith('hidden-'),
  );

  return (
    <main style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 30px 80px' }}>
      <style>{`
        .col-card {
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          border: 1px solid #1a1a1a;
          padding: 28px 24px;
          text-align: center;
          transition: all 0.3s ease;
          background: transparent;
          color: #1a1a1a;
        }
        .col-card:hover {
          background: #1a1a1a;
          color: #fff;
        }
      `}</style>

      <h1
        style={{
          fontFamily: 'var(--font-cormorant), "Cormorant Garamond", serif',
          fontSize: 36,
          fontWeight: 300,
          color: '#1a1a1a',
          textAlign: 'center',
          margin: '0 0 48px',
          letterSpacing: '0.02em',
        }}
      >
        Collections
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
        }}
      >
        {visibleCollections.map((collection: any) => (
          <Link
            key={collection.handle}
            href={`/collections/${collection.handle}`}
            className="col-card"
          >
            <span
              style={{
                fontFamily: 'var(--font-montserrat), "Montserrat", sans-serif',
                fontSize: 12,
                fontWeight: 400,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'inherit',
              }}
            >
              {collection.title}
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
