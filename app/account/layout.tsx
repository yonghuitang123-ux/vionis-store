/**
 * 账户区域布局 — 提供默认 SEO 元数据
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account — VIONIS·XY',
  description: 'Manage your VIONIS·XY account, view orders, and update your details.',
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
