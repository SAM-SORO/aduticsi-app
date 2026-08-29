'use client'

import Link from 'next/link'
import { MaterialIcon } from "@/components/icons/material-icon";
import { TechBackdrop } from "@/components/tech-backdrop";
import { MAIL_LINK_VALIDITY_LABEL } from "@/lib/auth-links";
import { BackButton } from "@/components/ui/back-button";

export default function pendingReviewPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 font-sans">
      <div className="absolute left-6 top-6 z-50 sm:left-8 sm:top-8">
        <BackButton className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/50 shadow-sm hover:border-(--aduti-primary)/50 hover:bg-white" />
      </div>

      {/* Animated Background */}
        <TechBackdrop variant="grid" />

      <div className="w-full max-w-[500px] z-10 flex flex-col gap-6">
        <div className="text-center space-y-2 flex flex-col items-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] text-aduti-primary mb-4 border border-slate-100 ring-8 ring-white/50 animate-bounce-subtle">
            <MaterialIcon name="verified" className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Demande d&apos;enregistrement</h1>
          <p className="text-slate-500 font-bold text-sm uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100/50">
            En cours de vérification
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] backdrop-blur-xl relative overflow-hidden">
          <div className="p-8 md:p-10">
            <div className="space-y-6 text-center">
              <p className="text-lg leading-relaxed text-slate-600">
                Votre demande a bien été enregistrée. Un administrateur va
                l&apos;examiner.
              </p>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left">
                <p className="mb-3 text-sm font-medium text-slate-700">La suite</p>
                <ol className="space-y-2 text-sm leading-relaxed text-slate-600">
                  <li>1. Un administrateur valide votre demande.</li>
                  <li>2. Vous recevez alors un email contenant un lien.</li>
                  <li>
                    3. Ce lien vous permet de choisir votre mot de passe. Il reste
                    valable {MAIL_LINK_VALIDITY_LABEL}.
                  </li>
                </ol>
                <p className="mt-4 text-xs leading-normal text-slate-500">
                  Aucun email ne vous est envoyé avant cette validation. Pensez à
                  regarder vos courriers indésirables le moment venu.
                </p>
              </div>

              <div className="pt-6">
                <Link 
                  href="/" 
                  className="group w-full flex justify-center items-center gap-3 py-4 px-6 rounded-2xl shadow-xl shadow-blue-100 text-sm font-bold text-white bg-aduti-primary hover:bg-aduti-primary-hover focus:outline-none transition-all active:scale-[0.98] uppercase tracking-widest"
                >
                  <MaterialIcon name="arrow_back" className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  Retour à l&apos;accueil
                </Link>
              </div>
            </div>
            
    
          </div>
        </div>
      </div>
    </main>
  )
}