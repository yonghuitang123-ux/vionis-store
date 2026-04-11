/**
 * 账户区域布局 — 提供默认 SEO 元数据
 */

import type { Metadata } from 'next';
import { buildAlternates, defaultOgImage } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'My Account — VIONIS·XY',
    description: 'Manage your VIONIS·XY account, view orders, and update your details.',
    alternates: buildAlternates('/account', locale),
    openGraph: {
      title: 'My Account — VIONIS·XY',
      description: 'Manage your VIONIS·XY account, view orders, and update your details.',
      siteName: 'VIONIS·XY',
      images: [defaultOgImage],
    },
  };
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
