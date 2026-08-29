import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import logger from "@/lib/logger";

// Une server action est un endpoint POST invocable depuis n'importe quelle
// route : le controle d'acces de la page qui l'affiche ne la protege pas.
async function currentMember() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const member = await prisma.member.findUnique({
    where: { id: user.id },
    select: { id: true, role: true, function: true, registration_status: true },
  });
  if (!member) throw new Error("Unauthorized");
  if (member.registration_status !== "APPROVED") {
    logger.warn({ userId: user.id }, "Action refusée : compte non approuvé");
    throw new Error("Unauthorized");
  }
  return member;
}

export async function requireSuperAdmin() {
  const member = await currentMember();
  if (member.role !== "SUPER_ADMIN") {
    logger.warn({ userId: member.id, role: member.role }, "Action super-admin refusée");
    throw new Error("Unauthorized");
  }
  return member;
}

export async function requireAdmin() {
  const member = await currentMember();
  if (member.role !== "SUPER_ADMIN" && member.role !== "ADMIN") {
    logger.warn({ userId: member.id, role: member.role }, "Action admin refusée");
    throw new Error("Unauthorized");
  }
  return member;
}

export async function requireActivityManager() {
  const member = await currentMember();
  const allowed =
    member.role === "SUPER_ADMIN" ||
    member.role === "ADMIN" ||
    member.function === "GESTION_ACTIVITES";
  if (!allowed) {
    logger.warn({ userId: member.id, role: member.role }, "Action activités refusée");
    throw new Error("Unauthorized");
  }
  return member;
}
