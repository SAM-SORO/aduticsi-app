'use server'

import { randomBytes } from 'crypto'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

import { createAdminClient } from '@/lib/supabase/admin'
import { generateUniqueSlug } from '@/lib/slug'
import { buildStorageName } from '@/lib/storage-names'
import { validateImage } from '@/lib/image-upload'
import {
  loginSchema,
  registerSchema,
  registerRequestSchema,
  type LoginInput,
  type RegisterInput,
} from '@/schemas/auth.schema'
import { verifyTurnstile } from '@/lib/captcha'
import logger from '@/lib/logger'
import { MAIL_LINK_VALIDITY_SENTENCE } from '@/lib/auth-links'

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
      select: { id: true, first_name: true, last_name: true },
    })

    if (!member) {
      logger.warn({ userId: authData.user.id, email }, 'User authenticated but not found in Member table');
      await supabase.auth.signOut()
      return { error: "Accès refusé. Seuls les membres de l'association peuvent se connecter." }
    }

    logger.info({ userId: member.id, first_name: member.first_name, last_name: member.last_name }, 'Login successful, member found');

  } catch (err) {
    logger.error({ err, userId: authData.user.id }, 'Error during Member table check');
    return { error: 'Une erreur est survenue lors de la vérification de votre compte.' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
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
    const isHuman = await verifyTurnstile(data.captchaToken)
    if (!isHuman) {
      return { error: 'Échec de la vérification captcha. Veuillez réessayer.' }
    }
  } else if (process.env.NODE_ENV === 'production') {
    return { error: 'Le captcha est requis.' }
  }

  // On reprend en compte le token
  const { email, password, first_name, last_name, promo_id, status, gender, token, profile_status } = result.data
  //const { email, password, first_name, last_name, promo_id, status, gender } = result.data
  
  // on rend la vérification conditionnelle
  if (token) {
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
          first_name,
          last_name,
          promo_id,
          status: status || 'STUDENT',
          gender: gender || null, // Convert empty string or falsy value to null for Prisma
          role: 'MEMBER', // Default role
          ...(token ? { invitation_token: token } : {}), // token optionnel
          //gestion du statut du profil
          profile_status: profile_status || 'PUBLIC',
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

  return {
    success: true,
    message: `Un email vous a été envoyé. ${MAIL_LINK_VALIDITY_SENTENCE}`,
  }
}
// On remet en place la logique de gestion de lien d'invitation (token)

export async function verifyInvitationToken(token: string) {
  if (!token) return { error: "Veuillez fournir un lien ou un code d'invitation." }

  const invitation = await prisma.invitation.findUnique({
    where: { token }
  })

  if (!invitation) return { error: "Lien d'invitation invalide." }
  if (new Date() > invitation.expires_at) return { error: "Le lien d'invitation a expiré." }

  return { success: true }
}
  

export async function verifyEmailOtp(token_hash: string, type: 'signup' | 'recovery' | 'invite' | 'magiclink' | 'email_change' = 'signup') {
  if (!token_hash) return { error: "Le jeton de confirmation est manquant." }

  const supabase = await createClient()

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    })

    if (error) {
      logger.error({ error: error.message }, "Erreur lors de la vérification de l'OTP");
      return { error: "Lien invalide ou expiré. Il est possible qu'il ait déjà été utilisé." }
    }

    if (data.user) {
      logger.info({ userId: data.user.id }, 'Auth Confirm: User OTP confirmed successfully');
      
      // On s'assure que l'utilisateur est bien créé dans Prisma s'il ne l'est pas encore (synchronisation)
      const existingMember = await prisma.member.findUnique({
        where: { id: data.user.id }
      })

      if (!existingMember) {
        logger.info({ userId: data.user.id }, 'Auth Confirm: Synchronizing missing member in Prisma');
        const { first_name, last_name, name, promo_id, status, gender } = data.user.user_metadata

        const sanitizedStatus = (status as string || 'STUDENT').toUpperCase() as 'STUDENT' | 'ALUMNI';
        const sanitizedGender = gender ? (gender as string).toUpperCase() as 'MALE' | 'FEMALE' : null;
        const effectiveFirstName = first_name || (name ? name.split(' ').slice(1).join(' ') : 'Prénom');
        const effectiveLastName = last_name || (name ? name.split(' ')[0] : 'Nom');

        if ((!first_name && !last_name && !name) || !promo_id) {
           logger.error({ userMetadata: data.user.user_metadata }, 'Auth Confirm ERROR: Missing metadata for Prisma creation');
        } else {
           // Générer le slug et créer le membre (la logique originelle était dans callback/route.ts, on la duplique ici pour la sécurité)
           const { generateUniqueSlug } = await import('@/lib/slug');
           const slugBase = `${effectiveLastName} ${effectiveFirstName}`;
           const slug = await generateUniqueSlug(slugBase, async (candidate) => {
             const existing = await prisma.member.findUnique({ where: { slug: candidate } })
             return !!existing
           })
           
           await prisma.member.create({
             data: {
               id: data.user.id,
               email: data.user.email!,
               first_name: effectiveFirstName,
               last_name: effectiveLastName,
               promo_id,
               status: sanitizedStatus,
               gender: sanitizedGender,
               role: 'MEMBER',
               poste_id: null,
               function: 'NONE',
               slug,
             }
           });
           logger.info('Auth Confirm: Synchronized member in Prisma');
        }
      }

      return { success: true }
    }

    return { error: "Une erreur est survenue lors de la vérification." }
  } catch (err) {
    logger.error({ err }, 'Exception in verifyEmailOtp');
    return { error: "Erreur inattendue." }
  }
}

