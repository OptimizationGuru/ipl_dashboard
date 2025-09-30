import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Removed static export to support API routes for live updates
  trailingSlash: false,
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
