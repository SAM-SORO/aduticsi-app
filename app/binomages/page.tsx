import { redirect } from "next/navigation";

import { BinomagesClient } from "./BinomagesClient";
import { getPromoCombos } from "@/app/dashboard/binomage/actions";
import { createClient } from "@/lib/supabase/server";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function BinomagesPublicPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Seuls les membres connectés peuvent voir cette page
  if (!user) {
    redirect("/auth/login");
  }

  const combos = await getPromoCombos();

  return (
    <main className="min-h-screen pt-24 pb-12 bg-slate-50">
      <div className="layout-container max-w-7xl mx-auto px-4">
        <BinomagesClient combos={combos} />
      </div>
    </main>
  );
}
