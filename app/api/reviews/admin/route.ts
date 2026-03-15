/**
 * 后台评论管理 API
 * GET  /api/reviews/admin?status=pending  — 按状态获取评论
 * POST /api/reviews/admin                 — 手动添加评论
 *
 * 所有请求需在 Header 中携带 x-admin-password
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getReviewsByStatus,
  createManualReview,
  anonymizeName,
} from '@/lib/reviews';
import { getCountryFlag } from '@/lib/countries';

const ADMIN_PASSWORD =
  process.env.REVIEW_ADMIN_PASSWORD || 'vionis2026';

function checkAuth(req: NextRequest): boolean {
  const password = req.headers.get('x-admin-password');
  return password === ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const status = req.nextUrl.searchParams.get('status') || 'all';
  const reviews = getReviewsByStatus(status);
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.author || !body.country || !body.rating || !body.body) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    const review = createManualReview({
      productId: body.productId || '',
      productTitle: body.productTitle || '',
      author: body.author,
      displayName: body.displayName || anonymizeName(body.author),
      email: body.email || '',
      country: body.country,
      countryFlag: getCountryFlag(body.country),
      rating: Math.min(5, Math.max(1, Math.round(body.rating))),
      title: body.title || '',
      body: body.body,
      images: body.images || [],
      verified: body.verified ?? true,
      status: body.status || 'approved',
      productInfo: body.productInfo || '',
    });

    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    console.error('Failed to create manual review:', err);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 },
    );
  }
}
