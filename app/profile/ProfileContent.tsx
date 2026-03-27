'use client'

import { useState, useRef, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion, AnimatePresence, Variants } from 'framer-motion'

import { ImageCropper } from '@/components/ui/ImageCropper'
import { MaterialIcon } from '@/components/icons/material-icon'
import { logout } from '@/app/auth/actions'
import { cn } from '@/lib/utils'
import { updateProfile, uploadAvatar } from './actions'

interface ProfileContentProps {
  member: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    function?: string | null;
    phone?: string | null;
    linkedin_url?: string | null;
    youtube_url?: string | null;
    portfolio_url?: string | null;
    current_job_title?: string | null;
    current_job_description?: string | null;
    description?: string | null;
    photo_url?: string | null;
    gender?: string | null;
    promotion?: { name: string } | null;
    poste?: { name: string } | null;
  }
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  })
}

const STATUS_LABELS: Record<string, string> = { STUDENT: 'Étudiant', ALUMNI: 'Alumni' }
const GENDER_LABELS: Record<string, string> = { MALE: 'Homme', FEMALE: 'Femme' }

function SocialLink({ href, icon, label, color }: { href: string; icon: string; label: string; color: string }) {
  return (
    <Link
      href={href.startsWith('http') ? href : `https://${href}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group ${color}`}
    >
      <MaterialIcon name={icon} className="w-5 h-5" />
      <span className="text-sm font-bold truncate max-w-[140px]">{label}</span>
      <MaterialIcon name="open_in_new" className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  )
}

function InfoChip({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
        <MaterialIcon name={icon} className="w-[18px] h-[18px]" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</div>
        <div className="text-sm font-bold text-slate-800 truncate">{value}</div>
      </div>
    </div>
  )
}

