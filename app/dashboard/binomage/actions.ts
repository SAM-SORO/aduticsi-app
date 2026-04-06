"use server";

import { prisma } from "@/lib/prisma";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MemberLight = {
  id: string;
  slug: string | null;
  name: string;
  photo_url: string | null;
  promo_id: string;
  promo_name: string;
  poste_name: string | null;
};

export type BinomePair = {
  id: string;
  promo_combo: string;
  parrain: MemberLight;
  filleul: MemberLight;
};

export type PromoCombo = {
  label: string;    // ex: "INP22-INP23"
  parrain_promo_id: string;
  filleul_promo_id: string;
  parrain_promo_name: string;
  filleul_promo_name: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toMemberLight(m: {
  id: string;
  slug: string | null;
  name: string;
  photo_url: string | null;
  promo_id: string;
  promotion: { name: string };
  poste: { name: string } | null;
}): MemberLight {
  return {
    id: m.id,
    slug: m.slug,
    name: m.name,
    photo_url: m.photo_url,
    promo_id: m.promo_id,
    promo_name: m.promotion.name,
    poste_name: m.poste?.name ?? null,
  };
}

// ─── 1. Générer les combos de promos consécutives ─────────────────────────────

export async function getPromoCombos(): Promise<PromoCombo[]> {
  const promos = await prisma.promotion.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  const combos: PromoCombo[] = [];

  for (let i = 0; i < promos.length - 1; i++) {
    const current = promos[i];
    const next = promos[i + 1];

    // Extraire les 2 premiers chiffres du nom de la promo pour vérifier la consécutivité
    const currentNum = parseInt(current.name.replace(/\D/g, "").slice(0, 2), 10);
    const nextNum = parseInt(next.name.replace(/\D/g, "").slice(0, 2), 10);

    if (!isNaN(currentNum) && !isNaN(nextNum) && nextNum === currentNum + 1) {
      combos.push({
        label: `${current.name}-${next.name}`,
        parrain_promo_id: current.id,
        filleul_promo_id: next.id,
        parrain_promo_name: current.name,
        filleul_promo_name: next.name,
      });
    }
  }

  return combos;
}

// ─── 2. Lister les présidents de promo ────────────────────────────────────────

export async function getPresidents(): Promise<MemberLight[]> {
  const members = await prisma.member.findMany({
    where: {
      poste: {
        name: { contains: "Président", mode: "insensitive" },
      },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      photo_url: true,
      promo_id: true,
      promotion: { select: { name: true } },
      poste: { select: { name: true } },
    },
    orderBy: { promotion: { name: "asc" } },
  });

  return members.map(toMemberLight);
}

// ─── 3. Membres parrains d'un combo (promo N = plus ancienne) ────────────────

export async function getParrainsByCombo(parrainPromoId: string): Promise<MemberLight[]> {
  const members = await prisma.member.findMany({
    where: { promo_id: parrainPromoId },
    select: {
      id: true,
      slug: true,
      name: true,
      photo_url: true,
      promo_id: true,
      promotion: { select: { name: true } },
      poste: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  });

  return members.map(toMemberLight);
}

// ─── 4. Membres filleuls d'un combo (promo N+1 = plus récente) ───────────────

export async function getFieulsByCombo(filleulPromoId: string): Promise<MemberLight[]> {
  const members = await prisma.member.findMany({
    where: { promo_id: filleulPromoId },
    select: {
      id: true,
      slug: true,
      name: true,
      photo_url: true,
      promo_id: true,
      promotion: { select: { name: true } },
      poste: { select: { name: true } },
    },
    orderBy: { name: "asc" },
  });

  return members.map(toMemberLight);
}

// ─── 5. Lister les binômes d'un combo ────────────────────────────────────────

export async function getBinomesForCombo(promoCombo: string): Promise<BinomePair[]> {
  const binomes = await prisma.binome.findMany({
    where: { promo_combo: promoCombo },
    include: {
      parrain: {
        select: {
          id: true,
          slug: true,
          name: true,
          photo_url: true,
          promo_id: true,
          promotion: { select: { name: true } },
          poste: { select: { name: true } },
        },
      },
      filleul: {
        select: {
          id: true,
          slug: true,
          name: true,
          photo_url: true,
          promo_id: true,
          promotion: { select: { name: true } },
          poste: { select: { name: true } },
        },
      },
    },
    orderBy: { created_at: "asc" },
  });

  return binomes.map((b) => ({
    id: b.id,
    promo_combo: b.promo_combo,
    parrain: toMemberLight(b.parrain),
    filleul: toMemberLight(b.filleul),
  }));
}

// ─── 6. Créer un binôme ───────────────────────────────────────────────────────

export async function createBinome(
  parrainId: string,
  filleulId: string,
  promoCombo: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.binome.create({
      data: {
        parrain_id: parrainId,
        filleul_id: filleulId,
        promo_combo: promoCombo,
      },
    });
    return { success: true };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erreur inconnue";
    return { success: false, error: msg };
  }
}

// ─── 7. Réinitialiser le binomage d'un combo ─────────────────────────────────

export async function reinitializeBinomage(
  promoCombo: string
): Promise<{ success: boolean; count: number }> {
  const result = await prisma.binome.deleteMany({
    where: { promo_combo: promoCombo },
  });
  return { success: true, count: result.count };
}

// ─── 8. Stats rapides ─────────────────────────────────────────────────────────

export async function getBinomageStats(
  promoCombo: string,
  parrainPromoId: string,
  filleulPromoId: string
): Promise<{
  totalParrains: number;
  totalFieuls: number;
  totalBinomes: number;
  parrainsNonBinomes: number;
  fieulsNonBinomes: number;
}> {
  const [totalParrains, totalFieuls, totalBinomes, binomesData] = await Promise.all([
    prisma.member.count({ where: { promo_id: parrainPromoId } }),
    prisma.member.count({ where: { promo_id: filleulPromoId } }),
    prisma.binome.count({ where: { promo_combo: promoCombo } }),
    prisma.binome.findMany({
      where: { promo_combo: promoCombo },
      select: { parrain_id: true, filleul_id: true },
    }),
  ]);

  const binomedParrainIds = new Set(binomesData.map((b) => b.parrain_id));
  const binomedFilleulIds = new Set(binomesData.map((b) => b.filleul_id));

  return {
    totalParrains,
    totalFieuls,
    totalBinomes,
    parrainsNonBinomes: totalParrains - binomedParrainIds.size,
    fieulsNonBinomes: totalFieuls - binomedFilleulIds.size,
  };
}
