import { Card, CardContent } from "@/components/ui/card";

export default function PromotionsPage() {
  return (
    <div className="bg-white py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-50 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="max-w-3xl space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#13acfa]">
            Promotions
          </p>
          <h1 className="text-balance text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Les promotions du cycle Technicien Supérieur
          </h1>
          <p className="max-w-2xl text-sm font-medium text-slate-600 dark:text-slate-300 sm:text-base">
            Cette page affichera les promotions DUT &amp; DTS, l&apos;année de
            début et de fin, ainsi que la promotion active mise en avant sur le
            site. Elle sera alimentée par la table{" "}
            <span className="font-semibold">promotions</span> (Prisma).
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card className="border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60">
            <CardContent className="space-y-2 p-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
                Promotion active
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Une seule promotion peut être marquée comme active
                simultanément.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60">
            <CardContent className="space-y-2 p-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
                Vue chronologique
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Affichage des promotions par ordre d&apos;année,
                rétrospective des cohortes successives.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60">
            <CardContent className="space-y-2 p-6">
              <div className="text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
                Espace admin
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Seuls les admins/super admin pourront définir ou modifier la
                promotion active.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

