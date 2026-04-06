"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import logger from "@/lib/logger";

export async function getPromotions() {
  try {
    return await prisma.promotion.findMany({
      orderBy: {
        name: "desc",
      },
    });
  } catch (error) {
    logger.error({ error }, "Error fetching promotions");
    throw new Error("Erreur lors de la récupération des promotions.");
  }
}

export async function createPromotion(data: {
  name: string;
  is_current_promo: boolean;
}) {
  try {
    // If setting as current promo, unset others
    if (data.is_current_promo) {
      await prisma.promotion.updateMany({
        where: { is_current_promo: true },
        data: { is_current_promo: false },
      });
    }

    const promo = await prisma.promotion.create({
      data,
    });

    revalidatePath("/dashboard/super-admin/promotions");
    return { success: true, data: promo };
  } catch (error) {
    logger.error({ error, data }, "Error creating promotion");
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { success: false, error: "Une promotion avec ce nom existe déjà." };
      }
    }
    
    return { success: false, error: "Erreur lors de la création de la promotion." };
  }
}

export async function updatePromotion(
  id: string,
  data: {
    name?: string;
    is_current_promo?: boolean;
  }
) {
  try {
    // If setting as current promo, unset others
    if (data.is_current_promo) {
      await prisma.promotion.updateMany({
        where: { 
          is_current_promo: true,
          id: { not: id }
        },
        data: { is_current_promo: false },
      });
    }

    const promo = await prisma.promotion.update({
      where: { id },
      data,
    });

    revalidatePath("/dashboard/super-admin/promotions");
    return { success: true, data: promo };
  } catch (error) {
    logger.error({ error, id, data }, "Error updating promotion");
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { success: false, error: "Une promotion avec ce nom existe déjà." };
      }
    }
    
    return { success: false, error: "Erreur lors de la mise à jour de la promotion." };
  }
}

export async function deletePromotion(id: string) {
  try {
    await prisma.promotion.delete({
      where: { id },
    });

    revalidatePath("/dashboard/super-admin/promotions");
    return { success: true };
  } catch (error) {
    logger.error({ error, id }, "Error deleting promotion");
    return { success: false, error: "Erreur lors de la suppression de la promotion." };
  }
}
