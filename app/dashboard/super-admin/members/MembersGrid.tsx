'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShieldCheck, Users, Calendar } from 'lucide-react'
import { MemberDrawer, type DrawerMember } from './MemberDrawer'
import { MaterialIcon } from '@/components/icons/material-icon'
import { StatusPill } from '@/components/ui/status-pill'

interface MembersGridProps {
  members: DrawerMember[]
  postes: { id: string; name: string }[]
  promotions: { id: string; name: string }[]
}

export function MembersGrid({ members, postes, promotions }: MembersGridProps) {
  const [selectedMember, setSelectedMember] = useState<DrawerMember | null>(null)

  function getInitials(m: DrawerMember) {
    const f = m.first_name?.[0] || ""
    const l = m.last_name?.[0] || ""
    return (f + l).toUpperCase() || "?"
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {members.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setSelectedMember(m)}
            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-5 text-left transition-colors duration-200 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aduti-primary)]"
          >
            <div className="flex items-start gap-4">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-full bg-slate-100">
                {m.photo_url ? (
                  <Image src={m.photo_url} alt="" fill sizes="56px" className="object-cover" />
                ) : (
                  <span className="flex size-full items-center justify-center text-sm font-semibold text-slate-500">
                    {getInitials(m)}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3
                  className="truncate text-base font-semibold text-slate-900"
                  title={`${m.last_name?.toUpperCase()} ${m.first_name}`}
                >
                  {m.last_name?.toUpperCase()} {m.first_name}
                </h3>
                <p className="truncate text-sm text-slate-500" title={m.email}>
                  {m.email}
                </p>
              </div>

              <MaterialIcon
                name="chevron_right"
                className="size-4 shrink-0 text-slate-300 transition-colors group-hover:text-slate-500"
              />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <StatusPill tone={m.status === 'ALUMNI' ? 'accent' : 'neutral'}>
                {m.status === 'ALUMNI' ? 'Alumni' : (m.gender === 'FEMALE' ? 'Étudiante' : 'Étudiant')}
              </StatusPill>
              {m.role !== 'MEMBER' && (
                <StatusPill>
                  <ShieldCheck className="size-3 shrink-0" />
                  <span className="truncate">{m.role.replace('_', ' ')}</span>
                </StatusPill>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5 truncate" title={m.poste?.name ?? 'Sans poste'}>
                <Users className="size-3.5 shrink-0" />
                <span className="truncate">{m.poste?.name ?? 'Sans poste'}</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5">
                <Calendar className="size-3.5" />
                Promo {m.promotion.name}
              </span>
            </div>
          </button>
        ))}
      </div>

      <MemberDrawer
        member={selectedMember}
        postes={postes}
        promotions={promotions}
        onClose={() => setSelectedMember(null)}
        canEdit={true}
      />
    </>
  )
}
