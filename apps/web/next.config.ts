import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // 75 is Next's default; 90 keeps the room photos sharp (PHOTO_QUALITY in app/PhotoRotation.tsx).
    qualities: [75, 90],
  },
  // the collection became part of the products
};

export default nextConfig;
