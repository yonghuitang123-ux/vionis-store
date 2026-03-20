/**
 * 后台评论管理 API
 * GET  /api/reviews/admin?status=pending  — 按状态获取评论
 * POST /api/reviews/admin                 — 手动添加评论
 *
 * 认证方式：x-admin-password header（环境变量配置，不使用默认值）
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getReviewsByStatus,
  createManualReview,
  anonymizeName,
} from '@/lib/reviews';
import { getCountryFlag } from '@/lib/countries';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const ADMIN_PASSWORD = process.env.REVIEW_ADMIN_PASSWORD;

function checkAuth(req: NextRequest): boolean {
  if (!ADMIN_PASSWORD) {
    // 未配置密码时禁止所有访问
    return false;
  }
  const password = req.headers.get('x-admin-password');
  if (!password || !ADMIN_PASSWORD) return false;

  // 使用恒定时间比较防止时序攻击
  if (password.length !== ADMIN_PASSWORD.length) return false;
  let mismatch = 0;
  for (let i = 0; i < password.length; i++) {
    mismatch |= password.charCodeAt(i) ^ ADMIN_PASSWORD.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function GET(req: NextRequest) {
  const ip = getClientIp(req.headers);
  if (!checkRateLimit(`admin-get:${ip}`, 30, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  if (!checkAuth(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const status = req.nextUrl.searchParams.get('status') || 'all';
  const reviews = await getReviewsByStatus(status);
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  if (!checkRateLimit(`admin-post:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

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

    const review = await createManualReview({
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
      ...(body.createdAt ? { createdAt: body.createdAt } : {}),
    });

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 },
    );
  }
}
