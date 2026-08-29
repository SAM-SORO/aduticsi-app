"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { buildStorageName } from "@/lib/storage-names";
import logger from "@/lib/logger";
import type { Member } from "@/types";
import { validateImage } from "@/lib/image-upload";

export type ActivityWithDetails = Prisma.ActivityGetPayload<{
  include: {
    promotion: { select: { name: true } };
    category: { select: { id: true; name: true; slug: true; created_at: true } };
    _count: { select: { publications: true } };
  };
}>;

export type PublicationWithDetails = Prisma.PublicationGetPayload<{
  include: {
    activity: {
      select: {
        title: true;
        promo_id: true;
      };
    };
  };
}>;

const ACTIVITY_BUCKET = "activity_images";
const PUBLICATION_BUCKET = "publications_images";
const ITEMS_PER_PAGE = 6;

// ─── Helpers ────────────────────────────────────────────

async function requireActivityManager(): Promise<{ user: { id: string }; member: Member }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const member = await prisma.member.findUnique({ where: { id: user.id } });
  if (!member) throw new Error("Unauthorized");

  const canManage =
    member.role === "SUPER_ADMIN" ||
    member.role === "ADMIN" ||
    member.function === "GESTION_ACTIVITES";

  if (!canManage) throw new Error("Unauthorized");
  return { user: { id: user.id }, member: member as Member };
}

/**
 * Upload une liste de fichiers dans un bucket Supabase avec nommage standardisé.
 *
 * @param files       - Fichiers à uploader
 * @param bucketName  - Nom du bucket Supabase Storage
 * @param labelPrefix - Préfixe lisible pour le nom (ex: titre de l'activité ou publication)
 * @param startIndex  - Index de départ pour la numérotation (lorsqu'il y a plusieurs images).
 *                      Si omis, aucun numéro n'est ajouté (cas d'une image unique).
 */
async function uploadImages(
  files: File[],
  bucketName: string,
  labelPrefix: string,
  startIndex?: number
): Promise<string[]> {
  const urls: string[] = [];
  const supabaseAdmin = createAdminClient();
  let fileIndex = 0;
  for (const file of files) {
    const check = validateImage(file);
    if (!check.ok) {
      logger.warn({ name: file.name, reason: check.error }, "uploadImages: fichier refusé");
      continue;
    }

    const ext = check.ext;
    // Si startIndex est fourni, on numérote les images : _01, _02, …
    // Sinon (image unique d'une activité), pas de numéro
    const index = startIndex !== undefined ? startIndex + fileIndex : undefined;
    const name = buildStorageName(labelPrefix, ext, index);

    const { error } = await supabaseAdmin.storage.from(bucketName).upload(name, file);
    if (error) {
      logger.warn({ error, name }, "uploadImages: Failed to upload one file, skipping");
      continue;
    }

    const { data: { publicUrl } } = supabaseAdmin.storage.from(bucketName).getPublicUrl(name);
    urls.push(publicUrl);
    fileIndex++;
  }
  return urls;
}

// ─── Activity Categories ────────────────────────────────

export async function getActivityCategories() {
  return prisma.activityCategory.findMany({ orderBy: { created_at: "asc" } });
}

export async function createActivityCategory(name: string) {
  await requireActivityManager();
  const trimmed = name.trim();
  if (!trimmed) return { success: false, error: "Le nom de la catégorie est requis." };

  // Build slug from name: "Fun Night" -> "fun-night"
  const slug = trimmed
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  try {
    const existing = await prisma.activityCategory.findFirst({
      where: { OR: [{ slug }, { name: { equals: trimmed, mode: "insensitive" } }] },
    });
    if (existing) return { success: true, category: existing };

    const category = await prisma.activityCategory.create({ data: { name: trimmed, slug } });
    return { success: true, category };
  } catch {
    return { success: false, error: "Erreur lors de la création de la catégorie." };
  }
}

// ─── Activities ─────────────────────────────────────────

