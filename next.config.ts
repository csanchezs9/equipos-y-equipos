import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sirve AVIF/WebP segun el navegador (menos peso que el original).
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
