import { redirect } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard/DashboardShell";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function BureauPage() {
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

  if (member.role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  if (member.function !== "GESTION_ACTIVITES") {
    redirect("/dashboard");
  }

  const [activitiesCount, publicationsCount] = await Promise.all([
    prisma.activity.count({ where: { promo_id: member.promo_id } }),
    prisma.publication.count({
      where: {
        activity: { promo_id: member.promo_id },
      },
    }),
  ]);

  return (
    <DashboardLayout member={member} activePath="/dashboard/bureau" title="Gestion d'activites">
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-2xl font-bold text-slate-900">Espace gestion d&apos;activites</h2>
          <p className="text-slate-500 mt-2">
            Vous pouvez gerer les activites et publications de votre promotion ({member.promotion?.name ?? "Non definie"}), ainsi que modifier votre profil.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a href="/dashboard/super-admin/activities" className="bg-white rounded-xl border border-slate-200 p-6 hover:border-[var(--aduti-primary)] transition-colors">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Gestion</p>
            <p className="mt-2 text-lg font-bold text-slate-900">Activites et publications</p>
            <p className="mt-1 text-sm text-slate-500">{activitiesCount} activites • {publicationsCount} publications</p>
          </a>
          <a href="/profile" className="bg-white rounded-xl border border-slate-200 p-6 hover:border-[var(--aduti-primary)] transition-colors">
            <p className="text-xs text-slate-500 uppercase tracking-wider">Compte</p>
            <p className="mt-2 text-lg font-bold text-slate-900">Mon profil</p>
            <p className="mt-1 text-sm text-slate-500">Mettre a jour vos informations publiques.</p>
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}

