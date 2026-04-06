"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { X, Shuffle, CheckCircle, AlertTriangle, PartyPopper } from "lucide-react";
import confetti from "canvas-confetti";
import type { MemberLight } from "./actions";
import { createBinome } from "./actions";

// ─── Utilitaire shuffle ───────────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface BinomageDrawModalProps {
  promoCombo: string;
  parrains: MemberLight[];
  fieuls: MemberLight[];
  onClose: () => void;
  onBinomeDone: (parrainId: string, filleulId: string) => void;
  onAllDone: () => void;
}

type DrawState = "idle" | "suspense" | "revealed" | "saving";

// ─── Composant principal ──────────────────────────────────────────────────────

export function BinomageDrawModal({
  promoCombo,
  parrains: initialParrains,
  fieuls: initialFieuls,
  onClose,
  onBinomeDone,
  onAllDone,
}: BinomageDrawModalProps) {
  const [parrains, setParrains] = useState<MemberLight[]>(() => shuffle(initialParrains));
  const [fieuls, setFieuls] = useState<MemberLight[]>(() => shuffle(initialFieuls));
  const [parrainIndex, setParrainIndex] = useState(0);
  const [filleulIndex, setFilleulIndex] = useState(0);

  const [drawState, setDrawState] = useState<DrawState>("idle");
  const [currentParrain, setCurrentParrain] = useState<MemberLight | null>(null);
  const [currentFilleul, setCurrentFilleul] = useState<MemberLight | null>(null);
  const [totalDone, setTotalDone] = useState(0);
  const [error, setError] = useState<string | null>(null);
  // Quand true : tous les membres sont associés mais on attend le clic "Terminer"
  const [allPaired, setAllPaired] = useState(false);

  // filleuls >= parrains → parrains en cycle, filleul aléatoire
  // parrains > filleuls  → filleuls en cycle, parrain aléatoire
  const listFieulSuperiorOrEqual = initialFieuls.length >= initialParrains.length;
  const totalToProcess = listFieulSuperiorOrEqual ? initialFieuls.length : initialParrains.length;

  const isProcessing = useRef(false);

  // Animation "Bouquet de joie"
  const firePairConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 99999,
      colors: ["#3b82f6", "#f97316", "#10b981", "#8b5cf6", "#ec4899", "#eab308"],
    });
  };

  const fireEndConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const colors = ["#3b82f6", "#f97316", "#10b981", "#8b5cf6", "#ec4899", "#eab308"];

    const frame = () => {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
        zIndex: 99999,
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
        zIndex: 99999,
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleDraw = useCallback(async () => {
    if (isProcessing.current) return;
    isProcessing.current = true;
    setError(null);

    // Phase suspense : masque les résultats précédents et met les images de suspense
    setDrawState("suspense");
    setCurrentParrain(null);
    setCurrentFilleul(null);

    // 2 secondes d'effet suspense
    await new Promise<void>((r) => setTimeout(r, 2000));

    let parrain: MemberLight;
    let filleul: MemberLight;

    if (listFieulSuperiorOrEqual) {
      parrain = parrains[parrainIndex % parrains.length];
      const randIdx = Math.floor(Math.random() * fieuls.length);
      filleul = fieuls[randIdx];

      setCurrentParrain(parrain);
      setCurrentFilleul(filleul);
      setDrawState("saving");

      const result = await createBinome(parrain.id, filleul.id, promoCombo);
      if (!result.success) {
        setError(result.error ?? "Erreur lors de l'enregistrement");
        setDrawState("revealed");
        isProcessing.current = false;
        return;
      }

      const newFieuls = fieuls.filter((_, i) => i !== randIdx);
      setFieuls(newFieuls);
      setParrainIndex((prev) => (prev + 1) % parrains.length);
      const newTotal = totalDone + 1;
      setTotalDone(newTotal);
      onBinomeDone(parrain.id, filleul.id);

      setDrawState("revealed");
      firePairConfetti();

      // Tous associés → on reste sur "revealed", on affiche juste le badge "terminé"
      if (newFieuls.length === 0) {
        setAllPaired(true);
        fireEndConfetti();
        isProcessing.current = false;
        return;
      }
    } else {
      filleul = fieuls[filleulIndex % fieuls.length];
      const randIdx = Math.floor(Math.random() * parrains.length);
      parrain = parrains[randIdx];

      setCurrentParrain(parrain);
      setCurrentFilleul(filleul);
      setDrawState("saving");

      const result = await createBinome(parrain.id, filleul.id, promoCombo);
      if (!result.success) {
        setError(result.error ?? "Erreur lors de l'enregistrement");
        setDrawState("revealed");
        isProcessing.current = false;
        return;
      }

      const newParrains = parrains.filter((_, i) => i !== randIdx);
      setParrains(newParrains);
      setFilleulIndex((prev) => (prev + 1) % fieuls.length);
      const newTotal = totalDone + 1;
      setTotalDone(newTotal);
      onBinomeDone(parrain.id, filleul.id);

      setDrawState("revealed");
      firePairConfetti();

      // Tous associés → on reste sur "revealed", on affiche juste le badge "terminé"
      if (newParrains.length === 0) {
        setAllPaired(true);
        fireEndConfetti();
        isProcessing.current = false;
        return;
      }
    }

    isProcessing.current = false;
  }, [
    parrains,
    fieuls,
    parrainIndex,
    filleulIndex,
    totalDone,
    listFieulSuperiorOrEqual,
    promoCombo,
    onBinomeDone,
  ]);

  const handleTerminer = () => {
    onAllDone();
    onClose();
  };

  const isSuspense = drawState === "suspense";
  const isSaving = drawState === "saving";
  const isRevealed = drawState === "revealed" || isSaving;

  const remaining = listFieulSuperiorOrEqual ? fieuls.length : parrains.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-3 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[96vh]">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-8 py-5 bg-gradient-to-r from-[var(--aduti-primary)] to-indigo-600 text-white shrink-0">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">🎉 Tirage du Binomage</h2>
            <p className="text-sm text-white/70 mt-0.5">Promotion {promoCombo}</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Compteur */}
            <div className="text-center bg-white/20 rounded-2xl px-4 py-2">
              <p className="text-2xl font-extrabold leading-none">{totalDone}</p>
              <p className="text-[10px] text-white/70 uppercase tracking-widest">/ {totalToProcess} paires</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 transition-colors"
              type="button"
              title="Fermer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* ── Zone principale ── */}
        <div className="flex-1 overflow-y-auto px-8 py-10">

          {/* ── Cartes du tirage ── */}
          <div className="flex items-center justify-center gap-6 sm:gap-10">

            {/* Parrain */}
            <BigAvatarCard
              label="Parrain / Marraine"
              promoName={isRevealed && currentParrain ? currentParrain.promo_name : null}
              member={isRevealed ? currentParrain : null}
              isSuspense={isSuspense}
              gradient="from-blue-500 to-indigo-600"
              ringColor="ring-blue-400"
            />

            {/* Icône centrale */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl text-3xl transition-all ${
                  isSuspense
                    ? "bg-slate-100 animate-pulse scale-90"
                    : isRevealed
                    ? "bg-[var(--aduti-primary)]/10 scale-110"
                    : "bg-slate-100"
                }`}
              >
                🔗
              </div>
              {isRevealed && !isSuspense && (
                <p className="text-[10px] font-bold text-[var(--aduti-primary)] uppercase tracking-widest animate-bounce">
                  Binôme !
                </p>
              )}
            </div>

            {/* Filleul */}
            <BigAvatarCard
              label="Filleul / Filleule"
              promoName={isRevealed && currentFilleul ? currentFilleul.promo_name : null}
              member={isRevealed ? currentFilleul : null}
              isSuspense={isSuspense}
              gradient="from-orange-400 to-pink-500"
              ringColor="ring-orange-400"
            />
          </div>

          {/* ── Erreur ── */}
          {error && (
            <div className="mt-6 flex items-center gap-2 text-red-600 bg-red-50 px-5 py-3 rounded-xl text-sm border border-red-200">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          {/* ── Badge "Terminé" ── */}
          {allPaired && (
            <div className="mt-8 flex flex-col items-center gap-2 animate-fade-in">
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-5 py-2.5 rounded-full font-bold text-sm">
                <CheckCircle className="w-5 h-5" />
                Tous les membres ont été associés !
              </div>
            </div>
          )}

          {/* ── Info restants ── */}
          {!allPaired && (
            <p className="mt-6 text-center text-xs text-slate-400 font-medium">
              {listFieulSuperiorOrEqual
                ? `${remaining} filleul(s) restant(s)`
                : `${remaining} parrain(s) restant(s)`}
            </p>
          )}
        </div>

        {/* ── Footer bouton ── */}
        <div className="shrink-0 px-8 py-5 border-t border-slate-100 flex justify-center bg-white">
          {allPaired ? (
            /* Bouton "Terminer" — affiché seulement au clic, laisse l'admin montrer le résultat */
            <button
              onClick={handleTerminer}
              className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-extrabold text-lg rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all"
            >
              <PartyPopper className="w-6 h-6" />
              Terminer le binomage
            </button>
          ) : (
            <button
              onClick={handleDraw}
              disabled={isSuspense || isSaving}
              className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-[var(--aduti-primary)] to-indigo-600 text-white font-extrabold text-lg rounded-2xl shadow-xl hover:shadow-2xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              <Shuffle
                className={`w-6 h-6 ${isSuspense ? "animate-spin" : ""}`}
              />
              {isSuspense
                ? "Tirage en cours…"
                : isSaving
                ? "Enregistrement…"
                : drawState === "revealed"
                ? "Paire suivante →"
                : "🎲 Lancer le tirage"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── BigAvatarCard ────────────────────────────────────────────────────────────

function BigAvatarCard({
  label,
  promoName,
  member,
  isSuspense,
  gradient,
  ringColor,
}: {
  label: string;
  promoName: string | null;
  member: MemberLight | null;
  isSuspense: boolean;
  gradient: string;
  ringColor: string;
}) {
  const isVisible = !isSuspense && member !== null;

  return (
    <div className="flex flex-col items-center gap-4 w-40 sm:w-52">

      {/* Grand cercle avatar */}
      <div
        className={`relative w-36 h-36 sm:w-48 sm:h-48 rounded-full overflow-hidden border-4 border-white shadow-2xl ring-4 ${ringColor} bg-gradient-to-br ${gradient} transition-all duration-500 ${
          isSuspense ? "animate-pulse scale-95" : isVisible ? "scale-100" : "scale-90 opacity-60"
        }`}
      >
        {isSuspense ? (
          /* Image de suspense qui tourne */
          <Image
            src="/images/suspence_image.png"
            alt="Suspense"
            fill
            className="object-cover animate-spin"
            style={{ animationDuration: "0.8s" }}
          />
        ) : member?.photo_url ? (
          <Image
            src={member.photo_url}
            alt={member.name}
            fill
            className="object-cover transition-opacity duration-300"
          />
        ) : member ? (
          <span className="absolute inset-0 flex items-center justify-center text-5xl sm:text-6xl font-extrabold text-white">
            {member.name.slice(0, 1).toUpperCase()}
          </span>
        ) : (
          /* État initial */
          <Image
            src="/images/suspence_image.png"
            alt="En attente"
            fill
            className="object-cover opacity-30"
          />
        )}
      </div>

      {/* Étiquette rôle */}
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center">
        {label}
      </p>

      {/* Nom + promo — visible après révélation */}
      <div className="text-center min-h-[2.5rem]">
        {isVisible && (
          <div className="animate-fade-in">
            <p className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight line-clamp-2">
              {member!.name}
            </p>
            {promoName && (
              <span className="inline-block mt-1 text-[10px] bg-[var(--aduti-primary)]/10 text-[var(--aduti-primary)] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider">
                {promoName}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
