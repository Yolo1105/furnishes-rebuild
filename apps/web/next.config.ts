import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // 75 is Next's default; 90 keeps the room photos sharp (PHOTO_QUALITY in app/page.tsx).
    qualities: [75, 90],
  },
};

export default nextConfig;
