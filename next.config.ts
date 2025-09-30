import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use SSG without export (allows API routes and dynamic features)
  // output: 'export', // Disabled - incompatible with API routes
  // trailingSlash: true, // Not needed without export
  images: {
    unoptimized: true  // Keep for compatibility
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  }
};

export default nextConfig;