// ── Public Preview ───────────────────────────────────────────────────────────
function PublicPreview({ member }: { member: ProfileContentProps['member'] }) {
  const hasSocials = member.linkedin_url || member.youtube_url || member.portfolio_url
  const hasJob = member.current_job_title || member.current_job_description

  return (
    <div className="space-y-8">
      {/* Hero Card */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="relative bg-gradient-to-br from-[var(--aduti-primary)]/5 via-white to-blue-50/30 rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden p-8 md:p-12"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--aduti-primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Avatar Premium */}
          <div className="relative flex-shrink-0 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--aduti-primary)] to-blue-400 blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-[2.5rem]"></div>
            
            <div className="relative w-32 h-32 md:w-44 md:h-44 p-1.5 bg-gradient-to-tr from-slate-100 via-white to-slate-100 rounded-[2.5rem] shadow-2xl overflow-visible border border-white/50">
              <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-slate-50 relative shadow-inner border border-slate-100/50">
                {member.photo_url ? (
                  <Image src={member.photo_url} alt={member.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
                    <MaterialIcon name="person" className="w-16 h-16 md:w-20 md:h-20 text-slate-300/80" />
                  </div>
                )}
              </div>
              
              <div className="absolute -bottom-3 -right-3 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-50 transition-transform duration-300 group-hover:-translate-y-1">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--aduti-primary)] to-blue-600 rounded-xl flex items-center justify-center text-white shadow-inner">
                  <MaterialIcon name={member.role === 'ADMIN' || member.role === 'SUPER_ADMIN' ? 'security' : 'workspace_premium'} className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Identity */}
          <div className="flex-1 w-full text-center md:text-left space-y-4 min-w-0">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight break-words">{member.name}</h2>
              {hasJob && (
                <p className="text-[var(--aduti-primary)] font-bold text-lg mt-1 break-words">{member.current_job_title}</p>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5 ${member.status === 'ALUMNI' ? 'bg-emerald-500 text-white' : 'bg-[var(--aduti-primary)] text-white'}`}>
                <MaterialIcon name="workspace_premium" className="w-3.5 h-3.5" />
                {STATUS_LABELS[member.status] ?? member.status}
              </span>
              {member.gender && (
                <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1.5 shadow-sm">
                  <MaterialIcon name={member.gender === 'MALE' ? 'male' : 'female'} className="w-3.5 h-3.5" />
                  {GENDER_LABELS[member.gender] ?? member.gender}
                </span>
              )}
              {member.promotion && (
                <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white shadow-sm flex items-center gap-1.5">
                  <MaterialIcon name="school" className="w-3.5 h-3.5" />
                  Promo {member.promotion.name}
                </span>
              )}
              {member.poste && (
                <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-100/80 text-amber-700 border border-amber-200/50 flex items-center gap-1.5 shadow-sm">
                  <MaterialIcon name="verified" className="w-3.5 h-3.5" />
                  {member.poste.name}
                </span>
              )}
            </div>

            {/* Description */}
            {member.description && (
              <p className="text-slate-500 font-medium leading-relaxed w-full max-w-full break-all whitespace-pre-wrap">{member.description}</p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Info Grid */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Contacts */}
        <motion.div custom={1} variants={fadeUp} initial="hidden" animate="show"
          className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[var(--aduti-primary)]">
              <MaterialIcon name="contacts" className="w-[18px] h-[18px]" />
            </div>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Coordonnées</h3>
          </div>
          <div className="space-y-3">
            <InfoChip icon="mail" label="Email" value={member.email} />
            {member.phone && <InfoChip icon="call" label="Téléphone" value={member.phone} />}
          </div>
        </motion.div>

        {/* Parcours Alumni */}
        {hasJob && (
          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show"
            className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-5">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <MaterialIcon name="work" className="w-[18px] h-[18px]" />
              </div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Parcours Professionnel</h3>
            </div>
            <div className="space-y-3">
              {member.current_job_title && <InfoChip icon="badge" label="Poste actuel" value={member.current_job_title} />}
              {member.current_job_description && (
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Missions</div>
                  <p className="text-sm font-medium text-slate-600 leading-relaxed">{member.current_job_description}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>

      {/* Réseaux sociaux */}
      {hasSocials && (
        <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show"
          className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500">
              <MaterialIcon name="share" className="w-[18px] h-[18px]" />
            </div>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Réseaux & Liens</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {member.linkedin_url && (
              <SocialLink href={`https://linkedin.com/in/${member.linkedin_url}`} icon="work" label="LinkedIn" color="bg-blue-50 border-blue-100 text-blue-700 hover:border-blue-300" />
            )}
            {member.youtube_url && (
              <SocialLink href={member.youtube_url} icon="play_circle" label="YouTube" color="bg-red-50 border-red-100 text-red-600 hover:border-red-300" />
            )}
            {member.portfolio_url && (
              <SocialLink href={member.portfolio_url} icon="language" label="Portfolio" color="bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-400" />
            )}
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────
export function ProfileContent({ member }: ProfileContentProps) {
  const [isPending, startTransition] = useTransition()
  const [photoUrl, setPhotoUrl] = useState<string | null>(member.photo_url || null)
  const [isUploading, setIsUploading] = useState(false)
  const [isCropping, setIsCropping] = useState(false)
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setTempImageUrl(reader.result as string)
      setIsCropping(true)
    })
    reader.readAsDataURL(file)
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsCropping(false)
    setIsUploading(true)
    try {
      const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' })
      const formData = new FormData()
      formData.append('file', file)
      const result = await uploadAvatar(formData)
      if (result.error) {
        toast.error(result.error)
      } else if (result.publicUrl) {
        setPhotoUrl(result.publicUrl)
        toast.success('Photo de profil mise à jour')
      }
    } catch {
      toast.error("Erreur lors de l'envoi de l'image")
    } finally {
      setIsUploading(false)
      setTempImageUrl(null)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    if (photoUrl) data.photo_url = photoUrl
    startTransition(async () => {
      const result = await updateProfile(data)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Profil mis à jour avec succès')
        router.refresh()
        setActiveTab('preview')
      }
    })
  }

  const handleLogout = async () => {
    await logout()
    router.push('/')
  }

  const displayMember = { ...member, photo_url: photoUrl }

  return (
    <div className="w-full">
      {isCropping && tempImageUrl && (
        <ImageCropper
          image={tempImageUrl}
          onCropComplete={handleCropComplete}
          onCancel={() => { setIsCropping(false); setTempImageUrl(null) }}
          circular={true}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Mon Profil</h1>
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 text-xs font-black text-red-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all flex items-center gap-2 uppercase tracking-widest border border-transparent hover:border-red-100"
        >
          <MaterialIcon name="logout" className="w-[18px] h-[18px]" />
          Quitter
        </button>
      </div>

      {/* Tab Bar */}
      <div className="flex gap-2 mb-6 p-1.5 bg-slate-100/70 rounded-2xl w-fit">
        {(['preview', 'edit'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "relative px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300",
              activeTab === tab
                ? "bg-white text-slate-900 shadow-md"
                : "text-slate-400 hover:text-slate-600"
            )}
          >
            {tab === 'preview' ? (
              <span className="flex items-center gap-2">
                <MaterialIcon name="badge" className="w-4 h-4" />
                Aperçu Public
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <MaterialIcon name="edit" className="w-4 h-4" />
                Modifier
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'preview' ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <PublicPreview member={displayMember} />
          </motion.div>
        ) : (
          <motion.div
            key="edit"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="bg-white rounded-[32px] border border-slate-200/60 overflow-hidden relative">
              {/* Loading Bar */}
              <div className={cn(
                "absolute top-0 left-0 right-0 h-1.5 bg-slate-100 overflow-hidden z-20 transition-opacity duration-300",
                (isPending || isUploading) ? "opacity-100" : "opacity-0"
              )}>
                <div className="h-full bg-[var(--aduti-primary)] animate-shimmer w-full origin-left" />
              </div>

              {/* Avatar Header Premium */}
              <div className="relative bg-white border-b border-slate-100 p-8 md:p-12 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-50/60 via-slate-50/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="relative flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start text-center md:text-left z-10">
                  <div className="relative group flex-shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--aduti-primary)] to-blue-400 blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 rounded-[2.5rem]"></div>
                    
                    <div className="relative w-36 h-36 md:w-44 md:h-44 p-1.5 bg-gradient-to-tr from-slate-100 via-white to-slate-100 rounded-[2.5rem] shadow-xl border border-white/80">
                      <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-slate-50 relative border border-slate-100/50">
                        {photoUrl ? (
                          <Image src={photoUrl} alt="Photo de profil" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
                            <MaterialIcon name="person" className="w-16 h-16 md:w-20 md:h-20 text-slate-300/80" />
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploading}
                          className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white cursor-pointer disabled:cursor-not-allowed backdrop-blur-[2px]"
                        >
                          {isUploading ? (
                            <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <MaterialIcon name="photo_camera" className="w-9 h-9 mb-1 shadow-sm" />
                              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1.5 rounded-lg backdrop-blur-md mt-2">Modifier</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </div>

                  <div className="space-y-4 py-2 flex-1 w-full min-w-0">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight break-words">{member.name}</h2>
                      {member.current_job_title && (
                        <p className="text-[var(--aduti-primary)] font-bold text-lg mt-1 break-words">{member.current_job_title}</p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-center md:justify-start gap-3 text-slate-600 font-bold text-sm bg-slate-50 px-4 py-3 rounded-2xl w-fit mx-auto md:mx-0 border border-slate-100">
                      <div className="w-8 h-8 rounded-lg bg-blue-100/50 flex items-center justify-center">
                        <MaterialIcon name="mail" className="w-[18px] h-[18px] text-blue-600" />
                      </div>
                      <span className="truncate max-w-[200px] sm:max-w-xs">{member.email}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5 ${member.status === 'ALUMNI' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-blue-50 text-blue-700 border border-blue-200/60'}`}>
                        <MaterialIcon name="workspace_premium" className="w-3.5 h-3.5" />
                        {STATUS_LABELS[member.status] ?? member.status}
                      </span>
                      {member.gender && (
                        <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-50 text-slate-600 border border-slate-200 flex items-center gap-1.5 shadow-sm">
                          <MaterialIcon name={member.gender === 'MALE' ? 'male' : 'female'} className="w-3.5 h-3.5" />
                          {GENDER_LABELS[member.gender] ?? member.gender}
                        </span>
                      )}
                      {member.promotion && (
                        <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white flex items-center gap-1.5 shadow-sm">
                          <MaterialIcon name="school" className="w-3.5 h-3.5" />
                          Promo {member.promotion.name}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  {/* Profil Public */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-50">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <MaterialIcon name="person" className="w-[18px] h-[18px] text-slate-500" />
                      </div>
                      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Profil Public</h3>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Nom complet</label>
                      <input name="name" defaultValue={member.name} placeholder="Votre nom"
                        className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[var(--aduti-primary)] outline-none transition-all font-bold text-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Téléphone</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <MaterialIcon name="call" className="w-5 h-5" />
                        </div>
                        <input name="phone" defaultValue={member.phone || ''} placeholder="+225 ..."
                          className="w-full pl-12 pr-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[var(--aduti-primary)] outline-none transition-all font-bold text-slate-700" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Genre</label>
                        <select name="gender" defaultValue={member.gender || ''}
                          className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[var(--aduti-primary)] outline-none transition-all font-bold text-slate-700 appearance-none">
                          <option value="">Non renseigné</option>
                          <option value="MALE">Homme</option>
                          <option value="FEMALE">Femme</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Statut</label>
                        <select name="status" defaultValue={member.status}
                          className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[var(--aduti-primary)] outline-none transition-all font-bold text-slate-700 appearance-none">
                          <option value="STUDENT">Étudiant</option>
                          <option value="ALUMNI">Alumni</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Réseaux */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-50">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <MaterialIcon name="share" className="w-[18px] h-[18px] text-slate-500" />
                      </div>
                      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Réseaux & Liens</h3>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">LinkedIn</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-black">in/</span>
                        <input name="linkedin_url" defaultValue={member.linkedin_url || ''} placeholder="identifiant"
                          className="w-full px-5 pl-12 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[var(--aduti-primary)] outline-none transition-all font-bold text-slate-700" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Youtube</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500/60">
                          <MaterialIcon name="play_circle" className="w-5 h-5" />
                        </div>
                        <input name="youtube_url" defaultValue={member.youtube_url || ''} placeholder="Lien chaîne"
                          className="w-full pl-12 pr-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[var(--aduti-primary)] outline-none transition-all font-bold text-slate-700" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Portfolio</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <MaterialIcon name="language" className="w-5 h-5" />
                        </div>
                        <input name="portfolio_url" defaultValue={member.portfolio_url || ''} placeholder="https://..."
                          className="w-full pl-12 pr-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[var(--aduti-primary)] outline-none transition-all font-bold text-slate-700" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Parcours Pro */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-50">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <MaterialIcon name="work" className="w-[18px] h-[18px] text-slate-500" />
                    </div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Parcours Professionnel</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Poste actuel</label>
                      <input name="current_job_title" defaultValue={member.current_job_title || ''} placeholder="Ex: Architecte Logiciel"
                        className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[var(--aduti-primary)] outline-none transition-all font-bold text-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Description du poste</label>
                      <input name="current_job_description" defaultValue={member.current_job_description || ''} placeholder="Missions principales..."
                        className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[var(--aduti-primary)] outline-none transition-all font-bold text-slate-700" />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-8">
                  <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-50">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                      <MaterialIcon name="article" className="w-[18px] h-[18px] text-slate-500" />
                    </div>
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Bio & Présentation</h3>
                  </div>
                  <div className="space-y-2">
                    <textarea name="description" defaultValue={member.description || ''} rows={5}
                      placeholder="Dites-nous en un peu plus sur vous..."
                      className="w-full px-6 py-5 bg-slate-50/50 border border-slate-200 rounded-[24px] focus:border-[var(--aduti-primary)] outline-none transition-all font-bold text-slate-700 resize-none leading-relaxed" />
                  </div>
                </div>

                <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-slate-100">
                  <div className="flex items-start gap-4 max-w-sm">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex-shrink-0 flex items-center justify-center">
                      <MaterialIcon name="verified" className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
                      Ces informations permettent aux membres de vous identifier et de suivre votre évolution.
                    </p>
                  </div>
                  <button type="submit" disabled={isPending || isUploading}
                    className="w-full sm:w-auto px-12 py-5 bg-[var(--aduti-primary)] text-white font-black rounded-2xl hover:bg-blue-600 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm flex items-center justify-center gap-3">
                    {isPending ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <MaterialIcon name="save" className="w-5 h-5" />}
                    {isPending ? 'Enregistrement...' : 'Mettre à jour'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
