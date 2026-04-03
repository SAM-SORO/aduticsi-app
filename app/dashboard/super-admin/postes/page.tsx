import { redirect } from "next/navigation";

import { PostesContent } from "./PostesContent";
import { getPostes } from "./actions";
import { DashboardLayout } from "@/components/dashboard/DashboardShell";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function PostesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const currentMember = await prisma.member.findUnique({
    where: { id: user.id },
    select: { id: true, role: true, name: true, email: true },
  });

  if (!currentMember || currentMember.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const initialPostes = await getPostes();

  return (
    <DashboardLayout
      member={currentMember}
      activePath="/dashboard/super-admin/postes"
      title="Gestion des Postes"
    >
      <PostesContent initialPostes={initialPostes} />
    </DashboardLayout>
  );
}
