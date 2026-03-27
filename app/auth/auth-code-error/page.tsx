import Link from 'next/link'
import Image from 'next/image'
import { MaterialIcon } from "@/components/icons/material-icon";

export default function AuthCodeErrorPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 bg-slate-50/50 min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-[480px] text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-center mb-6">
          <Image 
            src="/logo_association.jpeg" 
            alt="ADUTI Logo" 
            width={80} 
            height={80} 
            className="rounded-full shadow-md border-2 border-white object-cover"
          />
        </div>
        
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 text-red-500 mb-2">
          <MaterialIcon name="error" className="w-10 h-10" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Lien invalide ou expiré</h1>
        
        <p className="text-slate-600 text-base leading-relaxed">
          Le lien de confirmation que vous avez utilisé n&apos;est plus valide. Il est possible qu&apos;il ait déjà été utilisé ou qu&apos;il ait expiré.
        </p>

        <div className="pt-6 space-y-4">
          <Link 
            href="/auth/login" 
            className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-lg shadow-sm text-sm font-bold text-white bg-[var(--aduti-primary)] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--aduti-primary)] transition-all active:scale-[0.98]"
          >
            Retour à la connexion
          </Link>
          <Link 
            href="/auth/register" 
            className="block text-sm font-medium text-[var(--aduti-primary)] hover:underline"
          >
            Créer un nouveau compte
          </Link>
        </div>
      </div>
    </main>
  )
}
