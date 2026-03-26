"use client";

import { useState, useTransition } from "react";
import { 
  MoreVertical, 
  ShieldCheck, 
  Trash2, 
  GraduationCap, 
  Briefcase,
  AlertTriangle,
  Loader2,
  Users2
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { updateMemberRole, updateMemberStatus, updateMemberPoste, updateMemberGender, deleteMember } from "./actions";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

interface MemberActionsProps {
  member: {
    id: string;
    name: string;
    role: "MEMBER" | "ADMIN" | "SUPER_ADMIN";
    status: "STUDENT" | "ALUMNI";
    gender?: "MALE" | "FEMALE" | null;
    poste_id?: string | null;
    poste?: { name: string } | null;
  };
  postes: { id: string; name: string }[];
}

const ROLES = [
  { value: "MEMBER", label: "Membre Simple" },
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

const STATUSES = [
  { value: "STUDENT", label: "Étudiant" },
  { value: "ALUMNI", label: "Alumni" },
];

const GENDERS = [
  { value: "MALE", label: "Homme" },
  { value: "FEMALE", label: "Femme" },
];


export function MemberActions({ member, postes }: MemberActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleRoleChange = (newRole: "MEMBER" | "ADMIN" | "SUPER_ADMIN") => {
    if (newRole === member.role) return;
    startTransition(async () => {
      const result = await updateMemberRole(member.id, newRole);
      if (result.success) toast.success("Rôle mis à jour avec succès.");
    });
  };

  const handleStatusChange = (newStatus: "STUDENT" | "ALUMNI") => {
    if (newStatus === member.status) return;
    startTransition(async () => {
      const result = await updateMemberStatus(member.id, newStatus);
      if (result.success) toast.success("Statut mis à jour avec succès.");
    });
  };

  const handlePosteChange = (newPosteId: string) => {
    const effectiveId = newPosteId === "none" ? null : newPosteId;
    if (effectiveId === member.poste_id) return;
    startTransition(async () => {
      const result = await updateMemberPoste(member.id, effectiveId);
      if (result.success) toast.success("Poste mis à jour avec succès.");
    });
  };

  const handleGenderChange = (newGender: "MALE" | "FEMALE" | "none") => {
    const effectiveGender = newGender === "none" ? null : newGender;
    if (effectiveGender === member.gender) return;
    startTransition(async () => {
      const result = await updateMemberGender(member.id, effectiveGender);
      if (result.success) toast.success("Genre mis à jour avec succès.");
    });
  };

  const handleDelete = () => {
    startTransition(async () => {
      const result = await deleteMember(member.id);
      if (result.success) {
        toast.success("Membre supprimé avec succès.");
        setIsDeleteDialogOpen(false);
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full data-[state=open]:bg-slate-100 shrink-0">
            <span className="sr-only">Ouvrir le menu</span>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : <MoreVertical className="h-4 w-4 text-slate-400" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-xl">
          <DropdownMenuLabel className="font-bold text-xs uppercase tracking-wider text-slate-400 pb-2">
            Actions sur {member.name.split(" ")[0]}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Rôle */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              <span>Niveau d&apos;accès</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48 ml-1 rounded-xl shadow-xl">
              <DropdownMenuLabel className="text-xs text-slate-400">Rôle système</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={member.role} onValueChange={(v: string) => handleRoleChange(v as "MEMBER" | "ADMIN" | "SUPER_ADMIN")}>
                {ROLES.map((r) => (
                  <DropdownMenuRadioItem key={r.value} value={r.value} className="text-sm font-medium">
                    {r.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Statut */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <GraduationCap className="w-4 h-4 text-blue-500" />
              <span>Statut scolaire</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48 ml-1 rounded-xl shadow-xl">
              <DropdownMenuLabel className="text-xs text-slate-400">Statut</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={member.status} onValueChange={(v: string) => handleStatusChange(v as "STUDENT" | "ALUMNI")}>
                {STATUSES.map((s) => (
                  <DropdownMenuRadioItem key={s.value} value={s.value} className="text-sm font-medium">
                    {s.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Poste */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <Briefcase className="w-4 h-4 text-amber-500" />
              <span>Poste Bureau</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48 ml-1 rounded-xl shadow-xl">
              <DropdownMenuLabel className="text-xs text-slate-400">Poste au sein du bureau</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={member.poste_id || "none"} onValueChange={handlePosteChange}>
                <DropdownMenuRadioItem value="none" className="text-sm font-medium">
                  Aucun poste
                </DropdownMenuRadioItem>
                {postes.map((p) => (
                  <DropdownMenuRadioItem key={p.id} value={p.id} className="text-sm font-medium">
                    {p.name}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          {/* Genre */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <Users2 className="w-4 h-4 text-purple-500" />
              <span>Genre</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48 ml-1 rounded-xl shadow-xl">
              <DropdownMenuLabel className="text-xs text-slate-400">Modifier le genre</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={member.gender || "none"} onValueChange={(v: string) => handleGenderChange(v as "MALE" | "FEMALE" | "none")}>
                <DropdownMenuRadioItem value="none" className="text-sm font-medium">
                  Non renseigné
                </DropdownMenuRadioItem>
                {GENDERS.map((g) => (
                  <DropdownMenuRadioItem key={g.value} value={g.value} className="text-sm font-medium">
                    {g.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            className="text-red-600 focus:text-red-700 focus:bg-red-50 gap-2 font-medium"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="w-4 h-4" />
            Supprimer le membre
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-white p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <DialogHeader className="p-0 border-none">
                <DialogTitle className="text-2xl font-bold text-slate-900">Supprimer le membre</DialogTitle>
              </DialogHeader>
              <p className="text-slate-500 leading-relaxed">
                Voulez-vous vraiment supprimer <span className="font-bold text-slate-900">&quot;{member.name}&quot;</span> ?
                Toutes ses données seront effacées. Cette action est irréversible.
              </p>
            </div>

            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl text-slate-600 font-semibold"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-red-200"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suppression...
                  </>
                ) : (
                  "Supprimer définitivement"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
