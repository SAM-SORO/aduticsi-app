/**
 * Utilitaire de nommage standardisé pour les fichiers uploadés dans Supabase Storage.
 *
 * Convention :
 *  - Photo profil    → prenom-nom_YYYYMMDD-HHmmss.ext
 *  - Logo partenaire → nom-partenaire_YYYYMMDD-HHmmss.ext
 *  - Image activité  → titre-activite_YYYYMMDD-HHmmss.ext
 *  - Image publication #n → titre_YYYYMMDD-HHmmss_01.ext, _02.ext, …
 */

/**
 * Normalise un label en slug lisible et compatible avec les systèmes de fichiers.
 * Ex: "Sam Söro !" → "sam-söro", "Info's Days 2024" → "infos-days-2024"
 */
function slugify(label: string): string {
  return label
    .normalize("NFD")                    // Décompose les caractères accentués
    .replace(/[\u0300-\u036f]/g, "")     // Supprime les diacritiques (accents)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")       // Supprime les caractères spéciaux (', !, etc.)
    .trim()
    .replace(/\s+/g, "-")               // Remplace les espaces par des tirets
    .replace(/-+/g, "-")                // Évite les doubles tirets
    .substring(0, 50);                  // Limite la longueur pour éviter les noms trop longs
}

/**
 * Formate la date actuelle en YYYYMMDD-HHmmss
 */
function formatDate(date: Date = new Date()): string {
  const Y = date.getFullYear();
  const M = String(date.getMonth() + 1).padStart(2, "0");
  const D = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${Y}${M}${D}-${h}${m}${s}`;
}

/**
 * Construit le nom de fichier standardisé pour l'upload dans Supabase Storage.
 *
 * @param label - Nom lisible (ex: "Sam Soro", "Orange CI", "Hackathon 2024")
 * @param ext   - Extension du fichier sans le point (ex: "jpg", "png")
 * @param index - (Optionnel) Numéro d'ordre pour les images multiples (1, 2, 3, …)
 * @returns Nom de fichier prêt pour l'upload (ex: "sam-soro_20260404-213500.jpg")
 *
 * @example
 * buildStorageName("Sam Soro", "jpg")        → "sam-soro_20260404-213500.jpg"
 * buildStorageName("Orange CI", "png")       → "orange-ci_20260404-213500.png"
 * buildStorageName("Fun Night", "jpg", 1)    → "fun-night_20260404-213500_01.jpg"
 * buildStorageName("Fun Night", "jpg", 2)    → "fun-night_20260404-213500_02.jpg"
 */
export function buildStorageName(label: string, ext: string, index?: number): string {
  const slug = slugify(label) || "fichier";
  const date = formatDate();
  const suffix = index !== null && index !== undefined ? `_${String(index).padStart(2, "0")}` : "";
  const cleanExt = ext.replace(/^\./, "").toLowerCase(); // Enlève le point si présent
  return `${slug}_${date}${suffix}.${cleanExt}`;
}
