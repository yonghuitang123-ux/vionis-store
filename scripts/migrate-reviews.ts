/**
 * 一次性迁移脚本：将 data/reviews.json 导入 Upstash Redis
 * 运行: npx tsx scripts/migrate-reviews.ts
 */
import { Redis } from '@upstash/redis';
import fs from 'fs';
import path from 'path';

const url = process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
const token = process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;

if (!url || !token) {
  console.error('❌ 缺少环境变量 UPSTASH_REDIS_REST_KV_REST_API_URL / TOKEN');
  console.error('   请先运行: vercel env pull .env.local');
  process.exit(1);
}

const redis = new Redis({ url, token });

async function migrate() {
  const filePath = path.join(process.cwd(), 'data', 'reviews.json');

  if (!fs.existsSync(filePath)) {
    console.error('❌ 找不到 data/reviews.json');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`📦 找到 ${data.length} 条评论`);

  // 读取 Redis 中现有数据，避免重复
  const existing = await redis.get<any[]>('reviews:all') || [];
  const existingIds = new Set(existing.map((r: any) => r.id));

  const newReviews = data.filter((r: any) => !existingIds.has(r.id));

  if (newReviews.length === 0) {
    console.log('✅ 没有新评论需要迁移');
    return;
  }

  const merged = [...existing, ...newReviews];
  await redis.set('reviews:all', merged);

  console.log(`✅ 成功迁移 ${newReviews.length} 条评论到 Redis（总共 ${merged.length} 条）`);
}

migrate().catch(console.error);
