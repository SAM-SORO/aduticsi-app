'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ExpandableTextProps {
  text: string
  className?: string
  maxLength?: number
}

export function ExpandableText({ text, className, maxLength = 180 }: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const isLong = text.length > maxLength

  if (!isLong) {
    return <p className={cn("whitespace-pre-wrap break-words", className)}>{text}</p>
  }

  return (
    <div className="space-y-1.5 w-full group">
      <div 
        className={cn(
          "whitespace-pre-wrap break-words", 
          className, 
          !isExpanded && "line-clamp-3"
        )}
      >
        {text}
      </div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-1 text-xs font-bold text-slate-400 group-hover:text-[var(--aduti-primary)] transition-colors py-1 focus:outline-none"
      >
        {isExpanded ? (
          <>Voir moins <ChevronUp className="w-3.5 h-3.5" /></>
        ) : (
          <>Lire la suite <ChevronDown className="w-3.5 h-3.5" /></>
        )}
      </button>
    </div>
  )
}
