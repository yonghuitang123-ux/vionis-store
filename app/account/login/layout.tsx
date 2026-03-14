/**
 * 登录页布局 — 提供 SEO 元数据
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — VIONIS·XY',
  description: 'Sign in to your VIONIS·XY account to view orders and manage your profile.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
