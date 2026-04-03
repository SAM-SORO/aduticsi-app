import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

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
    // eslint-disable-next-line no-console
    console.log('Signup redirect URL (should be in Supabase whitelist):', redirectUrl);

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error("Auth Callback Error: exchangeCodeForSession failed:", error.message)
    }

    if (!error && data.user) {
      const user = data.user
      // eslint-disable-next-line no-console
      console.log('Auth Callback: User confirmed, checking synchronization. Metadata:', user.user_metadata);
      
      const existingMember = await prisma.member.findUnique({
        where: { id: user.id }
      })

      if (!existingMember) {
        // eslint-disable-next-line no-console
        console.log('Auth Callback: Creating new member in Prisma for user ID:', user.id);
        
        const { name, promo_id, status, role, gender, invitation_token } = user.user_metadata

        if (!invitation_token) {
          // eslint-disable-next-line no-console
          console.warn('Auth Callback: Missing invitation token in metadata for user:', user.id);
          // Don't block redirect, but log warning
        }

        // Validate and sanitize status and gender for Prisma Enums
        const sanitizedStatus = (status as string || 'STUDENT').toUpperCase() as 'STUDENT' | 'ALUMNI';
        const sanitizedGender = gender ? (gender as string).toUpperCase() as 'MALE' | 'FEMALE' : null;

        // Final check that we have Essential data
        if (!name || !promo_id) {
          // eslint-disable-next-line no-console
          console.error('Auth Callback ERROR: Missing name or promo_id', { name, promo_id });
        } else {
          try {
            // eslint-disable-next-line no-console
            console.log('Auth Callback: Attempting Prisma creation with:', { id: user.id, name, promo_id, sanitizedStatus, sanitizedGender });
            
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
            // eslint-disable-next-line no-console
            console.log('Auth Callback: SUCCESS! Member created:', newMember.id);
          } catch (prismaError) {
            // eslint-disable-next-line no-console
            console.error('Auth Callback ERROR (Prisma):', prismaError);
          }
        }
      } else {
        // eslint-disable-next-line no-console
        console.log('Auth Callback: Member already exists in Prisma, skipping creation.');
      }

      return NextResponse.redirect(`${baseOrigin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${baseOrigin}/auth/auth-code-error`)
}
