import type { Metadata } from 'next';
import { buildAlternates, defaultOgImage } from '@/lib/seo';

export function generateMetadata(): Metadata {
  return {
    title: 'Wishlist — VIONIS·XY',
    description: 'Your saved items. Revisit your favourite VIONIS·XY pieces.',
    alternates: buildAlternates('/wishlist'),
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
