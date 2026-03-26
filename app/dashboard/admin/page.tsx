import Link from "next/link";
import { redirect } from "next/navigation";

import { logout } from "@/app/auth/actions";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DashboardAdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const member = await prisma.member.findUnique({
    where: { id: user.id },
    include: { promotion: true },
  });

  if (!member) {
    redirect("/dashboard");
  }

  if (member.role === "SUPER_ADMIN") {
    redirect("/dashboard/super-admin");
  }

  if (member.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const promo = member.promotion;
  const [membersCount, activitiesCount, members] = await Promise.all([
    prisma.member.count({ where: { promo_id: promo.id } }),
    prisma.activity.count({ where: { promo_id: promo.id } }),
    prisma.member.findMany({
      where: { promo_id: promo.id },
      orderBy: { created_at: "desc" },
      take: 12,
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        role: true,
        poste: true,
        photo_url: true,
      },
    }),
  ]);

  return (
    <div className="bg-[#f6f7f8] min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
        <div className="px-6 md:px-10 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 text-slate-900">
            <div className="size-8 flex items-center justify-center text-[var(--aduti-primary)]">
              <span className="material-symbols-outlined !text-3xl">
                school
              </span>
            </div>
            <h2 className="text-xl font-black leading-tight tracking-tight">
              ADUTI
            </h2>
          </div>

          <nav className="hidden md:flex flex-1 justify-end gap-8 items-center">
            <div className="flex items-center gap-6">
              <Link
                className="text-sm font-medium hover:text-[var(--aduti-primary)] transition-colors"
                href="/"
              >
                Accueil
              </Link>
              <Link
                className="text-sm font-medium hover:text-[var(--aduti-primary)] transition-colors"
                href="/about"
              >
                À propos
              </Link>
              <Link
                className="text-sm font-medium hover:text-[var(--aduti-primary)] transition-colors"
                href="/activities"
              >
                Activités
              </Link>
              <Link
                className="text-sm font-medium hover:text-[var(--aduti-primary)] transition-colors"
                href="/members"
              >
                Membres
              </Link>
              <Link
                className="text-sm font-medium hover:text-[var(--aduti-primary)] transition-colors"
                href="/contact"
              >
                Contact
              </Link>
            </div>
            <form action={logout}>
              <button className="flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-6 bg-slate-900 text-white text-sm font-bold transition-all hover:bg-slate-800">
                <span className="material-symbols-outlined !text-sm">
                  logout
                </span>
                <span className="truncate">Déconnexion</span>
              </button>
            </form>
          </nav>

          <button className="md:hidden p-2 text-slate-900">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 hidden lg:flex flex-col border-r border-slate-200 bg-white p-4">
          <div className="mb-8 flex items-center gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
            <div
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 shrink-0 border-2 border-[var(--aduti-primary)]/20"
              style={{
                backgroundImage: `url("${
                  member.photo_url || "https://via.placeholder.com/80"
                }")`,
              }}
            />
            <div className="flex flex-col overflow-hidden">
              <h1 className="text-sm font-bold truncate text-slate-900">
                {member.name}
              </h1>
              <p className="text-xs text-[var(--aduti-primary)] font-medium">
                {member.poste === "PRESIDENT" ? "Président" : "Admin"}
              </p>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[var(--aduti-primary)]/10 text-[var(--aduti-primary)] font-medium"
              href="#"
            >
              <span className="material-symbols-outlined fill-1">group</span>
              <span className="text-sm">Gestion des Membres</span>
            </a>
            <a
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-600 font-medium transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined">calendar_today</span>
              <span className="text-sm">Activités de ma Promotion</span>
            </a>
            <Link
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50 text-slate-600 font-medium transition-colors"
              href="/dashboard/bureau"
            >
              <span className="material-symbols-outlined">work</span>
              <span className="text-sm">Mon Bureau</span>
            </Link>
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="bg-blue-50 p-4 rounded-xl">
              <p className="text-xs text-blue-800 font-semibold mb-1">
                Besoin d&apos;aide ?
              </p>
              <p className="text-xs text-blue-600 mb-3">
                Contactez le support technique de l&apos;ADUTI.
              </p>
              <Link href="/contact" className="text-xs font-bold text-[var(--aduti-primary)] hover:underline">
                Support
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#f6f7f8] p-6 md:p-10">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tight text-slate-900">
                  Tableau de Bord
                </h1>
                <p className="text-slate-500">
                  Gérez les membres et les activités de la promotion{" "}
                  <span className="font-bold text-[var(--aduti-primary)]">
                    {promo.name}
                  </span>
                  .
                </p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
                  <span className="material-symbols-outlined !text-lg">
                    download
                  </span>
                  Exporter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[var(--aduti-primary)] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-blue-600 transition-colors">
                  <span className="material-symbols-outlined !text-lg">add</span>
                  Nouveau Membre
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined !text-8xl text-[var(--aduti-primary)]">
                    groups
                  </span>
                </div>
                <p className="text-slate-500 text-sm font-medium">
                  Membres inscrits
                </p>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-bold text-slate-900">
                    {membersCount}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined !text-8xl text-orange-500">
                    event
                  </span>
                </div>
                <p className="text-slate-500 text-sm font-medium">
                  Activités publiées
                </p>
                <div className="flex items-end gap-2">
                  <p className="text-4xl font-bold text-slate-900">
                    {activitiesCount}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className="material-symbols-outlined !text-8xl text-green-500">
                    security
                  </span>
                </div>
                <p className="text-slate-500 text-sm font-medium">Rôle</p>
                <div className="flex items-end gap-2">
                  <p className="text-2xl font-bold text-slate-900">ADMIN</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-900">
                  Liste des membres ({promo.name})
                </h3>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <span className="material-symbols-outlined !text-lg">
                      search
                    </span>
                  </span>
                  <input
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[var(--aduti-primary)]/20 focus:border-[var(--aduti-primary)] w-full sm:w-64 transition-all"
                    placeholder="Rechercher un membre..."
                    type="text"
                  />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Membre
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {members.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center text-sm text-slate-500"
                        >
                          Aucun membre trouvé pour cette promotion.
                        </td>
                      </tr>
                    ) : (
                      members.map((m) => (
                        <tr
                          key={m.id}
                          className="hover:bg-slate-50 transition-colors group"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div
                                className="size-9 rounded-full bg-slate-200 bg-cover bg-center"
                                style={{
                                  backgroundImage: `url("${
                                    m.photo_url || "https://via.placeholder.com/80"
                                  }")`,
                                }}
                              />
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {m.name}
                                </p>
                                <p className="text-xs text-slate-500 truncate max-w-[220px]">
                                  ID: {m.id}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {m.status === "ALUMNI" ? "Alumni" : "Étudiant"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {m.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {m.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                className="text-slate-400 hover:text-[var(--aduti-primary)] transition-colors p-1"
                                title="Modifier"
                                type="button"
                              >
                                <span className="material-symbols-outlined !text-lg">
                                  edit
                                </span>
                              </button>
                              <button
                                className="text-slate-400 hover:text-green-500 transition-colors p-1"
                                title="Compléter Infos"
                                type="button"
                              >
                                <span className="material-symbols-outlined !text-lg">
                                  assignment_add
                                </span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

