'use client'

import Link from 'next/link'
import { MaterialIcon } from "@/components/icons/material-icon";

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 font-sans">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-80">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-[radial-gradient(circle,rgba(19,146,236,0.15)_0%,transparent_60%)] rounded-full blur-[80px] animate-pulse-slow mix-blend-multiply" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(37,99,235,0.12)_0%,transparent_60%)] rounded-full blur-[100px] animate-pulse-slow animation-delay-4000 mix-blend-multiply" />
      </div>

      <div className="w-full max-w-[500px] z-10 flex flex-col gap-6">
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] text-[var(--aduti-primary)] mb-4 border border-slate-100 ring-8 ring-white/50 animate-bounce-subtle">
            <MaterialIcon name="mark_email_unread" className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Vérifiez votre boîte mail</h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100/50">
            Activation du compte
          </p>
        </div>

        <div className="bg-white rounded-[32px] border border-slate-200/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] backdrop-blur-xl relative overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="space-y-6 text-center">
              <p className="text-slate-600 text-lg font-medium leading-relaxed">
                Un lien de confirmation sécurisé a été envoyé à votre adresse. 
                Veuillez cliquer sur ce lien pour activer votre accès membre.
              </p>

              <div className="bg-slate-50 rounded-2xl p-6 border border-dashed border-slate-200">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Conseil</p>
                <p className="text-xs text-slate-500 leading-normal italic">
                  Si vous ne voyez pas l&apos;email dans quelques minutes, n&apos;oubliez pas de vérifier votre dossier <span className="text-slate-700 font-bold uppercase">Spams</span> ou <span className="text-slate-700 font-bold uppercase">Courrier indésirable</span>.
                </p>
              </div>

              <div className="pt-6">
                <Link 
                  href="/auth/login" 
                  className="group w-full flex justify-center items-center gap-3 py-4 px-6 rounded-2xl shadow-xl shadow-blue-100 text-sm font-black text-white bg-[var(--aduti-primary)] hover:bg-blue-600 focus:outline-none transition-all active:scale-[0.98] uppercase tracking-widest"
                >
                  <MaterialIcon name="arrow_back" className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  Retour à la connexion
                </Link>
              </div>
            </div>
            
            <div className="mt-10 text-center flex flex-col items-center gap-3 opacity-50 grayscale transition-all hover:opacity-100 hover:grayscale-0">
               <div className="h-px w-20 bg-slate-200"></div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-tight">
                 Association des Diplômés de l&apos;UTI <br />
                 <span className="text-[var(--aduti-primary)]">Académie de l&apos;Excellence</span>
               </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
