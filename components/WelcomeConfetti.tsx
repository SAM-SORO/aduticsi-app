"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import confetti from "canvas-confetti";
import { PartyPopper, CheckCircle2 } from "lucide-react";

function WelcomeConfettiInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isWelcome = searchParams.get("welcome") === "true";
  const [showUI, setShowUI] = useState(isWelcome);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    if (isWelcome) {
      // Met à jour l'URL sans rafraîchir la page pour enlever ?welcome=true
      const params = new URLSearchParams(searchParams);
      params.delete("welcome");
      const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
      router.replace(newUrl, { scroll: false });

      // Lance l'animation de bienvenue
      const duration = 4000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 8,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: ["#3b82f6", "#f97316", "#10b981", "#8b5cf6", "#ec4899", "#eab308"],
          zIndex: 99999,
        });
        confetti({
          particleCount: 8,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: ["#3b82f6", "#f97316", "#10b981", "#8b5cf6", "#ec4899", "#eab308"],
          zIndex: 99999,
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };

      // Délai pour s'assurer que la page a bien rendu
      setTimeout(() => {
        frame();
      }, 300);

      // Nettoyage UI
      setTimeout(() => {
        setFadingOut(true);
      }, duration + 500); // Reste visible un peu après les confettis

      setTimeout(() => {
        setShowUI(false);
      }, duration + 1500); // 1s de fadeOut
    }
  }, [isWelcome, searchParams, router, pathname]);

  if (!showUI) return null;

  return (
    <div
      className={`fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-md transition-all duration-1000 ${
        fadingOut ? "opacity-0 scale-105" : "opacity-100 scale-100 animate-fade-in"
      }`}
    >
      <div className="relative bg-white/95 backdrop-blur-2xl px-8 py-12 sm:px-16 sm:py-16 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] border border-white/50 text-center max-w-2xl w-full transform overflow-hidden hidden sm:block">
        {/* Glow de fond */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-48 bg-gradient-to-b from-[var(--aduti-primary)]/10 to-transparent blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[2rem] flex items-center justify-center rotate-3 shadow-xl mb-4 sm:mb-6">
            <PartyPopper className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Bienvenue sur <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--aduti-primary)] to-indigo-600">
              ADUTI
            </span>
          </h1>

          <p className="text-lg sm:text-2xl text-slate-500 font-medium max-w-md mt-2">
            Votre inscription a été certifiée. Ravi de vous compter parmi nous !
          </p>

          <div className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-[var(--aduti-primary)]/10 text-[var(--aduti-primary)] rounded-full text-sm font-bold tracking-widest uppercase">
            <CheckCircle2 className="w-5 h-5" />
            Accès membre validé
          </div>
        </div>
      </div>

      {/* Version Mobile très grande également */}
      <div className="relative bg-white/95 backdrop-blur-2xl px-6 py-10 rounded-[2.5rem] shadow-2xl border border-white/50 text-center w-full max-w-sm sm:hidden overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-gradient-to-b from-[var(--aduti-primary)]/10 to-transparent blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.5rem] flex items-center justify-center shadow-lg mb-2">
            <PartyPopper className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
            <span className="block mb-1">Bienvenue !</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--aduti-primary)] to-indigo-600">
              ADUTI
            </span>
          </h1>
          <p className="text-sm text-slate-500 font-medium">Inscription validée avec succès.</p>
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
