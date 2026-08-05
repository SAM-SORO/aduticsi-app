"use client";

import { useEffect, useState, useRef, Suspense, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import confetti from "canvas-confetti";
import { PartyPopper, CheckCircle2, X, Sparkles } from "lucide-react";

function WelcomeConfettiInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isWelcome = searchParams.get("welcome") === "true";
  const [showUI, setShowUI] = useState(isWelcome);
  const [visible, setVisible] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);
  const confettiStopped = useRef(false);

  const handleClose = useCallback(() => {
    if (fadingOut) return;
    confettiStopped.current = true;
    setFadingOut(true);
    setTimeout(() => {
      setShowUI(false);
    }, 600);
  }, [fadingOut]);

  // Synchroniser showUI si l'URL change et contains welcome=true
  useEffect(() => {
    if (isWelcome) {
      const t = setTimeout(() => {
        setShowUI(true);
        setFadingOut(false);
        setVisible(false);
      }, 0);
      return () => clearTimeout(t);
    }
  }, [isWelcome]);

  // Lancement de l'animation lorsque showUI devient true
  useEffect(() => {
    if (!showUI || fadingOut) return;

    // Nettoie le paramètre ?welcome=true de l'URL silencieusement
    const params = new URLSearchParams(searchParams);
    if (params.has("welcome")) {
      params.delete("welcome");
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl, { scroll: false });
    }

    // Apparition du modal avec un léger délai pour la smoothness
    const showTimer = setTimeout(() => setVisible(true), 100);

    // Lance les confettis pendant 5s
    confettiStopped.current = false;
    const animationEnd = Date.now() + 5000;

    const frame = () => {
      if (confettiStopped.current) return;

      confetti({
        particleCount: 6,
        angle: 60,
        spread: 65,
        origin: { x: 0, y: 0.85 },
        colors: ["#3b82f6", "#f97316", "#10b981", "#8b5cf6", "#ec4899", "#eab308"],
        zIndex: 99999,
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 65,
        origin: { x: 1, y: 0.85 },
        colors: ["#3b82f6", "#f97316", "#10b981", "#8b5cf6", "#ec4899", "#eab308"],
        zIndex: 99999,
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    const confettiTimer = setTimeout(() => frame(), 400);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(confettiTimer);
      confettiStopped.current = true;
    };
  }, [showUI, fadingOut, pathname, router, searchParams]);

  if (!showUI) return null;

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 bg-slate-900/50 backdrop-blur-sm cursor-pointer transition-all duration-600 ${
        fadingOut
          ? "opacity-0 pointer-events-none"
          : visible
          ? "opacity-100"
          : "opacity-0"
      }`}
    >
      {/* ── Desktop ─────────────────────────────── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white px-10 py-14 sm:px-16 sm:py-16 rounded-[3rem] shadow-[0_40px_120px_rgba(0,0,0,0.18)] border border-slate-100 text-center max-w-xl w-full overflow-hidden cursor-default hidden sm:flex flex-col items-center transition-all duration-600 ${
          fadingOut ? "scale-95 opacity-0" : visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {/* Bouton Fermer */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-11 h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all group z-20"
          type="button"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 text-slate-500 group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* Glow subtil */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-56 bg-gradient-to-b from-[var(--aduti-primary)]/8 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-5">
          {/* Icône animée */}
          <div className="w-28 h-28 bg-gradient-to-br from-[var(--aduti-primary)] to-indigo-600 rounded-[2.2rem] flex items-center justify-center shadow-[0_20px_60px_rgba(59,130,246,0.35)] mb-2">
            <PartyPopper className="w-14 h-14 text-white" />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-xs font-black tracking-widest uppercase border border-emerald-100">
            <CheckCircle2 className="w-4 h-4" />
            Inscription validée
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15] mt-1">
            Bienvenue chèr(e) membre de{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--aduti-primary)] to-indigo-600">
              l&apos;ADUTI !
            </span>
          </h1>

          <p className="text-lg text-slate-500 font-medium max-w-sm leading-relaxed">
            Vous etre enregistrer sur la plateforme. Explorez la plateforme et retrouvez votre promo, les activités et bien plus encore.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-4 w-full sm:w-auto">
            <button
              onClick={handleClose}
              className="px-10 py-3.5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 shadow-lg inline-flex items-center gap-2 justify-center"
            >
              <Sparkles className="w-4 h-4" />
              Commencer l&apos;aventure
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile ──────────────────────────────── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative bg-white px-6 py-12 rounded-[2.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.15)] border border-slate-100 text-center w-full max-w-sm sm:hidden overflow-hidden cursor-default transition-all duration-600 ${
          fadingOut ? "scale-95 opacity-0" : visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center z-20 transition-all"
          type="button"
          aria-label="Fermer"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-[var(--aduti-primary)]/8 to-transparent blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-[var(--aduti-primary)] to-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-[0_10px_40px_rgba(59,130,246,0.3)] mb-1">
            <PartyPopper className="w-10 h-10 text-white" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black tracking-widest uppercase border border-emerald-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Inscription validée
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
            Bienvenue dans{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--aduti-primary)] to-indigo-600">
              l&apos;ADUTI !
            </span>
          </h1>

          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            Tu fais partie de la famille STIC. Explore ta promo et les activités !
          </p>

          <button
            onClick={handleClose}
            className="w-full mt-4 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all active:scale-95 inline-flex items-center gap-2 justify-center"
          >
            <Sparkles className="w-4 h-4" />
            C&apos;est parti !
          </button>
        </div>
      </div>
    </div>
  );
}

export function WelcomeConfetti() {
  return (
    <Suspense fallback={null}>
      <WelcomeConfettiInner />
    </Suspense>
  );
}
