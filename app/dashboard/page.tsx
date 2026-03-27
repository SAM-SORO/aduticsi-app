import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

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
    // eslint-disable-next-line no-console
    console.log(`Dashboard: Member not found by ID (${user.id}), trying email (${user.email})...`)
    member = await prisma.member.findUnique({
      where: { email: user.email },
      include: {
        promotion: true,
      },
    });

    if (member) {
      // eslint-disable-next-line no-console
      console.warn(`Dashboard: Member found by email but had different ID. Syncing Prisma ID with Supabase UUID.`)
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

  const currentPromo = await prisma.promotion.findFirst({
    where: { is_current_promo: true },
  });

  const latestActivities = currentPromo
    ? await prisma.activity.findMany({
        where: { promo_id: currentPromo.id },
        orderBy: { created_at: "desc" },
        take: 3,
      })
    : [];

  return (
    <div className="bg-white py-8 text-slate-900 dark:bg-slate-950 dark:text-slate-50 sm:py-12 lg:py-14">
      <div className="mx-auto max-w-6xl px-4 space-y-8">
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#13acfa]">
            Tableau de bord
          </p>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            Bonjour{member?.name ? `, ${member.name}` : ""} 👋
          </h1>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Vue rapide de votre situation dans l&apos;association : promotion,
            statut et dernières activités.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
              Promotion
            </div>
            <p className="mt-2 font-semibold text-slate-900 dark:text-slate-50">
              {member?.promotion?.name ?? "Non renseignée"}
            </p>
            {member?.promotion && (
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                Membre de l&apos;association
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
              Statut
            </div>
            <p className="mt-2 font-semibold text-slate-900 dark:text-slate-50">
              {member?.status === "ALUMNI"
                ? "Alumni"
                : member?.status === "STUDENT"
                ? "Étudiant"
                : "Non renseigné"}
            </p>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
              Rôle : {member?.role ?? "MEMBER"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 text-sm dark:border-slate-800 dark:bg-slate-900/60">
            <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
              Promotion active
            </div>
            <p className="mt-2 font-semibold text-slate-900 dark:text-slate-50">
              {currentPromo?.name ?? "Non définie"}
            </p>
            {currentPromo && (
              <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                Promotion en cours
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
            Dernières activités de la promotion active
          </div>
          {latestActivities.length === 0 ? (
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Aucune activité publiée pour l&apos;instant.
            </p>
          ) : (
            <ul className="space-y-3 text-sm">
              {latestActivities.map((activity) => (
                <li
                  key={activity.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3 font-medium text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200"
                >
                  {activity.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

