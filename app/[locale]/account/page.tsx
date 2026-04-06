import type { Metadata } from 'next';
import AccountPageContent from './AccountPageContent';

export const metadata: Metadata = {
  robots: 'noindex, follow',
};

export default function AccountPage() {
  return <AccountPageContent />;
}
