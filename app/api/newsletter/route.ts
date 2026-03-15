/**
 * 邮件订阅 API — 对接 Shopify Storefront API
 * ─────────────────────────────────────────────────────────────────
 * POST /api/newsletter — 接收 email，通过 customerCreate 在 Shopify
 * 后台创建一个"已接受营销"的客户。
 *
 * 你可以在 Shopify 后台 → Customers 看到这些订阅者（标记为 Email subscribed）。
 */

import { NextResponse } from 'next/server';
import crypto from 'crypto';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SHOPIFY_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;
const API_VERSION = '2026-01';

const CUSTOMER_CREATE_MUTATION = `
  mutation customerCreate($input: CustomerCreateInput!) {
    customerCreate(input: $input) {
      customer {
        id
        email
        acceptsMarketing
      }
      customerUserErrors {
        code
        field
        message
      }
    }
  }
`;

async function shopifyStorefrontFetch(query: string, variables: Record<string, unknown>) {
  const endpoint = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Shopify API ${res.status}: ${text}`);
  }

  return res.json();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 },
      );
    }

    // 生成随机密码（用户不需要知道，纯粹用于满足 Shopify 的必填字段）
    const randomPassword = crypto.randomBytes(24).toString('base64url');

    const { data, errors } = await shopifyStorefrontFetch(CUSTOMER_CREATE_MUTATION, {
      input: {
        email,
        password: randomPassword,
        acceptsMarketing: true,
      },
    });

    // GraphQL 级别错误
    if (errors?.length) {
      return NextResponse.json(
        { error: 'Subscription failed' },
        { status: 502 },
      );
    }

    const userErrors = data?.customerCreate?.customerUserErrors ?? [];

    // 如果该邮箱已存在 — 对用户来说仍然是"成功"
    if (userErrors.length > 0) {
      const alreadyTaken = userErrors.some(
        (e: { code: string }) => e.code === 'TAKEN' || e.code === 'CUSTOMER_DISABLED',
      );
      if (alreadyTaken) {
        // 邮箱已注册，静默成功
        return NextResponse.json({ success: true, alreadySubscribed: true });
      }

      return NextResponse.json(
        { error: userErrors[0]?.message ?? 'Subscription failed' },
        { status: 400 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: 'Subscription failed. Please try again.' },
      { status: 500 },
    );
  }
}
