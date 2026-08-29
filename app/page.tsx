import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { FadeInScroll } from "@/components/fade-in-scroll";

import { Button } from "@/components/ui/button";
import { Counter } from "@/components/ui/counter";
import { PartnersCarousel } from "@/components/partners-carousel";
import { MaterialIcon } from "@/components/icons/material-icon";
import { TechBackdrop } from "@/components/tech-backdrop";
import { prisma } from "@/lib/prisma";
import type { ActivityCategory } from "@/types";

export const runtime = "nodejs";
export const metadata: Metadata = {
  title: "ADUTI, la communauté des informaticiens de l'INP-HB",
  description:
    "Association des DUT et DTS en Informatique de l'INP-HB : découvrez l'association, ses membres, ses promotions et ses activités à Yamoussoukro.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "ADUTI, la communauté des informaticiens de l'INP-HB",
    description:
      "Association des DUT et DTS en Informatique de l'INP-HB : découvrez l'association, ses membres, ses promotions et ses activités à Yamoussoukro.",
    url: "/",
  },
};

export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch categories to build filtered links
  const categories: ActivityCategory[] = await prisma.activityCategory.findMany({ orderBy: { created_at: "asc" } });
  const catBySlug: Record<string, string> = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  return (
    <main className="flex-1 w-full overflow-x-hidden">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-10 pb-20 lg:pt-20 lg:pb-28">
        <TechBackdrop variant="grid" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
              INP-HB, Yamoussoukro
            </p>

            <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 text-balance md:text-6xl">
              Association des <span className="text-aduti-primary">DUT</span> et{" "}
              <span className="text-aduti-primary">DTS</span> en{" "}
              <span className="text-aduti-secondary">Informatique</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              Le réseau des étudiants et diplômés du cycle de technicien supérieur
              de la filière STIC. Fédérer, innover, exceller.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/about">
                <Button className="h-14 w-full rounded-2xl bg-aduti-primary px-8 font-bold text-white transition-colors hover:bg-aduti-primary-hover sm:w-auto">
                  {"Découvrir l'ADUTI"}
                  <MaterialIcon name="arrow_forward" className="ml-2 size-5" />
                </Button>
              </Link>
              <Link href="/activities">
                <Button
                  variant="outline"
                  className="h-14 w-full rounded-2xl border-slate-300 bg-white px-8 font-bold text-slate-700 transition-colors hover:border-slate-400 hover:bg-white sm:w-auto"
                >
                  Explorer nos activités
                </Button>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-8">
              <div className="relative mx-auto h-24 w-56 md:h-28 md:w-64">
                <Image
                  src="/logo_association.jpeg"
                  alt="Logo ADUTI"
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-6 border-t border-slate-100 pt-8">
                {[
                  { label: "d'histoire", value: 31, suffix: " ans" },
                  { label: "Promotions", value: 25, suffix: "+" },
                  { label: "Profils", value: 3, suffix: "" },
                  { label: "Insertion", value: 100, suffix: "%" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <dt className="sr-only">{stat.label}</dt>
                    <dd className="font-[family-name:var(--font-display)] text-3xl font-semibold text-slate-900">
                      <Counter end={stat.value} suffix={stat.suffix} />
                    </dd>
                    <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, vision, valeurs */}
      <section className="border-y border-slate-200 bg-slate-50 px-4 py-20 md:py-28">
        <FadeInScroll className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Ce qui nous guide
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Trois engagements qui structurent l&apos;action de l&apos;association
                depuis sa création.
              </p>
            </div>

            <dl className="divide-y divide-slate-200 lg:col-span-8">
              {[
                {
                  title: "Notre mission",
                  desc: "Promouvoir la filière Informatique de la STIC et favoriser l'intégration socio-professionnelle des étudiants.",
                  icon: "flag",
                },
                {
                  title: "Notre vision",
                  desc: "Faire de la communauté des informaticiens de la STIC un réseau professionnel solide et reconnu.",
                  icon: "visibility",
                },
                {
                  title: "Nos valeurs",
                  desc: "Solidarité entre promotions, excellence technique et entraide intergénérationnelle.",
                  icon: "groups",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-6 py-8 first:pt-0 last:pb-0">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-(--aduti-primary)/10 text-aduti-primary">
                    <MaterialIcon name={item.icon} className="size-6" />
                  </div>
                  <div>
                    <dt className="text-xl font-semibold text-slate-900">{item.title}</dt>
                    <dd className="mt-2 max-w-2xl leading-relaxed text-slate-600">{item.desc}</dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </FadeInScroll>
      </section>

      {/* Nos Objectifs - Interactive Layout */}
      <section className="bg-white px-4 py-20 md:py-28">
        <FadeInScroll 
          className="max-w-7xl mx-auto"
>
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl">
                  {"Nos piliers d'"}<span className="text-aduti-primary">action</span>
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
                  {"L'ADUTI a pour mission de promouvoir l'informatique au sein de l'INP-HB et au-delà, "}
                  {"de soutenir l'insertion professionnelle des jeunes diplômés grâce à son réseau d'alumni, "}
                  {"de valoriser les compétences numériques "}
                  {"et de développer un esprit de solidarité entre les générations."}
                </p>
              </div>
              <ul className="space-y-6">
                {[
                  "Promouvoir l'informatique et les NTIC",
                  "Encourager les amateurs et passionnés",
                  "Faciliter l'insertion professionnelle des diplômés",
                  "Faire rayonner le savoir-faire ivoirien mondialement",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-700 group cursor-default">
                    <span className="shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-aduti-primary transition-colors group-hover:bg-aduti-primary group-hover:text-white">
                      <MaterialIcon name="check" className="w-4 h-4" />
                    </span>
                    <span className="font-semibold text-slate-800 transition-colors group-hover:text-aduti-primary">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-14 space-y-8 lg:space-y-12 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
                <div className="flex items-start gap-6">
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-(--aduti-primary)/10 text-aduti-primary">
                    <MaterialIcon name="school" className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">Formation STIC</h3>
                    <p className="text-slate-500 leading-relaxed font-medium">
                      {"La filière STIC forme les techniciens supérieurs (DUT/DTS) d'élite à l'INP-HB."}
                    </p>
                  </div>
                </div>
                <div className="h-px bg-slate-100 w-full" />
                <div className="flex items-start gap-6">
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-(--aduti-primary)/10 text-aduti-primary">
                    <MaterialIcon name="diversity_3" className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-slate-900">Le Réseau</h3>
                    <p className="text-slate-500 leading-relaxed font-medium">
                      Une communauté unie de plus de 20 promotions de talents du numérique.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </FadeInScroll>
      </section>

      {/* Nos Partenaires - Elegant Background */}
      <section className="border-b border-slate-200 bg-white px-4 py-20 md:py-28">
        <FadeInScroll 
          className="max-w-7xl mx-auto"
>
          <div className="text-center mb-16 space-y-4">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Nos <span className="text-aduti-primary">Partenaires</span>
            </h2>
                        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
              Nous collaborons avec les leaders engagés dans le développement numérique.
            </p>
          </div>
          <PartnersCarousel />
        </FadeInScroll>
      </section>

      {/* Activités Phares - Premium Video-like Cards */}
      <section className="relative overflow-hidden bg-slate-50 px-4 py-20 md:py-28">
        <FadeInScroll 
          className="max-w-7xl mx-auto"
>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-20 gap-6">
            <div className="space-y-4">
              <p className="text-sm font-medium uppercase tracking-wide text-slate-500">Vie associative</p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                Nos Activités Phares
              </h2>
            </div>
            <Link
              href="/activities"
              className="group flex items-center gap-3 py-3 px-6 rounded-2xl bg-slate-50 hover:bg-slate-900 hover:text-white transition-all duration-500 font-bold text-slate-900"
            >
              {"Voir nos activités"}
              <MaterialIcon name="arrow_forward" className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
            {[
              {
                title: "Hackathon",
                cat: "Compétition",
                img: "/activities/ctf.png",
                desc: "48h de code intensif pour résoudre les défis technologiques de demain.",
                slug: "hackathon",
                linkLabel: "Voir les Hackathons",
              },
              {
                title: "Info's Days",
                cat: "Événement Annuel",
                img: "/activities/info_day.png",
                desc: "Promotion de la filière et conférences Tech pour les nouveaux talents.",
                slug: "infos-day",
                linkLabel: "Voir les Info's Days",
              },
              {
                title: "Fun Night",
                cat: "Cohésion",
                img: "/activities/fun_night.png",
                desc: "Moments de détente et renforcement des liens entre promotions.",
                slug: "fun-night",
                linkLabel: "Voir les Fun Nights",
              },
            ].map((activity, i) => {
              const catId = catBySlug[activity.slug];
              const href = catId ? `/activities?category=${catId}` : "/activities";
              return (
              <div key={i} className="group relative bg-white rounded-3xl p-4 border border-slate-100 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] transition-all duration-700 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.12)] hover:-translate-y-2">
                <div className="aspect-4/5 relative rounded-3xl overflow-hidden mb-8">
                  <Image
                    src={activity.img}
                    alt={activity.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900 flex flex-col justify-end p-8 text-white">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-white/70">{activity.cat}</p>
                    <h3 className="text-3xl font-bold mb-4">{activity.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-200">
                      {activity.desc}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <Link href={href} className="flex items-center justify-between group/link">
                    <span className="font-bold text-slate-900 group-hover/link:text-aduti-primary transition-colors">{activity.linkLabel}</span>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover/link:bg-aduti-primary group-hover/link:text-white transition-all">
                      <MaterialIcon name="east" className="w-5 h-5" />
                    </div>
                  </Link>
                </div>
              </div>
            );
          })}
          </div>
        </FadeInScroll>
      </section>

      {/* Final CTA - The "Wow" Exit */}
      <section className="relative overflow-hidden border-t border-slate-200 bg-white px-4 py-24 md:py-32">
        <TechBackdrop variant="dots" />

        <FadeInScroll className="max-w-4xl mx-auto text-center relative z-10 space-y-12">
          <div className="space-y-6">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight text-slate-900 md:text-5xl">
              En Savoir <span className="text-aduti-primary">Plus</span>
            </h2>
            <p className="text-slate-600 text-base sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
              {"Vous Voulez en Savoir plus sur l'ADUTI et son histoire ?"}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
            <Link href="/about">
              <Button className="h-14 w-full rounded-2xl bg-aduti-primary px-10 font-bold text-white transition-colors hover:bg-aduti-primary-hover sm:w-auto">
                En savoir plus
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                variant="outline"
                className="h-14 w-full rounded-2xl border-slate-300 bg-white px-10 font-bold text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 sm:w-auto"
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
