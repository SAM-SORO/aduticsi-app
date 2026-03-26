"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Activity, Member } from "@/types";

const ACTIVITY_BUCKET = "activity_images";
const PUBLICATION_BUCKET = "publications_images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ITEMS_PER_PAGE = 6;

// ─── Helpers ────────────────────────────────────────────

async function requireSuperAdmin(): Promise<{ user: { id: string }; member: Member }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const member = await prisma.member.findUnique({ where: { id: user.id } });
  if (!member || member.role !== "SUPER_ADMIN") throw new Error("Unauthorized");
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
    activities: activities as unknown as (Activity & { promotion: { name: string }, _count: { publications: number } })[],
    total,
    totalPages: Math.ceil(total / ITEMS_PER_PAGE),
    currentPage: page,
  };
}

export async function getActivities(promoId?: string) {
  const activities = await prisma.activity.findMany({
    where: promoId ? { promo_id: promoId } : {},
    include: {
      promotion: { select: { name: true } },
      _count: { select: { publications: true } },
    },
    orderBy: { created_at: "desc" },
  });
  return activities as unknown as (Activity & { promotion: { name: string }, _count: { publications: number } })[];
}

export async function createActivity(formData: FormData) {
  const { user } = await requireSuperAdmin();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const promoId = formData.get("promoId") as string;
  const imageFile = formData.get("image") as File;

  if (!title || !description || !promoId) {
    return { success: false, error: "Titre, description et promotion requis." };
  }

  let imageUrl: string | null = null;
  if (imageFile && imageFile.size > 0) {
    const urls = await uploadImages([imageFile], ACTIVITY_BUCKET);
    imageUrl = urls[0] || null;
  }

  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr) : null;

  await prisma.activity.create({
    data: {
      title,
      description,
      promo_id: promoId,
      image_url: imageUrl,
      created_by: user.id,
      date,
    },
  });

  revalidatePath("/dashboard/super-admin/activities");
  revalidatePath("/activities");
  return { success: true };
}

export async function updateActivity(id: string, formData: FormData) {
  await requireSuperAdmin();

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const promoId = formData.get("promoId") as string;
  const existingImageUrl = formData.get("existingImage") as string;
  const newImageFile = formData.get("image") as File;

  let finalImageUrl = existingImageUrl || null;

  if (newImageFile && newImageFile.size > 0) {
    // If there's an old image and we are uploading a new one, we should delete the old one
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
    // If explicitly asked to remove the image
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

  revalidatePath("/dashboard/super-admin/activities");
  revalidatePath("/activities");
  revalidatePath(`/activities/${id}`);
  return { success: true };
}

export async function deleteActivity(id: string) {
  await requireSuperAdmin();

  const activity = await prisma.activity.findUnique({ where: { id } }) as unknown as Activity | null;
  if (!activity) return { success: false, error: "Activité introuvable." };

  if (activity.image_url) {
    const supabaseAdmin = createAdminClient();
    const fileName = activity.image_url.split("/").pop();
    if (fileName) {
      await supabaseAdmin.storage.from(ACTIVITY_BUCKET).remove([fileName]);
    }
  }

  await prisma.activity.delete({ where: { id } });

  revalidatePath("/dashboard/super-admin/activities");
  revalidatePath("/activities");
  return { success: true };
}

// ─── Publications ───────────────────────────────────────

export async function getPublications(activityId: string) {
  return prisma.publication.findMany({
    where: { activity_id: activityId },
    orderBy: { created_at: "desc" },
  });
}

export async function createPublication(formData: FormData) {
  const { user } = await requireSuperAdmin();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string || "";
  const activityId = formData.get("activityId") as string;
  const images = formData.getAll("images") as File[];

  if (!title || !activityId) {
    return { success: false, error: "Titre et activité requis." };
  }

  const imageUrls = await uploadImages(images, PUBLICATION_BUCKET);

  const dateStr = formData.get("date") as string;
  const date = dateStr ? new Date(dateStr) : null;

  await prisma.publication.create({
    data: {
      title,
      content,
      activity_id: activityId,
      images: imageUrls,
      created_by: user.id,
      date,
    },
  });

  revalidatePath("/dashboard/super-admin/activities");
  revalidatePath("/activities");
  return { success: true };
}

export async function updatePublication(id: string, formData: FormData) {
  await requireSuperAdmin();

  const title = formData.get("title") as string;
  const content = formData.get("content") as string || "";
  const existingImages = JSON.parse(formData.get("existingImages") as string || "[]");
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

  revalidatePath("/dashboard/super-admin/activities");
  revalidatePath("/activities");
  return { success: true };
}

export async function deletePublication(id: string) {
  await requireSuperAdmin();

  const pub = await prisma.publication.findUnique({ where: { id } });
  if (!pub) return { success: false, error: "Publication introuvable." };

  const supabaseAdmin = createAdminClient();
  const fileNames = pub.images.map(url => url.split("/").pop()).filter(Boolean) as string[];
  if (fileNames.length > 0) {
    await supabaseAdmin.storage.from(PUBLICATION_BUCKET).remove(fileNames);
  }

  await prisma.publication.delete({ where: { id } });

  revalidatePath("/dashboard/super-admin/activities");
  revalidatePath("/activities");
  return { success: true };
}
