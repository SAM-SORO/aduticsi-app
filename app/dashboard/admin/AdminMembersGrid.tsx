'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Activity, ChevronRight, ShieldCheck, GraduationCap } from 'lucide-react'
import { toast } from 'sonner'
import { updateMemberFunction, updateMemberPromotion } from '@/app/dashboard/super-admin/members/actions'
import { StatusPill } from '@/components/ui/status-pill'

interface AdminMember {
  id: string
  first_name: string
  last_name: string
  email: string
  status: 'STUDENT' | 'ALUMNI'
  gender?: 'MALE' | 'FEMALE' | null
  promo_id: string
  function: string
}

interface AdminMembersGridProps {
  members: AdminMember[]
  promotions: { id: string; name: string }[]
}

export function AdminMembersGrid({ members, promotions }: AdminMembersGridProps) {
  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleToggleFunction = (member: AdminMember) => {
    const nextFunction = member.function === 'GESTION_ACTIVITES' ? 'NONE' : 'GESTION_ACTIVITES'
    const displayName = `${member.last_name.toUpperCase()} ${member.first_name}`
    startTransition(async () => {
      await updateMemberFunction(member.id, nextFunction as 'NONE' | 'GESTION_ACTIVITES')
      toast.success(
        nextFunction === 'GESTION_ACTIVITES'
          ? `Accès accordé à ${displayName}`
          : `Accès retiré à ${displayName}`
      )
      // Refresh selected member state
      if (selectedMember?.id === member.id) {
        setSelectedMember({ ...selectedMember, function: nextFunction })
      }
    })
  }

  const handlePromoChange = (memberId: string, promoId: string) => {
    startTransition(async () => {
      await updateMemberPromotion(memberId, promoId)
      toast.success('Promotion mise à jour')
      if (selectedMember?.id === memberId) {
        setSelectedMember({ ...selectedMember, promo_id: promoId })
      }
    })
  }

  function getInitials(firstName: string, lastName: string) {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
  }

  return (
    <>
      {members.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center">
          <p className="text-slate-400">Aucun membre dans votre promotion.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMember(m)}
              className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left transition-colors duration-200 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aduti-primary)]"
            >
              {/* Avatar */}
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                {getInitials(m.first_name, m.last_name)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="line-clamp-2 break-words text-sm font-semibold text-slate-900">
                  {m.last_name.toUpperCase()} {m.first_name}
                </p>
                <p className="truncate text-xs text-slate-500">{m.email}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  <StatusPill tone={m.status === 'ALUMNI' ? 'accent' : 'neutral'}>
                    {m.status === 'ALUMNI' ? 'Alumni' : (m.gender === 'FEMALE' ? 'Étudiante' : 'Étudiant')}
                  </StatusPill>
                  {m.function === 'GESTION_ACTIVITES' && (
                    <StatusPill>
                      <Activity className="size-3" />
                      Activités
                    </StatusPill>
                  )}
                </div>
              </div>

              <ChevronRight className="size-4 shrink-0 text-slate-300 transition-colors group-hover:text-slate-500" />
            </button>
          ))}
        </div>
      )}

      {/* ── Member Detail Drawer ── */}
      <AnimatePresence>
        {selectedMember && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMember(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40"
            />
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.38 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl border-l border-slate-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                  Fiche membre
                </h2>
                <button
                  onClick={() => setSelectedMember(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Identity */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--aduti-primary)]/10 to-[var(--aduti-primary)]/5 flex items-center justify-center text-[var(--aduti-primary)] font-bold text-2xl shrink-0">
                    {getInitials(selectedMember.first_name, selectedMember.last_name)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{selectedMember.last_name.toUpperCase()} {selectedMember.first_name}</h3>
                    <p className="text-sm text-slate-500">{selectedMember.email}</p>
                    <div className="flex gap-1.5 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        selectedMember.status === 'ALUMNI'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {selectedMember.status === 'ALUMNI' ? 'Alumni' : (selectedMember.gender === 'FEMALE' ? 'Étudiante' : 'Étudiant')}
                      </span>
                    </div>
                  </div>
                </div>

                <hr className="border-slate-100" />

                {/* Function Toggle Section */}
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Gestion des accès
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">Gestion des Activités</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Autorise ce membre à créer et gérer les activités de la promotion.
                        </p>
                        <span className={`inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded-lg text-xs font-bold ${
                          selectedMember.function === 'GESTION_ACTIVITES'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          <Activity className="w-3 h-3" />
                          {selectedMember.function === 'GESTION_ACTIVITES' ? 'Accès actif' : 'Aucun accès'}
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleToggleFunction(selectedMember)}
                        className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 ${
                          selectedMember.function === 'GESTION_ACTIVITES'
                            ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                            : 'bg-[var(--aduti-primary)] text-white hover:bg-[var(--aduti-primary-hover)] shadow-sm'
                        }`}
                      >
                        {isPending
                          ? '...'
                          : selectedMember.function === 'GESTION_ACTIVITES'
                          ? 'Retirer'
                          : 'Accorder'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Promotion Selector */}
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Changer la promotion
                  </div>
                  <select
                    value={selectedMember.promo_id}
                    disabled={isPending}
                    onChange={(e) => handlePromoChange(selectedMember.id, e.target.value)}
                    className="w-full h-11 bg-slate-50 border border-slate-100 rounded-xl px-4 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--aduti-primary)] focus:bg-white transition-all disabled:opacity-50"
                  >
                    {promotions.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 mt-2 italic">
                    Note : Déplacer ce membre hors de votre promotion vous en fera perdre l&apos;accès.
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
