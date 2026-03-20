/**
 * 评论图片上传 API
 * POST /api/reviews/upload  — 上传单张图片，返回 URL
 *
 * Content-Type: multipart/form-data
 * Body: file (image, max 5MB)
 */

import { NextRequest, NextResponse } from 'next/server';
import { saveUploadedImage } from '@/lib/reviews';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  if (!checkRateLimit(`upload:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: 'Too many uploads. Please try again later.' }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'File must be an image (PNG, JPEG, WebP, or GIF)' },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'File too large (max 5MB)' },
        { status: 400 },
      );
    }

    const ext =
      file.name.split('.').pop()?.toLowerCase().replace('jpeg', 'jpg') || 'jpg';
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = saveUploadedImage(buffer, ext);

    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 },
    );
  }
}
