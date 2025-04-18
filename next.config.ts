import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  images: {
    remotePatterns: [{ hostname: "**.gamemonetize.com", protocol: "https" },{ hostname: "**.gamedistribution.com", protocol: "https" }],
  },
};

export default nextConfig;
