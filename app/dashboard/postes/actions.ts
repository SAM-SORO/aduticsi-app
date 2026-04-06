"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import logger from "@/lib/logger";

async function requireSuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const member = await prisma.member.findUnique({ where: { id: user.id } });
  if (!member || member.role !== "SUPER_ADMIN") throw new Error("Unauthorized");
  return user;
}

export async function getPostes() {
  return prisma.poste.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createPoste(name: string) {
  await requireSuperAdmin();
  try {
    const poste = await prisma.poste.create({
      data: { name },
    });
    revalidatePath("/dashboard/super-admin/postes");
    return { success: true, poste };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { success: false, error: "Ce poste existe déjà." };
    }
    logger.error({ error, name }, "Error creating poste");
    return { success: false, error: "Une erreur est survenue." };
  }
}

export async function updatePoste(id: string, name: string) {
  await requireSuperAdmin();
  try {
    const poste = await prisma.poste.update({
      where: { id },
      data: { name },
    });
    revalidatePath("/dashboard/super-admin/postes");
    return { success: true, poste };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { success: false, error: "Ce nom de poste est déjà utilisé." };
    }
    logger.error({ error, id, name }, "Error updating poste");
    return { success: false, error: "Une erreur est survenue." };
  }
}

export async function deletePoste(id: string) {
  await requireSuperAdmin();
  try {
    await prisma.poste.delete({
      where: { id },
    });
    revalidatePath("/dashboard/super-admin/postes");
    return { success: true };
  } catch (error) {
    logger.error({ error, id }, "Error deleting poste");
    return { success: false, error: "Impossible de supprimer ce poste. Vérifiez s'il est utilisé par des membres." };
  }
}
