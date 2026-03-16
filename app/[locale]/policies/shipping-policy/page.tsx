import type { Metadata } from 'next';
import { getPolicies } from '@/lib/shopify/getPolicies';
import { sanitizeShopifyHtml } from '@/utils/sanitizeShopifyHtml';
import { buildAlternates, defaultOgImage } from '@/lib/seo';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const { shippingPolicy } = await getPolicies();
  const title = shippingPolicy?.title ?? 'Shipping Policy';
  return {
    title: `${title} — VIONIS·XY`,
    alternates: buildAlternates('/policies/shipping-policy'),
    openGraph: {
      title: `${title} — VIONIS·XY`,
      siteName: 'VIONIS·XY',
      images: [defaultOgImage],
    },
  };
}

export default async function ShippingPolicyPage() {
  const { shippingPolicy } = await getPolicies();

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
        {shippingPolicy ? (
          <>
            <h1 style={{ marginBottom: 24 }}>{shippingPolicy.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: sanitizeShopifyHtml(shippingPolicy.body) }} />
          </>
        ) : (
          <p>Shipping policy is not available.</p>
        )}
      </div>
  );
}
