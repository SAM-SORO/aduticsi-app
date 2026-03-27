import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nqofzuoozxnwyylxidne.supabase.co",
      },
    ],
  },
};

export default nextConfig;
 
