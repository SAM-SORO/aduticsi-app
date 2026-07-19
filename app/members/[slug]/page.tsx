import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MemberProfileView } from "./MemberProfileView";
import { prisma } from "@/lib/prisma";
import { MaterialIcon } from "@/components/icons/material-icon";
// on récupère l'utilisateur connecté
import { createClient } from '@/lib/supabase/server';

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Génération des métadonnées SEO dynamiques par membre
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const member = await prisma.member.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    select: { first_name: true, last_name: true, current_job_title: true, promotion: { select: { name: true } } },
  });

  if (!member) return { title: "Membre introuvable | ADUTI" };

  return {
    title: `${member.first_name} ${member.last_name} | Membre ADUTI`,
    description: member.current_job_title
      ? `${member.first_name} ${member.last_name} — ${member.current_job_title}. Promotion ${member.promotion.name}. Découvrez son profil sur la plateforme ADUTI.`
      : `Profil de ${member.first_name} ${member.last_name}, promotion ${member.promotion.name} — Communauté ADUTI des DUT et DTS en Informatique de l'INP-HB.`,
  };
}

export default async function MemberProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const fromParam = resolvedSearchParams?.from;
  const backHref = fromParam === "binomage" ? "/binomages" : "/members";
  const backLabel = fromParam === "binomage" ? "Binomages" : "Membres";

  // Double résolution : slug d'abord, puis id en fallback (compatibilité anciens liens)
  const member = await prisma.member.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    include: {
      promotion: true,
      poste: true,
    },
  });

  if (!member) {
    notFound();
  }
  // on récupère l'utilisateur connecté
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // bloquer les non connectés sur un profil privé
  if (member.profile_status==="PRIVATE" && !user){notFound();}


  return (
    <main className="flex-1 bg-slate-50 py-8 lg:py-12 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <nav aria-label="Fil d'Ariane" className="flex mb-8">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm">
            <li className="inline-flex items-center">
              <Link
                href="/"
                className="inline-flex items-center text-slate-500 hover:text-[var(--aduti-primary)] transition-colors"
              >
                <MaterialIcon name="home" className="w-[18px] h-[18px] mr-2" />
                Accueil
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <MaterialIcon name="chevron_right" className="w-[18px] h-[18px] text-slate-400" />
                <Link
                  href={backHref}
                  className="ml-1 text-slate-500 hover:text-[var(--aduti-primary)] md:ml-2 transition-colors"
                >
                  {backLabel}
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <MaterialIcon name="chevron_right" className="w-[18px] h-[18px] text-slate-400" />
                <span className="ml-1 font-medium text-slate-900 md:ml-2">
                  {member.first_name} {member.last_name}
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <MemberProfileView member={member}
          currentUserId={user?.id ?? null} />
      </div>
    </main>
  );
}
