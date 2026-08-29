// Les buckets sont publics : un SVG accepte ici serait servi tel quel et
// pourrait porter du script. Seuls les formats matriciels sont autorises.
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function validateImage(file: File): { ok: true; ext: string } | { ok: false; error: string } {
  if (file.size === 0) return { ok: false, error: "Le fichier est vide." };
  if (file.size > MAX_IMAGE_SIZE) {
    return { ok: false, error: "L'image ne doit pas dépasser 5 Mo." };
  }
  if (!(ALLOWED_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return { ok: false, error: "Format non accepté. Utilisez JPEG, PNG ou WebP." };
  }
  // L'extension vient du type declare, jamais du nom fourni par le client.
  return { ok: true, ext: EXTENSIONS[file.type] };
}
