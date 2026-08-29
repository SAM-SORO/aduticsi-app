"use client";

import { useEffect, useState, useTransition, Suspense } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Home } from "lucide-react";
import { toast } from "sonner";

import { RegisterWizard } from "./RegisterWizard";
import { getPromotions, verifyInvitationToken } from "@/app/auth/actions";
import { MaterialIcon } from "@/components/icons/material-icon";
import { BackButton } from "@/components/ui/back-button";
import { cn } from "@/lib/utils";
import { TechBackdrop } from "@/components/tech-backdrop";

type RegisterMode = "choice" | "invitation" | "request";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] bg-slate-50 flex items-center justify-center">Chargement...</div>}>
      <RegisterContent />
    </Suspense>
  );
}


function RegisterContent() {
  
  

  {/*on remet en place la logique de gestion lien d'invitation (token) */}
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  // State for the token entry form
  const [tokenInput, setTokenInput] = useState("");

  const [isPending, startTransition] = useTransition();
  const [promotions, setPromotions] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loadingPromos, setLoadingPromos] = useState(true);
  {/*Mode par défaut d'enregistrement */}
  const [mode, setMode] = useState<RegisterMode>("choice")
  useEffect(() => {
  if (token) setMode("invitation");
}, [token]);


  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const promos = await getPromotions();
        setPromotions(promos);
      } catch {
        // Silently fail
      } finally {
        setLoadingPromos(false);
      }
    };
    fetchPromos();
  }, []);

  

  
  
  {/*on remet en place la logique de gestion lien d'invitation (token) */}

  const handleTokenSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!tokenInput.trim()) {
      toast.error("Veuillez saisir un lien d'invitation ou un code valide.");
      return;
    }

    let extractedToken = tokenInput.trim();
    
    if (extractedToken.includes("http")) {
      try {
        const urlObj = new URL(extractedToken);
        const urlToken = urlObj.searchParams.get("token");
        if (urlToken) {
          extractedToken = urlToken;
        } else {
          toast.error("Le lien fourni ne contient pas d'invitation valide.");
          return;
        }
      } catch {
        toast.error("Le lien fourni est invalide.");
        return;
      }
    }

    startTransition(async () => {
      const result = await verifyInvitationToken(extractedToken);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      router.push(`/auth/register?token=${extractedToken}`);
    });
  };
  function chargementContenu(mode: RegisterMode){
  if (mode === "choice"){
    return(
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Lien d'inviation */}
        <button
          type="button"
          onClick={() => setMode("invitation")}
          className="group flex flex-col items-start gap-3 p-5 bg-white hover:bg-[var(--aduti-primary)]/5 border border-slate-200 hover:border-[var(--aduti-primary)]/40 rounded-2xl transition-all duration-150 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aduti-primary)]"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-[var(--aduti-primary)] border border-slate-100 group-hover:border-[var(--aduti-primary)] flex items-center justify-center transition-all duration-150">
            <MaterialIcon name="vpn_key" className="w-5 h-5 text-[var(--aduti-primary)] group-hover:text-white transition-colors duration-150" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800 mb-0.5">Lien d&apos;invitation</p>
            <p className="text-sm text-slate-500 leading-relaxed">Collez votre code ou lien reçu par email.</p>
          </div>
          
          <MaterialIcon name="arrow_forward" className="w-4 h-4 text-slate-300 group-hover:text-[var(--aduti-primary)] transition-colors mt-auto" />
        </button>

        {/* Demande d'enregistrement */}
        <button
          type="button"
          onClick={() => setMode("request")}
          className="group flex flex-col items-start gap-3 p-5 bg-white hover:bg-[var(--aduti-primary)]/5 border border-slate-200 hover:border-[var(--aduti-primary)]/40 rounded-2xl transition-all duration-150 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aduti-primary)]"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-50 group-hover:bg-[var(--aduti-primary)] border border-slate-100 group-hover:border-[var(--aduti-primary)] flex items-center justify-center transition-all duration-150">
            <MaterialIcon name="edit_note" className="w-5 h-5 text-[var(--aduti-primary)] group-hover:text-white transition-colors duration-150" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800 mb-0.5">Faire une demande</p>
            <p className="text-sm text-slate-500 leading-relaxed">Remplissez le formulaire et attendez la validation.</p>
          </div>
      
          <MaterialIcon name="arrow_forward" className="w-4 h-4 text-slate-300 group-hover:text-[var(--aduti-primary)] transition-colors mt-auto" />
        </button>
      </div>
              )
            }
  if (mode ==="invitation" && !token){ 
    return(
              <div className="py-4">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-4 ring-8 ring-blue-50/50">
                    <MaterialIcon name="vpn_key" className="w-12 h-12 text-[var(--aduti-primary)]" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-3 font-display">Accès sur invitation</h2>
                  <p className="text-sm font-medium text-slate-500 max-w-sm mx-auto leading-relaxed">
                    Seuls les membres de l&apos;association peuvent s&apos;enregistrer. Veuillez saisir votre code ou lien d&apos;invitation.
                  </p>
                </div>

                <form onSubmit={handleTokenSubmit} className="space-y-6 max-w-md mx-auto">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="tokenInput">
                      Lien d&apos;invitation ou code
                    </label>
                    <input
                      id="tokenInput"
                      type="text"
                      required
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      disabled={isPending}
                      placeholder="Collez le lien ici..."
                      className="block w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-[var(--aduti-primary)] transition-all text-sm font-medium shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-2xl shadow-xl shadow-blue-100 text-sm font-bold text-white bg-[var(--aduti-primary)] hover:bg-[var(--aduti-primary-hover)] focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                  >
                    {isPending ? (
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : null}
                    {isPending ? "VÉRIFICATION..." : "VALIDER L'INVITATION"}
                    {!isPending && <MaterialIcon name="arrow_forward" className="w-5 h-5" />}
                  </button>
                </form>

                <div className="mt-8 text-center pt-8 border-t border-slate-50">
                  <p className="text-xs font-bold text-slate-400  tracking-wider">
                    Vous n&apos;avez pas de lien d&apos;invitation ? {" "}
                    <Link href="/contact" className="font-semibold text-slate-500 hover:text-[var(--aduti-primary)] transition-colors underline decoration-transparent hover:decoration-[var(--aduti-primary)] underline-offset-4 tracking-wider">
                      contacter le support
                    </Link>
                  </p>
                </div>
              </div>)
            }
  return (
          <>
              <div className="mb-8 flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white">
                  <MaterialIcon name="info" className="size-5 text-[var(--aduti-primary)]" />
                </div>
                <p className="text-sm leading-relaxed">
                  {mode === "request"
                    ? "Votre demande sera examinée par un administrateur. Vous définirez votre mot de passe après approbation."
                    : "Réservé aux membres de l’ADUTI (DUT/DTS) de l’INP-HB."}
                </p>
              </div>

              <RegisterWizard
                mode={mode === "invitation" ? "invitation" : "request"}
                token={token ?? ""}
                promotions={promotions}
                loadingPromos={loadingPromos}
              />

                <div className="mt-8 pt-8 border-t border-slate-100 text-center">
                  <p className="text-sm font-medium text-slate-500">
                    Déjà inscrit ?{" "}
                    <Link
                      href="/auth/login"
                      className="font-semibold text-slate-500 hover:text-[var(--aduti-primary)] transition-colors underline decoration-transparent hover:decoration-[var(--aduti-primary)] underline-offset-4 tracking-wider"
                    >
                      Se connecter
                    </Link>
                  </p>
                </div>
      </>
            
            )
}



  return (
    <main className="min-h-[100dvh] flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 font-sans">
      {/* Bouton de retour en haut à gauche */}
      {mode === "choice" ? 
        ( <>
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50">
        <BackButton className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/50 shadow-sm hover:border-[var(--aduti-primary)]/50 hover:bg-white" />
      </div>
      </>
    )
      : (
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50">
          <button 
              onClick={() => setMode("choice")}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[var(--aduti-primary)] transition-colors w-fit focus:outline-none bg-white/80 backdrop-blur-md rounded-full border border-slate-200/50 shadow-sm hover:border-[var(--aduti-primary)]/50 hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </button>
      </div>
    )}
      

      {/* Bouton d'accueil en haut à droite */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50">
        <Link 
           href="/"
           className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[var(--aduti-primary)] transition-colors w-fit focus:outline-none bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/50 shadow-sm hover:border-[var(--aduti-primary)]/50 hover:bg-white"
         >
           <Home className="w-4 h-4" />
           <span className="hidden sm:inline">Accueil</span>
         </Link>
      </div>

      {/* Animated Background Canvas */}
        <TechBackdrop variant="grid" />
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0ZerrblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60 z-0"></div>

      {/* Main Content (Centered Form) */}
      <div className="w-full max-w-[720px] z-10 flex flex-col gap-6 pt-20 sm:pt-8 pb-12">

        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] backdrop-blur-xl relative overflow-hidden">
          {/* Loading Progress Bar */}
          <div className={cn(
            "absolute top-0 left-0 right-0 h-1.5 bg-slate-100 overflow-hidden z-20 transition-opacity duration-300",
            isPending ? "opacity-100" : "opacity-0"
          )}>
            <div className="h-full bg-[var(--aduti-primary)] animate-shimmer w-full origin-left" />
          </div>

          <div className="p-6 md:p-8 lg:p-12">
          {/*logique conditionnelle sur  mode poiur savoir ce que l'utilisateur doit voir */}
          {chargementContenu(mode)}
          
            
          </div>
        </div>
      </div>
    </main>
  );
}
