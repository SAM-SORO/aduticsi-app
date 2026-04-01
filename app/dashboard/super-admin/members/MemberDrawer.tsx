'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  X,
  Pencil,
  Trash2,
  Loader2,
  AlertTriangle,
  Mail,
  Phone,
  Linkedin,
  Link,
  Youtube,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  Users2,
  Info,
  ChevronLeft,
  Activity,
} from 'lucide-react'
import {
  updateMemberRole,
  updateMemberStatus,
  updateMemberPoste,
  updateMemberGender,
  updateMemberFunction,
  deleteMember,
} from './actions'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DrawerMember {
  id: string
  name: string
  email: string
  role: 'MEMBER' | 'ADMIN' | 'SUPER_ADMIN'
  status: 'STUDENT' | 'ALUMNI'
  function?: string | null
  gender?: 'MALE' | 'FEMALE' | null
  photo_url?: string | null
  phone?: string | null
  linkedin_url?: string | null
  portfolio_url?: string | null
  youtube_url?: string | null
  description?: string | null
  current_job_title?: string | null
  poste_id?: string | null
  poste?: { id: string; name: string } | null
  promotion: { name: string }
  created_at: Date
}

interface MemberDrawerProps {
  member: DrawerMember | null
  postes: { id: string; name: string }[]
  onClose: () => void
  /** Si false, le mode édition n'est pas accessible (ex: ADMIN) */
  canEdit?: boolean
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  MEMBER: 'Membre',
  ADMIN: 'Admin',
  SUPER_ADMIN: 'Super Admin',
}
const STATUS_LABELS: Record<string, string> = {
  STUDENT: 'Étudiant',
  ALUMNI: 'Alumni',
}
const GENDER_LABELS: Record<string, string> = {
  MALE: 'Homme',
  FEMALE: 'Femme',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

// ─── Section Label Component ──────────────────────────────────────────────────

function SectionLabel({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">
      <Icon className="w-3.5 h-3.5" />
      {label}
    </div>
  )
}

// ─── Radio Group Component ────────────────────────────────────────────────────

function RadioGroup<T extends string>({
  value,
  options,
  onChange,
  disabled,
}: {
  value: T
  options: { value: T; label: string }[]
  onChange: (v: T) => void
  disabled?: boolean
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          disabled={disabled}
          onClick={() => onChange(opt.value)}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition-all ${
            value === opt.value
              ? 'bg-[var(--aduti-primary)] text-white border-[var(--aduti-primary)] shadow-sm'
              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function MemberDrawer({ member, postes, onClose, canEdit = true }: MemberDrawerProps) {
  const [mode, setMode] = useState<'view' | 'edit'>('view')
  const [isPending, startTransition] = useTransition()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Local editable state (starts from member values)
  const [editRole, setEditRole] = useState<'MEMBER' | 'ADMIN' | 'SUPER_ADMIN'>(member?.role ?? 'MEMBER')
  const [editStatus, setEditStatus] = useState<'STUDENT' | 'ALUMNI'>(member?.status ?? 'STUDENT')
  const [editPosteId, setEditPosteId] = useState<string>(member?.poste_id ?? 'none')
  const [editGender, setEditGender] = useState<string>(member?.gender ?? 'none')
  const [editFunction, setEditFunction] = useState<string>(member?.function ?? 'NONE')

  // Reset edit state when member changes
  if (member && editRole !== member.role && mode === 'view') {
    setEditRole(member.role)
    setEditStatus(member.status)
    setEditPosteId(member.poste_id ?? 'none')
    setEditGender(member.gender ?? 'none')
    setEditFunction(member.function ?? 'NONE')
  }

  const handleRoleChange = (newRole: 'MEMBER' | 'ADMIN' | 'SUPER_ADMIN') => {
    setEditRole(newRole)
    startTransition(async () => {
      const res = await updateMemberRole(member!.id, newRole)
      if (res.success) toast.success('Rôle mis à jour')
    })
  }

  const handleStatusChange = (newStatus: 'STUDENT' | 'ALUMNI') => {
    setEditStatus(newStatus)
    startTransition(async () => {
      const res = await updateMemberStatus(member!.id, newStatus)
      if (res.success) toast.success('Statut mis à jour')
    })
  }

  const handlePosteChange = (posteId: string) => {
    setEditPosteId(posteId)
    const effectiveId = posteId === 'none' ? null : posteId
    startTransition(async () => {
      const res = await updateMemberPoste(member!.id, effectiveId)
      if (res.success) toast.success('Poste mis à jour')
    })
  }

  const handleGenderChange = (gender: string) => {
    setEditGender(gender)
    const effectiveGender = gender === 'none' ? null : (gender as 'MALE' | 'FEMALE')
    startTransition(async () => {
      const res = await updateMemberGender(member!.id, effectiveGender)
      if (res.success) toast.success('Genre mis à jour')
    })
  }

  const handleFunctionToggle = () => {
    const next = editFunction === 'GESTION_ACTIVITES' ? 'NONE' : 'GESTION_ACTIVITES'
    setEditFunction(next)
    startTransition(async () => {
      const res = await updateMemberFunction(member!.id, next as 'NONE' | 'GESTION_ACTIVITES')
      if (res.success)
        toast.success(
          next === 'GESTION_ACTIVITES' ? 'Accès activités accordé' : 'Accès activités retiré'
        )
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteMember(member!.id)
      if (res.success) {
        toast.success('Membre supprimé')
        setIsDeleteDialogOpen(false)
        onClose()
      }
    })
  }

  return (
    <>
      <AnimatePresence>
        {member && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-40"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.38 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl border-l border-slate-200 overflow-hidden"
            >
              {/* ── Header ── */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white shrink-0">
                <div className="flex items-center gap-3">
                  {mode === 'edit' && (
                    <button
                      onClick={() => setMode('view')}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                    {mode === 'edit' ? 'Modifier le membre' : 'Fiche membre'}
                  </h2>
                </div>
                <div className="flex items-center gap-1">
                  {canEdit && mode === 'view' && (
                    <button
                      onClick={() => setMode('edit')}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-[var(--aduti-primary)] bg-[var(--aduti-primary)]/10 rounded-lg hover:bg-[var(--aduti-primary)]/20 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Modifier
                    </button>
                  )}
                  <button
                    onClick={onClose}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ── Content ── */}
              <div className="flex-1 overflow-y-auto">

                {/* ── VIEW MODE ── */}
                {mode === 'view' && (
                  <div className="p-6 space-y-6">
                    {/* Avatar + Identity */}
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold text-2xl shrink-0 border border-slate-100">
                        {member.photo_url ? (
                          <Image src={member.photo_url} alt={member.name} width={80} height={80} className="object-cover w-full h-full" />
                        ) : (
                          getInitials(member.name)
                        )}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-bold text-slate-900 truncate">{member.name}</h3>
                        <p className="text-sm text-slate-500 truncate">{member.email}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            member.status === 'ALUMNI'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-blue-50 text-blue-700 border-blue-100'
                          }`}>
                            {STATUS_LABELS[member.status]}
                          </span>
                          {member.role !== 'MEMBER' && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100">
                              <ShieldCheck className="w-3 h-3" />
                              {ROLE_LABELS[member.role]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* Key Info Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <InfoTile icon={GraduationCap} label="Promotion" value={member.promotion.name} />
                      <InfoTile icon={Briefcase} label="Poste" value={member.poste?.name ?? '—'} />
                      <InfoTile icon={Users2} label="Genre" value={GENDER_LABELS[member.gender ?? ''] ?? '—'} />
                      <InfoTile icon={Info} label="Inscrit le" value={formatDate(member.created_at)} />
                    </div>

                    {/* Contact */}
                    {(member.phone || member.linkedin_url || member.portfolio_url || member.youtube_url) && (
                      <>
                        <hr className="border-slate-100" />
                        <div className="space-y-2">
                          <SectionLabel icon={Mail} label="Contact & Réseaux" />
                          {member.phone && (
                            <ContactLink href={`tel:${member.phone}`} icon={Phone} label={member.phone} />
                          )}
                          {member.linkedin_url && (
                            <ContactLink href={member.linkedin_url} icon={Linkedin} label="LinkedIn" external />
                          )}
                          {member.portfolio_url && (
                            <ContactLink href={member.portfolio_url} icon={Link} label="Portfolio" external />
                          )}
                          {member.youtube_url && (
                            <ContactLink href={member.youtube_url} icon={Youtube} label="YouTube" external />
                          )}
                        </div>
                      </>
                    )}

                    {/* Description */}
                    {member.description && (
                      <>
                        <hr className="border-slate-100" />
                        <div>
                          <SectionLabel icon={Info} label="À propos" />
                          <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {member.description}
                          </p>
                        </div>
                      </>
                    )}

                    {/* Job (Alumni) */}
                    {member.current_job_title && (
                      <div className="bg-slate-50 rounded-xl px-4 py-3 flex items-center gap-3 border border-slate-100">
                        <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-sm font-semibold text-slate-700">{member.current_job_title}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* ── EDIT MODE ── */}
                {mode === 'edit' && (
                  <div className="p-6 space-y-7">
                    {/* Pending indicator */}
                    {isPending && (
                      <div className="flex items-center gap-2 text-sm text-[var(--aduti-primary)] bg-blue-50 px-4 py-2.5 rounded-lg border border-blue-100">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enregistrement en cours…
                      </div>
                    )}

                    {/* Section: Rôle */}
                    <div>
                      <SectionLabel icon={ShieldCheck} label="Niveau d'accès (Rôle)" />
                      <RadioGroup
                        value={editRole}
                        options={[
                          { value: 'MEMBER', label: 'Membre' },
                          { value: 'ADMIN', label: 'Admin' },
                          { value: 'SUPER_ADMIN', label: 'Super Admin' },
                        ]}
                        onChange={handleRoleChange}
                        disabled={isPending}
                      />
                    </div>

                    {/* Section: Statut */}
                    <div>
                      <SectionLabel icon={GraduationCap} label="Statut scolaire" />
                      <RadioGroup
                        value={editStatus}
                        options={[
                          { value: 'STUDENT', label: 'Étudiant' },
                          { value: 'ALUMNI', label: 'Alumni' },
                        ]}
                        onChange={handleStatusChange}
                        disabled={isPending}
                      />
                    </div>

                    {/* Section: Genre */}
                    <div>
                      <SectionLabel icon={Users2} label="Genre" />
                      <RadioGroup
                        value={editGender}
                        options={[
                          { value: 'none', label: 'Non renseigné' },
                          { value: 'MALE', label: 'Homme' },
                          { value: 'FEMALE', label: 'Femme' },
                        ]}
                        onChange={handleGenderChange}
                        disabled={isPending}
                      />
                    </div>

                    {/* Section: Poste */}
                    <div>
                      <SectionLabel icon={Briefcase} label="Poste au bureau" />
                      <select
                        value={editPosteId}
                        disabled={isPending}
                        onChange={(e) => handlePosteChange(e.target.value)}
                        className="w-full h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[var(--aduti-primary)]/30 focus:border-[var(--aduti-primary)] transition-all disabled:opacity-50"
                      >
                        <option value="none">— Aucun poste —</option>
                        {postes.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Section: Gestion Activités */}
                    {/* Only available for MEMBER role (not admins) */}
                    {editRole === 'MEMBER' && (
                      <div>
                        <SectionLabel icon={Activity} label="Gestion des Activités" />
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 text-sm">Accès gestion des activités</p>
                              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                Autorise ce membre à créer et gérer les activités de la promotion.
                              </p>
                              <span className={`inline-flex items-center gap-1.5 mt-2 px-2 py-1 rounded-lg text-xs font-bold ${
                                editFunction === 'GESTION_ACTIVITES'
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-500'
                              }`}>
                                <Activity className="w-3 h-3" />
                                {editFunction === 'GESTION_ACTIVITES' ? 'Accès actif' : 'Aucun accès'}
                              </span>
                            </div>
                            <button
                              type="button"
                              disabled={isPending}
                              onClick={handleFunctionToggle}
                              className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50 ${
                                editFunction === 'GESTION_ACTIVITES'
                                  ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
                                  : 'bg-[var(--aduti-primary)] text-white hover:bg-blue-600 shadow-sm'
                              }`}
                            >
                              {editFunction === 'GESTION_ACTIVITES' ? 'Retirer' : 'Accorder'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Danger zone */}
                    <div className="pt-4 border-t border-slate-100">
                      <SectionLabel icon={AlertTriangle} label="Zone dangereuse" />
                      <button
                        type="button"
                        onClick={() => setIsDeleteDialogOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-sm font-semibold transition-colors w-full justify-center"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer ce membre
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Delete confirm dialog ── */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-white p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-2">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <DialogHeader className="p-0 border-none">
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  Supprimer le membre
                </DialogTitle>
              </DialogHeader>
              <p className="text-slate-500 leading-relaxed">
                Voulez-vous vraiment supprimer{' '}
                <span className="font-bold text-slate-900">&quot;{member?.name}&quot;</span> ?{' '}
                Toutes ses données seront effacées. Cette action est irréversible.
              </p>
            </div>
            <div className="flex gap-3 mt-8">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl text-slate-600 font-semibold"
                onClick={() => setIsDeleteDialogOpen(false)}
                disabled={isPending}
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold"
                onClick={handleDelete}
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Suppression…
                  </>
                ) : (
                  'Supprimer définitivement'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
    </div>
  )
}

function ContactLink({
  href,
  icon: Icon,
  label,
  external,
}: {
  href: string
  icon: React.ElementType
  label: string
  external?: boolean
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 hover:bg-[var(--aduti-primary)]/5 border border-slate-100 hover:border-[var(--aduti-primary)]/20 text-sm font-medium text-slate-700 hover:text-[var(--aduti-primary)] transition-all group"
    >
      <Icon className="w-4 h-4 text-slate-400 group-hover:text-[var(--aduti-primary)] transition-colors shrink-0" />
      {label}
    </a>
  )
}
