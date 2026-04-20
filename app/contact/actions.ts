'use server'

import { z } from 'zod'
import { headers } from 'next/headers'

import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/mail'
import { verifyTurnstile } from '@/lib/captcha'
import logger from '@/lib/logger'

// ─── Validation Zod (côté serveur) ─────────────────────────────────────────
const contactSchema = z.object({
  name:    z.string().min(2).max(100),
  email:   z.string().email().max(200).optional().or(z.literal('')),
  phone:   z.string().max(30).optional().or(z.literal('')),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
})

// ─── Sanitisation HTML anti-XSS ────────────────────────────────────────────
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export type ContactInput = {
  name: string
  email?: string
  phone?: string
  subject: string
  message: string
  captchaToken?: string
}

export async function sendContactMessage(data: ContactInput) {
  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for') || 'unknown'

  // 1. Validation de la longueur et du format côté serveur
  const parsed = contactSchema.safeParse(data)
  if (!parsed.success) {
    return { error: 'Données invalides. Vérifiez les champs et réessayez.' }
  }

  if (!data.email && !data.phone) {
    return { error: "Veuillez renseigner au moins un email ou un contact." }
  }

  // 2. Vérification Captcha
  if (data.captchaToken) {
    const isHuman = await verifyTurnstile(data.captchaToken)
    if (!isHuman) {
      return { error: 'Échec de la vérification captcha. Veuillez réessayer.' }
    }
  } else if (process.env.NODE_ENV === 'production') {
    return { error: 'Le captcha est requis.' }
  }

  try {
    // 1. Rate limiting: Check submissions in the last 24 hours
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000)
    
    const submissionCount = await prisma.contactMessage.count({
      where: {
        OR: [
          ...(data.email ? [{ email: data.email }] : []),
          ...(data.phone ? [{ phone: data.phone }] : []),
          { ip_address: ip }
        ],
        created_at: {
          gte: last24h
        }
      }
    })

    if (submissionCount >= 3) {
      return { 
        error: "Vous avez atteint la limite de messages (3 par 24h). Veuillez réessayer plus tard." 
      }
    }

    // 2. Save to database
    // Ignore captchaToken since it's not a column in the DB
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { captchaToken, ...dbData } = data
    
    await prisma.contactMessage.create({
      data: {
        ...dbData,
        ip_address: ip
      }
    })

    // 3. Envoi de l'email — données échappées pour éviter toute injection HTML
    const safeName    = escapeHtml(data.name)
    const safeSubject = escapeHtml(data.subject)
    const safeMessage = escapeHtml(data.message).replace(/\n/g, '<br/>')
    const safeEmail   = data.email ? escapeHtml(data.email) : 'Non renseigné'
    const safePhone   = data.phone ? escapeHtml(data.phone) : 'Non renseigné'

    const emailResult = await sendEmail({
      to: process.env.SMTP_FROM || 'support@aduticsi.com',
      replyTo: data.email,
      subject: `[Contact ADUTI] ${safeSubject} - de ${safeName}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Contact:</strong> ${safePhone}</p>
        <p><strong>Sujet:</strong> ${safeSubject}</p>
        <p><strong>Message:</strong></p>
        <div style="padding: 15px; background: #f5f5f5; border-radius: 5px;">
          ${safeMessage}
        </div>
        <hr/>
        <p><small>Envoyé depuis le site ADUTI (IP: ${escapeHtml(ip)})</small></p>
      `
    })

    if (!emailResult.success) {
      logger.error({ error: emailResult.error }, 'Failed to send contact email');
      return { 
        error: "Le service d'envoi d'email est temporairement indisponible. Veuillez réessayer plus tard ou nous contacter directement." 
      }
    }

    return { 
      success: true, 
      message: "Votre message a été envoyé avec succès !" 
    }

  } catch (error) {
    logger.error({ error, data }, 'Error in sendContactMessage');
    return { error: "Une erreur est survenue lors de l'envoi de votre message." }
  }
}
