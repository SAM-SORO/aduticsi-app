"use client";

import { useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createInvitation } from "./actions";
import { Button } from "@/components/ui/button";

interface InvitationFormProps {
  memberId: string;
}

export function InvitationForm({ memberId }: InvitationFormProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const expirationValue = formData.get("expirationValue") as string;
    const expirationUnit = formData.get("expirationUnit") as string;

    startTransition(async () => {
      const result = await createInvitation({
        title,
        expirationValue: Number(expirationValue),
        expirationUnit: expirationUnit as "days" | "months" | "years",
        created_by: memberId,
      });

      if (result.success) {
        toast.success("Lien d'invitation généré !");
        // Le revalidatePath dans l'action s'occupera de rafraîchir la liste
      } else {
        toast.error(result.error || "Une erreur est survenue.");
      }
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[var(--aduti-primary)]" />
          Nouveau lien d&apos;invitation
        </h3>
      </div>

      <form action={handleSubmit} className="p-5 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Titre / Description
          </label>
          <input
            type="text"
            name="title"
            required
            placeholder="ex: Rentrée 2024 - Général"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--aduti-primary)] focus:border-[var(--aduti-primary)] outline-none text-sm transition-all bg-slate-50 focus:bg-white"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">
            Durée de validité
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              name="expirationValue"
              required
              min="1"
              max="100"
              defaultValue="1"
              className="w-2/3 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--aduti-primary)] focus:border-[var(--aduti-primary)] outline-none text-sm transition-all bg-slate-50 focus:bg-white"
            />
            <select
              name="expirationUnit"
              className="w-1/3 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--aduti-primary)] focus:border-[var(--aduti-primary)] outline-none text-sm transition-all bg-slate-50 focus:bg-white"
            >
              <option value="days">Jour(s)</option>
              <option value="months">Mois</option>
              <option value="years">Année(s)</option>
            </select>
          </div>
          <p className="text-xs text-slate-500">
            Le lien expirera automatiquement après ce délai.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="w-full bg-[var(--aduti-primary)] text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 mt-2"
        >
          {isPending ? "Génération..." : "Générer le lien"}
        </Button>
      </form>
    </div>
  );
}
