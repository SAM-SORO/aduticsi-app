import { z } from 'zod'

// Schéma pour une promotion
export const promotionSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  is_current_promo: z.boolean().default(false),
})

// Schéma pour la création d'une promotion
export const createPromotionSchema = promotionSchema

// Schéma pour la mise à jour d'une promotion
export const updatePromotionSchema = promotionSchema.partial().extend({
  id: z.string(),
})

// Types dérivés
export type PromotionInput = z.infer<typeof promotionSchema>
export type CreatePromotionInput = z.infer<typeof createPromotionSchema>
export type UpdatePromotionInput = z.infer<typeof updatePromotionSchema>
