import { redirect } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard/DashboardShell";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { updateMemberFunction } from "@/app/dashboard/super-admin/members/actions";

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

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Attribution de la fonction gestion d&apos;activités</h3>
            <p className="text-sm text-slate-500">Vous ne pouvez modifier que les membres de votre promotion.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3">Membre</th>
                  <th className="px-6 py-3">Statut</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Fonction</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {managedMembers.map((m) => {
                  const nextFunction = m.function === "GESTION_ACTIVITES" ? "NONE" : "GESTION_ACTIVITES";
                  return (
                    <tr key={m.id}>
                      <td className="px-6 py-4 font-semibold text-slate-900">{m.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{m.status === "ALUMNI" ? "Alumni" : "Etudiant"}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{m.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${m.function === "GESTION_ACTIVITES" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                          {m.function === "GESTION_ACTIVITES" ? "GESTION_ACTIVITES" : "NONE"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <form action={async () => {
                          "use server";
                          await updateMemberFunction(m.id, nextFunction as "NONE" | "GESTION_ACTIVITES");
                        }}>
                          <button
                            type="submit"
                            className="px-3 py-2 rounded-lg text-xs font-bold bg-[var(--aduti-primary)] text-white hover:bg-blue-600 transition-colors"
                          >
                            {m.function === "GESTION_ACTIVITES" ? "Retirer accès" : "Donner accès"}
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

