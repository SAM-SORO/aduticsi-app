'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function deleteMessages(ids: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Non autorisé' }

  const member = await prisma.member.findUnique({
    where: { id: user.id },
    select: { role: true }
  })

  if (!member || (member.role !== 'SUPER_ADMIN' && member.role !== 'ADMIN')) {
    return { error: 'Permissions insuffisantes' }
  }

  try {
    const result = await prisma.contactMessage.deleteMany({
      where: {
        id: { in: ids }
      }
    })
    
    revalidatePath('/dashboard/messages')
    return { success: true, count: result.count }
  } catch (error) {
    console.error('Error deleting messages:', error)
    return { error: 'Erreur lors de la suppression des messages' }
  }
}
