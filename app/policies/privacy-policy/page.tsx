import type { Metadata } from 'next';
import { getPolicies } from '@/lib/shopify/getPolicies';

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const { privacyPolicy } = await getPolicies();
  const title = privacyPolicy?.title ?? 'Privacy Policy';
  return { title: `${title} — VIONIS·XY`, robots: 'noindex' };
}

export default async function PrivacyPolicyPage() {
  const { privacyPolicy } = await getPolicies();

  return (
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
        {privacyPolicy ? (
          <>
            <h1 style={{ marginBottom: 24 }}>{privacyPolicy.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: privacyPolicy.body }} />
          </>
        ) : (
          <p>Privacy policy is not available.</p>
        )}
      </div>
  );
}
