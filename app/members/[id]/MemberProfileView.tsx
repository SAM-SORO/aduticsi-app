'use client'

import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import type { Member, Poste, Promotion } from '@prisma/client'
import { MaterialIcon } from '@/components/icons/material-icon'

type MemberWithRelations = Member & {
  poste: Poste | null;
  promotion: Promotion;
}

interface MemberProfileViewProps {
  member: MemberWithRelations;
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
    <a
      href={href.startsWith('http') ? href : `https://${href}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group ${color}`}
    >
      <MaterialIcon name={icon} className="w-5 h-5" />
      <span className="text-sm font-bold truncate max-w-[140px]">{label}</span>
      <MaterialIcon name="open_in_new" className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
    </a>
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

export function MemberProfileView({ member }: MemberProfileViewProps) {
  const hasSocials = member.linkedin_url || member.youtube_url || member.portfolio_url
  const hasJob = member.current_job_title || member.current_job_description

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-700">
      {/* Hero Card Premium */}
      <motion.div
        custom={0}
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="relative bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-50/60 via-slate-50/30 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="relative flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start text-center md:text-left z-10 p-8 md:p-12">
          {/* Avatar Section */}
          <div className="relative group flex-shrink-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--aduti-primary)] to-blue-400 blur-xl opacity-20 transition-opacity duration-300 rounded-[2.5rem]"></div>
            
            <div className="relative w-36 h-36 md:w-44 md:h-44 p-1.5 bg-gradient-to-tr from-slate-100 via-white to-slate-100 rounded-[2.5rem] shadow-xl border border-white/80">
              <div className="w-full h-full rounded-[2.2rem] overflow-hidden bg-slate-50 relative border border-slate-100/50">
                {member.photo_url ? (
                  <Image src={member.photo_url} alt={member.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
                    <MaterialIcon name="person" className="w-16 h-16 md:w-20 md:h-20 text-slate-300/80" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Identity Section */}
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
              {member.poste && (
                <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200/60 flex items-center gap-1.5 shadow-sm">
                  <MaterialIcon name="badge" className="w-3.5 h-3.5" />
                  {member.poste.name}
                </span>
              )}
            </div>

            {/* Description */}
            {member.description && (
              <p className="text-slate-500 font-medium leading-relaxed w-full max-w-full break-all whitespace-pre-wrap pt-2">{member.description}</p>
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
