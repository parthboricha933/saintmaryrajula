import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-a1a30f0f-83ea-4712-ad8d-2777148b44d5.space-z.ai",
  ],
  env: {
    DATABASE_URL:
      "postgresql://neondb_owner:npg_9b2xVzACPMOj@ep-winter-band-azhei341-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
  },
};

export default nextConfig;
