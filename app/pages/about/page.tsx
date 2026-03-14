import type { Metadata } from 'next';
import { getPageByHandle } from '@/lib/shopify/getPageByHandle';

export const revalidate = 86400;

const HANDLE = 'our-story';
const PATH = '/pages/about';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageByHandle(HANDLE);
  const title = page?.seo?.title ?? page?.title ?? 'About';
  const description = page?.seo?.description ?? undefined;
  return { title: `${title} — VIONIS·XY`, description };
}

export default async function AboutPage() {
  const page = await getPageByHandle(HANDLE);
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vionisxy.com';

  const jsonLd = page
    ? {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: page.seo?.title ?? page.title,
        description: page.seo?.description ?? undefined,
        url: `${baseUrl}${PATH}`,
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div
        style={{
          margin: '0 30px',
          maxWidth: 800,
          marginLeft: 'auto',
          marginRight: 'auto',
          fontFamily: 'var(--font-montserrat)',
          lineHeight: 1.8,
        }}
      >
        {page ? (
          <>
            <h1 style={{ marginBottom: 24 }}>{page.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: page.body }} />
          </>
        ) : (
          <p>Page not found.</p>
        )}
      </div>
    </>
  );
}
