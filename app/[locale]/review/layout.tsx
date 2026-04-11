import type { Metadata } from 'next';
import { buildAlternates, defaultOgImage } from '@/lib/seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'Write a Review — VIONIS·XY',
    description: 'Share your experience with VIONIS·XY luxury knitwear.',
    alternates: buildAlternates('/review', locale),
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
