"use client";

import { useState, useTransition, useCallback } from "react";
import Image from "next/image";
import {
  Handshake,
  Link2,
  ChevronDown,
  RotateCcw,
  Shuffle,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import type { MemberLight, BinomePair, PromoCombo } from "./actions";
import {
  getParrainsByCombo,
  getFieulsByCombo,
  getBinomesForCombo,
  reinitializeBinomage,
  getBinomageStats,
} from "./actions";
import { BinomageDrawModal } from "./BinomageDrawModal";

interface BinomagePageClientProps {
  combos: PromoCombo[];
}

type Tab = "binomes" | "parrains" | "fieuls";

type ComboData = {
  parrains: MemberLight[];
  fieuls: MemberLight[];
  binomes: BinomePair[];
  stats: {
    totalParrains: number;
    totalFieuls: number;
    totalBinomes: number;
    parrainsNonBinomes: number;
    fieulsNonBinomes: number;
  };
};

export function BinomagePageClient({ combos }: BinomagePageClientProps) {
  const [selectedCombo, setSelectedCombo] = useState<PromoCombo | null>(null);
  const [comboData, setComboData] = useState<ComboData | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("binomes");
  const [isDrawModalOpen, setIsDrawModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const [isResetting, startResetTransition] = useTransition();
  const [resetConfirm, setResetConfirm] = useState(false);

  const loadCombo = useCallback((combo: PromoCombo) => {
    setSelectedCombo(combo);
    setIsDropdownOpen(false);
    setActiveTab("binomes");
    setComboData(null);
    setResetConfirm(false);

    startTransition(async () => {
      const [parrains, fieuls, binomes, stats] = await Promise.all([
        getParrainsByCombo(combo.parrain_promo_id),
        getFieulsByCombo(combo.filleul_promo_id),
        getBinomesForCombo(combo.label),
        getBinomageStats(combo.label, combo.parrain_promo_id, combo.filleul_promo_id),
      ]);
      setComboData({ parrains, fieuls, binomes, stats });
    });
  }, []);

  const refreshData = useCallback(() => {
    if (!selectedCombo) return;
    startTransition(async () => {
      const [binomes, stats] = await Promise.all([
        getBinomesForCombo(selectedCombo.label),
        getBinomageStats(
          selectedCombo.label,
          selectedCombo.parrain_promo_id,
          selectedCombo.filleul_promo_id
        ),
      ]);
      setComboData((prev) => (prev ? { ...prev, binomes, stats } : null));
    });
  }, [selectedCombo]);

  const handleReset = useCallback(() => {
    if (!selectedCombo) return;
    startResetTransition(async () => {
      await reinitializeBinomage(selectedCombo.label);
      setResetConfirm(false);
      loadCombo(selectedCombo);
    });
  }, [selectedCombo, loadCombo]);

  const nonBinomedParrains =
    comboData?.parrains.filter(
      (p) => !comboData.binomes.some((b) => b.parrain.id === p.id)
    ) ?? [];
  const nonBinomedFieuls =
    comboData?.fieuls.filter(
      (f) => !comboData.binomes.some((b) => b.filleul.id === f.id)
    ) ?? [];

  const canDraw =
    comboData !== null &&
    nonBinomedParrains.length > 0 &&
    nonBinomedFieuls.length > 0;

  return (
    <div className="space-y-6">
      {/* Titre */}
      {/* <div className="flex flex-col gap-1">
        <h2 className="text-2xl font-bold text-slate-900">Binomage</h2>
        <p className="text-slate-500">
          Association parrain / filleul entre promotions consécutives.
        </p>
      </div> */}

      {/* Sélecteur de combo */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">
          Sélectionner une promotion combinée
        </label>

        {combos.length === 0 ? (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-3 rounded-lg text-sm border border-amber-200">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Aucune combinaison de promotions consécutives trouvée. Vérifiez que vous avez
            au moins deux promotions dont les noms commencent par des numéros consécutifs.
          </div>
        ) : (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen((v) => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-left hover:border-[var(--aduti-primary)]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="p-1.5 bg-[var(--aduti-primary)]/10 rounded-lg">
                  <Link2 className="w-4 h-4 text-[var(--aduti-primary)]" />
                </span>
                <span className="font-semibold text-slate-800">
                  {selectedCombo
                    ? `${selectedCombo.parrain_promo_name} → ${selectedCombo.filleul_promo_name}`
                    : "Choisir un combo de promos…"}
                </span>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-20 overflow-hidden">
                {combos.map((combo) => (
                  <button
                    key={combo.label}
                    type="button"
                    onClick={() => loadCombo(combo)}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 text-left transition-colors ${
                      selectedCombo?.label === combo.label
                        ? "bg-[var(--aduti-primary)]/5"
                        : ""
                    }`}
                  >
                    <span className="p-1.5 bg-[var(--aduti-primary)]/10 rounded-lg">
                      <Link2 className="w-4 h-4 text-[var(--aduti-primary)]" />
                    </span>
                    <div>
                      <p className="font-semibold text-slate-800">
                        {combo.parrain_promo_name}{" "}
                        <span className="text-slate-400">→</span>{" "}
                        {combo.filleul_promo_name}
                      </p>
                      <p className="text-xs text-slate-400">Binomage {combo.label}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message sélection initiale */}
      {!selectedCombo && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="relative w-16 h-16 opacity-30">
            <Image src="/images/suspence_image.png" alt="Sélectionner" fill className="object-contain" />
          </div>
          <p className="text-slate-400 text-sm">Sélectionnez une promotion combinée pour afficher les binômes.</p>
        </div>
      )}

      {/* Vue combo sélectionné */}
      {selectedCombo && (
        <div className="space-y-4">
          {isLoading && !comboData ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--aduti-primary)]" />
            </div>
          ) : comboData ? (
            <>
              {/* Statistiques */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <StatCard label="Parrains" value={comboData.stats.totalParrains} color="blue" />
                <StatCard label="Filleuls" value={comboData.stats.totalFieuls} color="orange" />
                <StatCard label="Binômes" value={comboData.stats.totalBinomes} color="green" />
                <StatCard label="Parrains libres" value={comboData.stats.parrainsNonBinomes} color="slate" />
                <StatCard label="Filleuls libres" value={comboData.stats.fieulsNonBinomes} color="slate" />
              </div>

              {/* Barre d'actions */}
              <div className="flex flex-wrap gap-3 items-center justify-between bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {selectedCombo.parrain_promo_name} → {selectedCombo.filleul_promo_name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {comboData.binomes.length} paire(s) enregistrée(s)
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={refreshData}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-3 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
                    Actualiser
                  </button>

                  {comboData.binomes.length > 0 && (
                    <>
                      {resetConfirm ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setResetConfirm(false)}
                            className="px-3 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                          >
                            Annuler
                          </button>
                          <button
                            type="button"
                            onClick={handleReset}
                            disabled={isResetting}
                            className="flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                          >
                            {isResetting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <RotateCcw className="w-4 h-4" />
                            )}
                            Confirmer la réinitialisation
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setResetConfirm(true)}
                          className="flex items-center gap-2 px-3 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Réinitialiser
                        </button>
                      )}
                    </>
                  )}

                  {canDraw && (
                    <button
                      type="button"
                      onClick={() => setIsDrawModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--aduti-primary)] to-indigo-600 text-white rounded-lg text-sm font-bold shadow hover:shadow-lg transition-all"
                    >
                      <Shuffle className="w-4 h-4" />
                      Lancer le binomage
                    </button>
                  )}
                </div>
              </div>

              {/* Onglets */}
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-200">
                  {(["binomes", "parrains", "fieuls"] as Tab[]).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 px-4 py-3 text-sm font-semibold transition-colors ${
                        activeTab === tab
                          ? "border-b-2 border-[var(--aduti-primary)] text-[var(--aduti-primary)] bg-[var(--aduti-primary)]/5"
                          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                      }`}
                    >
                      {tab === "binomes"
                        ? `Binômes (${comboData.binomes.length})`
                        : tab === "parrains"
                        ? `Parrains (${comboData.parrains.length})`
                        : `Filleuls (${comboData.fieuls.length})`}
                    </button>
                  ))}
                </div>

                <div className="p-4">
                  {activeTab === "binomes" && (
                    <BinomesTab binomes={comboData.binomes} />
                  )}
                  {activeTab === "parrains" && (
                    <MembersTab
                      members={comboData.parrains}
                      binomedIds={comboData.binomes.map((b) => b.parrain.id)}
                      label="parrain"
                    />
                  )}
                  {activeTab === "fieuls" && (
                    <MembersTab
                      members={comboData.fieuls}
                      binomedIds={comboData.binomes.map((b) => b.filleul.id)}
                      label="filleul"
                    />
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Modal de tirage */}
      {isDrawModalOpen && selectedCombo && comboData && (
        <BinomageDrawModal
          promoCombo={selectedCombo.label}
          parrains={nonBinomedParrains}
          fieuls={nonBinomedFieuls}
          onClose={() => {
            setIsDrawModalOpen(false);
            refreshData();
          }}
          onBinomeDone={() => {}}
          onAllDone={() => {
            setIsDrawModalOpen(false);
            refreshData();
          }}
        />
      )}
    </div>
  );
}

// ─── Sous-composants ──────────────────────────────────────────────────────────


function BinomesTab({ binomes }: { binomes: BinomePair[] }) {
  if (binomes.length === 0) {
    return (
      <EmptyState message="Aucun bnomage effectué. Lancez le tirage pour associer les membres." />
    );
  }

  return (
    <div className="space-y-3">
      {binomes.map((b) => (
        <div
          key={b.id}
          className="flex items-center gap-3 sm:gap-6 p-3 rounded-xl border border-slate-100 hover:border-[var(--aduti-primary)]/20 hover:bg-[var(--aduti-primary)]/5 transition-all"
        >
          <MemberChip member={b.parrain} badge="Parrain" badgeColor="blue" />
          <div className="flex-1 flex items-center justify-center">
            <Handshake className="w-5 h-5 text-[var(--aduti-primary)]" />
          </div>
          <MemberChip member={b.filleul} badge="Filleul" badgeColor="orange" />
        </div>
      ))}
    </div>
  );
}

function MembersTab({
  members,
  binomedIds,
  label,
}: {
  members: MemberLight[];
  binomedIds: string[];
  label: string;
}) {
  const binomedSet = new Set(binomedIds);

  if (members.length === 0) {
    return <EmptyState message={`Aucun ${label} dans cette promotion.`} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {members.map((m) => {
        const isBinomed = binomedSet.has(m.id);
        return (
          <div
            key={m.id}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
              isBinomed
                ? "border-green-200 bg-green-50"
                : "border-slate-200 hover:border-[var(--aduti-primary)]/30"
            }`}
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[var(--aduti-primary)] to-indigo-500 shrink-0">
              {m.photo_url ? (
                <Image src={m.photo_url} alt={m.name} fill className="object-cover" />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
                  {m.name.slice(0, 1).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{m.name}</p>
              <p className="text-xs text-slate-400 truncate">{m.promo_name}</p>
            </div>
            {isBinomed && (
              <span className="text-green-600 shrink-0 text-xs font-semibold bg-green-100 px-2 py-0.5 rounded-full">
                Binômé
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function MemberChip({
  member,
  badge,
  badgeColor,
}: {
  member: MemberLight;
  badge: string;
  badgeColor: "blue" | "orange";
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="flex flex-col items-center gap-1.5 w-28 sm:w-36">
      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-slate-300 to-slate-400 shadow">
        {member.photo_url ? (
          <Image src={member.photo_url} alt={member.name} fill className="object-cover" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
            {member.name.slice(0, 1).toUpperCase()}
          </span>
        )}
      </div>
      <p className="text-xs font-bold text-slate-800 text-center line-clamp-1">{member.name}</p>
      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${colorMap[badgeColor]}`}>
        {badge}
      </span>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "blue" | "orange" | "green" | "slate";
}) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600",
    slate: "bg-slate-50 text-slate-600",
  };

  return (
    <div className={`rounded-xl p-4 ${colorMap[color]} flex flex-col gap-1`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs font-semibold opacity-70">{label}</p>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center gap-4 py-12 text-center">
      <div className="relative w-20 h-20 opacity-40">
        <Image src="/images/suspence_image.png" alt="Vide" fill className="object-contain" />
      </div>
      <p className="text-slate-500 text-sm max-w-sm">{message}</p>
    </div>
  );
}
