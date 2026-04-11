import type { Metadata } from 'next';
import { getPolicies } from '@/lib/shopify/getPolicies';
import { sanitizeShopifyHtml } from '@/utils/sanitizeShopifyHtml';
import { buildAlternates, defaultOgImage } from '@/lib/seo';

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const { refundPolicy } = await getPolicies();
  const title = refundPolicy?.title ?? 'Refund Policy';
  return {
    title: `${title} — VIONIS·XY`,
    alternates: buildAlternates('/policies/refund-policy', locale),
    openGraph: {
      title: `${title} — VIONIS·XY`,
      siteName: 'VIONIS·XY',
      images: [defaultOgImage],
    },
  };
}

export default async function RefundPolicyPage() {
  const { refundPolicy } = await getPolicies();

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
        {refundPolicy ? (
          <>
            <h1 style={{ marginBottom: 24 }}>{refundPolicy.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: sanitizeShopifyHtml(refundPolicy.body) }} />
          </>
        ) : (
          <p>Refund policy is not available.</p>
        )}
      </div>
  );
}