export async function getActivitiesPaginated(
  promoId?: string,
  page: number = 1,
  search: string = "",
  categoryId?: string
) {
  const where: Prisma.ActivityWhereInput = {
    ...(promoId ? { promo_id: promoId } : {}),
    ...(categoryId ? { category_id: categoryId } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" as const } },
            { description: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const validPage = Math.max(1, page);
  const [activities, total] = await Promise.all([
    prisma.activity.findMany({
      where,
      include: {
        promotion: { select: { name: true } },
        category: { select: { id: true, name: true, slug: true, created_at: true } },
        _count: { select: { publications: true } },
      },
      orderBy: { created_at: "desc" },
      skip: (validPage - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
    }),
    prisma.activity.count({ where }),
  ]);

  return {
    activities: activities as ActivityWithDetails[],
    total,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
  };
}

export async function getActivities(promoId?: string): Promise<ActivityWithDetails[]> {
  const activities = await prisma.activity.findMany({
    where: promoId ? { promo_id: promoId } : {},
    include: {
      promotion: { select: { name: true } },
      category: { select: { id: true, name: true, slug: true, created_at: true } },
      _count: { select: { publications: true } },
    },
    orderBy: { created_at: "desc" },
  });
  return activities as ActivityWithDetails[];
}

export async function createActivity(formData: FormData) {
  const { user, member } = await requireActivityManager();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const promoId = formData.get("promoId") as string;
  const categoryId = (formData.get("categoryId") as string) || null;
  const imageFile = formData.get("image") as File;

  if (!title || !description || !promoId) {
    return { success: false, error: "Titre, description et promotion requis." };
  }
  if (member.role !== "SUPER_ADMIN" && promoId !== member.promo_id) {
    return { success: false, error: "Vous ne pouvez creer des activites que pour votre promotion." };
  }

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const urls = await uploadImages([imageFile], ACTIVITY_BUCKET, title);
    imageUrl = urls[0] || null;
  }

  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr) : null;

  try {
    const activity = await prisma.activity.create({
      data: {
        title,
        description,
        promo_id: promoId,
        category_id: categoryId,
        image_url: imageUrl,
        created_by: user.id,
        date,
      },
    });

    logger.info({ activityId: activity.id, userId: user.id }, "Activity created successfully");

    revalidatePath("/dashboard/super-admin/activities");
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/bureau");
    revalidatePath("/activities");
    return { success: true };
  } catch (error) {
    logger.error({ error, userId: user.id }, "Error creating activity");
    return { success: false, error: "Une erreur est survenue lors de la création de l'activité." };
  }
}

export async function updateActivity(id: string, formData: FormData) {
  const { user, member } = await requireActivityManager();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const promoId = formData.get("promoId") as string;
  const categoryId = (formData.get("categoryId") as string) || null;
  
  try {
    const current = await prisma.activity.findUnique({
      where: { id },
      select: { id: true, promo_id: true },
    });
    if (!current) return { success: false, error: "Activité introuvable." };
    if (member.role !== "SUPER_ADMIN" && current.promo_id !== member.promo_id) {
      return { success: false, error: "Action non autorisée sur cette activité." };
    }
    if (member.role !== "SUPER_ADMIN" && promoId !== member.promo_id) {
      return { success: false, error: "Vous ne pouvez assigner que votre promotion." };
    }

    const existingImageUrl = formData.get("existingImage") as string;
    const newImageFile = formData.get("image") as File;

    let finalImageUrl = existingImageUrl || null;

    if (newImageFile && newImageFile.size > 0) {
      if (existingImageUrl) {
        const supabaseAdmin = createAdminClient();
        const oldFileName = existingImageUrl.split("/").pop();
        if (oldFileName) {
          await supabaseAdmin.storage.from(ACTIVITY_BUCKET).remove([oldFileName]);
        }
      }

      const urls = await uploadImages([newImageFile], ACTIVITY_BUCKET, title);
      finalImageUrl = urls[0] || null;
    } else if (formData.get("removeImage") === "true") {
      if (existingImageUrl) {
        const supabaseAdmin = createAdminClient();
        const oldFileName = existingImageUrl.split("/").pop();
        if (oldFileName) {
          await supabaseAdmin.storage.from(ACTIVITY_BUCKET).remove([oldFileName]);
        }
      }
      finalImageUrl = null;
    }

    const dateStr = formData.get("date") as string;
    const date = dateStr ? new Date(dateStr) : null;

    await prisma.activity.update({
      where: { id },
      data: {
        title,
        description,
        promo_id: promoId,
        category_id: categoryId,
        image_url: finalImageUrl,
        date,
      },
    });

    logger.info({ activityId: id, userId: user.id }, "Activity updated successfully");

    revalidatePath("/dashboard/super-admin/activities");
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/bureau");
    revalidatePath("/activities");
    revalidatePath(`/activities/${id}`);
    return { success: true };
  } catch (error) {
    logger.error({ error, activityId: id, userId: user.id }, "Error updating activity");
    return { success: false, error: "Une erreur est survenue lors de la mise à jour de l'activité." };
  }
}

export async function deleteActivity(id: string) {
  const { user, member } = await requireActivityManager();

  try {
    const activity = await prisma.activity.findUnique({ where: { id } });
    if (!activity) return { success: false, error: "Activité introuvable." };
    if (member.role !== "SUPER_ADMIN" && activity.promo_id !== member.promo_id) {
      return { success: false, error: "Action non autorisée sur cette activité." };
    }

    if (activity.image_url) {
      const supabaseAdmin = createAdminClient();
      const fileName = activity.image_url.split("/").pop();
      if (fileName) {
        await supabaseAdmin.storage.from(ACTIVITY_BUCKET).remove([fileName]);
      }
    }

    await prisma.activity.delete({ where: { id } });

    logger.info({ activityId: id, userId: user.id }, "Activity deleted successfully");

    revalidatePath("/dashboard/super-admin/activities");
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/bureau");
    revalidatePath("/activities");
    return { success: true };
  } catch (error) {
    logger.error({ error, activityId: id, userId: user.id }, "Error deleting activity");
    return { success: false, error: "Une erreur est survenue lors de la suppression de l'activité." };
  }
}

// ─── Publications ───────────────────────────────────────

export async function getPublications(activityId: string): Promise<PublicationWithDetails[]> {
  const publications = await prisma.publication.findMany({
    where: { activity_id: activityId },
    include: {
      activity: {
        select: {
          title: true,
          promo_id: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });
  return publications as PublicationWithDetails[];
}

export async function createPublication(formData: FormData) {
  const { user, member } = await requireActivityManager();

  const title = formData.get("title") as string;
  const content = (formData.get("content") as string) || "";
  const activityId = formData.get("activityId") as string;
  const images = formData.getAll("images") as File[];

  if (!title || !activityId) {
    return { success: false, error: "Titre et activité requis." };
  }

  try {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      select: { id: true, promo_id: true },
    });
    if (!activity) return { success: false, error: "Activité introuvable." };
    if (member.role !== "SUPER_ADMIN" && activity.promo_id !== member.promo_id) {
      return { success: false, error: "Action non autorisée sur cette activité." };
    }

    // Images multiples d'une publication → numérotation à partir de 1
    const imageUrls = await uploadImages(images, PUBLICATION_BUCKET, title, 1);

    const dateStr = formData.get("date") as string;
    const date = dateStr ? new Date(dateStr) : null;

    const publication = await prisma.publication.create({
      data: {
        title,
        content,
        activity_id: activityId,
        images: imageUrls,
        created_by: user.id,
        date,
      },
    });

    logger.info({ publicationId: publication.id, userId: user.id }, "Publication created successfully");

    revalidatePath("/dashboard/super-admin/activities");
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/bureau");
    revalidatePath("/activities");
    return { success: true };
  } catch (error) {
    logger.error({ error, userId: user.id }, "Error creating publication");
    return { success: false, error: "Une erreur est survenue lors de la création de la publication." };
  }
}

export async function updatePublication(id: string, formData: FormData) {
  const { user, member } = await requireActivityManager();

  const title = formData.get("title") as string;
  try {
    // Récupérer la publication en DB AVANT modification pour avoir la liste complète des images
    const publication = await prisma.publication.findUnique({
      where: { id },
      select: {
        images: true,
        activity: { select: { promo_id: true } },
      },
    });
    if (!publication) return { success: false, error: "Publication introuvable." };
    if (member.role !== "SUPER_ADMIN" && publication.activity.promo_id !== member.promo_id) {
      return { success: false, error: "Action non autorisée sur cette publication." };
    }

    const content = (formData.get("content") as string) || "";
    // URLs conservées par l'utilisateur (images qu'il n'a PAS retirées)
    const keepImages: string[] = JSON.parse((formData.get("existingImages") as string) || "[]");
    const newImages = formData.getAll("images") as File[];

    // ─── Suppression des images retirées du Storage ────────────────────────
    // On compare les images actuelles en DB avec celles que l'utilisateur garde
    const keepSet = new Set(keepImages);
    const removedUrls = publication.images.filter((url) => !keepSet.has(url));

    if (removedUrls.length > 0) {
      const supabaseAdmin = createAdminClient();
      // Extraire uniquement le nom du fichier depuis l'URL publique
      const fileNames = removedUrls
        .map((url) => url.split("/").pop())
        .filter((name): name is string => !!name);

      if (fileNames.length > 0) {
        const { error: removeError } = await supabaseAdmin.storage
          .from(PUBLICATION_BUCKET)
          .remove(fileNames);
        if (removeError) {
          logger.warn({ removeError, fileNames }, "updatePublication: Failed to delete some files from Storage");
        } else {
          logger.info({ fileNames }, "updatePublication: Removed orphaned files from Storage");
        }
      }
    }

    // ─── Numérotation des nouvelles images ─────────────────────────────────
    // On part du TOTAL historique (images originales) pour éviter les conflits
    // Ex: pub avait 3 images, user retire _02, garde [_01, _03], ajoute 2 nouvelles
    // → nouvelles files seront _04 et _05 (pas _03 qui existe déjà)
    const historicalTotal = publication.images.length;
    const newUrls = await uploadImages(newImages, PUBLICATION_BUCKET, title, historicalTotal + 1);

    const dateStr = formData.get("date") as string;
    const date = dateStr ? new Date(dateStr) : null;

    await prisma.publication.update({
      where: { id },
      data: {
        title,
        content,
        images: [...keepImages, ...newUrls],
        date,
      },
    });

    logger.info({ publicationId: id, userId: user.id, removedCount: removedUrls.length, addedCount: newUrls.length }, "Publication updated successfully");

    revalidatePath("/dashboard/super-admin/activities");
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/bureau");
    revalidatePath("/activities");
    return { success: true };
  } catch (error) {
    logger.error({ error, publicationId: id, userId: user.id }, "Error updating publication");
    return { success: false, error: "Une erreur est survenue lors de la mise à jour de la publication." };
  }
}


export async function deletePublication(id: string) {
  const { user, member } = await requireActivityManager();

  try {
    const pub = await prisma.publication.findUnique({
      where: { id },
      include: { activity: { select: { promo_id: true } } },
    });
    if (!pub) return { success: false, error: "Publication introuvable." };
    if (member.role !== "SUPER_ADMIN" && pub.activity.promo_id !== member.promo_id) {
      return { success: false, error: "Action non autorisée sur cette publication." };
    }

    const supabaseAdmin = createAdminClient();
    const fileNames = pub.images.map((url) => url.split("/").pop()).filter(Boolean) as string[];
    if (fileNames.length > 0) {
      await supabaseAdmin.storage.from(PUBLICATION_BUCKET).remove(fileNames);
    }

    await prisma.publication.delete({ where: { id } });

    logger.info({ publicationId: id, userId: user.id }, "Publication deleted successfully");

    revalidatePath("/dashboard/super-admin/activities");
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/bureau");
    revalidatePath("/activities");
    return { success: true };
  } catch (error) {
    logger.error({ error, publicationId: id, userId: user.id }, "Error deleting publication");
    return { success: false, error: "Une erreur est survenue lors de la suppression de la publication." };
  }
}
