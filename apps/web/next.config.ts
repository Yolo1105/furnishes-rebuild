import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // 75 is Next's default; 90 is there for photos that ask for it with `quality={90}`.
    qualities: [75, 90],
  },
  // the collection became part of the products
};

export default nextConfig;
