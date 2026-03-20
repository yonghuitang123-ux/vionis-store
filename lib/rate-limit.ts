/**
 * 简易内存级速率限制 — 防止 API 滥用
 * 适用于 Vercel Serverless（实例内限制，非跨实例）
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// 定期清理过期条目
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetTime) store.delete(key);
  }
}, 60_000);

/**
 * 检查是否超出限制
 * @param key 限制维度（如 IP 或 IP+路径）
 * @param limit 窗口内最大请求数
 * @param windowMs 时间窗口（毫秒）
 * @returns true = 允许，false = 限制
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

/** 从请求中提取客户端 IP */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    headers.get('x-real-ip') ||
    'unknown'
  );
}
