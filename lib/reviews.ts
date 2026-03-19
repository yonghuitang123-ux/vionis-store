/**
 * Review 数据层 — Upstash Redis 存储
 * ─────────────────────────────────────────────────────────────────
 * 使用 Upstash Redis 存储评论数据，适用于 Vercel serverless 部署。
 *
 * 环境变量（由 Vercel Upstash 集成自动注入）：
 *   UPSTASH_REDIS_REST_KV_REST_API_URL
 *   UPSTASH_REDIS_REST_KV_REST_API_TOKEN
 */

import { Redis } from '@upstash/redis';
import crypto from 'crypto';

// ─── Redis 客户端 ────────────────────────────────────────────────────────────

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL!,
  token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN!,
});

const REVIEWS_KEY = 'reviews:all';

// ─── 类型定义 ───────────────────────────────────────────────────────────────────

export interface ReviewRecord {
  id: string;
  productId: string;
  productTitle: string;
  author: string;        // 完整姓名（仅后台可见）
  displayName: string;   // 匿名化：J*** L.
  email: string;
  country: string;
  countryFlag: string;
  rating: number;
  title: string;
  body: string;
  images: string[];
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  productInfo: string;
  createdAt: string;
}

// ─── 读写 ───────────────────────────────────────────────────────────────────────

async function readAll(): Promise<ReviewRecord[]> {
  try {
    const data = await redis.get<ReviewRecord[]>(REVIEWS_KEY);
    return data || [];
  } catch {
    return [];
  }
}

async function writeAll(reviews: ReviewRecord[]): Promise<void> {
  await redis.set(REVIEWS_KEY, reviews);
}

// ─── 工具函数 ───────────────────────────────────────────────────────────────────

export function anonymizeName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return 'Anonymous';
  const first = parts[0];
  const last = parts.length > 1 ? parts[parts.length - 1] : '';
  const masked = first[0] + '*'.repeat(Math.max(first.length - 1, 2));
  const lastInitial = last ? ` ${last[0]}.` : '';
  return masked + lastInitial;
}

export function generateToken(data: {
  productId: string;
  productTitle: string;
  email?: string;
}): string {
  return Buffer.from(JSON.stringify(data)).toString('base64url');
}

export function decodeToken(token: string): {
  productId: string;
  productTitle: string;
  email?: string;
} | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf8');
    const parsed = JSON.parse(decoded);
    if (!parsed.productId) return null;
    return parsed;
  } catch {
    return null;
  }
}

// ─── CRUD 操作 ──────────────────────────────────────────────────────────────────

/** 获取某产品的已发布评论 */
export async function getApprovedReviews(productId: string): Promise<ReviewRecord[]> {
  const all = await readAll();
  return all
    .filter((r) => r.productId === productId && r.status === 'approved')
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

/** 按状态获取评论（后台用） */
export async function getReviewsByStatus(status?: string): Promise<ReviewRecord[]> {
  const all = await readAll();
  const filtered =
    !status || status === 'all'
      ? all
      : all.filter((r) => r.status === status);
  return filtered.sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/** 客户提交评论（默认 pending 状态） */
export async function createReview(
  data: Omit<ReviewRecord, 'id' | 'displayName' | 'status' | 'createdAt'>,
): Promise<ReviewRecord> {
  const reviews = await readAll();
  const review: ReviewRecord = {
    ...data,
    id: crypto.randomUUID(),
    displayName: anonymizeName(data.author),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  reviews.push(review);
  await writeAll(reviews);
  return review;
}

/** 后台手动创建评论（可直接设定状态和日期） */
export async function createManualReview(
  data: Omit<ReviewRecord, 'id'> & { createdAt?: string },
): Promise<ReviewRecord> {
  const reviews = await readAll();
  const review: ReviewRecord = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: data.createdAt || new Date().toISOString(),
  };
  reviews.push(review);
  await writeAll(reviews);
  return review;
}

/** 更新评论状态 */
export async function updateReviewStatus(
  id: string,
  status: 'approved' | 'rejected',
): Promise<ReviewRecord | null> {
  const reviews = await readAll();
  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) return null;
  reviews[index].status = status;
  await writeAll(reviews);
  return reviews[index];
}

/** 删除评论 */
export async function deleteReview(id: string): Promise<boolean> {
  const reviews = await readAll();
  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) return false;
  reviews.splice(index, 1);
  await writeAll(reviews);
  return true;
}

/** 保存上传的图片 — Vercel 环境不支持本地文件写入，返回 base64 data URL */
export function saveUploadedImage(buffer: Buffer, ext: string): string {
  const mimeMap: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    gif: 'image/gif',
  };
  const mime = mimeMap[ext] || 'image/jpeg';
  return `data:${mime};base64,${buffer.toString('base64')}`;
}
