import { redirect } from 'next/navigation'
import { Link2 as LinkIcon, Clock, ShieldCheck, Plus } from 'lucide-react'

import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

import { createInvitation } from './actions'
import { CopyButton } from './copy-button'
import { InvitationActions } from './invitation-actions'

async function getInvitations() {
  return await prisma.invitation.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      creator: {
        select: {
          name: true
        }
      }
    }
  })
}

export default async function InvitationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  let member = await prisma.member.findUnique({
    where: { id: user.id },
    select: { id: true, role: true, name: true, email: true },
  })

  // Fallback to email if not found by ID
  if (!member && user.email) {
    member = await prisma.member.findUnique({
      where: { email: user.email },
      select: { id: true, role: true, name: true, email: true },
    })
  }

  if (!member || member.role !== 'SUPER_ADMIN') {
    redirect('/')
  }

  const invitations = await getInvitations()

  async function handleCreate(formData: FormData) {
    'use server'
    const title = formData.get('title') as string
    const expirationValue = formData.get('expirationValue') as string
    const expirationUnit = formData.get('expirationUnit') as string

    await createInvitation({
      title,
      expirationValue: Number(expirationValue),
      expirationUnit: expirationUnit as 'days' | 'months' | 'years',
      created_by: member!.id
    })
  }


  return (
    <DashboardShell
      member={member}
      activePath="/dashboard/super-admin/invitations"
      title="Liens d'Invitation"
    >
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Liens d&apos;Invitation</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Colonne de gauche : Formulaire de création */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[var(--aduti-primary)]" />
                      Nouveau lien d&apos;invitation
                    </h3>
                  </div>
                  
                  <form action={handleCreate} className="p-5 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Titre / Description</label>
                      <input 
                        type="text" 
                        name="title" 
                        required
                        placeholder="ex: Rentrée 2024 - Général" 
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--aduti-primary)] focus:border-[var(--aduti-primary)] outline-none text-sm transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">Durée de validité</label>
                      <div className="flex gap-2">
                        <input 
                          type="number" 
                          name="expirationValue" 
                          required
                          min="1"
                          max="100"
                          defaultValue="1"
                          className="w-2/3 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--aduti-primary)] focus:border-[var(--aduti-primary)] outline-none text-sm transition-all bg-slate-50 focus:bg-white"
                        />
                        <select
                          name="expirationUnit"
                          className="w-1/3 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[var(--aduti-primary)] focus:border-[var(--aduti-primary)] outline-none text-sm transition-all bg-slate-50 focus:bg-white"
                        >
                          <option value="days">Jour(s)</option>
                          <option value="months">Mois</option>
                          <option value="years">Année(s)</option>
                        </select>
                      </div>
                      <p className="text-xs text-slate-500">Le lien expirera automatiquement après ce délai.</p>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-[var(--aduti-primary)] text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      Générer le lien
                    </button>
                  </form>
                </div>
              </div>

              {/* Colonne de droite : Liste des liens */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-slate-400" />
                  Liens actifs et expirés ({invitations.length})
                </h3>

                {invitations.length === 0 ? (
                  <div className="bg-white rounded-xl border border-slate-200 border-dashed p-10 text-center text-slate-500">
                    <LinkIcon className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                    <p>Aucun lien d&apos;invitation généré pour le moment.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {invitations.map((invitation) => {
                      const isExpired = new Date() > new Date(invitation.expires_at);
                      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
                      const inviteUrl = `${baseUrl}/auth/register?token=${invitation.token}`;
                      
                      return (
                        <div 
                          key={invitation.id} 
                          className={`bg-white rounded-xl border p-5 transition-all shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center ${isExpired ? 'border-red-100 bg-red-50/30 opacity-70' : 'border-slate-200 hover:border-blue-200 hover:shadow-md'}`}
                        >
                          <div className="space-y-1 w-full relative">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-slate-900">{invitation.title}</h4>
                              {isExpired ? (
                                <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">Expiré</span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">Actif</span>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                              <div className="flex items-center gap-1">
                                <ShieldCheck className="w-3.5 h-3.5" />
                                Créé par {invitation.creator.name}
                              </div>
                              <div className="flex items-center gap-1" title={invitation.expires_at.toLocaleString('fr-FR')}>
                                <Clock className={`w-3.5 h-3.5 ${isExpired ? 'text-red-400' : ''}`} />
                                {isExpired ? 'Expiré le' : 'Expire le'} {invitation.expires_at.toLocaleDateString('fr-FR')}
                              </div>
                            </div>

                            {/* URL Display and Copy */}
                            {!isExpired && (
                              <div className="mt-3 flex gap-2">
                                <input 
                                  readOnly 
                                  value={inviteUrl} 
                                  className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-600 w-full outline-none font-mono"
                                />
                              </div>
                            )}
                          </div>

                          <div className="flex sm:flex-col gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                            <InvitationActions id={invitation.id} />
                            {!isExpired && (
                              <CopyButton text={inviteUrl} />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
    </DashboardShell>
  )
}
