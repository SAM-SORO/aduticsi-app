"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createPromotion, updatePromotion } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";


interface PromotionFormProps {
  promotion?: {
    id: string;
    name: string;
    is_current_promo: boolean;
  };
  onSuccess?: () => void;
}

export function PromotionForm({ promotion, onSuccess }: PromotionFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!promotion;

  const [formData, setFormData] = useState({
    name: promotion?.name || "",
    is_current_promo: promotion?.is_current_promo || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const result = isEditing
        ? await updatePromotion(promotion!.id, formData)
        : await createPromotion(formData);

      if (result.success) {
        toast.success(isEditing ? "Promotion mise à jour !" : "Promotion créée !");
        onSuccess?.();
        router.refresh();
      } else {
        toast.error(result.error || "Une erreur est survenue.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nom de la promotion</Label>
          <Input
            id="name"
            placeholder="Ex: Promotion 2024-2026"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="is_current_promo"
            checked={formData.is_current_promo}
            onCheckedChange={(checked: boolean) => 
              setFormData({ ...formData, is_current_promo: checked === true })
            }
          />
          <Label 
            htmlFor="is_current_promo"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Définir comme promotion actuelle
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="submit"
          disabled={isPending}
          className="bg-[var(--aduti-primary)] hover:bg-blue-600 text-white"
        >
          {isPending ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Créer la promotion"}
        </Button>
      </div>
    </form>
  );
}
