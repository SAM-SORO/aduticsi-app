import Link from 'next/link'
import Image from 'next/image'

export default function VerifyEmailPage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 bg-slate-50/50 min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-[480px] text-center space-y-6">
        <div className="flex justify-center mb-6">
          <Image 
            src="/logo_association.jpeg" 
            alt="ADUTI Logo" 
            width={80} 
            height={80} 
            className="rounded-full shadow-md border-2 border-white object-cover"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Vérifiez votre boîte mail</h1>
        
        <p className="text-slate-600 text-lg leading-relaxed">
          Un lien de confirmation a été envoyé à votre adresse email. 
          Veuillez cliquer sur ce lien pour activer votre compte.
        </p>

        <div className="pt-4">
          <Link 
            href="/auth/login" 
            className="inline-flex items-center text-sm font-bold text-[var(--aduti-primary)] hover:underline"
          >
            Retour à la connexion
          </Link>
        </div>

        <div className="text-xs text-slate-400 mt-8">
          Si vous n&apos;avez rien reçu, vérifiez vos spams.
        </div>
      </div>
    </main>
  )
}
