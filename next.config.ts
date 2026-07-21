import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-a1a30f0f-83ea-4712-ad8d-2777148b44d5.space-z.ai",
  ],
};

export default nextConfig;
