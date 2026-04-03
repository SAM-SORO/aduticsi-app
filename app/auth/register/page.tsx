"use client";

import { useEffect, useState, useTransition, Suspense } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Home } from "lucide-react";

import { Turnstile } from "@marsidev/react-turnstile";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { registerSchema, type RegisterInput } from "@/schemas/auth.schema";
import { getPromotions, signup, verifyInvitationToken } from "@/app/auth/actions";
import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/utils";
import { BackButton } from "@/components/ui/back-button";

type SignupData = RegisterInput & { captchaToken: string; token: string };

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center">Chargement...</div>}>
      <RegisterContent />
    </Suspense>
  );
}

function RegisterContent() {
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: "onSubmit",
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      promo_id: "",
      status: "" as "STUDENT" | "ALUMNI",
      gender: "" as "MALE" | "FEMALE",
    },
    shouldUnregister: false,
  });

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

  const onSubmit = (data: RegisterInput) => {
    // Captcha validation only in production
    if (process.env.NODE_ENV === 'production' && !captchaToken) {
      toast.error("Veuillez valider le captcha.");
      return;
    }

    startTransition(async () => {
      const result = await signup({ 
        ...data, 
        token: token || "",
        captchaToken: captchaToken || ""
      } as SignupData);
      
      if (result?.error) {
        toast.error(result.error);
      }
    });
  };

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

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 font-sans">
      {/* Bouton de retour en haut à gauche */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 z-50">
        <BackButton className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/50 shadow-sm hover:border-[var(--aduti-primary)]/50 hover:bg-white" />
      </div>

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
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-80">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-[radial-gradient(circle,rgba(19,146,236,0.15)_0%,transparent_60%)] rounded-full blur-[80px] animate-pulse-slow mix-blend-multiply" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(37,99,235,0.12)_0%,transparent_60%)] rounded-full blur-[100px] animate-pulse-slow animation-delay-4000 mix-blend-multiply" />
        <div className="absolute top-[30%] left-[20%] w-[40vw] h-[40vw] bg-[radial-gradient(circle,rgba(59,130,246,0.1)_0%,transparent_60%)] rounded-full blur-[60px] animate-float mix-blend-multiply" />
      </div>
      
      {/* Subtle grid overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0ZerrblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-60 z-0"></div>

      {/* Main Content (Centered Form) */}
      <div className="w-full max-w-[720px] z-10 flex flex-col gap-6 pt-8 pb-12">

        <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] backdrop-blur-xl relative overflow-hidden">
          {/* Loading Progress Bar */}
          <div className={cn(
            "absolute top-0 left-0 right-0 h-1.5 bg-slate-100 overflow-hidden z-20 transition-opacity duration-300",
            isPending ? "opacity-100" : "opacity-0"
          )}>
            <div className="h-full bg-[var(--aduti-primary)] animate-shimmer w-full origin-left" />
          </div>

          <div className="p-6 md:p-8 lg:p-12">
            {!token ? (
              <div className="py-4">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-4 ring-8 ring-blue-50/50">
                    <MaterialIcon name="vpn_key" className="w-12 h-12 text-[var(--aduti-primary)]" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-3 font-display">Accès sur invitation</h2>
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
                    className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-2xl shadow-xl shadow-blue-100 text-sm font-black text-white bg-[var(--aduti-primary)] hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
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
              </div>
            ) : (
              <>         
                <div className="flex gap-4 mb-8 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 items-center">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                    <MaterialIcon name="info" className="w-5 h-5 text-[var(--aduti-primary)]" />
                  </div>
                  <div className="text-xs font-bold uppercase tracking-wider leading-tight">
                    Réservé aux membres de l&apos;ADUTI <span className="text-slate-400 font-medium tracking-normal normal-case">(DUT/DTS)</span> INPHB
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Row 1: Last Name & First Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="last_name">
                        Nom
                      </label>
                      <input
                        id="last_name"
                        type="text"
                        className={cn(
                          "block w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:ring-4 transition-all text-sm font-medium",
                          errors.last_name 
                            ? "border-red-500/50 ring-red-500/10 focus:ring-red-500/20 focus:border-red-500" 
                            : "focus:ring-[var(--aduti-primary)]/10 focus:border-[var(--aduti-primary)]"
                        )}
                        disabled={isPending}
                        {...register("last_name")}
                      />
                      {errors.last_name && (
                        <p className="text-[11px] font-bold text-red-500 ml-2 tracking-wide">
                          {errors.last_name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="first_name">
                        Prénoms
                      </label>
                      <input
                        id="first_name"
                        type="text"
                        className={cn(
                          "block w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:ring-4 transition-all text-sm font-medium",
                          errors.first_name 
                            ? "border-red-500/50 ring-red-500/10 focus:ring-red-500/20 focus:border-red-500" 
                            : "focus:ring-[var(--aduti-primary)]/10 focus:border-[var(--aduti-primary)]"
                        )}
                        disabled={isPending}
                        {...register("first_name")}
                      />
                      {errors.first_name && (
                        <p className="text-[11px] font-bold text-red-500 ml-2 tracking-wide">
                          {errors.first_name.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Email & Promotion */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="email">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        className={cn(
                          "block w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:ring-4 transition-all text-sm font-medium",
                          errors.email 
                            ? "border-red-500/50 ring-red-500/10 focus:ring-red-500/20 focus:border-red-500" 
                            : "focus:ring-[var(--aduti-primary)]/10 focus:border-[var(--aduti-primary)]"
                        )}
                        disabled={isPending}
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="text-[11px] font-bold text-red-500 ml-2 tracking-wide">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="promo_id">
                        Promotion
                      </label>
                      <div className="relative">
                        <select
                          id="promo_id"
                          disabled={isPending || loadingPromos}
                          className={cn(
                            "block w-full pl-5 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:ring-4 transition-all text-sm font-medium appearance-none",
                            errors.promo_id 
                              ? "border-red-500/50 ring-red-500/10 focus:ring-red-500/20 focus:border-red-500" 
                              : "focus:ring-[var(--aduti-primary)]/10 focus:border-[var(--aduti-primary)]"
                          )}
                          {...register("promo_id")}
                        >
                          <option value="">
                            {loadingPromos ? "Chargement..." : "Sélectionner"}
                          </option>
                          {promotions.map((promo) => (
                            <option key={promo.id} value={promo.id}>
                              {promo.name}
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                          <MaterialIcon name="expand_more" className="w-5 h-5" />
                        </div>
                      </div>
                      {errors.promo_id && (
                        <p className="text-[11px] font-bold text-red-500 ml-2 tracking-wide">
                          {errors.promo_id.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Statut & Genre */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="status">
                        Statut
                      </label>
                      <div className="relative">
                        <select
                          id="status"
                          disabled={isPending}
                          className={cn(
                            "block w-full pl-5 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:ring-4 transition-all text-sm font-medium appearance-none",
                            errors.status 
                              ? "border-red-500/50 ring-red-500/10 focus:ring-red-500/20 focus:border-red-500" 
                              : "focus:ring-[var(--aduti-primary)]/10 focus:border-[var(--aduti-primary)]"
                          )}
                          {...register("status")}
                        >
                          <option value="">Sélectionner</option>
                          <option value="STUDENT">Étudiant</option>
                          <option value="ALUMNI">Alumni</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                          <MaterialIcon name="expand_more" className="w-5 h-5" />
                        </div>
                      </div>
                      {errors.status && (
                        <p className="text-[11px] font-bold text-red-500 ml-2 tracking-wide">
                          {errors.status.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="gender">
                        Genre
                      </label>
                      <div className="relative">
                        <select
                          id="gender"
                          disabled={isPending}
                          className={cn(
                            "block w-full pl-5 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:ring-4 transition-all text-sm font-medium appearance-none",
                            errors.gender 
                              ? "border-red-500/50 ring-red-500/10 focus:ring-red-500/20 focus:border-red-500" 
                              : "focus:ring-[var(--aduti-primary)]/10 focus:border-[var(--aduti-primary)]"
                          )}
                          {...register("gender")}
                        >
                          <option value="">Sélectionner</option>
                          <option value="MALE">Homme</option>
                          <option value="FEMALE">Femme</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                          <MaterialIcon name="expand_more" className="w-5 h-5" />
                        </div>
                      </div>
                      {errors.gender && (
                        <p className="text-[11px] font-bold text-red-500 ml-2 tracking-wide">
                          {errors.gender.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Passwords */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="password">
                        Mot de passe
                      </label>
                      <div className="relative group">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          className={cn(
                            "block w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:ring-4 transition-all text-sm font-medium placeholder:text-slate-300",
                            errors.password 
                              ? "border-red-500/50 ring-red-500/10 focus:ring-red-500/20 focus:border-red-500" 
                            : "focus:ring-[var(--aduti-primary)]/10 focus:border-[var(--aduti-primary)]"
                          )}
                          disabled={isPending}
                          {...register("password")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <MaterialIcon
                            name={showPassword ? "visibility" : "visibility_off"}
                            className="w-5 h-5"
                          />
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-[11px] font-bold text-red-500 ml-2 tracking-wide">
                          {errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-bold text-slate-700 ml-1" htmlFor="confirmPassword">
                        Confirmation
                      </label>
                      <div className="relative group">
                        <input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          className={cn(
                            "block w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:ring-4 transition-all text-sm font-medium placeholder:text-slate-300",
                            errors.confirmPassword 
                              ? "border-red-500/50 ring-red-500/10 focus:ring-red-500/20 focus:border-red-500" 
                              : "focus:ring-[var(--aduti-primary)]/10 focus:border-[var(--aduti-primary)]"
                          )}
                          disabled={isPending}
                          {...register("confirmPassword")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          <MaterialIcon
                            name={showConfirmPassword ? "visibility" : "visibility_off"}
                            className="w-5 h-5"
                          />
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-[11px] font-bold text-red-500 ml-2 tracking-wide">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col items-center gap-4 pt-2">
                    <Turnstile
                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                      onSuccess={(token) => setCaptchaToken(token)}
                      options={{
                        theme: 'light',
                        size: 'normal',
                      }}
                    />
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-2xl shadow-xl shadow-blue-100 text-sm font-black text-white bg-[var(--aduti-primary)] hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                    >
                      {isPending ? (
                        <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <MaterialIcon name="check_circle" className="w-5 h-5" />
                      )}
                      {isPending ? "Traitement..." : "S'enregistrer"}
                    </button>
                  </div>
                </form>

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
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
