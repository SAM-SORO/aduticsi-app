/**
 * Génère un slug URL-safe à partir d'un nom de membre.
 * Ex: "SORO Konan Sam"  → "soro-konan-sam"
 *     "Éric Müller"     → "eric-muller"
 *     "N'Goran Aya"     → "ngoran-aya"
 */
export function generateMemberSlug(name: string): string {
  return name
    .toLowerCase()
    // Normaliser les caractères accentués (é→e, ü→u, etc.)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Supprimer les apostrophes et guillemets sans espace (N'Goran → NGoran d'abord)
    .replace(/['''`]/g, '')
    // Remplacer tout ce qui n'est pas alphanumérique par un tiret
    .replace(/[^a-z0-9]+/g, '-')
    // Supprimer les tirets en début et fin
    .replace(/^-+|-+$/g, '')
    // Éviter les tirets multiples
    .replace(/-{2,}/g, '-')
}

/**
 * Génère un slug unique en ajoutant un suffixe numérique si le slug de base
 * est déjà pris. Retourne le slug disponible.
 *
 * @param baseName   - Le nom du membre
 * @param existsFn   - Fonction async qui retourne true si le slug est déjà utilisé
 */
export async function generateUniqueSlug(
  baseName: string,
  existsFn: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = generateMemberSlug(baseName)
  if (!(await existsFn(base))) return base

  let counter = 2
  while (true) {
    const candidate = `${base}-${counter}`
    if (!(await existsFn(candidate))) return candidate
    counter++
  }
}
