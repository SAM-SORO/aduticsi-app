import Link from "next/link";
import Image from "next/image";

import { FadeInScroll } from "@/components/fade-in-scroll";

import { Button } from "@/components/ui/button";
import { Counter } from "@/components/ui/counter";
import { PartnersCarousel } from "@/components/partners-carousel";
import { MaterialIcon } from "@/components/icons/material-icon";

export default function Home() {
  return (
    <main className="flex-1 w-full">
      {/* Hero */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-24 lg:pb-30 px-4">
        {/* Animated Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[var(--aduti-primary)]/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-[var(--aduti-secondary)]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-[var(--aduti-primary)] text-xs font-bold tracking-[0.1em] uppercase border border-blue-100/50 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[var(--aduti-primary)] animate-pulse" />
            Portail Officiel
          </div>

          <div className="flex justify-center mb-10">
            <div className="relative w-64 h-28 md:w-80 md:h-36 group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-[var(--aduti-primary)]/10 to-[var(--aduti-secondary)]/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <Image
                src="/logo_association.jpeg"
                alt="Logo ADUTI"
                fill
                className="object-contain relative z-10 transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-[family-name:var(--font-display)] font-bold text-slate-900 tracking-tight text-balance max-w-5xl mx-auto leading-[1.1]">
            Association des <span className="text-[var(--aduti-primary)] relative italic">DUT<span className="absolute -bottom-1 left-0 w-full h-1 bg-[var(--aduti-primary)]/10 -rotate-1 rounded-full" /></span> et <span className="text-[var(--aduti-primary)] relative italic">DTS<span className="absolute -bottom-1 left-0 w-full h-1 bg-[var(--aduti-primary)]/10 -rotate-1 rounded-full" /></span>{" "}
            <br className="hidden md:block" /> en <span className="text-[var(--aduti-secondary)]">Informatique</span>
          </h1>

          <p className="mt-8 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium opacity-90">
            Fédérer, Innover et Exceller. Découvrez le réseau officiel des étudiants et diplômés du cycle de Technicien supérieur de la filière STIC de l&apos;INP-HB.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-10">
            <Link href="/about">
              <Button className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-[var(--aduti-primary)] hover:bg-blue-600 text-white font-bold transition-all shadow-[0_15px_30px_-10px_rgba(19,146,236,0.3)] hover:-translate-y-1">
                {"Découvrir l'ADUTI"}
                <MaterialIcon name="arrow_forward" className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/activities">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-14 px-10 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-slate-300 text-slate-700 font-bold transition-all hover:bg-white hover:-translate-y-1"
              >
                Explorer nos activités
              </Button>
            </Link>
          </div>

          <div className="pt-20 grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10 max-w-5xl mx-auto">
            {[
              { label: "d'histoire", value: 31, suffix: " ans" },
              { label: "2A-TS · 3A-TS · Alumnis", value: 3, suffix: " profils" },
              { label: "Promotions", value: 25, suffix: "+" },
              { label: "Insertion Pro", value: 100, suffix: "%" },
            ].map((stat, i) => (
              <div key={i} className="relative group p-6 rounded-3xl bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:-translate-y-1">
                <div className="text-4xl md:text-5xl font-[family-name:var(--font-display)] font-black text-slate-900 mb-2">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision - Luxury Cards */}
      <section className="py-24 bg-[#fafbfc] px-4 relative overflow-hidden">
        <FadeInScroll 
          className="max-w-7xl mx-auto"
>
          <div className="text-center mb-20 space-y-4 relative z-10">
            <span className="text-[var(--aduti-primary)] font-bold text-xs uppercase tracking-[0.3em]">Ambitions</span>
            <h2 className="text-3xl md:text-5xl font-[family-name:var(--font-display)] font-bold text-slate-900">
              Notre Mission & Vision
            </h2>
            <div className="w-12 h-1 bg-[var(--aduti-primary)]/20 mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {[
              {
                title: "Notre Mission",
                desc: "Promouvoir la filière Informatique de la STIC et favoriser l'intégration socio-professionnelle des étudiants.",
                icon: "flag",
                color: "bg-blue-50/80 text-[var(--aduti-primary)]",
                glow: "from-blue-500/10"
              },
              {
                title: "Notre Vision",
                desc: "Faire de la communauté des informaticiens de la STIC un réseau professionnel solide et reconnu.",
                icon: "visibility",
                color: "bg-red-50/80 text-[var(--aduti-secondary)]",
                glow: "from-red-500/10"
              },
              {
                title: "Nos Valeurs",
                desc: "Solidarité entre promotions, excellence technique et entraide intergénérationnelle.",
                icon: "groups",
                color: "bg-indigo-50/80 text-indigo-600",
                glow: "from-indigo-500/10"
              }
            ].map((item, i) => (
              <div key={i} className="group relative bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/60 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1)] hover:-translate-y-2 hover:bg-white/90">
                <div className={`absolute inset-0 bg-gradient-to-br ${item.glow} to-transparent opacity-0 group-hover:opacity-100 rounded-[2.5rem] transition-opacity duration-500`} />
                <div className={`w-14 h-14 ${item.color} backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 relative z-10 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                  <MaterialIcon name={item.icon} className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed relative z-10 text-balance group-hover:text-slate-600 transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </FadeInScroll>
      </section>

      {/* Nos Objectifs - Interactive Layout */}
      <section className="py-24 px-4 bg-white">
        <FadeInScroll 
          className="max-w-7xl mx-auto"
>
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-display)] font-bold text-slate-900 leading-[1.15]">
                  {"Nos piliers d'"}<span className="text-[var(--aduti-primary)]">action</span>
                </h2>
                <p className="text-slate-600 text-lg leading-relaxed max-w-xl">
                  {"L'ADUTI œuvre pour l'épanouissement académique et professionnel"}
                  {"de ses membres à travers des actions structurées."}
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
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[var(--aduti-primary)] transition-colors group-hover:bg-[var(--aduti-primary)] group-hover:text-white">
                      <MaterialIcon name="check" className="w-4 h-4" />
                    </span>
                    <span className="font-semibold text-slate-800 transition-colors group-hover:text-[var(--aduti-primary)]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-[var(--aduti-primary)]/5 rounded-full blur-[100px]" />
              <div className="relative bg-slate-50 rounded-[3rem] p-1.5 shadow-2xl overflow-hidden border border-slate-100">
                <div className="bg-white rounded-[2.9rem] p-8 lg:p-14 space-y-12">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center text-[var(--aduti-primary)] shadow-sm">
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
                    <div className="flex-shrink-0 w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center text-[var(--aduti-secondary)] shadow-sm">
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
          </div>
        </FadeInScroll>
      </section>

      {/* Nos Partenaires - Elegant Background */}
      <section className="py-24 px-4 bg-slate-50/80 border-y border-slate-100">
        <FadeInScroll 
          className="max-w-7xl mx-auto"
>
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-5xl font-[family-name:var(--font-display)] font-bold text-slate-900">
              Nos <span className="text-[var(--aduti-primary)]">Partenaires</span>
            </h2>
            <div className="w-12 h-1 bg-slate-200 mx-auto rounded-full mb-6" />
            <p className="text-slate-500 max-w-2xl mx-auto font-medium">
              Nous collaborons avec les leaders engagés dans le développement numérique.
            </p>
          </div>
          <PartnersCarousel />
        </FadeInScroll>
      </section>

      {/* Activités Phares - Premium Video-like Cards */}
      <section className="py-24 px-4 bg-white overflow-hidden">
        <FadeInScroll 
          className="max-w-7xl mx-auto"
>
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="space-y-4">
              <span className="text-[var(--aduti-secondary)] font-bold text-xs uppercase tracking-[0.3em]">Vie associative</span>
              <h2 className="text-4xl md:text-5xl font-[family-name:var(--font-display)] font-bold text-slate-900 leading-none">
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

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Hackathon",
                cat: "Compétition",
                img: "/activities/ctf.png",
                desc: "48h de code intensif pour résoudre les défis technologiques de demain."
              },
              {
                title: "Info's Days",
                cat: "Événement Annuel",
                img: "/activities/info_day.png",
                desc: "Promotion de la filière et conférences Tech pour les nouveaux talents."
              },
              {
                title: "Fun Night",
                cat: "Cohésion",
                img: "/activities/fun_night.png",
                desc: "Moments de détente et renforcement des liens entre promotions."
              }
            ].map((activity, i) => (
              <div key={i} className="group relative bg-white rounded-[3rem] p-4 border border-slate-100 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.05)] transition-all duration-700 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.12)] hover:-translate-y-2">
                <div className="aspect-[4/5] relative rounded-[2.5rem] overflow-hidden mb-8">
                  <Image
                    src={activity.img}
                    alt={activity.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 flex flex-col justify-end p-8 text-white">
                    <div className="text-[var(--aduti-primary)] text-[10px] font-black uppercase tracking-[0.4em] mb-2">{activity.cat}</div>
                    <h3 className="text-3xl font-bold mb-4">{activity.title}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                      {activity.desc}
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6">
                  <Link href="/activities" className="flex items-center justify-between group/link">
                    <span className="font-bold text-slate-900 group-hover/link:text-[var(--aduti-primary)] transition-colors">{"Détails de l'activité"}</span>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover/link:bg-[var(--aduti-primary)] group-hover/link:text-white transition-all">
                      <MaterialIcon name="east" className="w-5 h-5" />
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </FadeInScroll>
      </section>

      {/* Final CTA - The "Wow" Exit */}
      <section className="py-32 px-4 bg-slate-50 relative overflow-hidden border-t border-slate-100">
        <div className="absolute top-0 right-[-10%] w-[800px] h-[800px] bg-[var(--aduti-primary)]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[var(--aduti-secondary)]/10 rounded-full blur-[120px]" />
        
        <FadeInScroll className="max-w-4xl mx-auto text-center relative z-10 space-y-12">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-7xl font-[family-name:var(--font-display)] font-bold tracking-tight text-slate-900">
              En Savoir <span className="text-[var(--aduti-primary)]">Plus</span>
            </h2>
            <p className="text-slate-600 text-xl font-medium max-w-2xl mx-auto leading-relaxed">
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
