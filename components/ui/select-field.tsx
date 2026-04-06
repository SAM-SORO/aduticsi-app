'use client'

import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  icon?: React.ReactNode
}

/**
 * Composant Select moderne avec :
 * - Icône chevron toujours visible (flèche bas)
 * - Support icône à gauche (optionnel)
 * - Styles cohérents avec les inputs du projet
 * - Pas de placeholder — la première option doit être la valeur par défaut
 */
const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, icon, className, children, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {/* Icône gauche (optionnelle) */}
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
              {icon}
            </div>
          )}

          <select
            ref={ref}
            className={cn(
              // Base
              'w-full appearance-none font-bold text-slate-700 bg-slate-50/50 border border-slate-200 rounded-2xl',
              // Spacing
              'py-3.5 pr-11',
              icon ? 'pl-12' : 'pl-5',
              // Focus
              'focus:outline-none focus:border-[var(--aduti-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--aduti-primary)]/8',
              // Hover
              'hover:border-slate-300 hover:bg-white transition-all duration-200',
              // Disabled
              'disabled:opacity-50 disabled:cursor-not-allowed',
              // Cursor
              'cursor-pointer',
              className
            )}
            {...props}
          >
            {children}
          </select>

          {/* Chevron — toujours visible, sur fond blanc au hover */}
          <div className="absolute right-0 top-0 bottom-0 w-11 flex items-center justify-center pointer-events-none">
            <div className={cn(
              'w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200',
              'bg-white border border-slate-200 shadow-sm',
              'group-hover:border-slate-300 group-focus-within:border-[var(--aduti-primary)] group-focus-within:bg-[var(--aduti-primary)]/5'
            )}>
              <ChevronDown className="w-4 h-4 text-slate-500 group-focus-within:text-[var(--aduti-primary)] transition-colors" />
            </div>
          </div>
        </div>
      </div>
    )
  }
)

SelectField.displayName = 'SelectField'

export { SelectField }