/**
 * Demande d'adhesion sans lien d'invitation. Aucun mot de passe n'est saisi :
 * le compte est cree avec un secret aleatoire que personne ne connait, et le
 * membre definit le sien via le lien recu apres approbation.
 */
export async function requestRegistration(formData: FormData) {
  const captchaToken = String(formData.get('captchaToken') ?? '')
  if (process.env.NODE_ENV === 'production' && !captchaToken) {
    return { error: 'Le captcha est requis.' }
  }

  const parsed = registerRequestSchema.safeParse({
    first_name: formData.get('first_name'),
    last_name: formData.get('last_name'),
    email: formData.get('email'),
    promo_id: formData.get('promo_id'),
    status: formData.get('status'),
    gender: formData.get('gender'),
    profile_status: formData.get('profile_status') || undefined,
  })
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Formulaire invalide.' }
  }

  const { email, first_name, last_name, promo_id, status, gender, profile_status } = parsed.data

  const existing = await prisma.member.findUnique({ where: { email } })
  if (existing) {
    return { error: 'Un compte existe déjà avec cet email.' }
  }

  const admin = createAdminClient()

  // L'email est marque confirme : la verification d'adresse a lieu de fait
  // quand le membre ouvre le lien envoye apres approbation.
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: randomBytes(24).toString('base64url'),
    email_confirm: true,
    user_metadata: { first_name, last_name, promo_id, status, gender, profile_status },
  })

  if (createError || !created?.user) {
    logger.error({ error: createError }, 'requestRegistration: création du compte impossible')
    return { error: "Impossible d'enregistrer la demande. Réessayez plus tard." }
  }

  const userId = created.user.id

  try {
    const photo = formData.get('photo')
    let photoUrl: string | null = null
    if (photo instanceof File && photo.size > 0) {
      const check = validateImage(photo)
      if (!check.ok) {
        await admin.auth.admin.deleteUser(userId)
        return { error: check.error }
      }
      const path = `avatars/${buildStorageName(`${first_name}-${last_name}`, check.ext)}`
      const { error: uploadError } = await admin.storage
        .from('membres_images')
        .upload(path, photo, { upsert: true })
      if (uploadError) {
        logger.warn({ error: uploadError }, 'requestRegistration: photo non enregistrée')
      } else {
        photoUrl = admin.storage.from('membres_images').getPublicUrl(path).data.publicUrl
      }
    }

    const slug = await generateUniqueSlug(`${last_name} ${first_name}`, async (candidate) => {
      const found = await prisma.member.findUnique({ where: { slug: candidate } })
      return found !== null
    })

    await prisma.member.create({
      data: {
        id: userId,
        email,
        first_name,
        last_name,
        promo_id,
        status,
        gender,
        photo_url: photoUrl,
        profile_status: profile_status ?? 'PUBLIC',
        registration_status: 'PENDING',
        role: 'MEMBER',
        function: 'NONE',
        slug,
      },
    })
  } catch (error) {
    // Sans fiche membre, le compte d'authentification serait orphelin.
    await admin.auth.admin.deleteUser(userId)
    logger.error({ error }, 'requestRegistration: création de la fiche membre impossible')
    return { error: "Impossible d'enregistrer la demande. Réessayez plus tard." }
  }

  return { success: true }
}
