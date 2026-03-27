import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { AutoSubmitSelect } from "@/components/ui/auto-submit-select";
import { prisma } from "@/lib/prisma";
import { MaterialIcon } from "@/components/icons/material-icon";

const MEMBERS_PER_PAGE = 12;

export const runtime = "nodejs";
// Optionnel: Revalidation toutes les X secondes si on veut du cache dynamique
export const revalidate = 60; 

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; promo?: string; status?: string; role?: string; gender?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const search = params.search || "";
  const promoId = params.promo || "";
  const status = params.status || "";
  const role = params.role || "";
  const gender = params.gender || "";

  const where: Record<string, unknown> = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      // On peut ajouter la recherche par "poste" ou "current_job_title" si besoin
    ];
  }
  if (promoId) where.promo_id = promoId;
  if (status) where.status = status;
  if (role) where.poste_id = role; 
  if (gender) where.gender = gender;

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
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[var(--aduti-primary)]/5 rounded-full blur-3xl opacity-60" />
          <div className="absolute bottom-[20%] right-[-10%] w-[300px] h-[300px] bg-[var(--aduti-secondary)]/5 rounded-full blur-3xl opacity-60" />
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-slate-100 pb-12">
            <div className="space-y-6 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center justify-center md:justify-start gap-2 px-3 py-1 rounded-full bg-blue-50 text-[var(--aduti-primary)] text-xs font-semibold tracking-wide uppercase border border-blue-100 w-fit mx-auto md:mx-0">
                <span className="w-2 h-2 rounded-full bg-[var(--aduti-primary)] animate-pulse" />
                Communauté ADUTI
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-end gap-3 pb-2">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)] uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[var(--aduti-primary)] mr-2.5 shadow-[0_0_8px_var(--aduti-primary)]" />
                {totalCount} Membre{totalCount > 1 ? "s" : ""} actif{totalCount > 1 ? "s" : ""}
              </span>
            </div>
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
              <Input
                name="search"
                className="block w-full pl-12 pr-4 py-4 h-14 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-8 focus:ring-[var(--aduti-primary)]/5 focus:border-[var(--aduti-primary)]/30 transition-all text-base hover:bg-white hover:border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                placeholder="Recherche"
                defaultValue={search}
              />
              <button type="submit" className="hidden" />
            </form>

            <div className="flex flex-wrap md:flex-nowrap gap-4 w-full xl:w-auto">
              {[
                { name: "promo", defaultValue: promoId, options: [{ value: "", label: "Toutes Promotions" }, ...promotions.map(p => ({ value: p.id, label: p.name }))] },
                { name: "status", defaultValue: status, options: [{ value: "", label: "Tous Statuts" }, { value: "STUDENT", label: "Étudiant" }, { value: "ALUMNI", label: "Alumni" }] },
                  { name: "role", defaultValue: role, options: [
                    { value: "", label: "Tous Postes Bureau" },
                    ...postes.map(p => ({ value: p.id, label: p.name })),
                  ] },
                  { name: "gender", defaultValue: gender, options: [
                    { value: "", label: "Tous Genres" },
                    { value: "MALE", label: "Hommes" },
                    { value: "FEMALE", label: "Femmes" },
                  ] },
                ].map((filter) => (
                  <form key={filter.name} className="relative flex-1 md:min-w-[160px] group/select" method="GET">
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
              <div className="bg-slate-50 rounded-[3rem] p-16 text-center border-2 border-dashed border-slate-200">
                <MaterialIcon name="group_off" className="w-14 h-14 text-slate-300 mb-4 block mx-auto" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Aucun membre trouvé</h2>
                <p className="text-slate-500 font-medium">Réinitialisez vos filtres pour voir toute la communauté.</p>
                <Link href="/members" className="mt-6 inline-flex items-center gap-2 text-[var(--aduti-primary)] font-bold hover:underline">
                  <MaterialIcon name="restart_alt" className="w-4 h-4" />
                  Effacer les filtres
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="group bg-white rounded-[2rem] border border-slate-100 p-6 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:border-[var(--aduti-primary)]/20 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden hover:-translate-y-1.5"
                  >
                    <div
                      className={`absolute top-0 left-0 w-full h-1.5 ${
                        member.status === "ALUMNI"
                          ? "bg-gradient-to-r from-[var(--aduti-primary)] to-[var(--aduti-secondary)] opacity-80"
                          : "bg-slate-100"
                      }`}
                    />
                    
                    <div className="flex absolute top-5 inset-x-5 justify-between z-10 pointer-events-none">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          member.status === "ALUMNI"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-blue-50 text-blue-600 border border-blue-100"
                        } shadow-sm backdrop-blur-sm pointer-events-auto`}
                      >
                        {member.status === "ALUMNI" ? "Alumni" : "Étudiant"}
                      </span>
                      {member.poste_id && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100 shadow-sm backdrop-blur-sm pointer-events-auto">
                          Bureau
                        </span>
                      )}
                    </div>

                    <div className="relative mt-8 mb-6 pointer-events-none">
                      <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-slate-100 via-white to-slate-100 group-hover:from-[var(--aduti-primary)]/20 group-hover:to-[var(--aduti-secondary)]/20 transition-all duration-700 shadow-md">
                        <div className="w-full h-full rounded-full bg-white overflow-hidden ring-4 ring-white group-hover:ring-transparent transition-all relative">
                          {member.photo_url ? (
                            <Image
                              alt={`Photo de profil de ${member.name}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[0.1] group-hover:grayscale-0"
                              src={member.photo_url}
                              fill
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300 text-4xl font-black group-hover:scale-110 transition-transform">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="absolute inset-0 bg-[var(--aduti-primary)]/0 group-hover:bg-[var(--aduti-primary)]/5 transition-colors duration-500" />
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[var(--aduti-primary)] transition-colors tracking-tight truncate w-full flex items-center justify-center gap-2" title={member.name}>
                      {member.name}
                      {member.gender === "FEMALE" && (
                        <MaterialIcon name="female" className="w-[18px] h-[18px] text-rose-400" />
                      )}
                      {member.gender === "MALE" && (
                        <MaterialIcon name="male" className="w-[18px] h-[18px] text-blue-400" />
                      )}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500 mt-1 mb-2 group-hover:text-slate-600 transition-colors truncate w-full pointer-events-none" title={member.current_job_title || member.poste?.name || "Membre ADUTI"}>
                      {member.current_job_title || member.poste?.name || member.status}
                    </p>
                    
                    <span
                      className={`text-[11px] font-black px-3 py-1.5 rounded-lg mb-6 uppercase tracking-widest pointer-events-none ${
                        member.status === "ALUMNI"
                          ? "text-[var(--aduti-secondary)] bg-red-50/50"
                          : "text-slate-600 bg-slate-50"
                      }`}
                    >
                      Promo {member.promotion.name}
                    </span>

                    <div className="w-full pt-6 mt-auto border-t border-slate-50 flex items-center justify-between pointer-events-auto">
                      <div className="flex gap-1.5 focus-within:z-10">
                        <a
                          href={`mailto:${member.email}`}
                          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-[var(--aduti-primary)] hover:shadow-[0_4px_15px_rgba(37,99,235,0.2)] transition-all active:scale-90"
                          title="Envoyer un email"
                        >
                          <MaterialIcon name="mail" className="w-[18px] h-[18px]" />
                        </a>
                        {member.linkedin_url && (
                          <a
                            href={member.linkedin_url}
                            target="_blank"
                            rel="noreferrer"
                            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-white hover:bg-[#0077b5] hover:shadow-[0_4px_15px_rgba(0,119,181,0.2)] transition-all active:scale-90"
                            title="LinkedIn"
                          >
                            <MaterialIcon name="link" className="w-[18px] h-[18px]" />
                          </a>
                        )}
                      </div>
                      <Link
                        href={`/members/${member.id}`}
                        className="text-xs font-black uppercase tracking-widest text-[var(--aduti-primary)] hover:text-blue-700 flex items-center gap-1 group/link group-hover:opacity-100 lg:opacity-0 transition-opacity active:scale-95"
                      >
                        PROFIL
                        <MaterialIcon name="arrow_forward" className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>
                  </div>
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
                    sp.set("page", p.toString());
                    const href = `/members?${sp.toString()}`;

                    return (
                      <Link
                        key={p}
                        href={href}
                        className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all active:scale-90 font-bold ${
                          isActive
                            ? "bg-[var(--aduti-primary)] text-white shadow-[0_4px_20px_rgba(37,99,235,0.25)] hover:bg-blue-600"
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
