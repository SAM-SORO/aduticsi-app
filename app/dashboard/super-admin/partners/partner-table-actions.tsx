"use client";

import { useTransition, useState } from "react";
import { Trash2, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { togglePartner, deletePartner } from "./actions";

interface PartnerActionsProps {
  id: string;
  isActive: boolean;
  logoUrl: string;
}

export function PartnerTableActions({ id, isActive, logoUrl }: PartnerActionsProps) {
  const [isPendingToggle, startToggle] = useTransition();
  const [isPendingDelete, startDelete] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggle = () => {
    startToggle(async () => {
      try {
        await togglePartner(id, isActive);
        toast.success(isActive ? "Partenaire désactivé" : "Partenaire activé");
      } catch (error) {
        toast.error("Erreur lors de la modification");
      }
    });
  };

  const confirmDelete = () => {
    startDelete(async () => {
      try {
        await deletePartner(id, logoUrl);
        toast.success("Partenaire supprimé");
        setIsModalOpen(false);
      } catch (error) {
        toast.error("Erreur lors de la suppression");
      }
    });
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <button 
          onClick={handleToggle}
          disabled={isPendingToggle}
          className="text-slate-400 hover:text-[var(--aduti-primary)] transition-colors p-1 disabled:opacity-50" 
          title={isActive ? "Désactiver" : "Activer"}
        >
          {isActive ? (
            <EyeOff className="w-5 h-5" />
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          disabled={isPendingDelete}
          className="text-slate-400 hover:text-red-600 transition-colors p-1 disabled:opacity-50" 
          title="Supprimer"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Modern Delete Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-slate-100 flex flex-col pt-6 whitespace-normal">
            <div className="px-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-red-50/50">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Confirmer la suppression</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Êtes-vous sûr de vouloir supprimer ce partenaire ? Cette action est définitive et entraînera la perte de son logo.
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
