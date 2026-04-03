import { redirect } from "next/navigation";
import { ActivePromoForm } from "./active-promo-form";

import { DashboardLayout } from "@/components/dashboard/DashboardShell";
import { MaterialIcon } from "@/components/icons/material-icon";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import logger from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SuperAdminDashboardPage() {
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
    select: { id: true, role: true, name: true, email: true },
  });

  // Fallback to email if not found by ID
  if (!member && user.email) {
    logger.info({ userId: user.id, email: user.email }, 'SuperAdmin: Member not found by ID, trying email');
    member = await prisma.member.findUnique({
      where: { email: user.email },
      select: { id: true, role: true, name: true, email: true },
    });

    if (member) {
      logger.warn({ email: user.email }, 'SuperAdmin: Member found by email but had different ID. Syncing Prisma ID with Supabase UUID.');
      await prisma.member.update({
        where: { email: user.email },
        data: { id: user.id }
      });
    }
  }

  if (!member || member.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const [membersCount, promotionsCount, adminsCount, currentPromo, allPromos] =
    await Promise.all([
      prisma.member.count(),
      prisma.promotion.count(),
      prisma.member.count({ where: { role: { in: ["ADMIN", "SUPER_ADMIN"] } } }),
      prisma.promotion.findFirst({ where: { is_current_promo: true } }),
      prisma.promotion.findMany({ orderBy: { name: "desc" }, select: { id: true, name: true } })
    ]);

  return (
    <DashboardLayout
      member={member}
      activePath="/dashboard/super-admin"
      title="Vue d'ensemble - Super Admin"
    >
      <div className="space-y-8">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-slate-900">
            Tableau de Bord
          </h2>
          <p className="text-slate-500">
            Gestion globale de l&apos;association, des promotions et des membres.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-32 hover:border-[var(--aduti-primary)]/50 transition-colors group">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-slate-500">
                Total Membres
              </p>
              <span className="p-1.5 rounded-md bg-green-50 text-green-600 group-hover:bg-[var(--aduti-primary)]/10 group-hover:text-[var(--aduti-primary)] transition-colors">
                <MaterialIcon name="groups" className="w-5 h-5" />
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {membersCount}
              </p>
              <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                Stable
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-32 hover:border-[var(--aduti-primary)]/50 transition-colors group">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-slate-500">Promotions</p>
              <span className="p-1.5 rounded-md bg-blue-50 text-blue-600 group-hover:bg-[var(--aduti-primary)]/10 group-hover:text-[var(--aduti-primary)] transition-colors">
                <MaterialIcon name="school" className="w-5 h-5" />
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {promotionsCount}
              </p>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Historique + actuelles
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-32 hover:border-[var(--aduti-primary)]/50 transition-colors group">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-slate-500">
                Admins actifs
              </p>
              <span className="p-1.5 rounded-md bg-purple-50 text-purple-600 group-hover:bg-[var(--aduti-primary)]/10 group-hover:text-[var(--aduti-primary)] transition-colors">
                <MaterialIcon name="security" className="w-5 h-5" />
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {adminsCount}
              </p>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Admin + Super Admin
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between h-32 hover:border-[var(--aduti-primary)]/50 transition-colors group">
            <div className="flex justify-between items-start">
              <p className="text-sm font-medium text-slate-500">
                Promotion active
              </p>
              <span className="p-1.5 rounded-md bg-orange-50 text-orange-600 group-hover:bg-[var(--aduti-primary)]/10 group-hover:text-[var(--aduti-primary)] transition-colors">
                <MaterialIcon name="toggle_on" className="w-5 h-5" />
              </span>
            </div>
            <div>
              <p className="text-base font-bold text-slate-900">
                {currentPromo?.name ?? "Non définie"}
              </p>
              <p className="text-xs font-medium text-slate-500 mt-1">
                Contrôle des droits
              </p>
            </div>
          </div>
        </div>

        <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Promotion Active
              </h3>
              <p className="text-sm text-slate-500">
                Définir quelle promotion est actuellement mise en avant sur le site.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm font-medium border border-green-100">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              En ligne: {currentPromo?.name ?? "—"}
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ActivePromoForm 
                promotions={allPromos} 
                currentPromoId={currentPromo?.id || null} 
              />
              <div className="w-full sm:w-2/3 flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="p-3 bg-white rounded-full shadow-sm">
                  <MaterialIcon name="toggle_on" className="w-6 h-6 text-[var(--aduti-primary)]" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-slate-900">
                    Bascule Automatique
                  </h4>
                  <p className="text-xs text-slate-500">
                    La promotion active détermine l&apos;accès aux droits d&apos;administration standard.
                  </p>
                </div>
                <button
                  className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  type="button"
                >
                  Configurer
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

