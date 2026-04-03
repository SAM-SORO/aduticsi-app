'use client'

import { useTransition } from 'react'
import Link from 'next/link'

import { toast } from 'sonner'

import { Home } from 'lucide-react'
import { forgotPassword } from '../actions'
import { cn } from '@/lib/utils'
import { MaterialIcon } from '@/components/icons/material-icon'
import { BackButton } from '@/components/ui/back-button'


export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    startTransition(async () => {
      const result = await forgotPassword(email)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(result.message || "Un lien de réinitialisation a été envoyé.")
      }
    })
  }

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

      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-80">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-[radial-gradient(circle,rgba(19,146,236,0.15)_0%,transparent_60%)] rounded-full blur-[80px] animate-pulse-slow mix-blend-multiply" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(37,99,235,0.12)_0%,transparent_60%)] rounded-full blur-[100px] animate-pulse-slow animation-delay-4000 mix-blend-multiply" />
      </div>

      <div className="w-full max-w-[500px] z-10 flex flex-col gap-6">
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl shadow-blue-100 text-[var(--aduti-primary)] mb-2 border border-slate-100 ring-4 ring-white/50">
            <MaterialIcon name="lock_reset" className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mot de passe oublié</h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">
            Récupération de compte
          </p>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] backdrop-blur-xl relative overflow-hidden">
          {/* Loading Progress Bar */}
          <div className={cn(
            "absolute top-0 left-0 right-0 h-1.5 bg-slate-100 overflow-hidden z-20 transition-opacity duration-300",
            isPending ? "opacity-100" : "opacity-0"
          )}>
            <div className="h-full bg-[var(--aduti-primary)] animate-shimmer w-full origin-left" />
          </div>

          <div className="p-8">
            <p className="text-sm font-medium text-slate-500 text-center mb-8 leading-relaxed max-w-[320px] mx-auto">
              Entrez votre adresse email pour recevoir un lien de réinitialisation.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <MaterialIcon name="alternate_email" className="w-5 h-5" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="votre.email@inphb.ci"
                    className="block w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-[var(--aduti-primary)] transition-all text-sm font-medium shadow-inner"
                  />
                </div>
              </div>
              
              <button
                disabled={isPending}
                className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-2xl shadow-xl shadow-blue-100 text-sm font-black text-white bg-[var(--aduti-primary)] hover:bg-blue-600 focus:outline-none transition-all active:scale-[0.98] uppercase tracking-widest disabled:opacity-50"
              >
                {isPending ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <MaterialIcon name="send" className="w-5 h-5" />
                )}
                {isPending ? 'Envoi...' : 'Envoyer le lien'}
              </button>
            </form>

            <div className="mt-8 text-center pt-8 border-t border-slate-50">
              <Link href="/auth/login" className="text-xs font-bold text-slate-400 hover:text-slate-800 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                <MaterialIcon name="arrow_back" className="w-[18px] h-[18px]" />
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
