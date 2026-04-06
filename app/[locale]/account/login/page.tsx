import type { Metadata } from 'next';
import LoginPageContent from './LoginPageContent';

export const metadata: Metadata = {
  robots: 'noindex, follow',
};

export default function LoginPage() {
  return <LoginPageContent />;
}
