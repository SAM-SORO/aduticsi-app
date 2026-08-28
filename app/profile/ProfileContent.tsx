'use client'

import { useState, useRef, useTransition, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Variants } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion'

import { updateProfile, uploadAvatar } from './actions'
import { ImageCropper } from '@/components/ui/ImageCropper'
import { MaterialIcon } from '@/components/icons/material-icon'
import { ExpandableText } from '@/components/ui/expandable-text'
import { SelectField } from '@/components/ui/select-field'
import { ProfileVisibilityToggle } from '@/components/Profile/ProfileVisibilityToggle'
import { logout } from '@/app/auth/actions'
import { cn } from '@/lib/utils'
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ProfileContentProps {
  member: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
    role: string;
    status: string;
    profile_status: 'PUBLIC' | 'PRIVATE';
    function?: string | null;
    phone?: string | null;
    linkedin_url?: string | null;
    github_url?: string | null;
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
const GENDER_LABELS: Record<string, string> = { MALE: 'Masculin', FEMALE: 'Féminin' }

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
  const hasSocials = member.linkedin_url || member.github_url || member.youtube_url || member.portfolio_url
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="w-full h-full relative cursor-zoom-in outline-none group/btn block border-0 bg-transparent p-0 m-0 text-left">
                        <Image src={member.photo_url} alt={`${member.last_name?.toUpperCase()} ${member.first_name}`} fill className="object-cover transition-transform duration-700 group-hover/btn:scale-105" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[90vw] md:max-w-fit border-none bg-transparent shadow-none p-0 flex justify-center items-center h-[90vh]">
                      <DialogTitle className="sr-only">Photo de profil</DialogTitle>
                      <Image 
                        src={member.photo_url} 
                        alt={`${member.last_name?.toUpperCase()} ${member.first_name}`} 
                        width={1200} 
                        height={1200} 
                        className="max-h-full max-w-full w-auto h-auto object-contain rounded-2xl shadow-2xl"
                        quality={100} 
                      />
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
                    <MaterialIcon name="person" className="w-16 h-16 md:w-20 md:h-20 text-slate-300/80" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Identity */}
          <div className="flex-1 w-full text-center md:text-left space-y-4 min-w-0">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight break-words">
                {member.last_name?.toUpperCase()} {member.first_name}
              </h2>
              {hasJob && (
                <p className="text-[var(--aduti-primary)] font-bold text-lg mt-1 break-words">{member.current_job_title}</p>
              )}
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center gap-1.5 ${member.status === 'ALUMNI' ? 'bg-emerald-500 text-white' : 'bg-[var(--aduti-primary)] text-white'}`}>
                <MaterialIcon name="workspace_premium" className="w-3.5 h-3.5" />
                {member.status === 'STUDENT' 
                  ? (member.gender === 'FEMALE' ? 'Étudiante' : 'Étudiant') 
                  : (STATUS_LABELS[member.status] ?? member.status)}
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
              <div className="pt-2">
                <ExpandableText text={member.description} className="text-slate-500 font-medium leading-relaxed w-full max-w-full" />
              </div>
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
                  <ExpandableText text={member.current_job_description} className="text-sm font-medium text-slate-600 leading-relaxed" />
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
            {member.github_url && (
              <SocialLink href={`https://github.com/${member.github_url}`} icon="code" label="GitHub" color="bg-slate-900 border-slate-800 text-white hover:bg-slate-800" />
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
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [isTabModalOpen, setIsTabModalOpen] = useState(false)
  const [pendingTab, setPendingTab] = useState<'preview' | 'edit' | null>(null)
  const [isCropping, setIsCropping] = useState(false)
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Protection contre le rafraîchissement/fermeture sans sauvegarde
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validation de la taille : max 5 MB
    const MAX_SIZE_MB = 5
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`La photo est trop volumineuse (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum autorisé : ${MAX_SIZE_MB} MB.`)
      // Réinitialiser l'input pour permettre une nouvelle sélection
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setTempImageUrl(reader.result as string)
      setIsCropping(true)
    })
    reader.readAsDataURL(file)
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsCropping(false)
    
    // Libérer l'ancien URL d'aperçu s'il existe
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }

    const localUrl = URL.createObjectURL(croppedBlob)
    const file = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' })
    
    setPreviewUrl(localUrl)
    setPendingAvatarFile(file)
    setPhotoUrl(localUrl) // Afficher l'aperçu immédiatement
    setIsDirty(true)
    toast.info('Nouvelle photo prête à être enregistrée')
  }

  const handleTabChange = (tab: 'preview' | 'edit') => {
    if (activeTab === 'edit' && tab === 'preview' && isDirty) {
      setPendingTab(tab)
      setIsTabModalOpen(true)
      return
    }
    setActiveTab(tab)
  }

  const confirmTabChange = () => {
    if (pendingTab) {
      setActiveTab(pendingTab)
      setIsDirty(false) // On accepte de perdre les changements
    }
    setIsTabModalOpen(false)
    setPendingTab(null)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    
    startTransition(async () => {
      let finalPhotoUrl = member.photo_url || null

      // Étape 1 : Si on a une image en attente, on l'upload d'abord
      if (pendingAvatarFile) {
        setIsUploading(true)
        const uploadFormData = new FormData()
        uploadFormData.append('file', pendingAvatarFile)
        
        try {
          const result = await uploadAvatar(uploadFormData)
          if (result.error) {
            toast.error(result.error)
            return
          }
          if (result.publicUrl) {
            finalPhotoUrl = result.publicUrl
          }
        } catch {
          toast.error("Erreur lors de l'envoi de l'image")
          return
        } finally {
          setIsUploading(false)
        }
      } else {
        // Si pas de nouvelle image, on garde l'URL actuelle
        finalPhotoUrl = photoUrl
      }

      // Étape 2 : Mise à jour du profil complet
      if (finalPhotoUrl) data.photo_url = finalPhotoUrl
      
      const result = await updateProfile(data as Parameters<typeof updateProfile>[0])
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Profil mis à jour avec succès')
        // Nettoyage de l'état local
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl)
        }
        setPhotoUrl(finalPhotoUrl)
        setPendingAvatarFile(null)
        setPreviewUrl(null)
        setIsDirty(false)
        
        // On attend un court instant pour laisser le toast s'afficher avant de recharger
        setTimeout(() => {
          window.location.reload()
        }, 1500)
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
      <div className="flex items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        {/* Statut du profil */}
        <ProfileVisibilityToggle initialStatus={member.profile_status} />

        <button
          onClick={handleLogout}
          className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs font-black text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl sm:rounded-2xl transition-all flex items-center gap-1.5 sm:gap-2 uppercase tracking-widest border border-transparent hover:border-red-100 shrink-0"
        >
          <MaterialIcon name="logout" className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px]" />
          <span className="hidden sm:inline">Déconnexion</span>
          <span className="sm:hidden">Exit</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        {/* Tab Bar */}
        <div className="flex gap-2 p-1.5 bg-slate-100/70 rounded-2xl w-fit">
          {(['preview', 'edit'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
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

        {/* Quick Save Button (TOP) */}
        {activeTab === 'edit' && (
          <button
            type="submit"
            form="profile-form"
            disabled={isPending || isUploading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--aduti-primary)] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-100 disabled:opacity-50 active:scale-95"
          >
            {isPending ? <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <MaterialIcon name="save" className="w-4 h-4" />}
            Mettre à jour
          </button>
        )}
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
                          <>
                            <Image src={photoUrl} alt="Photo de profil" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                            <Dialog>
                              <DialogTrigger asChild>
                                <button 
                                  type="button"
                                  className="absolute top-2 right-2 z-20 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center hover:bg-white/40 cursor-zoom-in"
                                  title="Agrandir la photo"
                                >
                                  <MaterialIcon name="zoom_in" className="w-5 h-5" />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-[80vw] md:max-w-fit border-none bg-transparent shadow-none p-0 flex justify-center items-center h-[80vh] z-[100]">
                                <DialogTitle className="sr-only">Photo de profil</DialogTitle>
                                <Image 
                                  src={photoUrl} 
                                  alt="Photo de profil" 
                                  width={1200} 
                                  height={1200} 
                                  className="max-h-full max-w-full w-auto h-auto object-contain rounded-2xl shadow-2xl" 
                                  quality={100}
                                />
                              </DialogContent>
                            </Dialog>
                          </>
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
                              <span className="text-[9px] font-bold opacity-80 mt-1">MAX 5 MB</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-full text-[9px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">
                      Format JPG/PNG • Max 5 MB
                    </p>
                  </div>

                  <div className="space-y-4 py-2 flex-1 w-full min-w-0">
                    <div>
                      <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight break-words">
                        {member.last_name?.toUpperCase()} {member.first_name}
                      </h2>
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
              <form 
                id="profile-form"
                onSubmit={handleSubmit} 
                onChange={() => setIsDirty(true)}
                className="p-8 md:p-10 space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                  {/* Profil Public */}
                  <div className="space-y-8">
                    <div className="flex items-center gap-3 pb-3 border-b-2 border-slate-50">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                        <MaterialIcon name="person" className="w-[18px] h-[18px] text-slate-500" />
                      </div>
                      <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Profil Public</h3>
                    </div>
                    <div className="flex flex-col gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Nom</label>
                        <input name="last_name" defaultValue={member.last_name || ''} 
                          className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[var(--aduti-primary)] outline-none transition-all text-slate-700" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Prénoms</label>
                        <input name="first_name" defaultValue={member.first_name || ''} 
                          className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[var(--aduti-primary)] outline-none transition-all text-slate-700" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Téléphone</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <MaterialIcon name="call" className="w-5 h-5" />
                        </div>
                        <input name="phone" defaultValue={member.phone || ''} 
                          className="w-full pl-12 pr-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[var(--aduti-primary)] outline-none transition-all text-slate-700" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <SelectField
                        label="Genre"
                        name="gender"
                        defaultValue={member.gender || ''}
                      >
                        <option value="">Non renseigné</option>
                        <option value="MALE">Masculin</option>
                        <option value="FEMALE">Féminin</option>
                      </SelectField>
                      <SelectField
                        label="Statut"
                        name="status"
                        defaultValue={member.status}
                      >
                        <option value="STUDENT">Étudiant</option>
                        <option value="ALUMNI">Alumni</option>
                      </SelectField>
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
                        <input name="linkedin_url" defaultValue={member.linkedin_url || ''} 
                          className="w-full px-5 pl-12 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[var(--aduti-primary)] outline-none transition-all text-slate-700" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">GitHub</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-black">@</span>
                        <input name="github_url" defaultValue={member.github_url || ''} 
                          className="w-full px-5 pl-10 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[var(--aduti-primary)] outline-none transition-all text-slate-700" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Youtube</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500/60">
                          <MaterialIcon name="play_circle" className="w-5 h-5" />
                        </div>
                        <input name="youtube_url" defaultValue={member.youtube_url || ''} 
                          className="w-full pl-12 pr-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[var(--aduti-primary)] outline-none transition-all text-slate-700" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Portfolio</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <MaterialIcon name="language" className="w-5 h-5" />
                        </div>
                        <input name="portfolio_url" defaultValue={member.portfolio_url || ''} 
                          className="w-full pl-12 pr-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[var(--aduti-primary)] outline-none transition-all text-slate-700" />
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
                      <input name="current_job_title" defaultValue={member.current_job_title || ''} 
                        className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[var(--aduti-primary)] outline-none transition-all text-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Description du poste</label>
                      <input name="current_job_description" defaultValue={member.current_job_description || ''} 
                        className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-200 rounded-2xl focus:border-[var(--aduti-primary)] outline-none transition-all text-slate-700" />
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
                      className="w-full px-6 py-5 bg-slate-50/50 border border-slate-200 rounded-[24px] focus:border-[var(--aduti-primary)] outline-none transition-all text-slate-700 resize-none leading-relaxed" />
                  </div>
                </div>

                <div className="pt-10 flex flex-col sm:flex-row items-center justify-between gap-8 border-t border-slate-100">
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

      {/* Modern Confirmation Modal */}
      <Dialog open={isTabModalOpen} onOpenChange={setIsTabModalOpen}>
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
          <div className="bg-white p-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 mb-2 rotate-3">
                <MaterialIcon name="warning" className="h-8 w-8" />
              </div>
              <DialogHeader className="p-0 border-none">
                <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight whitespace-nowrap">Modifications non enregistrées</DialogTitle>
              </DialogHeader>
              <p className="text-slate-500 font-medium leading-relaxed">
                Vous avez apporté des changements à votre profil qui ne sont pas encore enregistrés. Voulez-vous vraiment quitter ?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Button
                variant="outline"
                className="flex-1 h-12 rounded-xl text-slate-600 font-black uppercase tracking-widest text-[10px] border-slate-200 hover:bg-slate-50"
                onClick={() => setIsTabModalOpen(false)}
              >
                Rester ici
              </Button>
              <Button
                variant="destructive"
                className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-200"
                onClick={confirmTabChange}
              >
                Quitter sans sauver
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
