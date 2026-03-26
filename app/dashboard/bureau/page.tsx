import Link from "next/link";
import { redirect } from "next/navigation";

import { logout } from "@/app/auth/actions";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function BureauPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const member = await prisma.member.findUnique({
    where: { id: user.id },
    include: { promotion: true, poste: true },
  });

  if (!member) {
    redirect("/dashboard");
  }

  if (!member.poste || member.poste.name !== "Président") {
    redirect("/dashboard");
  }

  const bureauMembers = await prisma.member.findMany({
    where: {
      promo_id: member.promo_id,
      poste_id: { not: null },
    },
    orderBy: { poste: { name: "asc" } },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      poste: { select: { name: true } },
      role: true,
      function: true,
      photo_url: true,
    },
  });

  return (
    <div className="bg-[#f6f7f8] text-slate-900 font-sans antialiased min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 text-slate-900">
            <div className="size-8 text-[var(--aduti-primary)]">
              <span className="material-symbols-outlined text-3xl">school</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">ADUTI INP-HB</h2>
          </div>
          <nav className="hidden md:flex flex-1 justify-center gap-8">
            <Link
              className="text-slate-600 hover:text-[var(--aduti-primary)] text-sm font-medium transition-colors"
              href="/"
            >
              Accueil
            </Link>
            <Link
              className="text-[var(--aduti-primary)] text-sm font-medium transition-colors"
              href="/dashboard/bureau"
            >
              Bureau
            </Link>
            <Link
              className="text-slate-600 hover:text-[var(--aduti-primary)] text-sm font-medium transition-colors"
              href="/activities"
            >
              Activités
            </Link>
            <Link
              className="text-slate-600 hover:text-[var(--aduti-primary)] text-sm font-medium transition-colors"
              href="/contact"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center justify-center rounded-lg h-9 px-4 bg-slate-100 text-slate-900 text-sm font-bold hover:bg-slate-200 transition-colors"
            >
              Profil
            </Link>
            <form action={logout}>
              <button className="flex items-center justify-center rounded-lg h-9 px-4 bg-[var(--aduti-primary)] text-white text-sm font-bold hover:bg-blue-600 transition-colors shadow-sm">
                <span className="truncate">Déconnexion</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1200px] mx-auto px-6 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-8 text-sm text-slate-500">
          <Link className="hover:text-[var(--aduti-primary)] transition-colors" href="/">
            Accueil
          </Link>
          <span className="material-symbols-outlined text-base">
            chevron_right
          </span>
          <Link
            className="hover:text-[var(--aduti-primary)] transition-colors"
            href="/dashboard"
          >
            Espace Président
          </Link>
          <span className="material-symbols-outlined text-base">
            chevron_right
          </span>
          <span className="text-slate-900 font-medium">Gestion du Bureau</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Gestion du Bureau &amp; Permissions
              </h1>
              <span className="inline-flex items-center rounded-full bg-[var(--aduti-primary)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--aduti-primary)] ring-1 ring-inset ring-[var(--aduti-primary)]/20">
                Président
              </span>
            </div>
            <p className="text-slate-600 text-lg max-w-2xl">
              Gérez les accès et les rôles des membres de votre bureau exécutif
              pour l&apos;année en cours.
            </p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg px-4 py-2 shadow-sm">
            <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
              Promotion active
            </p>
            <p className="text-lg font-bold text-[var(--aduti-primary)]">
              {member.promotion?.name ?? "—"}
            </p>
          </div>
        </div>

        {/* Warning */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[var(--aduti-primary)] to-[#3da9f4] p-6 text-white shadow-md mb-10 group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full shrink-0 backdrop-blur-sm">
              <span className="material-symbols-outlined text-2xl">info</span>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">
                Note importante sur les permissions
              </h3>
              <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-3xl">
                Les permissions{" "}
                <span className="font-bold bg-white/20 px-1 rounded">
                  Gestion Activités
                </span>{" "}
                permettent de publier et modifier des événements sur la
                plateforme. Attention : ces accès ne sont effectifs que si le
                membre possède déjà le rôle <strong>ADMIN</strong> technique sur
                la plateforme.
              </p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-[var(--aduti-primary)]">
                group
              </span>
              Membres du Bureau Exécutif
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">
                  search
                </span>
                <input
                  className="pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[var(--aduti-primary)]/50 w-full sm:w-64"
                  placeholder="Rechercher un membre..."
                  type="text"
                />
              </div>
              <button
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-lg">
                  filter_list
                </span>
                Filtres
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-xs border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">Membre</th>
                  <th className="px-6 py-4">Poste</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4 text-center">Gestion activités</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bureauMembers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-10 text-center text-sm text-slate-500"
                    >
                      Aucun membre de bureau n&apos;est encore renseigné pour
                      cette promotion.
                    </td>
                  </tr>
                ) : (
                  bureauMembers.map((m) => (
                    <tr
                      key={m.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              className="w-full h-full object-cover"
                              alt={m.name}
                              src={m.photo_url || "https://via.placeholder.com/80"}
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">
                              {m.name}
                            </p>
                            <p className="text-xs text-slate-500">ID: {m.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                          {m.poste?.name || "Sans poste"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        <div className="flex flex-col">
                          <span>{m.email}</span>
                          {m.phone && (
                            <span className="text-xs text-slate-400">
                              {m.phone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              className="sr-only peer"
                              type="checkbox"
                              readOnly
                              checked={m.function === "GESTION_ACTIVITES"}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--aduti-primary)]/20 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--aduti-primary)]" />
                          </label>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className="text-slate-400 hover:text-[var(--aduti-primary)] transition-colors p-1"
                          type="button"
                        >
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

