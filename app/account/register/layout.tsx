/**
 * 注册页布局 — 提供 SEO 元数据
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account — VIONIS·XY',
  description: 'Create your VIONIS·XY account to enjoy exclusive access and order tracking.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
