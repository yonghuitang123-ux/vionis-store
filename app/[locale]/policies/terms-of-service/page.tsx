import type { Metadata } from 'next';
import { getPolicies } from '@/lib/shopify/getPolicies';
import { sanitizeShopifyHtml } from '@/utils/sanitizeShopifyHtml';
import { buildAlternates, defaultOgImage } from '@/lib/seo';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const { termsOfService } = await getPolicies();
  const title = termsOfService?.title ?? 'Terms of Service';
  return {
    title: `${title} — VIONIS·XY`,
    alternates: buildAlternates('/policies/terms-of-service', locale),
    openGraph: {
      title: `${title} — VIONIS·XY`,
      siteName: 'VIONIS·XY',
      images: [defaultOgImage],
    },
  };
}

export default async function TermsOfServicePage() {
  const { termsOfService } = await getPolicies();

  return (
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
        {termsOfService ? (
          <>
            <h1 style={{ marginBottom: 24 }}>{termsOfService.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: sanitizeShopifyHtml(termsOfService.body) }} />
          </>
        ) : (
          <p>Terms of service are not available.</p>
        )}
      </div>
  );
}
