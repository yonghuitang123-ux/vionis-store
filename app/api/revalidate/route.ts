/**
 * On-demand Revalidation API — Shopify Webhook 触发
 * ─────────────────────────────────────────────────────────────────
 * 当 Shopify 发布/更新/删除博客文章时，通过 webhook 调用此端点
 * 自动清除相关页面缓存，确保新发布的定时文章立即可访问。
 *
 * Shopify webhook URL 配置示例：
 *   https://vionisxy.com/api/revalidate?secret=YOUR_SECRET
 *
 * 支持的 webhook 事件：
 *   - blogs/create, blogs/update
 *   - 手动触发: GET /api/revalidate?secret=...&path=/blog/article-handle
 */

import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const SECRET = process.env.REVALIDATION_SECRET || '';

function unauthorized() {
  return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
}

/** GET — 手动触发特定路径的 revalidation */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');

  if (!SECRET || secret !== SECRET) return unauthorized();

  if (path) {
    revalidatePath(path);
  }

  // 始终 revalidate 博客和新闻列表页 + 首页 + sitemap
  revalidatePath('/blog');
  revalidatePath('/news');
  revalidatePath('/');
  revalidatePath('/sitemap.xml');

  return NextResponse.json({ revalidated: true, path });
}

/** POST — Shopify Webhook 自动触发 */
export async function POST(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const secret = searchParams.get('secret');

  if (!SECRET || secret !== SECRET) return unauthorized();

  // 尝试解析 webhook payload 获取文章 handle
  let articleHandle: string | null = null;
  try {
    const body = await request.json();
    articleHandle = body?.handle || body?.article?.handle || null;
  } catch {
    // payload 解析失败不影响 revalidation
  }

  // revalidate 博客相关页面
  revalidatePath('/blog');
  revalidatePath('/news');
  revalidatePath('/');
  revalidatePath('/sitemap.xml');

  if (articleHandle) {
    revalidatePath(`/blog/${articleHandle}`);
    revalidatePath(`/news/${articleHandle}`);
  }

  return NextResponse.json({ revalidated: true, articleHandle });
}
