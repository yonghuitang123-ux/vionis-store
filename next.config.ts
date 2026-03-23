import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    qualities: [70],
    // 增加 520、320 断点，精确匹配 BrandStory 桌面显示尺寸，减少多余像素下载
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 320, 384, 520],
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
    ],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Cache: vary by RSC header so HTML and RSC payloads are cached separately
          { key: 'Vary', value: 'RSC, Next-Router-State-Tree, Next-Router-Prefetch' },
          // Security: HSTS — enforce HTTPS for 1 year, include subdomains
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          // Security: prevent clickjacking
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          // Security: isolate browsing context from cross-origin popups
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
          // Security: prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Security: control referrer info
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Security: restrict permissions
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
