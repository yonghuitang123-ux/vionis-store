/**
 * Review 数据层 — JSON 文件存储
 * ─────────────────────────────────────────────────────────────────
 * 开发/小规模使用 JSON 文件存储评论。
 * 生产环境如部署到 Vercel 需替换为数据库（Supabase / PlanetScale 等）。
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// ─── 路径 ───────────────────────────────────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), 'data');
const REVIEWS_FILE = path.join(DATA_DIR, 'reviews.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(REVIEWS_FILE))
    fs.writeFileSync(REVIEWS_FILE, '[]', 'utf8');
}

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

function readAll(): ReviewRecord[] {
  ensureDataDir();
  try {
    const raw = fs.readFileSync(REVIEWS_FILE, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeAll(reviews: ReviewRecord[]) {
  ensureDataDir();
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2), 'utf8');
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
export function getApprovedReviews(productId: string): ReviewRecord[] {
  return readAll()
    .filter((r) => r.productId === productId && r.status === 'approved')
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
}

/** 按状态获取评论（后台用） */
export function getReviewsByStatus(status?: string): ReviewRecord[] {
  const all = readAll();
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
export function createReview(
  data: Omit<ReviewRecord, 'id' | 'displayName' | 'status' | 'createdAt'>,
): ReviewRecord {
  const reviews = readAll();
  const review: ReviewRecord = {
    ...data,
    id: crypto.randomUUID(),
    displayName: anonymizeName(data.author),
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  reviews.push(review);
  writeAll(reviews);
  return review;
}

/** 后台手动创建评论（可直接设定状态） */
export function createManualReview(
  data: Omit<ReviewRecord, 'id' | 'createdAt'>,
): ReviewRecord {
  const reviews = readAll();
  const review: ReviewRecord = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  reviews.push(review);
  writeAll(reviews);
  return review;
}

/** 更新评论状态 */
export function updateReviewStatus(
  id: string,
  status: 'approved' | 'rejected',
): ReviewRecord | null {
  const reviews = readAll();
  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) return null;
  reviews[index].status = status;
  writeAll(reviews);
  return reviews[index];
}

/** 删除评论 */
export function deleteReview(id: string): boolean {
  const reviews = readAll();
  const index = reviews.findIndex((r) => r.id === id);
  if (index === -1) return false;
  reviews.splice(index, 1);
  writeAll(reviews);
  return true;
}

/** 保存上传的图片到 public 目录 */
export function saveUploadedImage(buffer: Buffer, ext: string): string {
  const dir = path.join(process.cwd(), 'public', 'uploads', 'reviews');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const filename = `${crypto.randomUUID()}.${ext}`;
  fs.writeFileSync(path.join(dir, filename), buffer);
  return `/uploads/reviews/${filename}`;
}
