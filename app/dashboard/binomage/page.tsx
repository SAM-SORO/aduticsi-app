import { redirect } from "next/navigation";
import { getPromoCombos } from "./actions";
import { BinomagePageClient } from "./BinomagePageClient";
import { DashboardLayout } from "@/components/dashboard/DashboardShell";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import logger from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function BinomagePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  let member = await prisma.member.findUnique({
    where: { id: user.id },
    select: { id: true, role: true, first_name: true, last_name: true, email: true, photo_url: true },
  });

  if (!member && user.email) {
    logger.info({ userId: user.id }, "Binomage: fallback to email lookup");
    member = await prisma.member.findUnique({
      where: { email: user.email },
      select: { id: true, role: true, first_name: true, last_name: true, email: true, photo_url: true },
    });
    if (member) {
      await prisma.member.update({
        where: { email: user.email },
        data: { id: user.id },
      });
    }
  }

  if (!member || (member.role !== "SUPER_ADMIN" && member.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  const combos = await getPromoCombos();

  return (
    <DashboardLayout
      member={member}
      activePath="/dashboard/binomage"
      title="Binomage — Parrainage inter-promos"
    >
      <BinomagePageClient combos={combos} />
    </DashboardLayout>
  );
}
