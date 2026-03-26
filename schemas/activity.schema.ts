import { z } from 'zod'

// Schéma pour une activité
export const activitySchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  promo_id: z.string().min(1, 'Veuillez sélectionner une promotion'),
  images: z.array(z.string().url()).default([]),
})

// Schéma pour la création d'une activité
export const createActivitySchema = activitySchema

// Schéma pour la mise à jour d'une activité
export const updateActivitySchema = activitySchema.partial().extend({
  id: z.string(),
})

// Schéma pour une publication
export const publicationSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  content: z.string().optional(),
  activity_id: z.string().min(1, 'Veuillez sélectionner une activité'),
  images: z.array(z.string().url()).default([]),
})

export const createPublicationSchema = publicationSchema
export const updatePublicationSchema = publicationSchema.partial().extend({
  id: z.string(),
})

// Types dérivés
export type ActivityInput = z.infer<typeof activitySchema>
export type CreateActivityInput = z.infer<typeof createActivitySchema>
export type UpdateActivityInput = z.infer<typeof updateActivitySchema>
export type PublicationInput = z.infer<typeof publicationSchema>
export type CreatePublicationInput = z.infer<typeof createPublicationSchema>
export type UpdatePublicationInput = z.infer<typeof updatePublicationSchema>
