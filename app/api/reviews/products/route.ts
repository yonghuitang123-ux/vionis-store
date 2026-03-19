/**
 * 获取产品列表（供评论后台选择产品用）
 * GET /api/reviews/products
 */

import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/shopify';

const ADMIN_PASSWORD = process.env.REVIEW_ADMIN_PASSWORD || 'vionis2026';

export async function GET(req: NextRequest) {
  const password = req.headers.get('x-admin-password');
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const products = await getProducts(50);
    const simplified = products.map((p: any) => ({
      id: p.id,
      title: p.title,
      handle: p.handle,
      image: p.featuredImage?.url || p.images?.edges?.[0]?.node?.url || '',
    }));
    return NextResponse.json(simplified);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
