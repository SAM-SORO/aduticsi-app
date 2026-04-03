'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/schemas/auth.schema'
import logger from '@/lib/logger'

export async function login(data: LoginInput) {
  const supabase = await createClient()

  logger.info({ email: data.email }, 'Login attempt started');

  // 1. Validate data
  const result = loginSchema.safeParse(data)
  if (!result.success) {
    logger.warn({ errors: result.error.format() }, 'Login validation failed');
    return { error: 'Données invalides' }
  }

  const { email, password } = result.data

  // 2. Authenticate with Supabase
  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    logger.warn({ email, error: error.message }, 'Supabase authentication failed');
    if (error.message.toLowerCase().includes('email not confirmed')) {
      return { error: "Votre email n'est pas encore confirmé. Vérifiez votre boîte mail." }
    }
    return { error: 'Email ou mot de passe incorrect' }
  }

  if (!authData.user) {
    logger.error('Supabase returned no user after successful authentication');
    return { error: 'Connexion impossible. Veuillez réessayer.' }
  }

  logger.info({ userId: authData.user.id }, 'Supabase authentication successful');

  // Only association members can access the platform.
  try {
    const member = await prisma.member.findUnique({
      where: { id: authData.user.id },
      select: { id: true, name: true },
    })

    if (!member) {
      logger.warn({ userId: authData.user.id, email }, 'User authenticated but not found in Member table');
      await supabase.auth.signOut()
      return { error: "Accès refusé. Seuls les membres de l'association peuvent se connecter." }
    }

    logger.info({ userId: member.id, name: member.name }, 'Login successful, member found');

  } catch (err) {
    logger.error({ err, userId: authData.user.id }, 'Error during Member table check');
    return { error: 'Une erreur est survenue lors de la vérification de votre compte.' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

async function verifyTurnstileToken(token: string) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) return true

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ response: token, secret: secretKey }),
    })
    const data = await response.json()
    return data.success
  } catch (error) {
    logger.error({ error }, 'Captcha verification error');
    return false
  }
}

export async function signup(data: RegisterInput & { captchaToken?: string }) {
  const supabase = await createClient()

  // 1. Validate data
  const result = registerSchema.safeParse(data)
  if (!result.success) {
    return { error: 'Données invalides' }
  }

  // 2. Verify Captcha
  if (data.captchaToken) {
    const isHuman = await verifyTurnstileToken(data.captchaToken)
    if (!isHuman) {
      return { error: 'Échec de la vérification captcha. Veuillez réessayer.' }
    }
  } else if (process.env.NODE_ENV === 'production') {
    return { error: 'Le captcha est requis.' }
  }

  const { email, password, first_name, last_name, promo_id, status, gender, token } = result.data
  const fullName = `${last_name.toUpperCase()} ${first_name}`

  if (!token) {
    return { error: "Un lien d'invitation valide est requis pour s'enregistrer." }
  }

  // 2. Validate Invitation Token
  const invitation = await prisma.invitation.findUnique({
    where: { token }
  })

  if (!invitation) {
    return { error: "Lien d'invitation invalide." }
  }

  if (new Date() > invitation.expires_at) {
    return { error: "Ce lien d'invitation a expiré." }
  }

  // 3. Sign up with Supabase
  try {
    const headersList = await headers();
    const host = headersList.get('host');
    const originHeader = headersList.get('origin');
    
    // Si on a l'en-tête origin, on l'utilise. Sinon on le construit.
    let origin = originHeader;
    if (!origin && host) {
      const isLocal = host.includes('localhost') || host.includes('192.168') || host.includes('127.0.0.1');
      const protocol = isLocal ? 'http' : 'https';
      origin = `${protocol}://${host}`;
    }
    
    const redirectUrl = `${origin}/auth/callback`;

    logger.info({ redirectUrl }, 'Signup redirect URL (must be in Supabase whitelist)');

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: fullName,
          promo_id,
          status: status || 'STUDENT',
          gender: gender || null, // Convert empty string or falsy value to null for Prisma
          role: 'MEMBER', // Default role
          invitation_token: token,
        },
      },
    });

    if (signUpError) {
      return { error: signUpError.message };
    }

  } catch (err) {
    // IMPORTANT: Redirections in Server Actions are technically "errors" that Next.js catches
    // We MUST let them pass through.
    if (err && typeof err === 'object' && 'digest' in err) {
      const digest = (err as { digest: string }).digest;
      if (digest.includes('NEXT_REDIRECT')) {
        throw err;
      }
    }

    if (err && typeof err === 'object' && 'message' in err) {
      const message = (err as { message: string }).message;
      if (message.includes('NEXT_REDIRECT')) {
        throw err;
      }
    }

    logger.error({ err }, 'Detailed signup error');
    
    return { error: "Une erreur inattendue est survenue lors de l'enregistrement. Veuillez vérifier la console du serveur pour plus de détails." };
  }

  revalidatePath('/', 'layout');
  redirect('/auth/verify-email');
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/auth/login')
}

export async function getPromotions() {
  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { name: 'desc' },
      select: {
        id: true,
        name: true,
      },
    })
    return promotions
  } catch (error) {
    logger.error({ error }, 'Error fetching promotions');
    return []
  }
}

export async function forgotPassword(email: string) {
  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get('origin') || `https://${headersList.get('host')}`

  // 1. Check if user exists in our database
  const member = await prisma.member.findUnique({
    where: { email }
  })

  if (!member) {
    return { error: "Aucun compte n'est associé à cette adresse email." }
  }

  // 2. Trigger reset
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true, message: 'Un email de réinitialisation a été envoyé.' }
}

export async function verifyInvitationToken(token: string) {
  if (!token) return { error: "Veuillez fournir un lien ou un code d'invitation." }

  const invitation = await prisma.invitation.findUnique({
    where: { token }
  })

  if (!invitation) return { error: "Lien d'invitation invalide." }
  if (new Date() > invitation.expires_at) return { error: "Le lien d'invitation a expiré." }

  return { success: true }
}
