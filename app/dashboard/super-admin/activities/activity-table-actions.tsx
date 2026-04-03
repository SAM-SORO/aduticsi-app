"use client";

import { useState, useTransition } from "react";
import { Edit2, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { ActivityForm } from "./activity-form";
import { deleteActivity } from "./actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import type { Activity, Promotion } from "@/types";

interface ActivityTableActionsProps {
  activity: Activity;
  promotions: Promotion[] | { id: string; name: string }[];
}

export function ActivityTableActions({ activity, promotions }: ActivityTableActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, startDeleteTransition] = useTransition();

  const handleDelete = async () => {
    startDeleteTransition(async () => {
      const result = await deleteActivity(activity.id);
      if (result.success) {
        toast.success("Activité supprimée !");
        setIsDeleteDialogOpen(false);
      } else {
        toast.error("Erreur lors de la suppression.");
      }
    });
  };

  return (
    <div
      className="flex items-center gap-1"
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
    >
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
            <Edit2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier l&apos;activité</DialogTitle>
          </DialogHeader>
          <ActivityForm 
            activity={activity} 
            promotions={promotions}
            onSuccess={() => setIsEditDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <Trash2 className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-white p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <DialogHeader className="p-0 border-none">
                <DialogTitle className="text-2xl font-bold text-slate-900">Supprimer l&apos;activité</DialogTitle>
              </DialogHeader>
              <p className="text-slate-500 leading-relaxed">
                Voulez-vous vraiment supprimer <span className="font-bold text-slate-900">&quot;{activity.title}&quot;</span> ?
                Toutes les images associées seront également supprimées.
              </p>
            </div>

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
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  "Supprimer"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
