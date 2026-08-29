import { z } from 'zod'

// Schéma de connexion
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

// Schéma d'inscription
export const registerSchema = z.object({
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
  promo_id: z.string().min(1, 'Veuillez sélectionner une promotion'),
  status: z.enum(['STUDENT', 'ALUMNI'], {
    message: 'Veuillez sélectionner un statut',
  }),
  gender: z.enum(['MALE', 'FEMALE'], {
    message: 'Veuillez sélectionner votre genre',
  }),
  profile_status: z.enum(['PUBLIC', 'PRIVATE']).optional(),
  token: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['confirmPassword'],
})

// Demande d'adhesion : l'utilisateur ne choisit pas son mot de passe. Il le
// definit via le lien recu apres approbation par un administrateur.
export const registerRequestSchema = z.object({
  first_name: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  last_name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  promo_id: z.string().min(1, 'Veuillez sélectionner une promotion'),
  status: z.enum(['STUDENT', 'ALUMNI'], {
    message: 'Veuillez sélectionner un statut',
  }),
  gender: z.enum(['MALE', 'FEMALE'], {
    message: 'Veuillez sélectionner votre genre',
  }),
  profile_status: z.enum(['PUBLIC', 'PRIVATE']).optional(),
})

export type RegisterRequestInput = z.infer<typeof registerRequestSchema>

// Types dérivés
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
