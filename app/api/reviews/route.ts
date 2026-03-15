/**
 * 公开评论 API
 * GET  /api/reviews?productId=xxx  — 获取某产品的已发布评论
 * POST /api/reviews                — 客户提交新评论
 */

import { NextRequest, NextResponse } from 'next/server';
import { getApprovedReviews, createReview, saveUploadedImage } from '@/lib/reviews';
import { getCountryFlag } from '@/lib/countries';

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('productId');
  if (!productId) {
    return NextResponse.json(
      { error: 'productId is required' },
      { status: 400 },
    );
  }

  const reviews = getApprovedReviews(productId);

  // 不暴露内部字段
  const publicReviews = reviews.map(
    ({ author, email, status, ...rest }) => rest,
  );

  return NextResponse.json(publicReviews);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      productId,
      productTitle,
      author,
      email,
      country,
      rating,
      title,
      body: reviewBody,
      images,
      productInfo,
    } = body;

    // 校验必填字段
    if (!productId || !author || !country || !rating || !reviewBody) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, author, country, rating, body' },
        { status: 400 },
      );
    }

    // 处理 base64 图片
    const savedImages: string[] = [];
    if (images && Array.isArray(images)) {
      for (const img of images.slice(0, 4)) {
        try {
          if (typeof img === 'string' && img.startsWith('data:image/')) {
            const match = img.match(/^data:image\/(\w+);base64,/);
            const ext = match?.[1] === 'jpeg' ? 'jpg' : (match?.[1] ?? 'jpg');
            const base64 = img.replace(/^data:image\/\w+;base64,/, '');
            const buffer = Buffer.from(base64, 'base64');
            const url = saveUploadedImage(buffer, ext);
            savedImages.push(url);
          } else if (typeof img === 'string' && img.startsWith('/')) {
            // 已上传的 URL
            savedImages.push(img);
          }
        } catch {
          /* skip invalid images */
        }
      }
    }

    const review = createReview({
      productId,
      productTitle: productTitle || '',
      author,
      email: email || '',
      country,
      countryFlag: getCountryFlag(country),
      rating: Math.min(5, Math.max(1, Math.round(rating))),
      title: title || '',
      body: reviewBody,
      images: savedImages,
      verified: false,
      productInfo: productInfo || '',
    });

    return NextResponse.json(
      { success: true, id: review.id },
      { status: 201 },
    );
  } catch (err) {
    console.error('Failed to create review:', err);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 },
    );
  }
}
