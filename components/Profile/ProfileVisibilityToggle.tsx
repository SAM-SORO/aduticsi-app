"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/utils";
import { updateProfileStatus } from "@/app/profile/actions";

interface ProfileVisibilityToggleProps {
  initialStatus: 'PUBLIC' | 'PRIVATE';
}

export function ProfileVisibilityToggle({ initialStatus }: ProfileVisibilityToggleProps) {
  const [status, setStatus] = useState<'PUBLIC' | 'PRIVATE'>(initialStatus);
  const [isPending, startTransition] = useTransition();
  

  const handleToggle = () => {
  
    const previousStatus = status;
    const newStatus = status === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
    setStatus(newStatus);
    startTransition(async () => {
      const result = await updateProfileStatus(newStatus) as { success?: boolean; error?: string };
      if (result?.error) {
        setStatus(previousStatus);
        toast.error(result.error);
      } else {
        toast.success(
          newStatus === 'PUBLIC'
            ? 'Profil rendu public'
            : 'Profil rendu privé'
        );
      }
    });
};
  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed",
        status === 'PUBLIC'
          ? "bg-blue-50 border-[var(--aduti-primary)]/30 text-[var(--aduti-primary)]"
          : "bg-slate-50 border-slate-200 text-slate-500"
      )}
    >
      <MaterialIcon
        name={status === 'PUBLIC' ? "public" : "lock"}
        className="w-4 h-4"
      />
      {status === 'PUBLIC' ? 'Profil public' : 'Profil privé'}

      {/* Switch visuel */}
      <div className={cn(
        "relative w-8 h-4 rounded-full transition-colors duration-200 ml-1",
        status === 'PUBLIC' ? "bg-[var(--aduti-primary)]" : "bg-slate-300"
      )}>
        {isPending ? (
          <div className="absolute top-0.5 left-0.5 w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin" />
        ) : (
          <div className={cn(
            "absolute top-0.5 w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-200",
            status === 'PUBLIC' ? "translate-x-4" : "translate-x-0.5"
          )} />
        )}
      </div>
    </button>
  );
}