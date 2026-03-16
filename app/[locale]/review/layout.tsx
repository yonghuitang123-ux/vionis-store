import type { Metadata } from 'next';
import { buildAlternates, defaultOgImage } from '@/lib/seo';

export function generateMetadata(): Metadata {
  return {
    title: 'Write a Review — VIONIS·XY',
    description: 'Share your experience with VIONIS·XY luxury knitwear.',
    alternates: buildAlternates('/review'),
    openGraph: {
      title: 'Write a Review — VIONIS·XY',
      description: 'Share your experience with VIONIS·XY luxury knitwear.',
      siteName: 'VIONIS·XY',
      images: [defaultOgImage],
    },
  };
}

export default function ReviewLayout({ children }: { children: React.ReactNode }) {
  return children;
}
