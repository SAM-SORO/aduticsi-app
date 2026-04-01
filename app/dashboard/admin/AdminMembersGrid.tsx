'use client'

import { useState, useTransition } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Activity, ChevronRight, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { updateMemberFunction } from '@/app/dashboard/super-admin/members/actions'

interface AdminMember {
  id: string
  name: string
  email: string
  status: 'STUDENT' | 'ALUMNI'
  function: string
}

interface AdminMembersGridProps {
  members: AdminMember[]
}

export function AdminMembersGrid({ members }: AdminMembersGridProps) {
  const [selectedMember, setSelectedMember] = useState<AdminMember | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleToggleFunction = (member: AdminMember) => {
    const nextFunction = member.function === 'GESTION_ACTIVITES' ? 'NONE' : 'GESTION_ACTIVITES'
    startTransition(async () => {
      await updateMemberFunction(member.id, nextFunction as 'NONE' | 'GESTION_ACTIVITES')
      toast.success(
        nextFunction === 'GESTION_ACTIVITES'
          ? `Accès accordé à ${member.name}`
          : `Accès retiré à ${member.name}`
      )
      // Refresh selected member state
      if (selectedMember?.id === member.id) {
        setSelectedMember({ ...selectedMember, function: nextFunction })
      }
    })
  }

  function getInitials(name: string) {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  return (
    <>
      {members.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-100">
          <p className="text-slate-400">Aucun membre dans votre promotion.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelectedMember(m)}
              className="group bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-lg hover:border-[var(--aduti-primary)]/20 transition-all duration-200 flex items-center gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--aduti-primary)]"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 font-bold text-lg shrink-0 group-hover:from-[var(--aduti-primary)]/10 group-hover:to-[var(--aduti-primary)]/5 transition-all">
                {getInitials(m.name)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 truncate text-sm group-hover:text-[var(--aduti-primary)] transition-colors">
                  {m.name}
                </p>
                <p className="text-xs text-slate-500 truncate">{m.email}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    m.status === 'ALUMNI'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'bg-blue-50 text-blue-600 border border-blue-100'
                  }`}>
                    {m.status === 'ALUMNI' ? 'Alumni' : 'Étudiant'}
                  </span>
                  {m.function === 'GESTION_ACTIVITES' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-violet-50 text-violet-600 border border-violet-100">
                      <Activity className="w-2.5 h-2.5" />
                      Activités
                    </span>
                  )}
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--aduti-primary)] shrink-0 transition-colors" />
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
                    {getInitials(selectedMember.name)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{selectedMember.name}</h3>
                    <p className="text-sm text-slate-500">{selectedMember.email}</p>
                    <div className="flex gap-1.5 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        selectedMember.status === 'ALUMNI'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {selectedMember.status === 'ALUMNI' ? 'Alumni' : 'Étudiant'}
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
                            : 'bg-[var(--aduti-primary)] text-white hover:bg-blue-600 shadow-sm'
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
