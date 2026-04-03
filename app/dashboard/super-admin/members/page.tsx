import type { Prisma, MemberStatus, MemberRole, Gender } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Search } from "lucide-react";

import { MembersGrid } from "./MembersGrid";
import { DashboardLayout } from "@/components/dashboard/DashboardShell";
import { Input } from "@/components/ui/input";
import { AutoSubmitSelect } from "@/components/ui/auto-submit-select";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

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

  const where: Prisma.MemberWhereInput = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (promoId) where.promo_id = promoId;
  if (status) where.status = status as MemberStatus;
  if (role) where.role = role as MemberRole;
  if (gender) where.gender = gender as Gender;

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
    <DashboardLayout
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
        <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
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
        <MembersGrid members={members} postes={postes} />

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
    </DashboardLayout>
  );
}
