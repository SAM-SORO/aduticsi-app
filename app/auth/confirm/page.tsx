'use client';

import { Suspense, useTransition } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { MaterialIcon } from '@/components/icons/material-icon';
import { verifyEmailOtp } from '@/app/auth/actions';
import { TechBackdrop } from "@/components/tech-backdrop";

function ConfirmEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as 'signup' | 'recovery' | 'magiclink' | 'email_change' | null;

  const handleConfirm = () => {
    if (!token_hash || !type) {
      toast.error("Le lien de confirmation est incomplet ou invalide.");
      return;
    }

    startTransition(async () => {
      const result = await verifyEmailOtp(token_hash, type);
      if (result.error) {
        toast.error(result.error);
        router.push('/auth/auth-code-error');
      } else {
        toast.success("Votre compte a été confirmé avec succès !");
        router.push('/?welcome=true');
      }
    });
  };

  return (
    <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 py-8 bg-slate-50 relative overflow-hidden">
      {/* Background decorations */}
        <TechBackdrop variant="grid" />

      <div className="w-full max-w-[480px] z-10 text-center space-y-6 bg-white/70 backdrop-blur-xl p-8 rounded-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] border border-slate-200/60 relative overflow-hidden">
        {/* Loading progress bar */}
        {isPending && (
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 overflow-hidden z-20">
            <div className="h-full bg-[var(--aduti-primary)] animate-shimmer w-full origin-left" />
          </div>
        )}

        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-50 border-4 border-white shadow-xl flex items-center justify-center text-[var(--aduti-primary)] ring-8 ring-blue-50/50">
            <MaterialIcon name="verified_user" className="w-10 h-10" />
          </div>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight font-display">
          Confirmation requise
        </h1>
        
        <p className="text-slate-600 text-sm md:text-base leading-relaxed px-4">
          Bienvenue ! Pour finaliser la création de votre compte, veuillez cliquer sur le bouton ci-dessous.
        </p>

        <div className="pt-8">
          <button 
            onClick={handleConfirm}
            disabled={isPending || !token_hash}
            className="w-full flex justify-center items-center gap-3 py-4 px-6 rounded-2xl shadow-xl shadow-blue-100 text-sm font-bold text-white bg-[var(--aduti-primary)] hover:bg-[var(--aduti-primary-hover)] focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
          >
            {isPending ? (
              <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             ) : (
               <MaterialIcon name="check_circle" className="w-5 h-5" />
             )}
            {isPending ? "Vérification en cours..." : "Confirmer mon compte"}
          </button>
        </div>
        
        {!token_hash && (
          <p className="text-sm font-bold text-red-500 bg-red-50 p-3 rounded-xl border border-red-100 mt-4">
            Le lien de confirmation est invalide. Veuillez utiliser le lien fourni dans votre email.
          </p>
        )}
      </div>
    </main>
  );
}

export default function ConfirmEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] grid flex-1 place-items-center bg-slate-50"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-[var(--aduti-primary)] animate-spin" /></div>}>
      <ConfirmEmailContent />
    </Suspense>
  );
}
