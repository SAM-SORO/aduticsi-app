import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { MemberProfileView } from "./MemberProfileView";

export const runtime = "nodejs";

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const member = await prisma.member.findUnique({
    where: { id },
    include: {
      promotion: true,
      poste: true,
    }
  });

  if (!member) {
    notFound();
  }

  return (
    <main className="flex-1 bg-slate-50 py-8 lg:py-12">
      <div className="max-w-6xl mx-auto px-4 lg:px-6">
        <nav aria-label="Fil d'Ariane" className="flex mb-8">
          <ol className="inline-flex items-center space-x-1 md:space-x-3 text-sm">
            <li className="inline-flex items-center">
              <Link
                href="/"
                className="inline-flex items-center text-slate-500 hover:text-[var(--aduti-primary)] transition-colors"
              >
                <span className="material-symbols-outlined text-lg mr-2">
                  home
                </span>
                Accueil
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-slate-400 text-lg">
                  chevron_right
                </span>
                <Link
                  href="/members"
                  className="ml-1 text-slate-500 hover:text-[var(--aduti-primary)] md:ml-2 transition-colors"
                >
                  Membres
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-slate-400 text-lg">
                  chevron_right
                </span>
                <span className="ml-1 font-medium text-slate-900 md:ml-2">
                  Profil
                </span>
              </div>
            </li>
          </ol>
        </nav>

        <MemberProfileView member={member} />
      </div>
    </main>
  );
}
