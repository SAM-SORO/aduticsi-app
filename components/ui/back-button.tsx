'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  label?: string
  className?: string
  /** Destination quand il n'y a pas d'historique, par exemple a l'ouverture d'un lien recu par email. */
  fallbackHref?: string
}

export function BackButton({ label = "Retour", className, fallbackHref = "/" }: BackButtonProps) {
  const router = useRouter()

  const goBack = () => {
    // history.length vaut 1 quand l'onglet vient d'etre ouvert : router.back()
    // n'aurait alors nulle part ou aller.
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
      return
    }
    router.push(fallbackHref)
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className={cn(
        "inline-flex w-fit items-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-aduti-primary focus:outline-none",
        className
      )}
    >
      <ArrowLeft className="size-4" />
      {label}
    </button>
  )
}
