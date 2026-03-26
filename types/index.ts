// Global TypeScript types for ADUTI platform

export type MemberRole = 'MEMBER' | 'ADMIN' | 'SUPER_ADMIN'
export type MemberStatus = 'STUDENT' | 'ALUMNI'
export type MemberFunction = 'NONE' | 'GESTION_ACTIVITES'
export type Gender = 'MALE' | 'FEMALE'

// Base interfaces (will be extended with Zod schemas)
export interface Member {
  id: string
  email: string
  name: string
  promo_id: string
  role: MemberRole
  function: MemberFunction
  status: MemberStatus
  gender: Gender | null
  photo_url: string | null
  description: string | null
  phone: string | null
  portfolio_url: string | null
  youtube_url: string | null
  linkedin_url: string | null
  poste_id: string | null
  poste?: Poste | null
  current_job_title: string | null
  current_job_description: string | null
  created_at: Date
  updated_at: Date
}

export interface Poste {
  id: string
  name: string
  created_at?: Date
  updated_at?: Date
}

export interface Promotion {
  id: string
  name: string
  is_current_promo: boolean
  created_at: Date
  updated_at: Date
}

export interface Activity {
  id: string
  title: string
  description: string
  promo_id: string
  image_url: string | null
  created_by: string
  date: Date | null
  created_at: Date
  updated_at: Date
}

export interface Publication {
  id: string
  title: string
  content: string | null
  images: string[]
  activity_id: string
  created_by: string
  date: Date | null
  created_at: Date
  updated_at: Date
}

export interface Partner {
  id: string
  name: string
  logo_url: string
  is_active: boolean
  created_at: Date
  updated_at: Date
}

export interface ContactMessage {
  id: string
  email?: string | null
  phone?: string | null
  name: string
  subject: string
  message: string
  ip_address?: string | null
  created_at: Date
}

export interface AdminAssignment {
  id: string
  assigned_to_id: string
  assigned_by_id: string
  assigned_at: Date
  revoked_at?: Date | null
  is_active: boolean
}
