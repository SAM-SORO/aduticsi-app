'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createInvitationSchema = z.object({
  title: z.string().min(3, "Le nom du lien doit contenir au moins 3 caractères"),
  expirationValue: z.coerce.number().min(1, 'La validité minimale est de 1'),
  expirationUnit: z.enum(['days', 'months', 'years']),
  created_by: z.string().min(1)
})

export async function createInvitation(data: z.infer<typeof createInvitationSchema>) {
  try {
    const validatedData = createInvitationSchema.parse(data)
    
    // Calcul de la date d'expiration
    const expires_at = new Date()
    if (validatedData.expirationUnit === 'days') {
      expires_at.setDate(expires_at.getDate() + validatedData.expirationValue)
    } else if (validatedData.expirationUnit === 'months') {
      expires_at.setMonth(expires_at.getMonth() + validatedData.expirationValue)
    } else if (validatedData.expirationUnit === 'years') {
      expires_at.setFullYear(expires_at.getFullYear() + validatedData.expirationValue)
    }
    
    const invitation = await prisma.invitation.create({
      data: {
        title: validatedData.title,
        expires_at,
        created_by: validatedData.created_by,
      }
    })

    revalidatePath('/dashboard/super-admin/invitations')
    
    return { success: true, invitation }
  } catch (error) {
    console.error('Erreur lors de la création de l\'invitation:', error)
    return { error: 'Impossible de créer le lien d\'invitation.' }
  }
}

export async function deleteInvitation(id: string) {
  try {
    await prisma.invitation.delete({
      where: { id }
    })
    
    revalidatePath('/dashboard/super-admin/invitations')
    return { success: true }
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'invitation:', error)
    return { error: 'Impossible de supprimer l\'invitation.' }
  }
}
