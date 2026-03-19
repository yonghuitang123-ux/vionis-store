/**
 * 评论邀请邮件 API
 * POST /api/reviews/request
 *
 * 由 Shopify Flow webhook 调用，向客户发送评论邀请邮件
 *
 * Body: {
 *   customer_email: string,
 *   customer_name: string,
 *   order_name: string,        // e.g. "#1001"
 *   line_items: Array<{
 *     product_id: string | number,
 *     title: string,
 *     variant_title?: string,
 *   }>
 * }
 *
 * Header: x-webhook-secret (用于验证请求来源)
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { generateToken } from '@/lib/reviews';

const WEBHOOK_SECRET = process.env.REVIEW_WEBHOOK_SECRET || 'vionis-review-2026';
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.REVIEW_FROM_EMAIL || 'VIONIS·XY <reviews@vionisxy.com>';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vionis-store.vercel.app';

export async function POST(req: NextRequest) {
  // 验证 webhook 密钥
  const secret = req.headers.get('x-webhook-secret');
  if (secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'RESEND_API_KEY not configured' },
      { status: 500 },
    );
  }

  try {
    const body = await req.json();
    const {
      customer_email,
      customer_name,
      order_name,
      line_items = [],
    } = body;

    if (!customer_email || line_items.length === 0) {
      return NextResponse.json(
        { error: 'Missing customer_email or line_items' },
        { status: 400 },
      );
    }

    const resend = new Resend(RESEND_API_KEY);
    const firstName = (customer_name || 'there').split(' ')[0];

    // 为每个产品生成评论链接
    const productLinks = line_items.map((item: any) => {
      const productId = typeof item.product_id === 'number'
        ? `gid://shopify/Product/${item.product_id}`
        : String(item.product_id);

      const token = generateToken({
        productId,
        productTitle: item.title,
        email: customer_email,
      });

      const reviewUrl = `${SITE_URL}/en/review?token=${token}`;

      return {
        title: item.title,
        variant: item.variant_title || '',
        url: reviewUrl,
      };
    });

    // 生成邮件 HTML
    const emailHtml = generateEmailHtml(firstName, order_name, productLinks);

    // 发送邮件
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: customer_email,
      subject: `${firstName}, how are you enjoying your VIONIS·XY pieces?`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      sent_to: customer_email,
      products: productLinks.length,
    });
  } catch (err) {
    console.error('Review request error:', err);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 },
    );
  }
}

// ─── 邮件模板 ─────────────────────────────────────────────────────────────────

function generateEmailHtml(
  firstName: string,
  orderName: string,
  products: Array<{ title: string; variant: string; url: string }>,
): string {
  const productRows = products
    .map(
      (p) => `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid #f0ece6;">
          <p style="margin:0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:15px;color:#1a1a1a;font-weight:500;">
            ${p.title}
          </p>
          ${p.variant ? `<p style="margin:4px 0 0;font-size:13px;color:#999;">${p.variant}</p>` : ''}
          <a href="${p.url}" style="display:inline-block;margin-top:12px;padding:10px 28px;background:#1a1a1a;color:#ffffff;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:12px;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;">
            Write a Review
          </a>
        </td>
      </tr>`,
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f7f5f2;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f5f2;padding:40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:40px 40px 0;text-align:center;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:20px;letter-spacing:0.15em;color:#1a1a1a;">
                VIONIS·XY
              </p>
              <p style="margin:4px 0 0;font-size:10px;letter-spacing:0.2em;color:#C8B69E;text-transform:uppercase;">
                Merino & Cashmere
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:24px 40px;">
              <hr style="border:none;border-top:1px solid #f0ece6;margin:0;">
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:0 40px;">
              <p style="margin:0 0 8px;font-family:Georgia,'Times New Roman',serif;font-size:24px;color:#1a1a1a;font-weight:400;">
                Dear ${firstName},
              </p>
              <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.7;">
                Thank you for your recent order${orderName ? ` (${orderName})` : ''}. We hope you're enjoying your new pieces. Your feedback means the world to us — would you take a moment to share your experience?
              </p>
            </td>
          </tr>

          <!-- Products -->
          <tr>
            <td style="padding:0 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                ${productRows}
              </table>
            </td>
          </tr>

          <!-- Footer note -->
          <tr>
            <td style="padding:32px 40px 0;">
              <p style="margin:0;font-size:13px;color:#999;line-height:1.6;">
                Your review will be published after a brief review by our team. As a verified buyer, your review will receive a special badge.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 40px 40px;text-align:center;">
              <hr style="border:none;border-top:1px solid #f0ece6;margin:0 0 24px;">
              <p style="margin:0;font-size:11px;color:#ccc;letter-spacing:0.08em;">
                © 2026 VIONIS·XY — 100% Alxa Cashmere & Australian Merino
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
