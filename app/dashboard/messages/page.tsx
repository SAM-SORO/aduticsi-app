import { redirect } from "next/navigation";

import { DashboardLayout } from "@/components/dashboard/DashboardShell";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function DashboardMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const member = await prisma.member.findUnique({
    where: { id: user.id },
    select: { id: true, role: true, name: true, email: true },
  });

  if (!member || (member.role !== "SUPER_ADMIN" && member.role !== "ADMIN")) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const currentPage = Math.max(1, Number(params.page || "1"));
  const query = (params.query || "").trim();

  const where = query
    ? {
        OR: [
          { name: { contains: query, mode: "insensitive" as const } },
          { email: { contains: query, mode: "insensitive" as const } },
          { phone: { contains: query, mode: "insensitive" as const } },
          { subject: { contains: query, mode: "insensitive" as const } },
          { message: { contains: query, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [messages, total] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { created_at: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.contactMessage.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <DashboardLayout member={member} activePath="/dashboard/messages" title="Messages publics">
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="text-xl font-bold text-slate-900">Messages du formulaire public</h2>
          <p className="text-sm text-slate-500 mt-1">
            {total} message(s) en base. Affichage paginé ({PAGE_SIZE} par page).
          </p>
        </div>

        <form method="GET" className="bg-white rounded-xl border border-slate-200 p-4 flex gap-3">
          <input
            type="text"
            name="query"
            defaultValue={query}
            placeholder="Rechercher nom, email, sujet, message..."
            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[var(--aduti-primary)] text-white text-sm font-bold"
          >
            Rechercher
          </button>
        </form>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Nom</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Sujet</th>
                  <th className="px-4 py-3">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {messages.length === 0 ? (
                  <tr>
                    <td className="px-4 py-10 text-center text-slate-500" colSpan={5}>
                      Aucun message trouvé.
                    </td>
                  </tr>
                ) : (
                  messages.map((m) => (
                    <tr key={m.id} className="align-top">
                      <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(m.created_at).toLocaleString("fr-FR")}
                      </td>
                      <td className="px-4 py-4 text-sm font-semibold text-slate-900">{m.name}</td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        <div>{m.email || "—"}</div>
                        <div>{m.phone || "—"}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-700 whitespace-nowrap">{m.subject}</td>
                      <td className="px-4 py-4 text-sm text-slate-600 max-w-2xl whitespace-pre-wrap">{m.message}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              const sp = new URLSearchParams();
              if (query) sp.set("query", query);
              sp.set("page", page.toString());
              const href = `/dashboard/messages?${sp.toString()}`;
              const active = page === currentPage;
              return (
                <a
                  key={page}
                  href={href}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold ${
                    active
                      ? "bg-[var(--aduti-primary)] text-white"
                      : "bg-white border border-slate-200 text-slate-600"
                  }`}
                >
                  {page}
                </a>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

