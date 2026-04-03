import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import logger from '@/lib/logger'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  // Determiner le host et le protocole dynamiquement
  const host = request.headers.get('host') || 'aduticsi.com'
  const isLocal = host.includes('localhost') || host.includes('192.168') || host.includes('127.0.0.1')
  const proto = request.headers.get('x-forwarded-proto') || (isLocal ? 'http' : 'https')
  const baseOrigin = `${proto}://${host}`

  if (code) {
    const supabase = await createClient()
    
    const redirectUrl = `${baseOrigin}/auth/callback`;
    logger.info({ redirectUrl }, 'Signup redirect URL (should be in Supabase whitelist)');

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      logger.error({ error: error.message }, "Auth Callback Error: exchangeCodeForSession failed");
    }

    if (!error && data.user) {
      const user = data.user
      logger.info({ userMetadata: user.user_metadata }, 'Auth Callback: User confirmed, checking synchronization');
      
      const existingMember = await prisma.member.findUnique({
        where: { id: user.id }
      })

      if (!existingMember) {
        logger.info({ userId: user.id }, 'Auth Callback: Creating new member in Prisma');
        
        const { name, promo_id, status, role, gender, invitation_token } = user.user_metadata

        if (!invitation_token) {
          logger.warn({ userId: user.id }, 'Auth Callback: Missing invitation token in metadata');
          // Don't block redirect, but log warning
        }

        // Validate and sanitize status and gender for Prisma Enums
        const sanitizedStatus = (status as string || 'STUDENT').toUpperCase() as 'STUDENT' | 'ALUMNI';
        const sanitizedGender = gender ? (gender as string).toUpperCase() as 'MALE' | 'FEMALE' : null;

        // Final check that we have Essential data
        if (!name || !promo_id) {
          logger.error({ name, promo_id }, 'Auth Callback ERROR: Missing name or promo_id');
        } else {
          try {
            logger.info({ id: user.id, name, promo_id, sanitizedStatus, sanitizedGender }, 'Auth Callback: Attempting Prisma creation');
            
            const newMember = await prisma.member.create({
              data: {
                id: user.id,
                email: user.email!,
                name,
                promo_id,
                status: sanitizedStatus,
                gender: sanitizedGender,
                role: role || 'MEMBER',
                poste_id: null,
                function: 'NONE',
              }
            })
            logger.info({ memberId: newMember.id }, 'Auth Callback: SUCCESS! Member created');
          } catch (prismaError) {
            logger.error({ prismaError }, 'Auth Callback ERROR (Prisma)');
          }
        }
      } else {
        logger.info('Auth Callback: Member already exists in Prisma, skipping creation.');
      }

      return NextResponse.redirect(`${baseOrigin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${baseOrigin}/auth/auth-code-error`)
}
