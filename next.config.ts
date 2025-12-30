import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* output: "export",  <-- Removed to support API routes */
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
