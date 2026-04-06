"use client";

import { useState, useTransition } from "react";
import { Edit2, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deletePromotion } from "./actions";
import { PromotionForm } from "./promotion-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PromotionTableActionsProps {
  promotion: {
    id: string;
    name: string;
    is_current_promo: boolean;
  };
}

export function PromotionTableActions({ promotion }: PromotionTableActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleDelete = async () => {
    startDeleteTransition(async () => {
      const result = await deletePromotion(promotion.id);
      if (result.success) {
        toast.success("Promotion supprimée !");
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(result.error || "Erreur lors de la suppression.");
      }
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-[var(--aduti-primary)]">
            <Edit2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Modifier la promotion</DialogTitle>
          </DialogHeader>
          <PromotionForm 
            promotion={promotion} 
            onSuccess={() => setIsEditDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500">
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-white p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <DialogTitle className="text-2xl font-bold text-slate-900">Confirmer la suppression</DialogTitle>
              <p className="text-slate-500 leading-relaxed whitespace-normal">
                Voulez-vous vraiment supprimer la promotion <span className="font-bold text-slate-900">&quot;{promotion.name}&quot;</span> ? 
                Cette action est définitive et supprimera tous les membres associés.
              </p>
            </div>

            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isDeleting}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-200"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  "Oui, supprimer"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
