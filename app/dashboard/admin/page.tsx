import { redirect } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard/DashboardShell";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { AdminMembersGrid } from "./AdminMembersGrid";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DashboardAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const member = await prisma.member.findUnique({
    where: { id: user.id },
    include: { promotion: true },
  });

  if (!member) {
    redirect("/dashboard");
  }

  if (member.role === "SUPER_ADMIN") {
    redirect("/dashboard/super-admin");
  }

  if (member.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const promo = member.promotion;
  const [membersCount, activitiesCount, managedMembers] = await Promise.all([
    prisma.member.count({ where: { promo_id: promo.id, role: "MEMBER" } }),
    prisma.activity.count({ where: { promo_id: promo.id } }),
    prisma.member.findMany({
      where: { promo_id: promo.id, role: "MEMBER" },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        function: true,
      },
    }),
  ]);

  return (
    <DashboardLayout
      member={member}
      activePath="/dashboard/admin"
      title="Administration de ma promotion"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Promotion</p>
            <p className="mt-2 text-lg font-bold text-slate-900">{promo.name}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Membres (promo)</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{membersCount}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Activités (promo)</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{activitiesCount}</p>
          </div>
        </div>

        {/* Members section */}
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900">Membres de ma promotion</h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Cliquez sur un membre pour voir sa fiche et gérer ses accès.
            </p>
          </div>
          <AdminMembersGrid members={managedMembers} />
        </div>
      </div>
    </DashboardLayout>
  );
}
