'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from '@/schemas/auth.schema'

export async function login(data: LoginInput) {
  const supabase = await createClient()

  // 1. Validate data
  const result = loginSchema.safeParse(data)
  if (!result.success) {
    return { error: 'Données invalides' }
  }

  const { email, password } = result.data

  // 2. Authenticate with Supabase
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'Email ou mot de passe incorrect' }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(data: RegisterInput) {
  const supabase = await createClient()

  // 1. Validate data
  const result = registerSchema.safeParse(data)
  if (!result.success) {
    return { error: 'Données invalides' }
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
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${(await headers()).get('origin')}/auth/callback`,
        data: {
          name: fullName,
          promo_id,
          status,
          gender,
          role: 'MEMBER', // Default role
        },
      },
    });

    if (error) {
      return { error: error.message };
    }

  } catch (err) {
    console.error('Unexpected signup error:', err);
    return { error: "Une erreur inattendue est survenue lors de l'enregistrement." };
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
    console.error('Error fetching promotions:', error)
    return []
  }
}

export async function forgotPassword(email: string) {
  const supabase = await createClient()
  const origin = (await headers()).get('origin')

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
