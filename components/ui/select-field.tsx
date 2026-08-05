import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  icon?: React.ReactNode
}

/**
 * Composant Select simplifié :
 * - Utilise un masque SVG natif pour le logo chevron, évitant les problèmes de position absolue
 * - S'intègre parfaitement aux conteneurs Flex sans casser les largeurs
 */
const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, icon, className, children, ...props }, ref) => {
    
    // Le select natif avec un joli chevron en background CSS (super léger)
    const selectContent = (
      <select
        ref={ref}
        className={cn(
          "w-full appearance-none bg-slate-50 border border-slate-200 rounded-[14px] py-2.5 font-medium text-slate-700 outline-none focus:border-[var(--aduti-primary)] focus:bg-white focus:ring-4 focus:ring-[var(--aduti-primary)]/10 transition-all disabled:opacity-50 cursor-pointer",
          icon ? "pl-11" : "px-4",
          "bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M19%209l-7%207-7-7%22%2F%3E%3C%2Fsvg%3E')]",
          "bg-[length:1em_1em] bg-[right_1rem_center] bg-no-repeat pr-10",
          className
        )}
        {...props}
      >
        {children}
      </select>
    );

    // Si pas de label ni icône, on retourne juste le select (idéal pour les colonnes Flex ex: w-1/3)
    if (!label && !icon) {
      return selectContent;
    }

    // S'il y a un label ou une icône, on l'enveloppe
    return (
      <div className={cn("space-y-1.5", className && className.includes("w-") ? className : "w-full")}>
        {label && (
          <label className="text-sm font-semibold text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
              {icon}
            </div>
          )}
          {selectContent}
        </div>
      </div>
    )
  }
)

SelectField.displayName = 'SelectField'

export { SelectField }
