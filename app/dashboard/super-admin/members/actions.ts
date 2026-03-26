"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const MEMBERS_PER_PAGE = 10;

async function requireSuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const member = await prisma.member.findUnique({ where: { id: user.id } });
  if (!member || member.role !== "SUPER_ADMIN") throw new Error("Unauthorized");
  return { user, member };
}

export async function getMembersPaginated(
  page: number = 1,
  search: string = "",
  promoId: string = "",
  status: string = "",
  role: string = ""
) {
  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (promoId) where.promo_id = promoId;
  if (status) where.status = status;
  if (role) where.role = role;

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
  await prisma.member.update({ where: { id: memberId }, data: { role: newRole } });
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

export async function getAllPostes() {
  return prisma.poste.findMany({
    orderBy: { name: "asc" },
  });
}
