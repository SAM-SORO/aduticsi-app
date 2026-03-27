import Link from 'next/link'
import { MaterialIcon } from "@/components/icons/material-icon";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 min-h-[calc(100vh-80px)] bg-white dark:bg-slate-900">
      <div className="max-w-[640px] w-full text-center">
        <div className="mb-8 inline-flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700">
          <MaterialIcon name="error" className="w-20 h-20 text-[var(--aduti-accent,var(--aduti-primary))] text-red-600" />
        </div>
        
        <h1 className="text-slate-900 dark:text-white text-4xl md:text-5xl font-extrabold leading-tight mb-4 tracking-tight">
          Oups ! Page introuvable
        </h1>
        
        <div className="w-24 h-1 bg-red-600 mx-auto mb-8 rounded-full"></div>
        
        <p className="text-slate-600 dark:text-slate-300 text-lg md:text-xl font-normal leading-relaxed mb-10">
          Désolé, la page que vous recherchez n'existe pas, a été déplacée ou est temporairement indisponible.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/" 
            className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 bg-[var(--aduti-primary)] text-white text-lg font-bold transition-all hover:bg-blue-900 shadow-lg group"
          >
            <MaterialIcon name="arrow_back" className="mr-2 w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="truncate">Retour à l'accueil</span>
          </Link>
          <Link 
            href="/contact" 
            className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-lg h-14 px-8 border-2 border-slate-200 dark:border-slate-700 bg-transparent text-slate-700 dark:text-slate-300 text-lg font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <span className="truncate">Contacter le support</span>
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left border-t border-slate-100 dark:border-slate-800 pt-12">
          <Link href="/about" className="p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors block group">
            <MaterialIcon name="school" className="w-6 h-6 text-[var(--aduti-primary)] mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Notre Histoire</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Découvrez l'historique de l'ADUTI.</p>
          </Link>
          
          <Link href="/members" className="p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors block group">
            <MaterialIcon name="groups" className="w-6 h-6 text-[var(--aduti-primary)] mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Membres</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Consultez l'annuaire de nos membres.</p>
          </Link>
          
          <Link href="/activities" className="p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors block group">
            <MaterialIcon name="calendar_month" className="w-6 h-6 text-[var(--aduti-primary)] mb-2 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-slate-900 dark:text-white mb-1">Événements</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Ne manquez pas nos prochaines activités.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
