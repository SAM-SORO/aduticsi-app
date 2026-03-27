import { notFound } from "next/navigation";
import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { MaterialIcon } from "@/components/icons/material-icon";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const activity = await prisma.activity.findUnique({
    where: { id },
    include: {
      promotion: { select: { name: true } },
      publications: { orderBy: { created_at: "desc" } },
    },
  });

  if (!activity) notFound();

  return (
    <main className="flex-1 bg-white">
      {/* Header Section - Better Readability */}
      <section className="pt-8 md:pt-12 pb-6 md:pb-8 px-4">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/activities"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-[var(--aduti-primary)] text-xs font-bold uppercase tracking-widest transition-colors mb-6 group"
          >
            <MaterialIcon name="arrow_back" className="w-[18px] h-[18px] group-hover:-translate-x-1 transition-transform" />
            Retour aux activités
          </Link>
          
          <div className="space-y-4 md:space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-[var(--aduti-primary)]/10 text-[var(--aduti-primary)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] rounded-full border border-[var(--aduti-primary)]/20">
                Promotion {activity.promotion.name}
              </span>
              <span className="text-slate-400 text-[11px] font-bold uppercase tracking-widest flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                <MaterialIcon name="calendar_month" className="w-4 h-4" />
                {new Date(activity.date || activity.created_at).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-[family-name:var(--font-display)] font-bold text-slate-900 leading-tight max-w-4xl tracking-tight">
              {activity.title}
            </h1>
          </div>
        </div>
      </section>





      {/* Publications */}
      <section className="py-12 md:py-16 px-4 bg-[#f8f9fa]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-[family-name:var(--font-display)] font-bold text-slate-900 flex items-center gap-3">
              <span className="w-2 h-8 bg-[var(--aduti-primary)] rounded-full" />
              Publications
            </h2>
            <span className="px-3 py-1 bg-blue-50 text-[var(--aduti-primary)] text-xs font-bold uppercase rounded-full border border-blue-100">
              {activity.publications.length} publication{activity.publications.length !== 1 ? "s" : ""}
            </span>
          </div>

          {activity.publications.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100">
              <MaterialIcon name="newspaper" className="w-12 h-12 text-slate-200 mb-3 block mx-auto" />
              <p className="text-slate-400 font-medium">Aucune publication pour cette activité.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {activity.publications.map((pub) => (
                <article
                  key={pub.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
                >
                  <div className="p-6 md:p-8 space-y-5">
                    <div className="flex items-center gap-3 text-slate-400 text-[11px] font-black uppercase tracking-widest">
                      <MaterialIcon name="calendar_month" className="w-4 h-4 text-[var(--aduti-primary)]" />
                      {new Date(pub.date || pub.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
                      {pub.title}
                    </h3>
                    {pub.content && (
                      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {pub.content}
                      </p>
                    )}

                    {/* Facebook-style image gallery */}
                    {pub.images.length > 0 && (
                      <div className="rounded-2xl overflow-hidden">
                        <ImageGallery images={pub.images} alt={pub.title} />
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
