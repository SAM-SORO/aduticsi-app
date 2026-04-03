"use server";

import { revalidatePath } from "next/cache";
import type { Prisma, MemberStatus, MemberRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import logger from "@/lib/logger";

const MEMBERS_PER_PAGE = 10;

async function requireSuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const member = await prisma.member.findUnique({ where: { id: user.id } });
  if (!member || member.role !== "SUPER_ADMIN") {
    logger.warn({ userId: user.id, role: member?.role }, "Unauthorized access attempt to super admin action");
    throw new Error("Unauthorized");
  }
  return { user, member };
}

export async function getMembersPaginated(
  page: number = 1,
  search: string = "",
  promoId: string = "",
  status: string = "",
  role: string = ""
) {
  const where: Prisma.MemberWhereInput = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (promoId) where.promo_id = promoId;
  if (status) where.status = status as MemberStatus;
  if (role) where.role = role as MemberRole;

  const [members, total] = await Promise.all([
    prisma.member.findMany({
      where,
      include: { promotion: { select: { name: true } } },
      orderBy: { created_at: "desc" },
      skip: (page - 1) * MEMBERS_PER_PAGE,
      take: MEMBERS_PER_PAGE,
    }),
    prisma.member.count({ where }),
  ]);

  return {
    members,
    total,
    totalPages: Math.ceil(total / MEMBERS_PER_PAGE),
    currentPage: page,
  };
}

export async function updateMemberRole(memberId: string, newRole: "MEMBER" | "ADMIN" | "SUPER_ADMIN") {
  await requireSuperAdmin();
  await prisma.member.update({
    where: { id: memberId },
    data: {
      role: newRole,
      function: newRole === "MEMBER" ? "NONE" : "GESTION_ACTIVITES",
    },
  });
  revalidatePath("/dashboard/super-admin/members");
  return { success: true };
}

export async function updateMemberPoste(
  memberId: string,
  posteId: string | null
) {
  await requireSuperAdmin();
  await prisma.member.update({ where: { id: memberId }, data: { poste_id: posteId } });
  revalidatePath("/dashboard/super-admin/members");
  return { success: true };
}

export async function updateMemberGender(memberId: string, gender: "MALE" | "FEMALE" | null) {
  await requireSuperAdmin();
  await prisma.member.update({ where: { id: memberId }, data: { gender } });
  revalidatePath("/dashboard/super-admin/members");
  return { success: true };
}

export async function updateMemberStatus(memberId: string, newStatus: "STUDENT" | "ALUMNI") {
  await requireSuperAdmin();
  await prisma.member.update({ where: { id: memberId }, data: { status: newStatus } });
  revalidatePath("/dashboard/super-admin/members");
  return { success: true };
}

export async function deleteMember(memberId: string) {
  await requireSuperAdmin();
  await prisma.member.delete({ where: { id: memberId } });
  revalidatePath("/dashboard/super-admin/members");
  revalidatePath("/members");
  return { success: true };
}

export async function updateMemberFunction(
  memberId: string,
  nextFunction: "NONE" | "GESTION_ACTIVITES"
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const actor = await prisma.member.findUnique({ where: { id: user.id } });
  if (!actor) throw new Error("Unauthorized");

  const target = await prisma.member.findUnique({
    where: { id: memberId },
    select: { id: true, promo_id: true, role: true },
  });
  if (!target) throw new Error("Member not found");

  const isSuperAdmin = actor.role === "SUPER_ADMIN";
  const isAdminSamePromo =
    actor.role === "ADMIN" && actor.promo_id === target.promo_id;

  if (!isSuperAdmin && !isAdminSamePromo) {
    throw new Error("Unauthorized");
  }

  if (target.role !== "MEMBER") {
    throw new Error("Action autorisée uniquement sur les membres simples.");
  }

  await prisma.member.update({
    where: { id: memberId },
    data: { function: nextFunction },
  });

  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/super-admin/members");
  return { success: true };
}

export async function getAllPostes() {
  return prisma.poste.findMany({
    orderBy: { name: "asc" },
  });
}
