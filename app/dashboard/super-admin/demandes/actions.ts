"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import logger from "@/lib/logger";
import { sendEmail } from "@/lib/mail";
import { approvalEmailTemplate, rejectionEmailTemplate } from "@/lib/email-templates";

async function requireSuperAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");
  const member = await prisma.member.findUnique({ where: { id: user.id } });
  if (!member || member.role !== "SUPER_ADMIN") throw new Error("Unauthorized");
  return user;
}




async function getBaseOrigin(){
  const headerList = await headers();
  const host = headerList.get('host') || 'aduticsi.com'
  const isLocal = host.includes('localhost') || host.includes('192.168') || host.includes('127.0.0.1')
  const proto = headerList.get('x-forwarded-proto') || (isLocal ? 'http' : 'https')
  return `${proto}://${host}`;
}

export async function getPendingRegistrations() {
  await requireSuperAdmin();
    return prisma.member.findMany({
    where: { registration_status: "PENDING" },
    include: { promotion: true },
    orderBy: { created_at: "asc" },
  });
}


export async function approveMember(memberId: string) {
  await requireSuperAdmin();
  try {
    const member = await prisma.member.update({
      where: { id: memberId },
      data: { registration_status: "APPROVED" },
    });

    const origin = await getBaseOrigin();

    // Le membre n'a jamais choisi de mot de passe : ce lien est sa seule
    // porte d'entree. A defaut, on le renvoie vers "mot de passe oublie".
    let actionUrl = `${origin}/auth/forgot-password`;
    const { data: link, error: linkError } = await createAdminClient().auth.admin.generateLink({
      type: "recovery",
      email: member.email,
      options: { redirectTo: `${origin}/auth/callback?next=/auth/reset-password` },
    });
    if (linkError || !link?.properties?.action_link) {
      logger.error({ memberId, error: linkError }, "Lien de définition du mot de passe indisponible");
    } else {
      actionUrl = link.properties.action_link;
    }

    const emailResult = await sendEmail({
      to: member.email,
      subject: "Votre demande ADUTI-INPHB est approuvée",
      html: approvalEmailTemplate(actionUrl),
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

    const emailResult = await sendEmail({
      to: member.email,
      subject: "Votre demande d'inscription ADUTI-INPHB",
      html: rejectionEmailTemplate(),
    });

    if (!emailResult.success) {
      logger.error({ memberId, error: emailResult.error }, "Failed to send rejection email");
    }

    revalidatePath("/dashboard/super-admin/demandes");
    return { success: true };
  } catch (error) {
    logger.error({ error, memberId }, "Error rejecting member");
    return { success: false, error: "Une erreur est survenue lors du refus." };
  }
}

