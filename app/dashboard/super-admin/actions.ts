'use server'

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"

export async function setActivePromo(promoId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié" }
  }

  const member = await prisma.member.findUnique({
    where: { id: user.id },
    select: { role: true }
  })

  // Fallback to email
  if (!member && user.email) {
      const fallbackMember = await prisma.member.findUnique({
          where: { email: user.email },
          select: { role: true }
      })
      if (!fallbackMember || fallbackMember.role !== "SUPER_ADMIN") {
        return { error: "Non autorisé" }
      }
  } else if (!member || member.role !== "SUPER_ADMIN") {
    return { error: "Non autorisé" }
  }

  try {
    // Start transaction to reset all promos and set the new one
    await prisma.$transaction([
      prisma.promotion.updateMany({
        where: { is_current_promo: true },
        data: { is_current_promo: false }
      }),
      prisma.promotion.update({
        where: { id: promoId },
        data: { is_current_promo: true }
      })
    ])

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/super-admin")
    return { success: true }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error setting active promo:", error)
    return { error: "Erreur lors de la mise à jour de la promotion." }
  }
}
