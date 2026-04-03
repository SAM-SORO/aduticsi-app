"use client";

import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { FadeInScroll } from "@/components/fade-in-scroll";
import { MaterialIcon } from "@/components/icons/material-icon";

export default function AboutPage() {
  const scrollToHistory = () => {
    const el = document.getElementById("notre-histoire");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="flex-1 w-full overflow-x-hidden">
      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(1deg); }
          66% { transform: translateY(-6px) rotate(-1deg); }
        }
        @keyframes shimmerLine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-fade-in-left {
          animation: fadeInLeft 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-fade-in-right {
          animation: fadeInRight 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-float-slow { animation: floatSlow 7s ease-in-out infinite; }
        .shimmer-line { animation: shimmerLine 2.5s linear infinite; }
      `}</style>

    
      <section className="relative min-h-screen flex items-center bg-white overflow-hidden">
        {/* Light atmosphere background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {/* Subtle ambient glows matching landing page */}
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[var(--aduti-primary)]/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-[var(--aduti-secondary)]/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 grid lg:grid-cols-2 gap-16 lg:gap-24 items-center py-5 lg:py-1">

          {/* ── LEFT: Text Content ── */}
          <div className="space-y-10 animate-fade-in-left">
            {/* Eyebrow badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-[var(--aduti-primary)] text-xs font-bold tracking-[0.1em] uppercase border border-blue-100/50 shadow-sm"
              style={{ animationDelay: "0ms" }}
            >
              <span className="w-2 h-2 rounded-full bg-[var(--aduti-primary)] animate-pulse" />
              Association DUT / DTS · INP-HB
            </div>

            {/* Headline */}
            <div className="space-y-4" style={{ animationDelay: "100ms" }}>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-[family-name:var(--font-display)] font-black text-slate-900 leading-[0.92] tracking-tight">
                L&apos;Excellence
                <br />
                <span className="text-[var(--aduti-primary)] italic">
                  Numérique
                </span>
                <br />
                <span className="text-slate-600">à l&apos;INP-HB</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-lg leading-relaxed max-w-lg font-medium border-l-2 border-[var(--aduti-primary)]/30 pl-5" style={{ animationDelay: "200ms" }}>
              L&apos;ADUTI est l&apos;association des étudiants de la spécialité informatique du cycle
              de techniciens supérieurs de l&apos;ESI - <span className="text-slate-900 font-semibold">École Supérieure d&apos;Industrie</span>.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-8 pt-2" style={{ animationDelay: "300ms" }}>
              {[
                { val: "1995", label: "Fondation" },
                { val: "3k+", label: "Membres" },
                { val: "100%", label: "Insertion" },
              ].map((s) => (
                <div key={s.val} className="text-center">
                  <div className="text-2xl font-black text-slate-900 tracking-tight">{s.val}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4" style={{ animationDelay: "400ms" }}>
              <Button
                onClick={scrollToHistory}
                className="h-14 px-8 rounded-2xl bg-[var(--aduti-primary)] hover:bg-blue-600 text-white font-bold transition-all shadow-[0_15px_30px_-10px_rgba(19,146,236,0.3)] gap-3 hover:-translate-y-1 active:scale-95 text-sm"
              >
                <MaterialIcon name="history_edu" className="w-5 h-5" />
                Notre Histoire
              </Button>
              <Link href="/members">
                <Button
                  variant="outline"
                  className="h-14 px-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-slate-200 hover:border-slate-300 text-slate-700 font-bold transition-all hover:bg-white gap-3 hover:-translate-y-1 text-sm w-full sm:w-auto"
                >
                  <MaterialIcon name="hub" className="w-5 h-5 text-[var(--aduti-primary)]" />
                  Le Réseau
                </Button>
              </Link>
            </div>
          </div>

          {/* ── RIGHT: Logo Showcase Card ── */}
          <div className="relative animate-fade-in-right" style={{ animationDelay: "200ms" }}>
            {/* Outer glow halo */}
            <div className="absolute inset-0 -m-8 bg-[var(--aduti-primary)]/5 rounded-[4rem] blur-3xl" />

            {/* Main card — light theme */}
            <div className="relative bg-white rounded-[3rem] border border-slate-100 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.12)] overflow-hidden p-12 flex flex-col items-center gap-12 animate-float-slow">
              {/* Top label */}

              {/* ADUTI logo — large */}
              <div className="relative z-10 w-full flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 -m-4 bg-[var(--aduti-primary)]/5 rounded-full blur-2xl" />
                  <div className="relative bg-slate-50 rounded-3xl p-6 shadow-sm border border-slate-100">
                    <Image
                      src="/logo_association.jpeg"
                      alt="ADUTI — Association des DUT/DTS en Informatique"
                      width={280}
                      height={120}
                      className="object-contain max-h-28 w-auto"
                    />
                  </div>
                </div>
              </div>
              {/* ESI / STIC logo */}
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="relative">
                  <div className="absolute inset-0 -m-4 bg-blue-50 rounded-full blur-2xl" />
                  <div className="relative bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <Image
                      src="/image_aduti_logo_2.png"
                      alt="ESI / STIC — École Supérieure d'Industrie"
                      width={120}
                      height={120}
                      className="object-contain w-24 h-24"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom decorative dots */}
              <div className="relative z-10 grid grid-cols-5 gap-2 opacity-30">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--aduti-primary)]" />
                ))}
              </div>
            </div>

            {/* Floating accent chips */}
            <div className="absolute -top-4 -right-4 z-20 px-4 py-2 rounded-2xl bg-[var(--aduti-primary)] shadow-lg text-white text-xs font-black uppercase tracking-widest animate-float-slow" style={{ animationDelay: "2s" }}>
              DUT · DTS
            </div>
            <div className="absolute -bottom-4 -left-4 z-20 px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-lg text-slate-600 text-xs font-black uppercase tracking-widest animate-float-slow" style={{ animationDelay: "3.5s" }}>
              Depuis 1995
            </div>
          </div>

        </div>

      </section>


      {/* Vision & Mission - Refined Floating Grid */}
      <section className="py-32 px-4 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <FadeInScroll className="space-y-12">
              <div className="space-y-6">
                <div className="w-12 h-1.5 bg-indigo-600 rounded-full" />
                <h2 className="text-5xl md:text-6xl font-[family-name:var(--font-display)] font-black text-slate-900 leading-tight">
                  {"Fédérer pour"} <br /><span className="text-indigo-600 italic">{"l'Innovation"}</span>
                </h2>
                <p className="text-slate-600 text-xl leading-relaxed max-w-xl font-medium">
                  {"L'ADUTI est le pont stratégique entre la formation d'excellence à l'ESI"} 
                  {"et l'écosystème technologique mondial."}
                </p>
              </div>
              
              <div className="grid sm:grid-cols-1 gap-8">
                {[
                  {
                    title: "Vision Stratégique",
                    desc: "Devenir le catalyseur majeur de l'innovation technologique et du leadership au sein de l'INP-HB.",
                    icon: "visibility",
                    color: "text-blue-600",
                    bg: "bg-blue-50"
                  },
                  {
                    title: "Mission Excellence",
                    desc: "Promouvoir l'excellence académique et forger l'élite numérique capable de relever les défis de demain.",
                    icon: "rocket_launch",
                    color: "text-indigo-600",
                    bg: "bg-indigo-50"
                  }
                ].map((item, i) => (
                  <div key={i} className="flex gap-8 p-8 rounded-3xl bg-white shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-2xl transition-all duration-500 group">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-[1.25rem] ${item.bg} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                      <MaterialIcon name={item.icon} className={`w-8 h-8 ${item.color}`} />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-bold text-slate-900">{item.title}</h4>
                      <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeInScroll>
            
            <FadeInScroll delay={200} className="grid grid-cols-2 gap-8 relative">
              <div className="absolute inset-0 bg-indigo-200/20 blur-[120px] -z-10" />
              <div className="space-y-8 mt-16">
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 space-y-6 hover:-translate-y-3 transition-transform duration-500">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <MaterialIcon name="verified" className="w-8 h-8" />
                  </div>
                  <h5 className="text-xl font-bold text-slate-900">Excellence</h5>
                  <p className="text-sm text-slate-500 font-semibold leading-relaxed">{"Standard de formation et de rigueur académique certifié."}</p>
                </div>
                <div className="bg-slate-900 p-10 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] text-white space-y-6 hover:-translate-y-3 transition-transform duration-500">
                  <div className="w-14 h-14 bg-white/10 text-white rounded-2xl flex items-center justify-center">
                    <MaterialIcon name="history" className="w-8 h-8" />
                  </div>
                  <h5 className="text-xl font-bold text-white">Héritage</h5>
                  <p className="text-sm text-slate-400 font-semibold leading-relaxed">{"Plus de trois décennies de leadership étudiant."}</p>
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-indigo-600 p-10 rounded-[3rem] shadow-[0_30px_60px_rgba(79,70,229,0.3)] text-white space-y-6 hover:-translate-y-3 transition-transform duration-500">
                  <div className="w-14 h-14 bg-white/20 text-white rounded-2xl flex items-center justify-center">
                    <MaterialIcon name="diversity_1" className="w-8 h-8" />
                  </div>
                  <h5 className="text-xl font-bold text-white">Réseau</h5>
                  <p className="text-sm text-indigo-100 font-semibold leading-relaxed">{"Une force collective prête pour le monde professionnel."}</p>
                </div>
                <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 space-y-6 hover:-translate-y-3 transition-transform duration-500">
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                    <MaterialIcon name="ads_click" className="w-8 h-8" />
                  </div>
                  <h5 className="text-xl font-bold text-slate-900">Impact</h5>
                  <p className="text-sm text-slate-500 font-semibold leading-relaxed">{"Insertion professionnelle directe et privilégiée."}</p>
                </div>
              </div>
            </FadeInScroll>
          </div>
        </div>
      </section>

      {/* Notre Histoire - Digital Pulse Storyteller */}
      <section id="notre-histoire" className="py-40 px-4 bg-white scroll-mt-20 relative overflow-hidden">
        {/* Subtle Tech Background */}
        <div className="absolute inset-0 z-0 opacity-[0.03]" 
             style={{ backgroundImage: 'radial-gradient(#1392ec 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-white via-transparent to-white" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeInScroll className="text-center mb-32 space-y-6">
            <h2 className="text-5xl md:text-7xl font-[family-name:var(--font-display)] font-black text-slate-900 tracking-tight">
              Notre <span className="text-[var(--aduti-primary)]">Histoire</span>
            </h2>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-[0.6em]">Depuis 1995</p>
          </FadeInScroll>

          <div className="grid lg:grid-cols-3 gap-8">
            {[
              {
                year: "1995",
                title: "L'Origine",
                icon: "history",
                content: "L'ADUTI est née en 1995 de la volonté de jeunes étudiants passionnés d'informatique de l'INP-HB de promouvoir l'excellence académique et l'innovation technologique au sein de leur institution et au-delà. Depuis sa création, l'association s'est engagée à favoriser un environnement propice au développement personnel et professionnel des étudiants, tout en favorisant l'interaction et la collaboration entre les étudiants, les enseignants et les professionnels de l'industrie.",
                color: "text-[var(--aduti-primary)]",
                bg: "bg-blue-50/50"
              },
              {
                year: "Vision",
                title: "Développement",
                icon: "visibility",
                content: "Avec une vision axée sur l'émancipation des jeunes talents, l'ADUTI s'efforce d'encourager l'excellence académique, le développement personnel et professionnel, ainsi que la contribution significative à la communauté technologique nationale et internationale.",
                color: "text-[var(--aduti-secondary)]",
                bg: "bg-red-50/50"
              },
              {
                year: "Futur",
                title: "Innovation",
                icon: "auto_awesome",
                content: "À travers une série d'activités engagées, l'ADUTI s'est forgée une réputation solide de pôle d'innovation. En conjuguant passion et compétence, nous façonnons l'avenir de la technologie en Côte d'Ivoire et au-delà.",
                color: "text-indigo-600",
                bg: "bg-indigo-50/50"
              }
            ].map((chapter, i) => (
              <FadeInScroll key={i} delay={i * 200} className="relative group">
                <div className="h-full bg-white/40 backdrop-blur-sm p-10 rounded-[3rem] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] transition-all duration-700 hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:-translate-y-4 group-hover:bg-white">
                  <div className={`w-16 h-16 ${chapter.bg} ${chapter.color} rounded-2xl flex items-center justify-center mb-10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                    <MaterialIcon name={chapter.icon} className="w-8 h-8 font-bold" />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-baseline gap-3">
                      <span className={`text-4xl font-black ${chapter.color} tracking-tighter`}>{chapter.year}</span>
                      <div className="h-px flex-1 bg-slate-100" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{chapter.title}</h3>
                    <p className="text-slate-500 font-medium leading-relaxed text-balance">
                      {chapter.content}
                    </p>
                  </div>
                </div>
              </FadeInScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ESI & STIC */}
      <section className="py-40 px-4 bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        
        <div className="max-w-7xl mx-auto">
          <FadeInScroll className="relative mb-32 flex flex-col md:flex-row items-start md:items-end justify-between gap-16 md:gap-24">
            {/* Huge watermark text for premium depth */}
            <div className="absolute -top-16 -left-8 text-[10rem] md:text-[16rem] font-[family-name:var(--font-display)] font-black text-slate-900/[0.03] select-none pointer-events-none z-0 leading-none">
              STIC
            </div>

            <div className="relative z-10 max-w-2xl space-y-8">
              <div className="flex items-center gap-6">
                <div className="h-px w-16 bg-gradient-to-r from-[#c2185b] to-transparent"></div>
                <span className="text-[#c2185b] font-bold text-sm lg:text-base uppercase tracking-[0.4em]">Excellence Académique</span>
              </div>
              
              <h2 className="text-6xl md:text-7xl lg:text-8xl font-[family-name:var(--font-display)] font-black text-slate-900 leading-[0.85] tracking-tighter">
                Le cadre<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c2185b] to-[#f48fb1]">ESI-STIC</span>
              </h2>
            </div>

            <div className="relative z-10 md:max-w-lg w-full">
              {/* Vertical elegant accent line for typography support */}
              <div className="absolute -left-8 top-2 bottom-6 w-[2px] bg-gradient-to-b from-[#c2185b] to-transparent hidden md:block rounded-full opacity-50" />
              
              <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed">
                L&apos;École Supérieure d&apos;Industrie (<strong className="text-slate-900 font-bold">ESI</strong>) regroupe les filières technologiques  et industrielle de l&apos;INP-HB. 
                <br/><br/>
                La filière <strong className="text-[#c2185b] font-bold">STIC</strong> forme les ingénieurs et techniciens d&apos;excellence qui façonnent la souveraineté numérique de demain.
              </p>
            </div>
          </FadeInScroll>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Cycle TS */}
            <FadeInScroll delay={100} className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#c2185b]/5 rounded-bl-[6rem]" />
              <div className="relative z-10 space-y-12">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#c2185b]/10 flex items-center justify-center text-[#c2185b]">
                    <MaterialIcon name="terminal" className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">Cycle Technicien Supérieur</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:shadow-xl transition-all">
                    <div className="text-[#c2185b] font-black text-2xl mb-1">INFO</div>
                    <div className="text-sm font-bold text-slate-900">Informatique</div>
                    <div className="text-xs text-slate-500 mt-2 italic">Notre spécialité</div>
                  </div>
                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 hover:shadow-xl transition-all">
                    <div className="text-slate-400 font-black text-2xl mb-1">EIT</div>
                    <div className="text-sm font-bold text-slate-900 leading-snug">Électronique,<br />Informatique,<br />Télécommunication</div>
                  </div>
                </div>
              </div>
            </FadeInScroll>

            {/* Cycle Ingénieur */}
            <FadeInScroll delay={300} className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--aduti-primary)]/5 rounded-bl-[6rem]" />
              <div className="relative z-10 space-y-12">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-[var(--aduti-primary)]">
                    <MaterialIcon name="account_tree" className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900">Continuité en cycle Ingénieur</h3>
                </div>

                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                  {"Le système de passerelle permet aux meilleur etudiants de la TS de continuer en cycle ingénieur STIC (Bac+5)"}
                </p>

                <div className="flex gap-4 flex-wrap">
                  {["INFORMATIQUE", "RESEAUX ET TELECOMS", "EIT"].map((tag, i) => (
                    <span key={i} className="px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-[var(--aduti-primary)] text-xs font-bold">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </FadeInScroll>
          </div>
        </div>
      </section>

      {/* Final Impact - Massive Numbers */}
      <section className="py-40 px-4 bg-white text-center">
        <div className="max-w-7xl mx-auto space-y-32">
          <div className="grid md:grid-cols-3 gap-24">
            {[
              { val: "100%", label: "Insertion Directe", sub: "Grandes Entreprises & Startups", color: "text-indigo-600" },
              { val: "+31", label: "Années d'Histoire", sub: "Fondée en 1995 à l'INP-HB", color: "text-slate-900" },
              { val: "3k+", label: "Réseau Alumnis", sub: "Membres à travers le monde", color: "text-[var(--aduti-secondary)]" }
            ].map((stat, i) => (
              <FadeInScroll key={i} delay={i * 200} className="space-y-6 group">
                <div className={`text-7xl md:text-9xl font-[family-name:var(--font-display)] font-black ${stat.color} tracking-tighter transition-transform group-hover:scale-110 duration-500`}>
                  {stat.val}
                </div>
                <div className="space-y-2">
                  <div className="text-xl font-bold text-slate-900">{stat.label}</div>
                  <div className="text-sm font-medium text-slate-400 uppercase tracking-widest leading-tight">{stat.sub}</div>
                </div>
              </FadeInScroll>
            ))}
          </div>

        </div>
      </section>
    </main>
  );
}
