import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Attempt to find the member by Supabase ID first
  let member = await prisma.member.findUnique({
    where: { id: user.id },
    include: {
      promotion: true,
    },
  });

  // Fallback to email if not found by ID (for accounts with ID mismatch)
  if (!member && user.email) {
    logger.info({ userId: user.id, email: user.email }, 'Dashboard: Member not found by ID, trying email');
    member = await prisma.member.findUnique({
      where: { email: user.email },
      include: {
        promotion: true,
      },
    });

    if (member) {
      logger.warn({ email: user.email }, 'Dashboard: Member found by email but had different ID. Syncing Prisma ID with Supabase UUID.');
      await prisma.member.update({
        where: { email: user.email },
        data: { id: user.id }
      });
    }
  }

  if (member?.role === "SUPER_ADMIN") {
    redirect("/dashboard/super-admin");
  }

  if (member?.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  if (member?.function === "GESTION_ACTIVITES") {
    redirect("/dashboard/bureau");
  }

  // Un membre simple n'a pas de tableau de bord — il est redirigé vers son profil
  redirect("/profile");
}

