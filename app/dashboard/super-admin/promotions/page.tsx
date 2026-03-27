import { Plus } from "lucide-react";
import { redirect } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

import { getPromotions } from "./actions";
import { PromotionForm } from "./promotion-form";
import { PromotionTableActions } from "./promotion-table-actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function PromotionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const member = await prisma.member.findUnique({
    where: { id: user.id },
    select: { id: true, role: true, name: true, email: true },
  });

  if (!member || member.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const promotions = await getPromotions();

  return (
    <DashboardLayout
      member={member}
      activePath="/dashboard/super-admin/promotions"
      title="Gestion des Promotions"
    >
      <div className="space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Promotions</h2>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[var(--aduti-primary)] hover:bg-blue-600 text-white px-6 h-12 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95 gap-2">
                <Plus className="w-5 h-5" />
                Nouvelle Promotion
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Ajouter une promotion</DialogTitle>
              </DialogHeader>
              <PromotionForm />
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="overflow-x-auto text-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-wider">Promotion</th>
                  <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-wider text-center">Statut</th>
                  <th className="px-6 py-5 font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {promotions.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-medium">
                      Aucune promotion trouvée.
                    </td>
                  </tr>
                ) : (
                  promotions.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5 font-bold text-slate-900">{p.name}</td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          {p.is_current_promo ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-50 text-slate-400 border border-slate-100">
                              Archive
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right flex justify-end">
                        <PromotionTableActions promotion={p} />
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
