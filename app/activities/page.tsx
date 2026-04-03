import Link from "next/link";
import { Search } from "lucide-react";
import { ImageGallery } from "@/components/ui/ImageGallery";

import type { Activity } from "@/types";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { AutoSubmitSelect } from "@/components/ui/auto-submit-select";
import { getActivitiesPaginated } from "@/app/dashboard/super-admin/activities/actions";
import { MaterialIcon } from "@/components/icons/material-icon";

export const runtime = "nodejs";

export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; promo?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const search = params.search || "";
  const promoId = params.promo || "";

  const { activities: rawActivities, total, totalPages } = await getActivitiesPaginated(
    promoId || undefined,
    currentPage,
    search
  );

  const activities = rawActivities as (Activity & { promotion: { name: string }; _count: { publications: number } })[];

  const promotions = await prisma.promotion.findMany({
    orderBy: { name: "desc" },
    include: { _count: { select: { activities: true } } },
  });

  return (
    <main className="flex-1 overflow-hidden bg-white">
      {/* Hero */}
      <section className="relative pt-12 md:pt-16 lg:pt-20 pb-12 px-4 shadow-[0_1px_0_0_rgba(0,0,0,0.02)]">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-[min(400px,80vw)] h-[min(400px,80vw)] bg-[var(--aduti-primary)]/5 rounded-full blur-3xl opacity-60 pointer-events-none" />
          <div className="absolute bottom-[20%] left-0 w-[min(300px,70vw)] h-[min(300px,70vw)] bg-[var(--aduti-secondary)]/5 rounded-full blur-3xl opacity-60 pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-10 border-b border-slate-100 pb-8 md:pb-12 text-center md:text-left">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center justify-center md:justify-start gap-2 px-3 py-1 rounded-full bg-blue-50 text-[var(--aduti-primary)] text-xs font-semibold tracking-wide uppercase border border-blue-100 w-fit mx-auto md:mx-0">
                <span className="w-2 h-2 rounded-full bg-[var(--aduti-primary)] animate-pulse" />
                Vie Associative ADUTI
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-end gap-3 pb-0 md:pb-2">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-white text-slate-700 border border-slate-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)] uppercase tracking-wide">
                <span className="w-2 h-2 rounded-full bg-[var(--aduti-primary)] mr-2.5 shadow-[0_0_8px_var(--aduti-primary)]" />
                {total} Événement{total > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          {/* Nouveau système de filtre moderne (identique à Members page) */}
          <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col xl:flex-row gap-6 items-center relative z-10 -mt-10">
            <form className="relative w-full xl:flex-1" method="GET">
              <input type="hidden" name="promo" value={promoId} />
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <Input
                name="search"
                className="block w-full pl-12 pr-4 py-4 h-14 bg-slate-50/50 border border-slate-100 rounded-2xl text-slate-900 placeholder-slate-400 focus:ring-8 focus:ring-[var(--aduti-primary)]/5 focus:border-[var(--aduti-primary)]/30 transition-all text-base hover:bg-white hover:border-slate-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                placeholder="Rechercher une activité..."
                defaultValue={search}
              />
              <button type="submit" className="hidden" />
            </form>

            <div className="flex gap-4 w-full xl:w-auto">
              <form className="relative flex-1 min-w-full sm:min-w-[220px] xl:min-w-[280px] group/select" method="GET">
                <input type="hidden" name="search" value={search} />
                <AutoSubmitSelect
                  name="promo"
                  className="appearance-none w-full pl-4 pr-10 py-4 h-14 bg-white border border-slate-100 rounded-2xl text-slate-700 text-sm font-bold tracking-tight focus:ring-8 focus:ring-[var(--aduti-primary)]/5 focus:border-[var(--aduti-primary)]/30 cursor-pointer group-hover/select:border-slate-300 transition-all shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                  defaultValue={promoId}
                >
                  <option value="">Toutes les Promotions</option>
                  {promotions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p._count.activities})
                    </option>
                  ))}
                </AutoSubmitSelect>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                  <MaterialIcon name="expand_more" className="w-5 h-5" />
                </div>
              </form>
            </div>
          </div>

          <div className="mt-16">
            {activities.length === 0 ? (
              <div className="bg-slate-50 rounded-[3rem] p-16 text-center border-2 border-dashed border-slate-200">
                <MaterialIcon name="event_busy" className="w-14 h-14 text-slate-300 mb-4 block mx-auto" />
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Aucune activité trouvée</h2>
                <p className="text-slate-500 font-medium">Réinitialisez les filtres pour voir les événements passés.</p>
                <Link href="/activities" className="mt-6 inline-flex items-center gap-2 text-[var(--aduti-primary)] font-bold hover:underline">
                  <MaterialIcon name="restart_alt" className="w-4 h-4" />
                  Effacer les filtres
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex flex-col gap-0 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)] transition-all duration-500 group overflow-hidden"
                  >
                    {/* Cover image with zoom capability */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 z-20">
                      {activity.image_url ? (
                        <ImageGallery images={[activity.image_url]} alt={activity.title} />
                      ) : (
                        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 z-10" />
                          <MaterialIcon name="event" className="w-16 h-16 text-white/10 scale-150 group-hover:scale-[2] transition-transform duration-1000" />
                        </div>
                      )}
                      
                      <div className="absolute top-5 right-5 z-20 pointer-events-none">
                        <span className="bg-[var(--aduti-primary)] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl rounded-full backdrop-blur-md">
                          {activity.promotion.name}
                        </span>
                      </div>
                      
                    </div>

                    {/* Content area */}
                    <div className="flex flex-col gap-3 p-8">
                      <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-widest gap-2.5">
                        <MaterialIcon name="calendar_today" className="w-[18px] h-[18px] text-[var(--aduti-primary)]" />
                        {new Date(activity.date || activity.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </div>
                      <h3 className="text-slate-900 text-2xl font-bold leading-tight line-clamp-2 tracking-tight">
                        {activity.title}
                      </h3>
                      <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium">
                        {activity.description}
                      </p>
                      
                      <Link 
                        href={`/activities/${activity.id}`}
                        className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between group/link cursor-pointer"
                      >
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl group-hover/link:bg-blue-50 border border-transparent group-hover/link:border-[var(--aduti-primary)]/20 transition-all">
                          <MaterialIcon name="article" className="w-[18px] h-[18px] text-[var(--aduti-primary)]" />
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                            {activity._count.publications} Publications
                          </span>
                        </div>
                        <div className="flex items-center gap-2 group/btn">
                          <span className="text-[var(--aduti-primary)] text-sm font-black group-hover/link:translate-x-1 transition-transform inline-flex items-center uppercase tracking-[0.1em] gap-1.5">
                            <span className="hover:underline decoration-2 underline-offset-4">Découvrir</span>
                            <MaterialIcon name="east" className="w-[18px] h-[18px]" />
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination Dynamique */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center pb-8 animate-in fade-in fill-mode-both duration-700 delay-300">
                <nav className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-[1.5rem] border border-slate-100">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    const isActive = p === currentPage;
                    const sp = new URLSearchParams();
                    if (search) sp.set("search", search);
                    if (promoId) sp.set("promo", promoId);
                    sp.set("page", p.toString());
                    const href = `/activities?${sp.toString()}`;

                    return (
                      <Link
                        key={p}
                        href={href}
                        className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all active:scale-90 font-bold text-sm ${
                          isActive
                            ? "bg-[var(--aduti-primary)] text-white shadow-[0_8px_25px_rgba(37,99,235,0.3)] hover:bg-blue-600"
                            : "text-slate-400 hover:bg-white border border-transparent hover:border-slate-200"
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
