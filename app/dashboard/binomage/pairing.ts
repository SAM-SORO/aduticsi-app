// Regles du tirage :
//  - chaque parrain a au moins un filleul, chaque filleul au moins un parrain ;
//  - le cote le plus nombreux est servi une fois chacun ;
//  - le cote le moins nombreux absorbe le surplus, charges equilibrees a une
//    unite pres, jamais un membre a trois partenaires quand d'autres en ont un ;
//  - chaque choix reste aleatoire, des deux cotes.

export type Side = "parrain" | "filleul";

export interface Pair {
  parrainId: string;
  filleulId: string;
}

export interface PairingInput {
  parrainIds: string[];
  filleulIds: string[];
  existingPairs: Pair[];
}

export interface PairingState {
  majoritySide: Side;
  /** Membres du cote majoritaire restant a servir. */
  pending: string[];
  /** Nombre de partenaires deja attribues a chaque membre du cote minoritaire. */
  load: Map<string, number>;
  /** Couples deja formes, pour ne jamais repeter le meme. */
  taken: Set<string>;
  /** Nombre de tirages restants pour terminer. */
  remaining: number;
}

const key = (parrainId: string, filleulId: string) => `${parrainId}:${filleulId}`;

function pickRandom<T>(items: T[], random: () => number): T {
  return items[Math.floor(random() * items.length)];
}

export function initPairing({ parrainIds, filleulIds, existingPairs }: PairingInput): PairingState {
  // A effectifs egaux, on sert les parrains : chacun recevra exactement un filleul.
  const majoritySide: Side = filleulIds.length > parrainIds.length ? "filleul" : "parrain";
  const majorityIds = majoritySide === "parrain" ? parrainIds : filleulIds;
  const minorityIds = majoritySide === "parrain" ? filleulIds : parrainIds;

  const served = new Set<string>();
  const load = new Map<string, number>(minorityIds.map((id) => [id, 0]));
  const taken = new Set<string>();

  for (const pair of existingPairs) {
    taken.add(key(pair.parrainId, pair.filleulId));
    const majorityId = majoritySide === "parrain" ? pair.parrainId : pair.filleulId;
    const minorityId = majoritySide === "parrain" ? pair.filleulId : pair.parrainId;
    served.add(majorityId);
    if (load.has(minorityId)) load.set(minorityId, (load.get(minorityId) ?? 0) + 1);
  }

  const pending = majorityIds.filter((id) => !served.has(id));
  return { majoritySide, pending, load, taken, remaining: pending.length };
}

/**
 * Tire le prochain couple. Retourne null quand il n'y a plus rien a former,
 * ou quand aucun partenaire admissible ne reste pour le membre choisi.
 */
export function drawPair(state: PairingState, random: () => number = Math.random): Pair | null {
  if (state.pending.length === 0) return null;

  const majorityId = pickRandom(state.pending, random);

  // On ne reforme jamais un couple existant.
  const candidates = [...state.load.keys()].filter((minorityId) => {
    const k = state.majoritySide === "parrain"
      ? key(majorityId, minorityId)
      : key(minorityId, majorityId);
    return !state.taken.has(k);
  });
  if (candidates.length === 0) return null;

  // Les moins charges d'abord : l'ecart entre deux membres reste d'au plus un.
  const minLoad = Math.min(...candidates.map((id) => state.load.get(id) ?? 0));
  const leastLoaded = candidates.filter((id) => (state.load.get(id) ?? 0) === minLoad);
  const minorityId = pickRandom(leastLoaded, random);

  return state.majoritySide === "parrain"
    ? { parrainId: majorityId, filleulId: minorityId }
    : { parrainId: minorityId, filleulId: majorityId };
}

/** Enregistre un couple valide et fait avancer l'etat. */
export function commitPair(state: PairingState, pair: Pair): PairingState {
  const majorityId = state.majoritySide === "parrain" ? pair.parrainId : pair.filleulId;
  const minorityId = state.majoritySide === "parrain" ? pair.filleulId : pair.parrainId;

  const pending = state.pending.filter((id) => id !== majorityId);
  const load = new Map(state.load);
  load.set(minorityId, (load.get(minorityId) ?? 0) + 1);
  const taken = new Set(state.taken);
  taken.add(key(pair.parrainId, pair.filleulId));

  return { ...state, pending, load, taken, remaining: pending.length };
}
