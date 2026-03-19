/**
 * 评论状态更新 API
 * PATCH /api/reviews/[id]/status  — 通过 / 拒绝评论
 *
 * Body: { status: 'approved' | 'rejected' }
 * Header: x-admin-password
 */

import { NextRequest, NextResponse } from 'next/server';
import { updateReviewStatus } from '@/lib/reviews';

const ADMIN_PASSWORD =
  process.env.REVIEW_ADMIN_PASSWORD || 'vionis2026';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const password = req.headers.get('x-admin-password');
  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status } = body;

  if (!['approved', 'rejected'].includes(status)) {
    return NextResponse.json(
      { error: 'Status must be "approved" or "rejected"' },
      { status: 400 },
    );
  }

  const review = await updateReviewStatus(id, status);
  if (!review) {
    return NextResponse.json(
      { error: 'Review not found' },
      { status: 404 },
    );
  }

  return NextResponse.json(review);
}
