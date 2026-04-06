'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'

import { setActivePromo } from './actions'
import { SelectField } from '@/components/ui/select-field'
import { MaterialIcon } from '@/components/icons/material-icon'

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
    <div className="w-full sm:w-72">
      <SelectField
        id="promo-select"
        label="Promotion active"
        icon={<MaterialIcon name="school" className="w-[18px] h-[18px]" />}
        defaultValue={currentPromoId || ""}
        onChange={handleSelectChange}
        disabled={isPending}
      >
        {promotions.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </SelectField>
    </div>
  )
}
