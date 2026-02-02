import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: 'standalone',
  /* config options here */
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
