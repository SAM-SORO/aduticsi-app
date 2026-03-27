"use client";

import { useFormStatus } from "react-dom";
import { MaterialIcon } from "@/components/icons/material-icon";

export function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-[var(--aduti-primary)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
    >
      {pending ? (
        <>
          <MaterialIcon name="progress_activity" className="w-[18px] h-[18px] animate-spin" />
          Ajout...
        </>
      ) : (
        "Ajouter"
      )}
    </button>
  );
}
