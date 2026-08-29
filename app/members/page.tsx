import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";

import { AutoSubmitInput } from "@/components/ui/auto-submit-input";
import { AutoSubmitSelect } from "@/components/ui/auto-submit-select";
import { prisma } from "@/lib/prisma";
import { MaterialIcon } from "@/components/icons/material-icon";
import { MemberCard } from "@/components/members/MemberCard";
import { createClient } from "@/lib/supabase/server";

const MEMBERS_PER_PAGE = 12;

export const runtime = "nodejs";
export const metadata: Metadata = {
  title: "Annuaire des membres",
  description:
    "Étudiants et anciens du DUT et DTS en Informatique de l'INP-HB : parcourez l'annuaire par promotion, statut ou poste.",
  alternates: { canonical: "/members" },
  openGraph: {
    title: "Annuaire des membres",
    description:
      "Étudiants et anciens du DUT et DTS en Informatique de l'INP-HB : parcourez l'annuaire par promotion, statut ou poste.",
    url: "/members",
  },
};

export const dynamic = "force-dynamic";

export default async function MembersPage({
  searchParams,
  
}: {
  searchParams: Promise<{ page?: string; search?: string; promo?: string; status?: string; role?: string; gender?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient()
  // récupérer les infos du user connecté
  const { data: { user } } = await supabase.auth.getUser()
  const currentPage = parseInt(params.page || "1", 10);
  const search = params.search || "";
  const promoId = params.promo || "";
  const status = params.status || "";
  const role = params.role || "";
  const gender = params.gender || "";

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { first_name: { contains: search, mode: "insensitive" } },
      { last_name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      // On peut ajouter la recherche par "poste" ou "current_job_title" si besoin
    ];
  }
  if (promoId) where.promo_id = promoId;
  if (status) where.status = status;
  if (role) where.poste_id = role; 
  if (gender) where.gender = gender;
  // seulement affiché les profil publi si l'utilisateur n'est pas un membre
  if (!user) { where.profile_status = 'PUBLIC' }
  // n'afficher que les utilisateur approuvé
  where.registration_status = 'APPROVED'

  // Fetch promotions pour le select
  const promotions = await prisma.promotion.findMany({
    orderBy: { name: "desc" },
  });

  const [members, totalCount, postes] = await Promise.all([
    prisma.member.findMany({
      where,
      include: {
        promotion: {
          select: { name: true },
        },
        poste: {
          select: { name: true },
        },
      },
      orderBy: { created_at: "desc" },
      skip: (currentPage - 1) * MEMBERS_PER_PAGE,
      take: MEMBERS_PER_PAGE,
    }),
    prisma.member.count({ where }),
    prisma.poste.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / MEMBERS_PER_PAGE);

  return (
    <main className="flex-1 overflow-hidden bg-white">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-16 lg:pt-20 pb-12 px-4 shadow-[0_1px_0_0_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 border-b border-slate-100 pb-8 md:flex-row md:items-end md:justify-between md:pb-12">
            <div className="max-w-2xl space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                Les membres de l’ADUTI
              </h1>
              <p className="text-base leading-relaxed text-slate-500">
                Étudiants et anciens du DUT et DTS en informatique de l’INP-HB.
                Parcourez l’annuaire pour retrouver un camarade ou identifier une
                compétence.
              </p>
            </div>
            <p className="shrink-0 text-sm text-slate-500 md:pb-2">
              {totalCount} membre{totalCount > 1 ? "s" : ""} référencé{totalCount > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          {/* Filtres alignés sur le design admin dashboard */}
          <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col xl:flex-row gap-6 items-center relative z-10 -mt-10">
            <form className="relative w-full xl:flex-1" method="GET">
              <input type="hidden" name="promo" value={promoId} />
              <input type="hidden" name="status" value={status} />
              <input type="hidden" name="role" value={role} />
              <input type="hidden" name="gender" value={gender} />
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <AutoSubmitInput
                name="search"
                className="block w-full pl-12 pr-4 py-4 h-14 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-8 focus:ring-[var(--aduti-primary)]/5 focus:border-[var(--aduti-primary)]/30 transition-all text-base hover:bg-white hover:border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                placeholder="Rechercher un membre"
                defaultValue={search}
                debounceMs={400}
              />
              <button type="submit" className="hidden" />
            </form>

            <div className="flex flex-wrap gap-3 w-full xl:w-auto">
              {[
                { name: "promo", defaultValue: promoId, options: [{ value: "", label: "Toutes Promotions" }, ...promotions.map(p => ({ value: p.id, label: p.name }))] },
                { name: "status", defaultValue: status, options: [{ value: "", label: "Tous Statuts" }, { value: "STUDENT", label: "Étudiant" }, { value: "ALUMNI", label: "Alumni" }] },
                  { name: "role", defaultValue: role, options: [
                    // on va utiliser "adhérents" comme label pour le rôle vide
                    { value: "", label: "Adhérents" },
                    ...postes.map(p => ({ value: p.id, label: p.name })),
                  ] },
                  { name: "gender", defaultValue: gender, options: [
                    { value: "", label: "Tous Genres" },
                    { value: "MALE", label: "Masculin" },
                    { value: "FEMALE", label: "Féminin" },
                  ] },
                ].map((filter) => (
                  <form key={filter.name} className="relative flex-1 min-w-[calc(50%-6px)] sm:min-w-[160px] group/select" method="GET">
                  <input type="hidden" name="search" value={search} />
                  {filter.name !== "promo" && <input type="hidden" name="promo" value={promoId} />}
                  {filter.name !== "status" && <input type="hidden" name="status" value={status} />}
                  {filter.name !== "role" && <input type="hidden" name="role" value={role} />}
                  {filter.name !== "gender" && <input type="hidden" name="gender" value={gender} />}
                  
                  <AutoSubmitSelect
                    name={filter.name}
                    className="appearance-none w-full pl-4 pr-10 py-4 h-14 bg-white border border-slate-100 rounded-2xl text-slate-700 text-sm font-bold tracking-tight focus:ring-8 focus:ring-[var(--aduti-primary)]/5 focus:border-[var(--aduti-primary)]/30 cursor-pointer group-hover/select:border-slate-300 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                    defaultValue={filter.defaultValue}
                    /* AutoSubmitSelect handles onChange internally */
                  >
                    {filter.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </AutoSubmitSelect>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                    <MaterialIcon name="expand_more" className="w-5 h-5" />
                  </div>
                </form>
              ))}
            </div>
          </div>

          <div className="mt-16">
            {/* Grille des membres */}
            {members.length === 0 ? (
              <div className="bg-slate-50 rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
                <MaterialIcon name="group_off" className="w-14 h-14 text-slate-300 mb-4 block mx-auto" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Aucun membre trouvé</h2>
                <p className="text-slate-500 font-medium">Réinitialisez vos filtres pour voir toute la communauté.</p>
                <Link href="/members" className="mt-6 inline-flex items-center gap-2 text-[var(--aduti-primary)] font-bold hover:underline">
                  <MaterialIcon name="restart_alt" className="w-4 h-4" />
                  Effacer les filtres
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            )}

            {/* Pagination Dynamique */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center pb-8 animate-in fade-in fill-mode-both duration-700 delay-300">
                <nav className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    const isActive = p === currentPage;
                    const sp = new URLSearchParams();
                    if (search) sp.set("search", search);
                    if (promoId) sp.set("promo", promoId);
                    if (status) sp.set("status", status);
                    if (role) sp.set("role", role);
                    if (gender) sp.set("gender", gender);
                    sp.set("page", p.toString());
                    const href = `/members?${sp.toString()}`;

                    return (
                      <Link
                        key={p}
                        href={href}
                        className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all active:scale-90 font-bold ${
                          isActive
                            ? "bg-[var(--aduti-primary)] text-white shadow-[0_4px_20px_rgba(37,99,235,0.25)] hover:bg-[var(--aduti-primary-hover)]"
                            : "text-slate-500 hover:bg-white border border-transparent hover:border-slate-200"
                        }`}
                      >
                        {p}
                      </Link>
                    )
                  })}
                </nav>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
