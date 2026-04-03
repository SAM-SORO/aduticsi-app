"use server";

import { revalidatePath } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import logger from "@/lib/logger";
import type { Member } from "@/types";

export type ActivityWithDetails = Prisma.ActivityGetPayload<{
  include: {
    promotion: { select: { name: true } };
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
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
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

async function uploadImages(files: File[], bucketName: string): Promise<string[]> {
  const urls: string[] = [];
  const supabaseAdmin = createAdminClient();

  for (const file of files) {
    if (file.size === 0) continue;
    if (file.size > MAX_FILE_SIZE) continue;

    const ext = file.name.split(".").pop();
    const name = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;

    const { error } = await supabaseAdmin.storage.from(bucketName).upload(name, file);
    if (error) continue;

    const { data: { publicUrl } } = supabaseAdmin.storage.from(bucketName).getPublicUrl(name);
    urls.push(publicUrl);
  }
  return urls;
}

// ─── Activities ─────────────────────────────────────────

export async function getActivitiesPaginated(
  promoId?: string,
  page: number = 1,
  search: string = ""
) {
  const where: {
    promo_id?: string;
    OR?: Array<{
      title?: { contains: string; mode: "insensitive" };
      description?: { contains: string; mode: "insensitive" };
    }>;
  } = {
    ...(promoId ? { promo_id: promoId } : {}),
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
  const imageFile = formData.get("image") as File;

  if (!title || !description || !promoId) {
    return { success: false, error: "Titre, description et promotion requis." };
  }
  if (member.role !== "SUPER_ADMIN" && promoId !== member.promo_id) {
    return { success: false, error: "Vous ne pouvez creer des activites que pour votre promotion." };
  }

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const urls = await uploadImages([imageFile], ACTIVITY_BUCKET);
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

      const urls = await uploadImages([newImageFile], ACTIVITY_BUCKET);
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

    const imageUrls = await uploadImages(images, PUBLICATION_BUCKET);

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
    const publication = await prisma.publication.findUnique({
      where: { id },
      select: { activity: { select: { promo_id: true } } },
    });
    if (!publication) return { success: false, error: "Publication introuvable." };
    if (member.role !== "SUPER_ADMIN" && publication.activity.promo_id !== member.promo_id) {
      return { success: false, error: "Action non autorisée sur cette publication." };
    }

    const content = (formData.get("content") as string) || "";
    const existingImages = JSON.parse((formData.get("existingImages") as string) || "[]");
    const newImages = formData.getAll("images") as File[];

    const newUrls = await uploadImages(newImages, PUBLICATION_BUCKET);

    const dateStr = formData.get("date") as string;
    const date = dateStr ? new Date(dateStr) : null;

    await prisma.publication.update({
      where: { id },
      data: {
        title,
        content,
        images: [...existingImages, ...newUrls],
        date,
      },
    });

    logger.info({ publicationId: id, userId: user.id }, "Publication updated successfully");

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
