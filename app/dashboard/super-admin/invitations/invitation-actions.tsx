"use client";

import { useTransition, useState } from "react";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { deleteInvitation } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface InvitationActionsProps {
  id: string;
}

export function InvitationActions({ id }: InvitationActionsProps) {
  const [isPendingDelete, startDelete] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const confirmDelete = () => {
    startDelete(async () => {
      try {
        await deleteInvitation(id);
        toast.success("Lien d'invitation supprimé avec succès");
        setIsModalOpen(false);
      } catch {
        toast.error("Erreur lors de la suppression du lien");
      }
    });
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <button 
            disabled={isPendingDelete}
            className="w-full sm:w-auto flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
            title="Supprimer ce lien"
          >
            <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-white p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <DialogHeader className="p-0 border-none">
                <DialogTitle className="text-2xl font-bold text-slate-900">Confirmer la suppression</DialogTitle>
              </DialogHeader>
              <p className="text-slate-500 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer ce lien d&apos;invitation ? Cette action est définitive. Toute personne essayant d&apos;utiliser ce lien ne pourra plus s&apos;inscrire.
              </p>
            </div>

            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl text-slate-600 font-semibold"
                onClick={() => setIsModalOpen(false)}
                disabled={isPendingDelete}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-200"
                onClick={confirmDelete}
                disabled={isPendingDelete}
              >
                {isPendingDelete ? (
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
    </>
  );
}
