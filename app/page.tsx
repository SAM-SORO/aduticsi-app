import Link from "next/link";

import { FadeInScroll } from "@/components/fade-in-scroll";
import { LandingActivities } from "@/components/landing/landing-activities";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingMission } from "@/components/landing/landing-mission";
import { LandingPartners } from "@/components/landing/landing-partners";
import { LandingPillars } from "@/components/landing/landing-pillars";
import { LandingStats } from "@/components/landing/landing-stats";

import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import type { ActivityCategory } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, promotionCount]: [ActivityCategory[], number] = await Promise.all([
    prisma.activityCategory.findMany({ orderBy: { created_at: "asc" } }),
    prisma.promotion.count(),
  ]);
  const catBySlug: Record<string, string> = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  return (
    <main className="flex-1 w-full overflow-x-hidden">
      <LandingHero />

      <div className="landing-v14 landing-v14-phase-two">
        <LandingStats promotionCount={promotionCount} />
        <LandingMission />
        <LandingPillars />
        <LandingPartners />
        <LandingActivities categoryIdsBySlug={catBySlug} />
      </div>

      {/* Final CTA - The "Wow" Exit */}
      <section className="py-16 sm:py-24 md:py-32 px-4 bg-slate-50 relative overflow-hidden border-t border-slate-100">
        {/* Blobs décoratifs confinés — pas de débordement */}
        <div className="absolute top-0 right-0 w-[min(800px,100vw)] h-[min(800px,100vw)] bg-[var(--aduti-primary)]/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[min(600px,80vw)] h-[min(600px,80vw)] bg-[var(--aduti-secondary)]/10 rounded-full blur-[120px] pointer-events-none" />
        
        <FadeInScroll className="max-w-4xl mx-auto text-center relative z-10 space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl sm:text-5xl md:text-7xl font-[family-name:var(--font-display)] font-bold tracking-tight text-slate-900">
              En Savoir <span className="text-[var(--aduti-primary)]">Plus</span>
            </h2>
            <p className="text-slate-600 text-base sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              {"Vous Voulez en Savoir plus sur l'ADUTI et son histoire ?"}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <Link href="/about">
              <Button className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-[var(--aduti-primary)] text-white font-black text-lg hover:bg-blue-600 transition-all shadow-[0_15px_30px_-10px_rgba(19,146,236,0.3)] hover:-translate-y-1">
                En savoir plus
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-16 px-12 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-lg hover:bg-slate-50 hover:text-slate-900 transition-all shadow-sm hover:-translate-y-1"
              >
                Nous contacter
              </Button>
            </Link>
          </div>
        </FadeInScroll>
      </section>
    </main>
  );
}
