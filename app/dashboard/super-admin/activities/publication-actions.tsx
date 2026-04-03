"use client";

import { useTransition, useState } from "react";
import { Trash2, AlertTriangle, Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";

import { PublicationForm } from "./publication-form";
import { deletePublication } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { Publication } from "@/types";

interface PublicationActionsProps {
  publication: Publication;
  promoId: string;
  activityId: string;
}

export function PublicationActions({ publication, activityId }: Omit<PublicationActionsProps, 'promoId'>) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  const publicationId = publication.id;

  const handleDelete = async () => {
    startDeleteTransition(async () => {
      try {
        const result = await deletePublication(publicationId);
        if (result.success) {
          toast.success("Publication supprimée !");
          setIsDeleteDialogOpen(false);
        } else {
          toast.error(result.error || "Erreur lors de la suppression.");
        }
      } catch {
        toast.error("Erreur de communication avec le serveur.");
      }
    });
  };

  return (
    <div className="flex items-center gap-1">
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full bg-white/80 backdrop-blur shadow-sm text-slate-600 hover:text-[var(--aduti-primary)] hover:bg-white transition-all"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-[2rem]">
          <DialogHeader>
            <DialogTitle>Modifier la publication</DialogTitle>
          </DialogHeader>
          <PublicationForm 
            publication={publication} 
            activityId={activityId} 
            onSuccess={() => setIsEditDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full bg-white/80 backdrop-blur shadow-sm text-red-500 hover:text-red-600 hover:bg-white transition-all"
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Supprimer la publication</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Voulez-vous vraiment supprimer cette publication de l&apos;album ?
              </p>
              
              <div className="flex gap-3 mt-8">
                <Button
                  variant="outline"
                  className="flex-1 h-12 rounded-xl text-slate-600 font-semibold"
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
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Supprimer"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
