import type { Metadata } from 'next';
import { getPageByHandle } from '@/lib/shopify/getPageByHandle';
import { sanitizeShopifyHtml } from '@/utils/sanitizeShopifyHtml';
import { buildAlternates, defaultOgImage } from '@/lib/seo';

export const revalidate = 86400;

const HANDLE = 'our-story';
const PATH = '/pages/about';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageByHandle(HANDLE);
  const title = page?.seo?.title ?? page?.title ?? 'About';
  const description = page?.seo?.description ?? undefined;
  return {
    title: `${title} — VIONIS·XY`,
    description,
    alternates: buildAlternates(PATH),
    openGraph: {
      title: `${title} — VIONIS·XY`,
      description,
      siteName: 'VIONIS·XY',
      images: [defaultOgImage],
    },
  };
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
          padding: '40px 30px 80px',
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
            <div dangerouslySetInnerHTML={{ __html: sanitizeShopifyHtml(page.body) }} />
          </>
        ) : (
          <p>Page not found.</p>
        )}
      </div>
    </>
  );
}
