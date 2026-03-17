import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
  },
  images: {
    qualities: [70],
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
    ],
  },

  async headers() {
    return [
      {
        // All routes: tell Cloudflare to vary cache by RSC header
        // so HTML and RSC payloads are cached separately
        source: '/:path*',
        headers: [
          { key: 'Vary', value: 'RSC, Next-Router-State-Tree, Next-Router-Prefetch' },
        ],
      },
    ];
  },
};

export default nextConfig;
