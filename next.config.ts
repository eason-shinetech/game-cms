import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  poweredByHeader: false,
  /* config options here */
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  images: {
    remotePatterns: [
      { hostname: "**.gamemonetize.com", protocol: "https" },
      { hostname: "**.gamedistribution.com", protocol: "https" },
      { hostname: "**.gamepix.com", protocol: "https" },
      // 新增以下域名配置
      { hostname: "**.funnyplayers.com", protocol: "https" }
    ],
    minimumCacheTTL: 3600,
    deviceSizes: [320, 640, 768, 1024, 1280],
    imageSizes: [64, 128, 256],
    formats: ['image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  output: 'standalone',
};

export default nextConfig;
