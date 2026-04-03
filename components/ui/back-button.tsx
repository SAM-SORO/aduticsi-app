'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BackButtonProps {
  label?: string
  className?: string
}

export function BackButton({ label = "Retour", className }: BackButtonProps) {
  const router = useRouter()
  
  return (
    <button 
      onClick={() => router.back()}
      className={cn("inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[var(--aduti-primary)] transition-colors w-fit focus:outline-none", className)}
    >
      <ArrowLeft className="w-4 h-4" />
      {label}
    </button>
  )
}
