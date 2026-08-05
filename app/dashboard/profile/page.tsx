import { redirect } from "next/navigation";
import { getProfile } from "@/app/profile/actions";
import { ProfileContent } from "@/app/profile/ProfileContent";
import { DashboardLayout } from "@/components/dashboard/DashboardShell";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const profile = await getProfile();

  if (!profile) {
    redirect("/auth/login");
  }

  // Seuls les admins ou membres avec des fonctions accèdent au dashboard
  const hasAccess = profile.role === "ADMIN" || profile.role === "SUPER_ADMIN" || (profile.function && profile.function !== "NONE");
  
  if (!hasAccess) {
    redirect("/profile");
  }

  return (
    <DashboardLayout
      member={profile}
      activePath="/dashboard/profile"
      title="Mon Profil"
    >
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-700">
        <ProfileContent member={profile} />
      </div>
    </DashboardLayout>
  );
}
