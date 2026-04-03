"use client";

import { useState, useTransition } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Pencil,
  Briefcase,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import type { Poste } from "@prisma/client";

import { getPostes, deletePoste } from "./actions";
import { PosteForm } from "./poste-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


interface PostesContentProps {
  initialPostes: Poste[];
}

export function PostesContent({ initialPostes }: PostesContentProps) {
  const [postes, setPostes] = useState<Poste[]>(initialPostes);
  const [isLoading, setIsLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPoste, setEditingPoste] = useState<Poste | null>(null);
  const [deletingPoste, setDeletingPoste] = useState<Poste | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchPostes = async () => {
    setIsLoading(true);
    const data = await getPostes();
    setPostes(data as Poste[]);
    setIsLoading(false);
  };

  const handleDelete = () => {
    if (!deletingPoste) return;
    startTransition(async () => {
      const result = await deletePoste(deletingPoste.id);
      if (result.success) {
        toast.success("Poste supprimé !");
        setDeletingPoste(null);
        fetchPostes();
      } else {
        toast.error(result.error);
      }
    });
  };

  const filteredPostes = postes.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header card within the content */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Postes du Bureau
          </h1>
          <p className="text-slate-500 font-medium">
            Gérez les rôles officiels au sein de l&apos;association.
          </p>
        </div>

        <Button 
          onClick={() => {
            setEditingPoste(null);
            setIsFormOpen(true);
          }}
          className="bg-[var(--aduti-primary)] hover:bg-blue-600 text-white rounded-2xl h-12 px-6 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] font-bold text-sm gap-2"
        >
          <Plus className="w-4 h-4" />
          Ajouter un poste
        </Button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {/* Search Bar Area */}
        <div className="p-6 border-b border-slate-50">
          <div className="relative max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[var(--aduti-primary)] transition-colors" />
            <Input
              placeholder="Rechercher un poste..."
              className="pl-12 h-11 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-[var(--aduti-primary)]/20 shadow-none text-sm transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table/List Area */}
        <div className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--aduti-primary)]" />
              <p className="font-bold uppercase tracking-widest text-[10px]">Chargement des postes...</p>
            </div>
          ) : filteredPostes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-center px-10">
              <div className="p-5 rounded-full bg-slate-50 mb-4">
                <Briefcase className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">Aucun poste trouvé</h3>
              <p className="text-sm max-w-xs mx-auto text-slate-400">
                {search ? `La recherche "${search}" ne correspond à aucun poste.` : "Commencez par ajouter le premier poste du bureau."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Nom du Poste</th>
                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Créé le</th>
                    <th className="px-8 py-4 text-right border-b border-slate-100"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPostes.map((poste) => (
                    <tr key={poste.id} className="group hover:bg-slate-50/30 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[var(--aduti-primary)] font-bold shadow-sm border border-blue-100/30">
                            {poste.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-900">{poste.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-slate-500 font-medium text-sm">
                        {new Date(poste.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-9 w-9 p-0 hover:bg-white hover:shadow-md rounded-xl transition-all">
                              <MoreVertical className="h-4 w-4 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl p-2 border-slate-100">
                             <DropdownMenuItem 
                                onClick={() => {
                                  setEditingPoste(poste);
                                  setIsFormOpen(true);
                                }}
                                className="rounded-xl h-10 cursor-pointer gap-3 font-semibold text-slate-700 text-sm"
                             >
                                <Pencil className="w-4 h-4 text-slate-400" />
                                Modifier
                             </DropdownMenuItem>
                             <DropdownMenuItem 
                                onClick={() => setDeletingPoste(poste)}
                                className="rounded-xl h-10 text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer gap-3 font-semibold text-sm"
                             >
                                <Trash2 className="w-4 h-4" />
                                Supprimer
                             </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Dialog: Add/Edit Form */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-[2rem] p-8 border-none shadow-2xl">
          <DialogHeader className="space-y-2 text-left">
            <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">
              {editingPoste ? "Modifier le poste" : "Créer un poste"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium leading-relaxed">
              Définissez le nom du rôle tel qu&apos;il apparaîtra sur le site.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <PosteForm 
              poste={editingPoste || undefined} 
              onSuccess={() => {
                setIsFormOpen(false);
                fetchPostes();
              }} 
            />
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Delete Confirmation */}
      <Dialog open={!!deletingPoste} onOpenChange={(open) => !open && setDeletingPoste(null)}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem]">
          <div className="bg-white p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center text-red-500 mb-2">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <DialogHeader className="p-0 border-none">
                <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">Supprimer le poste</DialogTitle>
              </DialogHeader>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">
                Voulez-vous vraiment supprimer le poste <span className="font-bold text-slate-900">&quot;{deletingPoste?.name}&quot;</span> ?
                Cette action est irréversible.
              </p>
            </div>

            <div className="flex gap-3 mt-10">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-2xl text-slate-600 font-bold border-slate-200 hover:bg-slate-50 transition-all"
                onClick={() => setDeletingPoste(null)}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                className="flex-1 h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-100 transition-all hover:scale-[1.02]"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? (
                   <Loader2 className="h-5 w-5 animate-spin" />
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
