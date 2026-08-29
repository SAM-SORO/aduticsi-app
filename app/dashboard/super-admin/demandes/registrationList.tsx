"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Calendar, ChevronRight } from "lucide-react";
import type { Prisma } from "@prisma/client";

import { approveMember, rejectMember } from "./actions";
import { MaterialIcon } from "@/components/icons/material-icon";
import { StatusPill } from "@/components/ui/status-pill";

type Registration = Prisma.MemberGetPayload<{ include: { promotion: true } }>;

interface RegistrationsListProps {
  registrations: Registration[];
}

function initials(m: Registration) {
  return `${m.last_name?.[0] ?? ""}${m.first_name?.[0] ?? ""}`.toUpperCase() || "?";
}

function formatDate(value: Date) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function RegistrationsList({ registrations: initialRegistrations }: RegistrationsListProps) {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [selected, setSelected] = useState<Registration | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function decide(id: string, action: "approve" | "reject") {
    setPendingId(id);
    startTransition(async () => {
      const result = action === "approve" ? await approveMember(id) : await rejectMember(id);
      if (result.success) {
        toast.success(
          action === "approve"
            ? "Demande approuvée. Un email de définition du mot de passe a été envoyé."
            : "Demande refusée."
        );
        setRegistrations((prev) => prev.filter((r) => r.id !== id));
        setSelected(null);
      } else {
        toast.error(result.error || "Une erreur est survenue.");
      }
      setPendingId(null);
    });
  }

  if (registrations.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-16 text-center">
        <MaterialIcon name="inbox" className="mx-auto mb-4 block size-12 text-slate-300" />
        <h3 className="mb-1 text-lg font-semibold text-slate-900">Aucune demande en attente</h3>
        <p className="text-sm text-slate-500">Toutes les demandes ont été traitées.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {registrations.map((m) => (
          <article
            key={m.id}
            className="group relative flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-slate-300 sm:flex-row sm:items-center"
          >
            <div className="relative mx-auto size-16 shrink-0 overflow-hidden rounded-full bg-slate-100 sm:mx-0">
              {m.photo_url ? (
                <Image src={m.photo_url} alt="" fill sizes="64px" className="object-cover" />
              ) : (
                <span className="flex size-full items-center justify-center text-base font-semibold text-slate-500">
                  {initials(m)}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1 text-center sm:text-left">
              <h3 className="truncate text-base font-semibold text-slate-900">
                {/* Lien étiré : toute la carte ouvre le détail, les boutons restent au-dessus. */}
                <button
                  type="button"
                  onClick={() => setSelected(m)}
                  className="outline-none after:absolute after:inset-0 after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-aduti-primary"
                >
                  {m.last_name?.toUpperCase()} {m.first_name}
                </button>
              </h3>
              <p className="truncate text-sm text-slate-500">{m.email}</p>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 sm:justify-start">
                <StatusPill tone={m.status === "ALUMNI" ? "accent" : "neutral"}>
                  {m.status === "ALUMNI" ? "Alumni" : "Étudiant"}
                </StatusPill>
                <span>Promo {m.promotion.name}</span>
                <span aria-hidden className="h-3 w-px bg-slate-200" />
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {formatDate(m.created_at)}
                </span>
              </div>
            </div>

            <div className="relative z-10 flex shrink-0 items-center justify-center gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setSelected(m)}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
              >
                Détails
                <ChevronRight className="size-4" />
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => decide(m.id, "approve")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-aduti-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-aduti-primary-hover disabled:opacity-50"
              >
                {isPending && pendingId === m.id ? (
                  <span className="size-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <Check className="size-3.5" />
                )}
                Approuver
              </button>
            </div>
          </article>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px]"
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label={`Demande de ${selected.last_name} ${selected.first_name}`}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200 bg-white"
            >
              <header className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
                <h2 className="text-base font-semibold text-slate-900">Demande d&apos;enregistrement</h2>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Fermer"
                  className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="size-4" />
                </button>
              </header>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex items-center gap-4">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                    {selected.photo_url ? (
                      <Image src={selected.photo_url} alt="" fill sizes="80px" className="object-cover" />
                    ) : (
                      <span className="flex size-full items-center justify-center text-lg font-semibold text-slate-500">
                        {initials(selected)}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-slate-900">
                      {selected.last_name?.toUpperCase()} {selected.first_name}
                    </p>
                    <p className="truncate text-sm text-slate-500">{selected.email}</p>
                  </div>
                </div>

                <dl className="mt-8 divide-y divide-slate-100 border-t border-slate-100">
                  {[
                    { label: "Promotion", value: selected.promotion.name },
                    { label: "Statut", value: selected.status === "ALUMNI" ? "Alumni" : "Étudiant" },
                    {
                      label: "Genre",
                      value:
                        selected.gender === "FEMALE"
                          ? "Féminin"
                          : selected.gender === "MALE"
                            ? "Masculin"
                            : "Non renseigné",
                    },
                    {
                      label: "Visibilité du profil",
                      value: selected.profile_status === "PRIVATE" ? "Privé" : "Public",
                    },
                    { label: "Téléphone", value: selected.phone || "Non renseigné" },
                    { label: "Poste actuel", value: selected.current_job_title || "Non renseigné" },
                    { label: "Photo", value: selected.photo_url ? "Fournie" : "Aucune" },
                    { label: "Demande reçue le", value: formatDate(selected.created_at) },
                  ].map((row) => (
                    <div key={row.label} className="flex items-start justify-between gap-4 py-3 text-sm">
                      <dt className="text-slate-500">{row.label}</dt>
                      <dd className="text-right font-medium text-slate-900">{row.value}</dd>
                    </div>
                  ))}
                </dl>

                {selected.description && (
                  <div className="mt-6">
                    <p className="mb-2 text-sm text-slate-500">Présentation</p>
                    <p className="whitespace-pre-line rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                      {selected.description}
                    </p>
                  </div>
                )}
              </div>

              <footer className="shrink-0 border-t border-slate-100 p-5">
                <p className="mb-4 text-xs leading-relaxed text-slate-500">
                  L&apos;approbation envoie au demandeur un email contenant un lien pour
                  définir son mot de passe.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => decide(selected.id, "reject")}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 disabled:opacity-50"
                  >
                    Refuser
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => decide(selected.id, "approve")}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-aduti-primary px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-aduti-primary-hover disabled:opacity-50"
                  >
                    {isPending && pendingId === selected.id && (
                      <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    )}
                    Approuver
                  </button>
                </div>
              </footer>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
