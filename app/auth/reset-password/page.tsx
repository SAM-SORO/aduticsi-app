'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

import { toast } from 'sonner'

import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export default function ResetPasswordPage() {
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.')
      return
    }

    startTransition(async () => {
      try {
        const { error } = await supabase.auth.updateUser({ password })
        if (error) {
          toast.error(error.message)
        } else {
          toast.success('Votre mot de passe a été réinitialisé.')
          router.push('/auth/login')
        }
      } catch {
        toast.error('Une erreur inattendue est survenue.')
      }
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 font-sans">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-80">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-[radial-gradient(circle,rgba(19,146,236,0.15)_0%,transparent_60%)] rounded-full blur-[80px] animate-pulse-slow mix-blend-multiply" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(37,99,235,0.12)_0%,transparent_60%)] rounded-full blur-[100px] animate-pulse-slow animation-delay-4000 mix-blend-multiply" />
      </div>

      <div className="w-full max-w-[550px] z-10 flex flex-col gap-6">
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-xl shadow-blue-100 text-[var(--aduti-primary)] mb-2 border border-slate-100 ring-4 ring-white/50">
            <span className="material-symbols-outlined text-4xl">
              security
            </span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Nouveau mot de passe</h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">
            Sécurisation du compte
          </p>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-[0_30px_60_px_-15px_rgba(0,0,0,0.08)] backdrop-blur-xl relative overflow-hidden">
          {/* Loading Progress Bar */}
          <div className={cn(
            "absolute top-0 left-0 right-0 h-1.5 bg-slate-100 overflow-hidden z-20 transition-opacity duration-300",
            isPending ? "opacity-100" : "opacity-0"
          )}>
            <div className="h-full bg-[var(--aduti-primary)] animate-shimmer w-full origin-left" />
          </div>

          <div className="p-8">
            <p className="text-sm font-medium text-slate-500 text-center mb-10 leading-relaxed max-w-[340px] mx-auto">
              Veuillez définir votre nouveau mot de passe pour accéder à votre espace membre.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 ml-1">Nouveau mot de passe</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <span className="material-symbols-outlined text-xl">lock</span>
                  </div>
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="block w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-[var(--aduti-primary)] transition-all text-sm font-medium shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 px-2 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 ml-1">Confirmer le mot de passe</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <span className="material-symbols-outlined text-xl">lock_clock</span>
                  </div>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="block w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-[var(--aduti-primary)] transition-all text-sm font-medium shadow-inner"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-3 px-2 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showConfirmPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              <button
                disabled={isPending}
                className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-2xl shadow-xl shadow-blue-100 text-sm font-black text-white bg-[var(--aduti-primary)] hover:bg-blue-600 focus:outline-none transition-all active:scale-[0.98] uppercase tracking-widest disabled:opacity-50 mt-4"
              >
                {isPending ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-xl">task_alt</span>
                )}
                {isPending ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
