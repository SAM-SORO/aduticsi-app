"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { PartyPopper, X } from "lucide-react";

// La charte plutot qu'un arc-en-ciel generique.
const CONFETTI_COLORS = ["#13254b", "#1d3a70", "#a9111f", "#e2e8f0"];
const CONFETTI_DURATION_MS = 2500;

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function WelcomeConfettiInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isWelcome = searchParams.get("welcome") === "true";
  const [open, setOpen] = useState(isWelcome);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const stopped = useRef(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    if (closing) return;
    stopped.current = true;
    setClosing(true);
    setTimeout(() => setOpen(false), 250);
  }, [closing]);

  useEffect(() => {
    if (!open || closing) return;

    // Retire ?welcome=true sans recharger : un rafraichissement ne doit pas
    // rejouer l'animation.
    const params = new URLSearchParams(searchParams);
    if (params.has("welcome")) {
      params.delete("welcome");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    }

    dialogRef.current?.focus();
    const showTimer = setTimeout(() => setVisible(true), 50);

    // Evenement unique dans la vie d'un membre : la fete se justifie, mais
    // jamais contre le reglage systeme de l'utilisateur.
    if (prefersReducedMotion()) {
      return () => clearTimeout(showTimer);
    }

    stopped.current = false;
    const end = Date.now() + CONFETTI_DURATION_MS;
    const frame = () => {
      if (stopped.current) return;
      for (const x of [0, 1]) {
        confetti({
          particleCount: 5,
          angle: x === 0 ? 60 : 120,
          spread: 60,
          origin: { x, y: 0.85 },
          colors: CONFETTI_COLORS,
          zIndex: 99999,
        });
      }
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    const confettiTimer = setTimeout(frame, 300);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(confettiTimer);
      stopped.current = true;
    };
  }, [open, closing, pathname, router, searchParams]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  if (!open) return null;

  return (
    <div
      onClick={close}
      className={`fixed inset-0 z-100000 flex cursor-pointer items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm transition-opacity duration-300 ${
        closing || !visible ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
        className={`relative w-full max-w-md cursor-default rounded-3xl border border-slate-200 bg-white p-8 text-center outline-none transition-all duration-300 sm:p-12 ${
          closing || !visible ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <button
          onClick={close}
          type="button"
          aria-label="Fermer"
          className="absolute right-4 top-4 flex size-10 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="size-5" />
        </button>

        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-(--aduti-primary)/10 text-aduti-primary">
          <PartyPopper className="size-8" />
        </div>

        <h2
          id="welcome-title"
          className="mt-6 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl"
        >
          Bienvenue à l’ADUTI
        </h2>

        <p className="mx-auto mt-3 max-w-sm leading-relaxed text-slate-600">
          Votre compte est actif. Retrouvez votre promotion, les activités de
          l’association et l’annuaire des membres.
        </p>

        <button
          onClick={close}
          type="button"
          className="mt-8 w-full rounded-2xl bg-aduti-primary px-8 py-3.5 font-bold text-white transition-colors hover:bg-aduti-primary-hover"
        >
          Explorer la plateforme
        </button>
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
