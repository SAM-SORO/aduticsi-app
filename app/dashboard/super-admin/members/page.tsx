import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Users,
  Search,
  ShieldCheck,
  Calendar,
} from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Input } from "@/components/ui/input";
import { AutoSubmitSelect } from "@/components/ui/auto-submit-select";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

import { MemberActions } from "./member-actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function MembersAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const currentMember = await prisma.member.findUnique({
    where: { id: user.id },
    select: { id: true, role: true, name: true, email: true, photo_url: true },
  });

  if (!currentMember || currentMember.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const page = typeof params.page === "string" ? parseInt(params.page) : 1;
  const search = typeof params.search === "string" ? params.search : "";
  const promoId = typeof params.promo === "string" ? params.promo : "";
  const status = typeof params.status === "string" ? params.status : "";
  const role = typeof params.role === "string" ? params.role : "";
  const gender = typeof params.gender === "string" ? params.gender : "";

  const pageSize = 12;
  const currentPage = Math.max(1, page);

  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (promoId) where.promo_id = promoId;
  if (status) where.status = status;
  if (role) where.role = role;
  if (gender) where.gender = gender;

  const [members, totalCount, promotions, postes] = await Promise.all([
    prisma.member.findMany({
      where,
      include: { 
        promotion: { select: { name: true } },
        poste: { select: { id: true, name: true } }
      },
      orderBy: { created_at: "desc" },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.member.count({ where }),
    prisma.promotion.findMany({ orderBy: { name: "desc" } }),
    prisma.poste.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <DashboardShell
      member={currentMember}
      activePath="/dashboard/super-admin/members"
      title="Gestion des Membres"
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Annuaire des Membres</h2>
          </div>
          <div className="flex items-center gap-3">
             <div className="bg-white px-3 py-1.5 rounded-xl border border-slate-100 shadow-sm flex flex-col items-center min-w-[80px]">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total</span>
              <span className="text-xl font-black text-slate-900 leading-none">{totalCount}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <form className="relative" method="GET">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <Input
                name="search"
                placeholder="Rechercher..."
                defaultValue={search}
                className="pl-10 h-11 bg-slate-50/50 border-slate-100 rounded-xl focus:bg-white transition-all shadow-none"
              />
            </form>

            <form method="GET">
              <AutoSubmitSelect name="promo" defaultValue={promoId} className="h-11 bg-slate-50/50 border-slate-100 rounded-xl">
                <option value="">Toutes les promos</option>
                {promotions.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </AutoSubmitSelect>
            </form>

            <form method="GET">
              <AutoSubmitSelect name="status" defaultValue={status} className="h-11 bg-slate-50/50 border-slate-100 rounded-xl">
                <option value="">Tous les statuts</option>
                <option value="STUDENT">Étudiant</option>
                <option value="ALUMNI">Alumni</option>
              </AutoSubmitSelect>
            </form>

            <form method="GET">
              <AutoSubmitSelect name="role" defaultValue={role} className="h-11 bg-slate-50/50 border-slate-100 rounded-xl">
                <option value="">Tous les rôles</option>
                <option value="MEMBER">Membre</option>
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
              </AutoSubmitSelect>
            </form>

            <form method="GET">
              <AutoSubmitSelect name="gender" defaultValue={gender} className="h-11 bg-slate-50/50 border-slate-100 rounded-xl">
                <option value="">Tous les genres</option>
                <option value="MALE">Homme</option>
                <option value="FEMALE">Femme</option>
              </AutoSubmitSelect>
            </form>
          </div>
        </div>

        {/* Grid */}
        {members.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-100">
            <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-1">Aucun membre trouvé</h2>
            <p className="text-slate-400 text-sm">Essayez de modifier vos filtres ou termes de recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-700">
            {members.map((m) => (
              <div
                key={m.id}
                className="group bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[var(--aduti-primary)]/20 transition-all duration-300 flex flex-col relative"
              >
                <div
                   className={`absolute top-0 left-0 w-full h-1.5 rounded-t-3xl ${
                    m.status === "ALUMNI"
                      ? "bg-gradient-to-r from-[var(--aduti-primary)] to-[var(--aduti-secondary)] opacity-80"
                      : "bg-slate-100"
                  }`}
                />
                
                {/* Header: Badges & Actions */}
                <div className="flex items-start justify-between mb-4 mt-2">
                  <div className="flex gap-1.5 flex-wrap flex-1 min-w-0">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        m.status === "ALUMNI"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-blue-50 text-blue-600 border border-blue-100"
                      }`}
                    >
                      {m.status === "ALUMNI" ? "Alumni" : "Étudiant"}
                    </span>
                    {m.role !== "MEMBER" && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100 truncate max-w-[100px]" title={m.role}>
                        <ShieldCheck className="w-3 h-3 shrink-0" />
                        <span className="truncate">{m.role.replace("_", " ")}</span>
                      </span>
                    )}
                  </div>
                  <MemberActions member={m as any} postes={postes} />
                </div>

                {/* Avatar & Info */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-full p-1 bg-slate-50 mb-4 relative shadow-sm">
                    {m.photo_url ? (
                      <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-slate-100">
                        <Image src={m.photo_url} alt={m.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-3xl">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[var(--aduti-primary)] transition-colors truncate w-full flex items-center justify-center gap-1.5" title={m.name}>
                    {m.name}
                    {m.gender === "FEMALE" && (
                      <span className="material-symbols-outlined text-rose-400 text-base">female</span>
                    )}
                    {m.gender === "MALE" && (
                      <span className="material-symbols-outlined text-blue-400 text-base">male</span>
                    )}
                  </h3>
                  <p className="text-xs font-medium text-slate-500 mt-0.5 truncate w-full" title={m.email}>
                    {m.email}
                  </p>
                  <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded inline-block">
                    {m.promotion.name}
                  </p>
                </div>

                {/* Footer Infos */}
                <div className="w-full pt-4 mt-auto border-t border-slate-50 flex items-center justify-between text-slate-400 text-xs mt-6">
                  <div className="flex items-center gap-1.5" title={m.poste?.name || "Sans poste"}>
                    <Users className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[100px]">{m.poste?.name || "Sans poste"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(m.created_at).toLocaleDateString("fr-FR", { month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center pb-8 animate-in fade-in duration-700">
            <nav className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-sm">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                const isActive = p === currentPage;
                const sp = new URLSearchParams();
                if (search) sp.set("search", search);
                if (promoId) sp.set("promo", promoId);
                if (status) sp.set("status", status);
                if (role) sp.set("role", role);
                if (gender) sp.set("gender", gender);
                sp.set("page", p.toString());
                const href = `/dashboard/super-admin/members?${sp.toString()}`;

                return (
                  <Link
                    key={p}
                    href={href}
                    className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm transition-all active:scale-90 font-bold ${
                      isActive
                        ? "bg-[var(--aduti-primary)] text-white shadow-md hover:bg-blue-600"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {p}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
