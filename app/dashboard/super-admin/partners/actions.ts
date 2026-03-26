"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const BUCKET_NAME = "partenaires_logo";

export async function createPartner(formData: FormData) {
  const supabase = await createClient();
  
  // Verify super admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const member = await prisma.member.findUnique({ where: { id: user.id } });
  if (member?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

  const name = formData.get("name") as string;
  const file = formData.get("image") as File;

  if (!name || !file || file.size === 0) {
    throw new Error("Nom et logo requis.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("L'image dépasse la limite de 5 Mo.");
  }

  // Upload to Supabase
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

  // Use Admin Client for Storage to bypass RLS (we've already verified role)
  const supabaseAdmin = createAdminClient();
  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(fileName, file);

  if (uploadError) {
    console.error("Upload error:", uploadError);
    throw new Error("Erreur lors de l'upload de l'image.");
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  await prisma.partner.create({
    data: {
      name,
      logo_url: publicUrl,
      is_active: true,
    },
  });

  revalidatePath("/dashboard/super-admin/partners");
  revalidatePath("/");
  return { success: true };
}

export async function togglePartner(id: string, currentStatus: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const member = await prisma.member.findUnique({ where: { id: user.id } });
  if (member?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

  await prisma.partner.update({
    where: { id },
    data: { is_active: !currentStatus },
  });

  revalidatePath("/dashboard/super-admin/partners");
  revalidatePath("/");
  return { success: true };
}

export async function deletePartner(id: string, logo_url: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const member = await prisma.member.findUnique({ where: { id: user.id } });
  if (member?.role !== "SUPER_ADMIN") throw new Error("Unauthorized");

  const fileName = logo_url.split("/").pop();

  if (fileName) {
    const supabaseAdmin = createAdminClient();
    await supabaseAdmin.storage.from(BUCKET_NAME).remove([fileName]);
  }

  await prisma.partner.delete({ where: { id } });

  revalidatePath("/dashboard/super-admin/partners");
  revalidatePath("/");
  return { success: true };
}
