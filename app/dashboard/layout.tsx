import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { PendingRegistrationsProvider } from "@/components/dashboard/PendingRegistrationsProvider";

export const dynamic = "force-dynamic";

/**
 * Le compte des demandes en attente est calculé ici plutôt que dans chaque
 * page : le badge de la barre latérale reste juste quelle que soit la section
 * ouverte, sans modifier les treize pages du tableau de bord.
 */
async function countPendingRegistrations(): Promise<number> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 0;

    const member = await prisma.member.findUnique({
      where: { id: user.id },
      select: { role: true },
    });
    if (member?.role !== "SUPER_ADMIN") return 0;

    return await prisma.member.count({ where: { registration_status: "PENDING" } });
  } catch {
    // Un badge est un confort : son échec ne doit pas empêcher le tableau de bord.
    return 0;
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pending = await countPendingRegistrations();

  return (
    <PendingRegistrationsProvider count={pending}>{children}</PendingRegistrationsProvider>
  );
}
