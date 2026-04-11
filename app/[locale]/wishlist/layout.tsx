import type { Metadata } from 'next';
import { buildAlternates, defaultOgImage } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Wishlist — VIONIS·XY',
    description: 'Your saved items. Revisit your favourite VIONIS·XY pieces.',
    alternates: buildAlternates('/wishlist', locale),
    openGraph: {
      title: 'Wishlist — VIONIS·XY',
      description: 'Your saved items. Revisit your favourite VIONIS·XY pieces.',
      siteName: 'VIONIS·XY',
      images: [defaultOgImage],
    },
  };
}

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return children;
}
