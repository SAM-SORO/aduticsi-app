import type { Metadata } from "next";
import Link from "next/link";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { Pagination } from "@/components/ui/pagination";
import { FilterBar } from "@/components/filters/FilterBar";

import { prisma } from "@/lib/prisma";
import { getActivitiesPaginated } from "@/app/dashboard/super-admin/activities/actions";
import type { ActivityWithDetails } from "@/app/dashboard/super-admin/activities/actions";
import { MaterialIcon } from "@/components/icons/material-icon";

export const runtime = "nodejs";
export const metadata: Metadata = {
  title: "Activités et événements",
  description:
    "Hackathons, journées d'information et soirées organisés par les promotions de l'ADUTI tout au long de l'année.",
  alternates: { canonical: "/activities" },
  openGraph: {
    title: "Activités et événements",
    description:
      "Hackathons, journées d'information et soirées organisés par les promotions de l'ADUTI tout au long de l'année.",
    url: "/activities",
  },
};

export const dynamic = "force-dynamic";


export default async function ActivitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; promo?: string; category?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const search = params.search || "";
  const promoId = params.promo || "";
  const categoryId = params.category || "";

  const { activities: rawActivities, total, totalPages } = await getActivitiesPaginated(
    promoId || undefined,
    currentPage,
    search,
    categoryId || undefined
  );

  const activities = rawActivities as ActivityWithDetails[];

  const [promotions, categories] = await Promise.all([
    prisma.promotion.findMany({
      orderBy: { name: "desc" },
      include: { _count: { select: { activities: true } } },
    }),
    prisma.activityCategory.findMany({ orderBy: { created_at: "asc" } }),
  ]);

  return (
    <main className="flex-1 overflow-hidden bg-white">
      {/* Hero */}
      <section className="relative pt-12 md:pt-16 lg:pt-20 pb-12 px-4 shadow-[0_1px_0_0_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6 border-b border-slate-100 pb-8 md:flex-row md:items-end md:justify-between md:pb-12">
            <div className="max-w-2xl space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                La vie associative
              </h1>
              <p className="text-base leading-relaxed text-slate-500">
                Hackathons, journées d’information, soirées : retrouvez ce que les
                promotions de l’ADUTI organisent tout au long de l’année.
              </p>
            </div>
            <p className="shrink-0 text-sm text-slate-500 md:pb-2">
              {total} événement{total > 1 ? "s" : ""} publié{total > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </section>

      <section className="pb-24 px-4 bg-white">
        <div className="mx-auto max-w-7xl">
          <FilterBar
            searchValue={search}
            searchPlaceholder="Rechercher une activité, un thème, un lieu..."
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
                name: "category",
                placeholder: "Toutes catégories",
                searchPlaceholder: "Rechercher une catégorie...",
                value: categoryId,
                options: [
                  { value: "", label: "Toutes catégories" },
                  ...categories.map((c) => ({ value: c.id, label: c.name })),
                ],
              },
            ]}
          />


          <div className="mt-16">
            {activities.length === 0 ? (
              <div className="bg-slate-50 rounded-3xl p-16 text-center border-2 border-dashed border-slate-200">
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
                      className="flex flex-col gap-0 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)] transition-all duration-500 group overflow-hidden"
                    >
                      {/* Cover image */}
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-slate-100 z-20">
                        {activity.image_url ? (
                          <ImageGallery images={[activity.image_url]} alt={activity.title} />
                        ) : (
                          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 z-10" />
                            <MaterialIcon name="event" className="w-16 h-16 text-white/10 scale-150 group-hover:scale-[2] transition-transform duration-1000" />
                          </div>
                        )}
                        
                        {/* Promo badge */}
                        <div className="absolute top-5 right-5 z-20 pointer-events-none">
                          <span className="bg-[var(--aduti-primary)] px-4 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-xl rounded-full backdrop-blur-md">
                            {activity.promotion.name}
                          </span>
                        </div>
                      </div>

                      {/* Content area */}
                      <div className="flex flex-col gap-3 p-8">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-slate-500">
                          <span className="inline-flex items-center gap-1.5">
                            <MaterialIcon name="calendar_today" className="w-4 h-4 text-slate-400" />
                            {new Date(activity.date || activity.created_at).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </span>
                          {activity.category && (
                            <>
                              <span aria-hidden className="h-3 w-px bg-slate-200" />
                              <span className="text-slate-500">{activity.category.name}</span>
                            </>
                          )}
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
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                              {activity._count.publications} Publications
                            </span>
                          </div>
                          <div className="flex items-center gap-2 group/btn">
                            <span className="text-[var(--aduti-primary)] text-sm font-bold group-hover/link:translate-x-1 transition-transform inline-flex items-center uppercase tracking-wide gap-1.5">
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

            <Pagination
              className="mt-16 pb-8"
              currentPage={currentPage}
              totalPages={totalPages}
              buildHref={(p) => {
                const sp = new URLSearchParams();
                if (search) sp.set("search", search);
                if (promoId) sp.set("promo", promoId);
                if (categoryId) sp.set("category", categoryId);
                sp.set("page", p.toString());
                return `/activities?${sp.toString()}`;
              }}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
