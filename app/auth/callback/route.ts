import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error("Auth Callback Error: exchangeCodeForSession failed:", error.message)
    }

    if (!error && data.user) {
      // Check if this is a new signup that needs Prisma synchronization
      const user = data.user
      
      const existingMember = await prisma.member.findUnique({
        where: { id: user.id }
      })

      if (!existingMember) {
        // This is a new confirmed user, create in Prisma
        // The metadata was passed during signUp in auth/actions.ts
        const { name, promo_id, status, role, gender, invitation_token } = user.user_metadata

        if (!invitation_token) {
          console.error('Missing invitation token in user metadata for user:', user.id)
          return NextResponse.redirect(`${origin}/auth/auth-code-error`)
        }

        const invitation = await prisma.invitation.findUnique({
          where: { token: invitation_token },
          select: { token: true, expires_at: true },
        })

        if (!invitation || new Date() > invitation.expires_at) {
          console.error('Invitation missing or expired during email confirmation for user:', user.id)
          return NextResponse.redirect(`${origin}/auth/auth-code-error`)
        }

        if (name && promo_id && status) {
          try {
            await prisma.member.create({
              data: {
                id: user.id,
                email: user.email!,
                name,
                promo_id,
                status,
                gender: gender || null,
                role: role || 'MEMBER',
                poste_id: null,
                function: 'NONE',
              }
            })
          } catch (prismaError) {
            console.error('Error creating member in callback:', prismaError)
            // We might want to redirect to an error page here
          }
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that origin is http://localhost:3000
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
