'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShieldCheck, Users, Calendar } from 'lucide-react'
import { MaterialIcon } from '@/components/icons/material-icon'
import { MemberDrawer, type DrawerMember } from './MemberDrawer'

interface MembersGridProps {
  members: DrawerMember[]
  postes: { id: string; name: string }[]
}

export function MembersGrid({ members, postes }: MembersGridProps) {
  const [selectedMember, setSelectedMember] = useState<DrawerMember | null>(null)

  function getInitials(name: string) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in duration-700">
        {members.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setSelectedMember(m)}
            className="group bg-white rounded-3xl border border-slate-100 p-6 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:border-[var(--aduti-primary)]/30 transition-all duration-200 flex flex-col relative cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aduti-primary)]"
          >
            {/* Top accent bar */}
            <div
              className={`absolute top-0 left-0 w-full h-1.5 rounded-t-3xl ${
                m.status === 'ALUMNI'
                  ? 'bg-gradient-to-r from-[var(--aduti-primary)] to-[var(--aduti-secondary)] opacity-80'
                  : 'bg-slate-100'
              }`}
            />

            {/* Badges */}
            <div className="flex items-start justify-between mb-4 mt-2">
              <div className="flex gap-1.5 flex-wrap flex-1 min-w-0">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    m.status === 'ALUMNI'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}
                >
                  {m.status === 'ALUMNI' ? 'Alumni' : 'Étudiant'}
                </span>
                {m.role !== 'MEMBER' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100 truncate max-w-[110px]">
                    <ShieldCheck className="w-3 h-3 shrink-0" />
                    <span className="truncate">{m.role.replace('_', ' ')}</span>
                  </span>
                )}
              </div>
              {/* Hover indicator */}
              <div className="w-7 h-7 rounded-full bg-slate-50 group-hover:bg-[var(--aduti-primary)]/10 flex items-center justify-center transition-colors shrink-0">
                <MaterialIcon name="chevron_right" className="w-4 h-4 text-slate-300 group-hover:text-[var(--aduti-primary)] transition-colors" />
              </div>
            </div>

            {/* Avatar & Info */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full p-1 bg-slate-50 mb-4 relative shadow-sm">
                {m.photo_url ? (
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-slate-100">
                    <Image src={m.photo_url} alt={m.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-2xl">
                    {getInitials(m.name)}
                  </div>
                )}
              </div>

              <h3
                className="text-base font-bold text-slate-900 group-hover:text-[var(--aduti-primary)] transition-colors truncate w-full flex items-center justify-center gap-1.5"
                title={m.name}
              >
                {m.name}
                {m.gender === 'FEMALE' && (
                  <MaterialIcon name="female" className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                {m.gender === 'MALE' && (
                  <MaterialIcon name="male" className="w-4 h-4 text-blue-400 shrink-0" />
                )}
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-0.5 truncate w-full" title={m.email}>
                {m.email}
              </p>
              <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded inline-block">
                {m.promotion.name}
              </p>
            </div>

            {/* Footer */}
            <div className="w-full pt-4 mt-auto border-t border-slate-50 flex items-center justify-between text-slate-400 text-xs mt-6">
              <div className="flex items-center gap-1.5" title={m.poste?.name ?? 'Sans poste'}>
                <Users className="w-3.5 h-3.5" />
                <span className="truncate max-w-[100px]">{m.poste?.name ?? 'Sans poste'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(m.created_at).toLocaleDateString('fr-FR', {
                  month: 'short',
                  year: 'numeric',
                })}
              </div>
            </div>
          </button>
        ))}
      </div>

      <MemberDrawer
        member={selectedMember}
        postes={postes}
        onClose={() => setSelectedMember(null)}
        canEdit={true}
      />
    </>
  )
}
