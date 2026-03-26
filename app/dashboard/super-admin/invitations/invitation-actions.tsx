"use client";

import { useTransition, useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { deleteInvitation } from "./actions";

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
      <button 
        onClick={() => setIsModalOpen(true)}
        disabled={isPendingDelete}
        className="w-full sm:w-auto flex items-center justify-center p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
        title="Supprimer ce lien"
      >
        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
      </button>

      {/* Modern Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 text-left">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100 flex flex-col pt-6 whitespace-normal">
            <div className="px-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-red-50/50">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Confirmer la suppression</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Êtes-vous sûr de vouloir supprimer ce lien d&apos;invitation ? Cette action est définitive. Toute personne essayant d&apos;utiliser ce lien ne pourra plus s&apos;inscrire.
              </p>
            </div>
            
            <div className="mt-8 flex border-t border-slate-100 bg-slate-50/50">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isPendingDelete}
                className="flex-1 py-4 text-sm font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors border-r border-slate-100 disabled:opacity-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                disabled={isPendingDelete}
                className="flex-1 py-4 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isPendingDelete ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-600/20 border-t-red-600 rounded-full animate-spin" />
                    Suppression...
                  </>
                ) : (
                  "Oui, supprimer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
