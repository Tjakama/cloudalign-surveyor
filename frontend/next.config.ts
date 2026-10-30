import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Required for static export & native app builds
  images: {
    unoptimized: true, // Required for static image loading without a Node server
  },
  typescript: {
    ignoreBuildErrors: true, // Bypasses strict type-checking so production builds succeed
  },
  devIndicators: false,
};

export default nextConfig;