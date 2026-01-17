import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    // Ensure Turbopack uses this project as the root
    root: __dirname,
  },
};

export default nextConfig;
