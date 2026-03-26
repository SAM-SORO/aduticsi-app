'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Member, Poste, Promotion } from '@prisma/client'

type MemberWithRelations = Member & {
  poste: Poste | null;
  promotion: Promotion;
}

interface MemberProfileViewProps {
  member: MemberWithRelations;
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }
  })
}

const STATUS_LABELS: Record<string, string> = { STUDENT: 'Étudiant', ALUMNI: 'Alumni' }

function SocialLink({ href, icon, label, color }: { href: string; icon: string; label: string; color: string }) {
  return (
    <a
      href={href.startsWith('http') ? href : `https://${href}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group ${color}`}
    >
      <span className="material-symbols-outlined text-xl">{icon}</span>
      <span className="text-sm font-bold truncate max-w-[140px]">{label}</span>
      <span className="material-symbols-outlined text-sm ml-auto opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
    </a>
  )
}

function InfoChip({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
      <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0">
        <span className="material-symbols-outlined text-lg">{icon}</span>
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
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2rem] ring-8 ring-white shadow-2xl overflow-hidden bg-slate-100 border border-slate-100">
              {member.photo_url ? (
                <Image src={member.photo_url} alt={member.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-slate-300">person</span>
                </div>
              )}
            </div>
            {/* Gender badge */}
            {member.gender && (
              <div className={`absolute -bottom-2 -right-2 w-9 h-9 rounded-full border-4 border-white flex items-center justify-center shadow-lg text-white text-sm ${member.gender === 'MALE' ? 'bg-blue-500' : 'bg-pink-500'}`}>
                <span className="material-symbols-outlined text-base">{member.gender === 'MALE' ? 'man' : 'woman'}</span>
              </div>
            )}
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
              <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${member.status === 'ALUMNI' ? 'bg-emerald-500 text-white' : 'bg-[var(--aduti-primary)] text-white'}`}>
                {STATUS_LABELS[member.status] ?? member.status}
              </span>
              {member.promotion && (
                <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white">
                  Promo {member.promotion.name}
                </span>
              )}
              {member.poste && (
                <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700">
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
              <span className="material-symbols-outlined text-lg">contacts</span>
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
                <span className="material-symbols-outlined text-lg">work</span>
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
              <span className="material-symbols-outlined text-lg">share</span>
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
