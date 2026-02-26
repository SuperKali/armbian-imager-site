import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cache.armbian.com",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
