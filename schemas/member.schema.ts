import { z } from 'zod'

// Schéma de base pour un membre
export const memberBaseSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  promo_id: z.string().min(1, 'Veuillez sélectionner une promotion'),
  status: z.enum(['STUDENT', 'ALUMNI']),
  poste: z.enum(['NONE', 'PRESIDENT', 'VICE_PRESIDENT', 'TREASURER', 'SECRETARY', 'MEMBER_BUREAU']).default('NONE'),
  description: z.string().max(1000).optional(),
  photo_url: z.string().url().optional().or(z.literal('')),
})

// Schéma pour un étudiant
export const studentMemberSchema = memberBaseSchema.extend({
  status: z.literal('STUDENT'),
  phone: z.string().optional(),
  portfolio_url: z.string().url().optional().or(z.literal('')),
  youtube_url: z.string().url().optional().or(z.literal('')),
  linkedin_url: z.string().url().optional().or(z.literal('')),
})

// Schéma pour un alumni
export const alumniMemberSchema = memberBaseSchema.extend({
  status: z.literal('ALUMNI'),
  current_job_title: z.string().min(2).optional(),
  current_job_description: z.string().max(500).optional(),
})

// Schéma pour la création d'un membre (utilisé par les admins)
export const createMemberSchema = z.discriminatedUnion('status', [
  studentMemberSchema,
  alumniMemberSchema,
])

// Schéma pour la mise à jour d'un membre
export const updateMemberSchema = z.object({
  id: z.string(),
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  promo_id: z.string().optional(),
  status: z.enum(['STUDENT', 'ALUMNI']).optional(),
  poste: z.enum(['NONE', 'PRESIDENT', 'VICE_PRESIDENT', 'TREASURER', 'SECRETARY', 'MEMBER_BUREAU']).optional(),
  description: z.string().max(1000).optional(),
  photo_url: z.string().url().optional().or(z.literal('')),
  // Student fields
  phone: z.string().optional(),
  portfolio_url: z.string().url().optional().or(z.literal('')),
  youtube_url: z.string().url().optional().or(z.literal('')),
  linkedin_url: z.string().url().optional().or(z.literal('')),
  // Alumni fields
  current_job_title: z.string().min(2).optional(),
  current_job_description: z.string().max(500).optional(),
})

// Types dérivés
export type MemberBase = z.infer<typeof memberBaseSchema>
export type StudentMember = z.infer<typeof studentMemberSchema>
export type AlumniMember = z.infer<typeof alumniMemberSchema>
export type CreateMemberInput = z.infer<typeof createMemberSchema>
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>
