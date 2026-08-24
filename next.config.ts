import type { NextConfig } from "next";

/**
 * Pattern d'image dérivé de NEXT_PUBLIC_SUPABASE_URL (évalué au BUILD).
 * Évite de figer un hostname en dur : changer d'instance Supabase ne demande
 * plus de toucher à ce fichier, il suffit de changer la variable d'environnement.
 *
 * ⚠️ NEXT_PUBLIC_SUPABASE_URL doit donc être disponible au moment du `next build`
 *    (cf. les ARG/ENV du Dockerfile), pas seulement au runtime.
 */
function supabaseImagePattern() {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return [];

  try {
    const { protocol, hostname, port } = new URL(raw);
    return [
      {
        protocol: protocol.replace(":", "") as "http" | "https",
        hostname,
        ...(port ? { port } : {}),
      },
    ];
  } catch {
    // URL malformée : on ne fait pas échouer le build, l'app lèvera plus tôt
    // via lib/supabase/* si la variable est réellement inutilisable.
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
    remotePatterns: [
      ...supabaseImagePattern(),
      // TEMPORAIRE — ancienne instance Supabase Cloud.
      // Les URLs déjà stockées en base (Member.photo_url, Activity.image_url,
      // Publication.images, Partner.logo_url) pointent encore vers ce domaine.
      // À SUPPRIMER une fois scripts/migrate-storage-urls.sql exécuté et validé.
      { protocol: "https" as const, hostname: "nqofzuoozxnwyylxidne.supabase.co" },
    ],
  },
};

export default nextConfig;
