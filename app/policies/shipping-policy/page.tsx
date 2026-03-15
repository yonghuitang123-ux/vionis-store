import type { Metadata } from 'next';
import { getPolicies } from '@/lib/shopify/getPolicies';
import { sanitizeShopifyHtml } from '@/utils/sanitizeShopifyHtml';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const { shippingPolicy } = await getPolicies();
  const title = shippingPolicy?.title ?? 'Shipping Policy';
  return { title: `${title} — VIONIS·XY` };
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
