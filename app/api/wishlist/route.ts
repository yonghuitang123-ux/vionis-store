/**
 * Wishlist API — 已登录用户的服务器端存储
 * GET  /api/wishlist?token=xxx  → 获取收藏列表
 * PUT  /api/wishlist             → 保存收藏列表
 */

import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data', 'wishlists');

// 用 Shopify customer token 获取 customer ID 作为文件名
async function getCustomerId(token: string): Promise<string | null> {
  try {
    const { getCustomer } = await import('@/lib/shopify');
    const customer = await getCustomer(token);
    if (!customer?.id) return null;
    // Shopify ID 是 gid://shopify/Customer/123456 格式，提取数字
    const match = customer.id.match(/(\d+)$/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

async function ensureDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // already exists
  }
}

function filePath(customerId: string) {
  return path.join(DATA_DIR, `${customerId}.json`);
}

// ── GET ─────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

  const customerId = await getCustomerId(token);
  if (!customerId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  await ensureDir();
  try {
    const raw = await fs.readFile(filePath(customerId), 'utf-8');
    const items = JSON.parse(raw);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

// ── PUT ─────────────────────────────────────────────────────────────────────

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { token, items } = body;

  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });
  if (!Array.isArray(items)) return NextResponse.json({ error: 'Invalid items' }, { status: 400 });

  const customerId = await getCustomerId(token);
  if (!customerId) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

  await ensureDir();
  await fs.writeFile(filePath(customerId), JSON.stringify(items, null, 2));

  return NextResponse.json({ success: true });
}
