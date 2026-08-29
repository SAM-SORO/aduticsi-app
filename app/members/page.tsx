import type { Metadata } from "next";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { MaterialIcon } from "@/components/icons/material-icon";
import { MemberCard } from "@/components/members/MemberCard";
import { Pagination } from "@/components/ui/pagination";
import { FilterBar } from "@/components/filters/FilterBar";
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
          <FilterBar
            searchValue={search}
            searchPlaceholder="Rechercher un membre, un métier, une compétence..."
            filters={[
              {
                name: "promo",
                placeholder: "Toutes promotions",
                searchPlaceholder: "Rechercher une année...",
                value: promoId,
                options: [
                  { value: "", label: "Toutes promotions" },
                  ...promotions.map((p) => ({ value: p.id, label: p.name })),
                ],
              },
              {
                name: "status",
                placeholder: "Tous statuts",
                searchPlaceholder: "Rechercher un statut...",
                value: status,
                options: [
                  { value: "", label: "Tous statuts" },
                  { value: "STUDENT", label: "Étudiant" },
                  { value: "ALUMNI", label: "Alumni" },
                ],
              },
              {
                name: "role",
                placeholder: "Adhérents",
                searchPlaceholder: "Rechercher un poste...",
                value: role,
                options: [
                  { value: "", label: "Adhérents" },
                  ...postes.map((p) => ({ value: p.id, label: p.name })),
                ],
              },
              {
                name: "gender",
                placeholder: "Tous genres",
                searchPlaceholder: "Rechercher un genre...",
                value: gender,
                options: [
                  { value: "", label: "Tous genres" },
                  { value: "MALE", label: "Masculin" },
                  { value: "FEMALE", label: "Féminin" },
                ],
              },
            ]}
          />

          <div className="mt-16">
            {/* Grille des membres */}
            {members.length === 0 ? (
              <div className="bg-slate-50 rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
                <MaterialIcon name="group_off" className="w-14 h-14 text-slate-300 mb-4 block mx-auto" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Aucun membre trouvé</h2>
                <p className="text-slate-500 font-medium">Réinitialisez vos filtres pour voir toute la communauté.</p>
                <Link href="/members" className="mt-6 inline-flex items-center gap-2 text-aduti-primary font-bold hover:underline">
                  <MaterialIcon name="restart_alt" className="w-4 h-4" />
                  Effacer les filtres
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member) => (
                  <MemberCard key={member.id} member={member} />
                ))}
              </div>
            )}

            <Pagination
              className="mt-16 pb-8"
              currentPage={currentPage}
              totalPages={totalPages}
              buildHref={(p) => {
                const sp = new URLSearchParams();
                if (search) sp.set("search", search);
                if (promoId) sp.set("promo", promoId);
                if (status) sp.set("status", status);
                if (role) sp.set("role", role);
                if (gender) sp.set("gender", gender);
                sp.set("page", p.toString());
                return `/members?${sp.toString()}`;
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
