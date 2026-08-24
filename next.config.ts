import type { NextConfig } from "next";

// Hostname des images dérivé de NEXT_PUBLIC_SUPABASE_URL, lu au build.
function supabaseImagePattern() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return [];
  try {
    const { protocol, hostname, port } = new URL(raw);
    return [{
      protocol: protocol.replace(":", "") as "http" | "https",
      hostname,
      ...(port ? { port } : {}),
    }];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Permet l'upload d'avatars jusqu'à 5 MB
    },
  },
  images: {
    remotePatterns: supabaseImagePattern(),
  },
};

export default nextConfig;
