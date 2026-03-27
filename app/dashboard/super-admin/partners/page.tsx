import { redirect } from "next/navigation";
import Image from "next/image";
import { Plus, Building2 } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard/DashboardShell";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

import { PartnerForm } from "./partner-form";
import { PartnerTableActions } from "./partner-table-actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function SuperAdminPartnersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const currentMember = await prisma.member.findUnique({
    where: { id: user.id },
    select: { id: true, role: true, name: true, email: true },
  });

  if (
    !currentMember ||
    (currentMember.role !== "SUPER_ADMIN" && currentMember.role !== "ADMIN")
  ) {
    redirect("/dashboard");
  }

  const partners = await prisma.partner.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <DashboardLayout
      member={currentMember}
      activePath="/dashboard/super-admin/partners"
      title="Gestion des partenaires"
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Partenaires</h2>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="size-10 bg-blue-50 rounded-xl flex items-center justify-center text-[var(--aduti-primary)]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total</p>
              <p className="text-xl font-black text-slate-900 leading-none">{partners.length}</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-[var(--aduti-primary)]" />
            Ajouter un partenaire
          </h3>
          <PartnerForm />
        </div>

        {/* List Section */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 font-bold text-slate-500 text-xs uppercase tracking-wider">
                  <th className="px-8 py-5">Logo</th>
                  <th className="px-8 py-5">Nom de l&apos;entreprise</th>
                  <th className="px-8 py-5 text-center">Visibilité</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {partners.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-slate-400 font-medium">
                      Aucun partenaire trouvé.
                    </td>
                  </tr>
                ) : (
                  partners.map((p) => (
                    <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="size-16 relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 p-2 transform group-hover:scale-110 transition-transform">
                          <Image
                            src={p.logo_url}
                            alt={p.name}
                            fill
                            className="object-contain"
                            sizes="64px"
                          />
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-base font-bold text-slate-900 group-hover:text-[var(--aduti-primary)] transition-colors">
                          {p.name}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-center">
                          {p.is_active ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                              Actif
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-400 border border-slate-100">
                              Masqué
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <PartnerTableActions id={p.id} isActive={p.is_active} logoUrl={p.logo_url} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
