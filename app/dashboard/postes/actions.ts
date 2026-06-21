"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import logger from "@/lib/logger";
// gestion des urls
import { headers } from "next/headers";
// gestion de l'envoi emails
import {sendEmail} from "@/lib/mail";
// gestion des templates d'emails
import { approvalEmailTemplate, rejectionEmailTemplate } from "@/lib/email-templates";

async function requireSuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const member = await prisma.member.findUnique({ where: { id: user.id } });
  if (!member || member.role !== "SUPER_ADMIN") throw new Error("Unauthorized");
  return user;
}

export async function getPostes() {
  return prisma.poste.findMany({
    orderBy: { name: "asc" },
  });
}

export async function createPoste(name: string) {
  await requireSuperAdmin();
  try {
    const poste = await prisma.poste.create({
      data: { name },
    });
    revalidatePath("/dashboard/super-admin/postes");
    return { success: true, poste };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { success: false, error: "Ce poste existe déjà." };
    }
    logger.error({ error, name }, "Error creating poste");
    return { success: false, error: "Une erreur est survenue." };
  }
}

export async function updatePoste(id: string, name: string) {
  await requireSuperAdmin();
  try {
    const poste = await prisma.poste.update({
      where: { id },
      data: { name },
    });
    revalidatePath("/dashboard/super-admin/postes");
    return { success: true, poste };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return { success: false, error: "Ce nom de poste est déjà utilisé." };
    }
    logger.error({ error, id, name }, "Error updating poste");
    return { success: false, error: "Une erreur est survenue." };
  }
}

export async function deletePoste(id: string) {
  await requireSuperAdmin();
  try {
    await prisma.poste.delete({
      where: { id },
    });
    revalidatePath("/dashboard/super-admin/postes");
    return { success: true };
  } catch (error) {
    logger.error({ error, id }, "Error deleting poste");
    return { success: false, error: "Impossible de supprimer ce poste. Vérifiez s'il est utilisé par des membres." };
  }
}




// formation de la base de l'url
async function getBaseOrigin(){
  const hearderlist = await headers();
  const host = hearderlist.get('host') || 'aduticsi.com'
  const isLocal = host.includes('localhost') || host.includes('192.168') || host.includes('127.0.0.1')
  const proto = hearderlist.get('x-forwarded-proto') || (isLocal ? 'http' : 'https')
  const baseOrigin = `${proto}://${host}`
}

// on récupère les demandes d'enregistrement en attentes
export async function getPendingRegistration() {
  await requireSuperAdmin();
    return prisma.member.findMany({
    where: { registration_status: "PENDING" },
    include: { promotion: true },
    orderBy: { created_at: "asc" },
  });
}

// on modifie l'état du membre et on envoi un email

export async function approveMember(memberId: string) {
  await requireSuperAdmin();

  try {
    const member = await prisma.member.update({
      where: { id: memberId },
      data: { registration_status: "APPROVED" },
    });

    const origin = await getBaseOrigin();
    const loginUrl = `${origin}/auth/login`;

    const emailResult = await sendEmail({
      to: member.email,
      subject: "Votre compte ADUTI-INPHB a été approuvé",
      html: approvalEmailTemplate(loginUrl),
    });

    if (!emailResult.success) {
      logger.error({ memberId, error: emailResult.error }, "Failed to send approval email");
    }

    revalidatePath("/dashboard/super-admin/registrations");
    return { success: true };
  } catch (error) {
    logger.error({ error, memberId }, "Error approving member");
    return { success: false, error: "Une erreur est survenue lors de l'approbation." };
  }
}


export async function rejectMember(memberId: string) {
  await requireSuperAdmin();

  try {
    const member = await prisma.member.update({
      where: { id: memberId },
      data: { registration_status: "REJECTED" },
    });

    const origin = await getBaseOrigin();
    const loginUrl = `${origin}/auth/login`;

    const emailResult = await sendEmail({
      to: member.email,
      subject: "Votre compte ADUTI-INPHB a été approuvé",
      html: rejectionEmailTemplate(),
    });

    if (!emailResult.success) {
      logger.error({ memberId, error: emailResult.error }, "Failed to send approval email");
    }

    revalidatePath("/dashboard/super-admin/registrations");
    return { success: true };
  } catch (error) {
    logger.error({ error, memberId }, "Error approving member");
    return { success: false, error: "Une erreur est survenue lors de l'approbation." };
  }
}

