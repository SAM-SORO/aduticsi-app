"use server";

import { revalidatePath } from "next/cache";
import type { Prisma, MemberStatus, MemberRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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




// formation de la base de l'url
async function getBaseOrigin(){
  const hearderlist = await headers();
  const host = hearderlist.get('host') || 'aduticsi.com'
  const isLocal = host.includes('localhost') || host.includes('192.168') || host.includes('127.0.0.1')
  const proto = hearderlist.get('x-forwarded-proto') || (isLocal ? 'http' : 'https')
  return `${proto}://${host}`;
}

// on récupère les demandes d'enregistrement en attentes
export async function getPendingRegistrations() {
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

    revalidatePath("/dashboard/super-admin/demandes");
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
      subject: "Votre demande d'inscription ADUTI-INPHB",
      html: rejectionEmailTemplate(),
    });

    if (!emailResult.success) {
      logger.error({ memberId, error: emailResult.error }, "Failed to send approval email");
    }

    revalidatePath("/dashboard/super-admin/demandes");
    return { success: true };
  } catch (error) {
    logger.error({ error, memberId }, "Error rejecting member");
    return { success: false, error: "Une erreur est survenue lors du refus." };
  }
}

