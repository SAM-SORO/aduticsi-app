'use server'

import { headers } from 'next/headers'

import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/mail'

export type ContactInput = {
  name: string
  email?: string
  phone?: string
  subject: string
  message: string
}

export async function sendContactMessage(data: ContactInput) {
  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for') || 'unknown'

  if (!data.email && !data.phone) {
    return { error: "Veuillez renseigner au moins un email ou un contact." }
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
    await prisma.contactMessage.create({
      data: {
        ...data,
        ip_address: ip
      }
    })

    // 3. Send email to support
    const emailResult = await sendEmail({
      to: process.env.SMTP_FROM || 'support@aduticsi.com',
      subject: `[Contact ADUTI] ${data.subject} - de ${data.name}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email || 'Non renseigné'}</p>
        <p><strong>Contact:</strong> ${data.phone || 'Non renseigné'}</p>
        <p><strong>Sujet:</strong> ${data.subject}</p>
        <p><strong>Message:</strong></p>
        <div style="padding: 15px; background: #f5f5f5; border-radius: 5px;">
          ${data.message.replace(/\n/g, '<br/>')}
        </div>
        <hr/>
        <p><small>Envoyé depuis le site ADUTI (IP: ${ip})</small></p>
      `
    })

    if (!emailResult.success) {
      console.error('Failed to send contact email:', emailResult.error)
      return { 
        error: "Le service d'envoi d'email est temporairement indisponible. Veuillez réessayer plus tard ou nous contacter directement." 
      }
    }

    return { 
      success: true, 
      message: "Votre message a été envoyé avec succès !" 
    }

  } catch (error) {
    console.error('Error in sendContactMessage:', error)
    return { error: "Une erreur est survenue lors de l'envoi de votre message." }
  }
}
