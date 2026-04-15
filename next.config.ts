import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure image optimization works on Vercel
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Explicitly mark server-only packages so they're not bundled client-side
  serverExternalPackages: ["bcryptjs", "jsonwebtoken", "@prisma/client", "pg"],
};

export default nextConfig;
