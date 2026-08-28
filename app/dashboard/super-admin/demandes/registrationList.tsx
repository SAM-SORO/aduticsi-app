"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Check, X, Calendar } from "lucide-react";
import type { Prisma } from "@prisma/client";

import { MaterialIcon } from "@/components/icons/material-icon";
import { approveMember, rejectMember } from "./actions";

type Registration = Prisma.MemberGetPayload<{ include: { promotion: true } }>;

interface RegistrationsListProps {
  registrations: Registration[];
}

export function RegistrationsList({ registrations: initialRegistrations }: RegistrationsListProps) {
  const [registrations, setRegistrations] = useState(initialRegistrations);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function getInitials(m: Registration) {
    const f = m.first_name?.[0] || "";
    const l = m.last_name?.[0] || "";
    return (f + l).toUpperCase() || "?";
  }

  const handleApprove = (id: string) => {
    setPendingId(id);
    startTransition(async () => {
      const result = await approveMember(id);
      if (result.success) {
        toast.success("Membre approuvé avec succès.");
        setRegistrations((prev) => prev.filter((r) => r.id !== id));
      } else {
        toast.error(result.error || "Une erreur est survenue.");
      }
      setPendingId(null);
    });
  };

  const handleReject = (id: string) => {
    setPendingId(id);
    startTransition(async () => {
      const result = await rejectMember(id);
      if (result.success) {
        toast.success("Demande refusée.");
        setRegistrations((prev) => prev.filter((r) => r.id !== id));
      } else {
        toast.error(result.error || "Une erreur est survenue.");
      }
      setPendingId(null);
    });
  };

  if (registrations.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-100 p-16 text-center">
        <MaterialIcon name="inbox" className="w-12 h-12 text-slate-300 mb-4 block mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 mb-1">Aucune demande en attente</h3>
        <p className="text-sm text-slate-500">Toutes les demandes ont été traitées.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-700">
      {registrations.map((m) => {
        const isThisPending = isPending && pendingId === m.id;

        return (
          <div
            key={m.id}
            className="bg-white rounded-3xl border border-slate-100 p-5 hover:shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-all duration-200 flex flex-col sm:flex-row sm:items-center gap-5"
          >
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full p-1 bg-slate-50 shadow-sm shrink-0 mx-auto sm:mx-0">
              {m.photo_url ? (
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-slate-100 relative">
                  <Image src={m.photo_url} alt={`${m.first_name} ${m.last_name}`} fill className="object-cover" />
                </div>
              ) : (
                <div className="w-full h-full rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg">
                  {getInitials(m)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap mb-1">
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {m.last_name?.toUpperCase()} {m.first_name}
                </h3>
                {m.gender === "FEMALE" && <MaterialIcon name="female" className="w-4 h-4 text-rose-400 shrink-0" />}
                {m.gender === "MALE" && <MaterialIcon name="male" className="w-4 h-4 text-blue-400 shrink-0" />}
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    m.status === "ALUMNI"
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : "bg-blue-50 text-blue-600 border border-blue-100"
                  }`}
                >
                  {m.status === "ALUMNI" ? "Alumni" : "Étudiant"}
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500 truncate">{m.email}</p>
              <div className="flex items-center justify-center sm:justify-start gap-3 mt-2 text-xs text-slate-400">
                <span className="font-medium uppercase tracking-widest bg-slate-50 px-2 py-1 rounded">
                  {m.promotion.name}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(m.created_at).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 justify-center sm:justify-end shrink-0">
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleApprove(m.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isThisPending ? (
                  <div className="h-3.5 w-3.5 border-2 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                Approuver
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => handleReject(m.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isThisPending ? (
                  <div className="h-3.5 w-3.5 border-2 border-rose-600/30 border-t-rose-600 rounded-full animate-spin" />
                ) : (
                  <X className="w-3.5 h-3.5" />
                )}
                Refuser
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}