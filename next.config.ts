import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Permet l'upload d'avatars jusqu'à 5 MB
    },
  },
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
 
