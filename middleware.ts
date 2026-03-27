/**
 * Next.js Middleware — 语言检测 + 路由重定向
 * ─────────────────────────────────────────────────────────────────
 * 1. 检查 URL 是否已包含 locale 前缀
 * 2. 如果没有：检查 cookie → Accept-Language → 默认 en
 * 3. 301 重定向到 /{locale}/xxx
 */

import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'fr', 'de', 'ja', 'it', 'es', 'pt', 'nl', 'pl', 'cs', 'da', 'fi', 'no', 'sv'];
const defaultLocale = 'en';

function getPreferredLocale(request: NextRequest): string {
  // 1. Cookie 优先（用户手动切换过语言）
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  // 2. 浏览器 Accept-Language
  const acceptLang = request.headers.get('accept-language');
  if (acceptLang) {
    const preferred = acceptLang
      .split(',')
      .map((l) => l.split(';')[0].trim().split('-')[0].toLowerCase());
    for (const lang of preferred) {
      if (locales.includes(lang)) return lang;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // /pages/about → /pages/our-story（301，避免 Shopify API 5xx）
  if (pathname === '/pages/about' || pathname.match(/^\/[a-z]{2}\/pages\/about$/)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/\/pages\/about$/, '/pages/our-story');
    return NextResponse.redirect(url, 301);
  }

  // 跳过：Shopify checkout paths, API、静态文件、admin、_next、uploads 等
  if (
    pathname.startsWith('/cart/c/') ||
    pathname.startsWith('/checkouts/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/uploads/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/llms.txt' ||
    pathname === '/llms-full.txt' ||
    pathname.match(/\.\w+$/) // 任何带扩展名的文件
  ) {
    return NextResponse.next();
  }

  // 检查路径是否已有 locale 前缀
  const segments = pathname.split('/');
  const firstSegment = segments[1]; // '' 之后的第一段

  if (locales.includes(firstSegment)) {
    // /en/* → 301 重定向到 /*（英文是默认语言，不需要前缀）
    if (firstSegment === defaultLocale) {
      const url = request.nextUrl.clone();
      const rest = pathname.replace(/^\/en\/?/, '/');
      url.pathname = rest === '' ? '/' : rest;
      return NextResponse.redirect(url, 301);
    }

    // 其他语言已有 locale 前缀，放行
    // 设置 cookie 记住用户选择
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', firstSegment, {
      maxAge: 365 * 24 * 60 * 60, // 1 year
      path: '/',
      sameSite: 'lax',
    });
    return response;
  }

  // 没有 locale 前缀 → 当作英文默认语言，rewrite 到 /en/path（URL 不变）
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;

  const response = NextResponse.rewrite(url);
  response.cookies.set('NEXT_LOCALE', defaultLocale, {
    maxAge: 365 * 24 * 60 * 60,
    path: '/',
    sameSite: 'lax',
  });
  return response;
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径，排除：
     * - api (API routes)
     * - _next (Next.js internals)
     * - admin (管理后台)
     * - 静态文件
     */
    '/((?!api|_next|admin|uploads|favicon\\.ico|robots\\.txt|sitemap\\.xml|llms\\.txt|llms-full\\.txt).*)',
  ],
};
