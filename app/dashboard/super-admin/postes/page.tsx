"use client";

import { useEffect, useState, useTransition } from "react";
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Trash2, 
  Pencil,
  Briefcase,
  AlertTriangle,
  Loader2,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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

import { getPostes, deletePoste } from "./actions";
import { PosteForm } from "./poste-form";

export default function PostesPage() {
  const [postes, setPostes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPoste, setEditingPoste] = useState<any>(null);
  const [deletingPoste, setDeletingPoste] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const fetchPostes = async () => {
    setIsLoading(true);
    const data = await getPostes();
    setPostes(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchPostes();
  }, []);

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
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-slate-400 mb-1">
             <Link href="/dashboard/super-admin/members" className="hover:text-[var(--aduti-primary)] transition-colors">
               Membres
             </Link>
             <span className="text-slate-300">/</span>
             <span className="text-slate-900 font-bold">Gestion des Postes</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <span className="w-2 h-10 bg-[var(--aduti-primary)] rounded-full" />
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
          className="bg-[var(--aduti-primary)] hover:bg-blue-600 text-white rounded-2xl h-14 px-8 shadow-lg shadow-blue-100 transition-all hover:scale-[1.02] active:scale-[0.98] font-bold text-base gap-3"
        >
          <Plus className="w-5 h-5" />
          Ajouter un poste
        </Button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden min-h-[500px]">
        {/* Search Bar Area */}
        <div className="p-6 border-b border-slate-50 bg-slate-50/30">
          <div className="relative max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[var(--aduti-primary)] transition-colors" />
            <Input
              placeholder="Rechercher un poste..."
              className="pl-12 h-12 rounded-2xl border-slate-100 bg-white focus:ring-2 focus:ring-[var(--aduti-primary)]/20 shadow-sm text-base"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Table/List Area */}
        <div className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[var(--aduti-primary)]" />
              <p className="font-bold uppercase tracking-widest text-xs">Chargement des postes...</p>
            </div>
          ) : filteredPostes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-slate-400 text-center px-10">
              <div className="p-6 rounded-full bg-slate-50 mb-4">
                <Briefcase className="w-12 h-12 text-slate-200" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Aucun poste trouvé</h3>
              <p className="max-w-xs mx-auto">
                {search ? `La recherche "${search}" ne correspond à aucun poste.` : "Commencez par ajouter le premier poste du bureau."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Nom du Poste</th>
                    <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Créé le</th>
                    <th className="px-8 py-4 text-right border-b border-slate-50"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredPostes.map((poste) => (
                    <tr key={poste.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[var(--aduti-primary)] font-bold shadow-sm border border-blue-100/50">
                            {poste.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-900 text-lg">{poste.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-slate-500 font-medium">
                        {new Date(poste.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        })}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-white hover:shadow-md rounded-xl transition-all">
                              <MoreVertical className="h-5 w-5 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-2xl p-2 border-slate-100">
                             <DropdownMenuItem 
                               onClick={() => {
                                 setEditingPoste(poste);
                                 setIsFormOpen(true);
                               }}
                               className="rounded-xl h-11 pointer cursor-pointer gap-3 font-semibold text-slate-700"
                             >
                                <Pencil className="w-4 h-4 text-slate-400" />
                                Modifier
                             </DropdownMenuItem>
                             <DropdownMenuItem 
                               onClick={() => setDeletingPoste(poste)}
                               className="rounded-xl h-11 text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer gap-3 font-semibold"
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
        <DialogContent className="sm:max-w-[450px] rounded-3xl p-8 border-none shadow-2xl">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">
              {editingPoste ? "Modifier le poste" : "Créer un nouveau poste"}
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium italic">
              Définissez le nom du rôle tel qu&apos;il apparaîtra sur le site.
            </DialogDescription>
          </DialogHeader>
          <PosteForm 
            poste={editingPoste} 
            onSuccess={() => {
              setIsFormOpen(false);
              fetchPostes();
            }} 
          />
        </DialogContent>
      </Dialog>

      {/* Dialog: Delete Confirmation */}
      <Dialog open={!!deletingPoste} onOpenChange={(open) => !open && setDeletingPoste(null)}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-white p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <DialogHeader className="p-0 border-none">
                <DialogTitle className="text-2xl font-bold text-slate-900 tracking-tight">Supprimer le poste</DialogTitle>
              </DialogHeader>
              <p className="text-slate-500 leading-relaxed font-medium">
                Voulez-vous vraiment supprimer le poste <span className="font-bold text-slate-900">&quot;{deletingPoste?.name}&quot;</span> ?
                Cette action ne peut pas être annulée.
              </p>
            </div>

            <div className="flex gap-3 mt-10">
              <Button
                variant="outline"
                className="flex-1 h-14 rounded-2xl text-slate-600 font-bold border-slate-200 hover:bg-slate-50 transition-all text-base"
                onClick={() => setDeletingPoste(null)}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                className="flex-1 h-14 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-100 transition-all hover:scale-[1.02] text-base"
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
