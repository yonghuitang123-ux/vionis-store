import type { Metadata } from 'next';
import RegisterPageContent from './RegisterPageContent';

export const metadata: Metadata = {
  robots: 'noindex, follow',
};

export default function RegisterPage() {
  return <RegisterPageContent />;
}
