import { LandingActivities } from "@/components/landing/landing-activities";
import { LandingFinalCta } from "@/components/landing/landing-final-cta";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingMission } from "@/components/landing/landing-mission";
import { LandingPartners } from "@/components/landing/landing-partners";
import { LandingPillars } from "@/components/landing/landing-pillars";
import { LandingStats } from "@/components/landing/landing-stats";

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
        <LandingFinalCta />
      </div>
    </main>
  );
}
