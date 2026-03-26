'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'

import { setActivePromo } from './actions'

interface ActivePromoFormProps {
  promotions: { id: string; name: string }[]
  currentPromoId: string | null
}

export function ActivePromoForm({ promotions, currentPromoId }: ActivePromoFormProps) {
  const [isPending, startTransition] = useTransition()

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPromoId = e.target.value
    if (!newPromoId || newPromoId === currentPromoId) return

    startTransition(async () => {
      const result = await setActivePromo(newPromoId)
      if (result?.error) {
        toast.error(result.error)
      } else {
        toast.success("Promotion active mise à jour")
      }
    })
  }

  return (
    <div className="w-full sm:w-1/3">
      <label
        className="block text-sm font-medium leading-6 text-slate-900 mb-2"
        htmlFor="promo-select"
      >
        Sélectionner la promotion active
      </label>
      <select
        className="block w-full rounded-md border-0 py-2 pl-3 pr-10 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-[var(--aduti-primary)] sm:text-sm sm:leading-6 bg-white disabled:opacity-50"
        id="promo-select"
        defaultValue={currentPromoId || ""}
        onChange={handleSelectChange}
        disabled={isPending}
      >
        <option value="" disabled>
          Sélectionner une promotion
        </option>
        {promotions.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  )
}
