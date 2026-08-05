import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/DashboardShell";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { getPendingRegistrations } from "./actions";
import { RegistrationsList } from "./registrationList";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function RegistrationsAdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const currentMember = await prisma.member.findUnique({
    where: { id: user.id },
    select: { id: true, role: true, first_name: true, last_name: true, email: true, photo_url: true },
  });

  if (!currentMember || currentMember.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const registrations = await getPendingRegistrations();

  return (
    <DashboardLayout
      member={currentMember}
      activePath="/dashboard/super-admin/demandes"
      title="Demandes d'inscription"
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Demandes en attente</h2>
            <p className="text-sm text-slate-500">Validez ou refusez les nouvelles demandes d&apos;inscription.</p>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center min-w-[80px]">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">En attente</span>
            <span className="text-xl font-black text-slate-900 leading-none">{registrations.length}</span>
          </div>
        </div>

        <RegistrationsList registrations={registrations} />
      </div>
    </DashboardLayout>
  );
}