import type { Metadata } from 'next';
import WishlistPageContent from './WishlistPageContent';

export const metadata: Metadata = {
  robots: 'noindex, follow',
};

export default function WishlistPage() {
  return <WishlistPageContent />;
}
