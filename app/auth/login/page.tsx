"use client";

import Link from "next/link";
import NextImage from "next/image";
import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@/schemas/auth.schema";
import { login } from "@/app/auth/actions";
import { MaterialIcon } from "@/components/icons/material-icon";
import { cn } from "@/lib/utils";
import { BackButton } from "@/components/ui/back-button";
import { Home } from "lucide-react";

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginInput) => {
    startTransition(async () => {
      const result = await login(data);
      if (result?.error) {
        toast.error(result.error);
      }
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
      <div className="w-full max-w-[440px] z-10 flex flex-col gap-6 pt-8 pb-12">
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="relative h-16 w-32 bg-white p-2 rounded-xl shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 mb-4 ring-4 ring-white/50">
            <NextImage
              src="/logo_association.jpeg"
              alt="Logo ADUTI"
              fill
              className="object-contain"
              priority
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--aduti-primary)]/5 border border-[var(--aduti-primary)]/20 backdrop-blur-sm mb-2">
            <MaterialIcon name="lock" className="w-[15px] h-[15px] text-[var(--aduti-primary)]" />
            <span className="text-[11px] font-black text-[var(--aduti-primary)] tracking-widest uppercase">Uniquement réservé aux membres</span>
          </div>
          {/* <h1 className="text-3xl font-black text-slate-900 tracking-tight font-display">
            Se connecter
          </h1> */}
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] backdrop-blur-xl relative overflow-hidden group">
          {/* Loading Progress Bar */}
          <div className={cn(
            "absolute top-0 left-0 right-0 h-1.5 bg-slate-100 overflow-hidden z-20 transition-opacity duration-300",
            isPending ? "opacity-100" : "opacity-0"
          )}>
            <div className="h-full bg-[var(--aduti-primary)] animate-shimmer w-full origin-left" />
          </div>

          <div className="p-6 md:p-8">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label
                  className="block text-sm font-bold text-slate-700 ml-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    className={cn(
                      "block w-full px-5 py-3 tracking-wide bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:ring-4 transition-all text-sm font-medium",
                      errors.email 
                        ? "border-red-500/50 ring-red-500/10 focus:ring-red-500/20 focus:border-red-500" 
                        : "focus:ring-[var(--aduti-primary)]/10 focus:border-[var(--aduti-primary)]"
                    )}
                    disabled={isPending}
                    {...register("email")}
                  />
                  {errors.email && (
                    <MaterialIcon name="info" className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-[11px] font-bold text-red-500 ml-2 tracking-wide">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="ml-1">
                  <label
                    className="block text-sm font-bold text-slate-700"
                    htmlFor="password"
                  >
                    Mot de passe
                  </label>
                </div>
                <div className="relative group">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    // placeholder="••••••••"
                    autoComplete="current-password"
                    className={cn(
                      "block w-full px-5 py-3 tracking-wide bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:ring-4 transition-all text-sm font-medium",
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
                <div className="flex justify-end mt-1.5 mr-1">
                  <Link
                    href="/auth/forgot-password"
                    className="text-xs font-semibold text-slate-500 hover:text-[var(--aduti-primary)] transition-colors underline decoration-transparent hover:decoration-[var(--aduti-primary)] underline-offset-4"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-2xl shadow-xl shadow-blue-100 text-sm font-black text-white bg-[var(--aduti-primary)] hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                >
                  {isPending ? (
                     <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : null}
                  {isPending ? "Traitement..." : "Se connecter"}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100 text-center space-y-4">
              <p className="text-sm font-medium text-slate-500">
                Pas encore enregistrer ?{" "}
                <Link
                  href="/auth/register"
                  className="font-semibold text-slate-500 hover:text-[var(--aduti-primary)] transition-colors underline decoration-transparent hover:decoration-[var(--aduti-primary)] underline-offset-4 tracking-wider"
                >
                  S&apos;enregistrer
                </Link>
              </p>
              <p className="text-sm font-medium text-slate-400">
                Besoin d&apos;aide ?{" "}
                <Link
                  href="/contact"
                  className="font-semibold text-slate-500 hover:text-[var(--aduti-primary)] transition-colors underline decoration-transparent hover:decoration-[var(--aduti-primary)] underline-offset-4 tracking-wider"
                >
                  Contacter le support
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
