/**
 * 邮件订阅 API
 * ─────────────────────────────────────────────────────────────────
 * POST /api/newsletter — 接收 email，可对接 Klaviyo 或自定义 webhook
 * 环境变量：NEWSLETTER_WEBHOOK_URL（Klaviyo 或自定义 POST 地址，服务端专用）
 */

import { NextResponse } from 'next/server';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim() : '';

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 },
      );
    }

    const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
    if (webhookUrl) {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const text = await res.text();
        console.error('Newsletter webhook failed:', res.status, text);
        return NextResponse.json(
          { error: 'Subscription failed' },
          { status: 502 },
        );
      }
    }
    // 无 webhook 时仅记录（开发环境）
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Newsletter API error:', err);
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 },
    );
  }
}
