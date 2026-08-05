import { User } from "lucide-react";
import { redirect } from "next/navigation";
import { getProfile } from "./actions";
import { ProfileContent } from "./ProfileContent";
import { BackButton } from "@/components/ui/back-button";

import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profile = await getProfile();

  if (!profile) {
    redirect("/auth/login");
  }

  // La page affiche désormais la mise en page centrée pour tout le monde (accès via Navbar)
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-6">
        {/* Retour */}
        <BackButton label="Retour" />

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="size-12 bg-blue-50 rounded-2xl flex items-center justify-center text-[var(--aduti-primary)]">
                    <User className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mon Profil</h1>
                    <p className="text-slate-500 font-medium text-sm">Gérez vos informations</p>
                </div>
            </div>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ProfileContent member={profile} />
        </div>
      </div>
    </div>
  );
}
