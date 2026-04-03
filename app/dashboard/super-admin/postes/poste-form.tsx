"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { createPoste, updatePoste } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PosteFormProps {
  poste?: { id: string; name: string };
  onSuccess?: () => void;
}

export function PosteForm({ poste, onSuccess }: PosteFormProps) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState(poste?.name || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    startTransition(async () => {
      const result = poste 
        ? await updatePoste(poste.id, name)
        : await createPoste(name);

      if (result.success) {
        toast.success(poste ? "Poste mis à jour !" : "Poste créé !");
        onSuccess?.();
      } else {
        toast.error(result.error || "Une erreur est survenue.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nom du poste</Label>
        <Input
          id="name"
          placeholder="Ex: Président, Secrétaire, etc."
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-[var(--aduti-primary)] hover:bg-blue-600 text-white min-w-[120px]"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {poste ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            poste ? "Mettre à jour" : "Créer le poste"
          )}
        </Button>
      </div>
    </form>
  );
}
