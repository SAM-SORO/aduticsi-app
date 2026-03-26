'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface CopyButtonProps {
  text: string
}

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success('Lien copié dans le presse-papier !')
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error('Échec de la copie.')
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`flex items-center justify-center p-2 rounded-lg transition-all ${
        copied 
          ? 'text-emerald-600 bg-emerald-50' 
          : 'text-slate-400 hover:text-[var(--aduti-primary)] hover:bg-blue-50'
      }`}
      title="Copier le lien"
    >
      {copied ? (
        <Check className="w-4 h-4 md:w-5 md:h-5" />
      ) : (
        <Copy className="w-4 h-4 md:w-5 md:h-5" />
      )}
    </button>
  )
}
