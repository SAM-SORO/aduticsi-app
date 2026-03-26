import { redirect } from "next/navigation";
import { Plus, Layout, ChevronRight, ArrowLeft } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ImageGallery } from "@/components/ui/ImageGallery";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import type { Activity, Publication } from "@/types";

import { ActivityActions } from "./activity-actions";
import { ActivityForm } from "./activity-form";
import { PublicationActions } from "./publication-actions";
import { PublicationForm } from "./publication-form";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function ActivitiesAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ promo?: string; activity?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const member = await prisma.member.findUnique({
    where: { id: user.id },
    select: { id: true, role: true, name: true, email: true },
  });

  if (!member || member.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const selectedPromoId = params.promo;
  const selectedActivityId = params.activity;

  // Data fetching
  const promotions = await prisma.promotion.findMany({ 
    orderBy: { name: "desc" },
    include: { _count: { select: { activities: true } } }
  });

  let activities = null;
  if (selectedPromoId) {
    const rawActivities = await prisma.activity.findMany({
      where: { promo_id: selectedPromoId },
      include: {
        promotion: { select: { name: true } },
        _count: { select: { publications: true } },
      },
      orderBy: { created_at: "desc" },
    });
    activities = rawActivities as unknown as (Activity & { promotion: { name: string }; _count: { publications: number } })[];
  }

  let publications = null;
  if (selectedActivityId) {
    const rawPublications = await prisma.publication.findMany({
      where: { activity_id: selectedActivityId },
      orderBy: { created_at: "desc" },
    });
    publications = rawPublications as unknown as Publication[];
  }

  return (
    <DashboardShell
      member={member}
      activePath="/dashboard/super-admin/activities"
      title="Activités & Publications"
    >
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-end mb-4">
          <div className="flex items-center gap-3">
            {!selectedActivityId && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[var(--aduti-primary)] hover:bg-blue-600 text-white px-4 h-10 rounded-lg shadow-sm transition-all active:scale-95 gap-2 text-sm font-bold">
                    <Plus className="w-4 h-4" />
                    Nouvelle Activité
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-[2rem]">
                  <DialogHeader>
                    <DialogTitle>Ajouter une activité</DialogTitle>
                  </DialogHeader>
                  <ActivityForm promotions={promotions} />
                </DialogContent>
              </Dialog>
            )}
            {selectedActivityId && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-[var(--aduti-primary)] hover:bg-blue-600 text-white px-4 h-10 rounded-lg shadow-sm transition-all active:scale-95 gap-2 text-sm font-bold">
                    <Plus className="w-4 h-4" />
                    Nouvelle Publication
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-[2rem]">
                  <DialogHeader>
                    <DialogTitle>Ajouter une publication</DialogTitle>
                  </DialogHeader>
                  <PublicationForm activityId={selectedActivityId} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>

        {/* ═══════════ LEVEL 1: PROMOTION CARDS ═══════════ */}
        {!selectedPromoId && !selectedActivityId && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promotions.map((promo: { id: string; name: string; is_current_promo: boolean; _count: { activities: number } }) => (
                <a
                  key={promo.id}
                  href={`/dashboard/super-admin/activities?promo=${promo.id}`}
                  className="group bg-white p-8 rounded-3xl border border-slate-100 hover:border-[var(--aduti-primary)]/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all flex flex-col items-center text-center relative overflow-hidden"
                >
                  <div className="size-16 bg-blue-50 rounded-2xl flex items-center justify-center text-[var(--aduti-primary)] mb-6 group-hover:scale-110 transition-transform">
                    <Layout className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Promotion {promo.name}</h3>
                  <div className="flex items-center gap-4 text-slate-400 text-xs font-bold mb-4">
                    <span>{promo._count.activities} activités</span>
                  </div>
                  <p className="text-slate-400 text-sm font-medium">Cliquez pour voir les activités</p>
                  {promo.is_current_promo && (
                    <span className="absolute top-4 right-4 px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-full">Actuelle</span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ═══════════ LEVEL 2: ACTIVITIES FOR PROMO ═══════════ */}
        {selectedPromoId && !selectedActivityId && activities && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex items-center gap-4 mb-4">
              <a href="/dashboard/super-admin/activities" className="text-slate-500 hover:text-slate-900 flex items-center gap-2 font-bold text-sm">
                <ArrowLeft className="w-4 h-4" />
                Tableau de bord
              </a>
            </div>

            {activities.length === 0 ? (
              <div className="bg-white p-16 rounded-3xl border-2 border-dashed border-slate-100 text-center">
                <Layout className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-slate-900">Aucune activité</h4>
                <p className="text-slate-400 text-sm">Créez votre première activité pour cette promotion.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {activities.map((act: Activity & { _count: { publications: number } }) => (
                  <div key={act.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all flex flex-col relative">
                    <div className="h-48 relative overflow-hidden bg-slate-100">
                      {act.image_url ? (
                        <ImageGallery images={[act.image_url]} alt={act.title} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <Layout className="w-12 h-12" />
                        </div>
                      )}
                      {/* Actions overlay - outside of main link click area */}
                      <div className="absolute top-4 right-4 z-20">
                        <ActivityActions activity={act} promotions={promotions} />
                      </div>
                    </div>
                    
                    <div className="p-8 flex flex-col flex-1">
                      <h4 className="text-xl font-bold text-slate-900 mb-3">{act.title}</h4>
                      <p className="text-slate-500 text-sm line-clamp-3 mb-6 leading-relaxed font-medium">{act.description}</p>
                      
                      <a 
                        href={`/dashboard/super-admin/activities?promo=${selectedPromoId}&activity=${act.id}`}
                        className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50 group/link cursor-pointer"
                      >
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl border border-slate-100 group-hover/link:bg-blue-50 group-hover/link:border-[var(--aduti-primary)]/20 transition-all">
                          <span className="material-symbols-outlined !text-[20px] text-[var(--aduti-primary)]">article</span>
                          <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{act._count.publications} Publications</span>
                        </div>
                        <div className="size-11 bg-slate-900 text-white rounded-2xl flex items-center justify-center group-hover/link:bg-[var(--aduti-primary)] group-hover/link:rotate-[-5deg] transition-all shadow-xl shadow-slate-200">
                          <ChevronRight className="w-6 h-6" />
                        </div>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ═══════════ LEVEL 3: PUBLICATIONS FOR ACTIVITY ═══════════ */}
        {selectedActivityId && publications && (
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
             <div className="flex items-center gap-4 mb-4">
              <a href={`/dashboard/super-admin/activities?promo=${selectedPromoId}`} className="text-slate-500 hover:text-slate-900 flex items-center gap-2 font-bold text-sm">
                <ArrowLeft className="w-4 h-4" />
                Retour aux activités
              </a>
            </div>

            {publications.length === 0 ? (
              <div className="bg-white p-16 rounded-3xl border-2 border-dashed border-slate-100 text-center">
                <Plus className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-slate-900">Aucune publication</h4>
                <p className="text-slate-400 text-sm">Cliquez sur « Nouvelle Publication » pour illustrer cette activité.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {publications.map((pub: Publication) => (
                  <div key={pub.id} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] transition-all flex flex-col">
                    <div className="p-2 bg-slate-50 shrink-0">
                      <ImageGallery images={pub.images} alt={pub.title} />
                      {pub.images.length === 0 && (
                         <div className="aspect-video flex items-center justify-center text-slate-300 rounded-2xl bg-white border border-slate-100 border-dashed">
                          <Layout className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <div className="p-8 relative pt-4">
                      <div className="absolute top-4 right-8">
                        <PublicationActions publication={pub} activityId={selectedActivityId} />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2">{pub.title}</h4>
                      <p className="text-slate-500 text-sm mb-6 leading-relaxed line-clamp-3">{pub.content}</p>
                      <div className="flex items-center gap-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest pt-4 border-t border-slate-50">
                        <span className="material-symbols-outlined !text-[16px]">calendar_today</span>
                        {new Date(pub.date || pub.created_at).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
