import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { generateUniqueSlug } from '@/lib/slug'
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
        
        // on ne log plus l'absence de token d'invitation
        
        
        /*if (!invitation_token) {
          logger.warn({ userId: user.id }, 'Auth Callback: Missing invitation token in metadata');
          // Don't block redirect, but log warning
        }
           */

        const { first_name, last_name, name, promo_id, status, gender, invitation_token, profile_status } = user.user_metadata

        // Validate and sanitize status and gender for Prisma Enums
        const sanitizedStatus = (status as string || 'STUDENT').toUpperCase() as 'STUDENT' | 'ALUMNI';
        const sanitizedGender = gender ? (gender as string).toUpperCase() as 'MALE' | 'FEMALE' : null;

        // Final check that we have Essential data
        const effectiveFirstName = first_name || (name ? name.split(' ').slice(1).join(' ') : 'Prénom');
        const effectiveLastName = last_name || (name ? name.split(' ')[0] : 'Nom');

        if ((!first_name && !last_name && !name) || !promo_id) {
          logger.error({ first_name, last_name, name, promo_id }, 'Auth Callback ERROR: Missing name components or promo_id');
        } else {
          try {
            logger.info({ id: user.id, effectiveFirstName, effectiveLastName, promo_id, sanitizedStatus, sanitizedGender }, 'Auth Callback: Attempting Prisma creation');
            
            // Générer un slug unique pour l'URL du profil (ex: nom-prenom)
            const slugBase = `${effectiveLastName} ${effectiveFirstName}`;
            const slug = await generateUniqueSlug(slugBase, async (candidate) => {
              const existing = await prisma.member.findUnique({ where: { slug: candidate } })
              return !!existing
            })

            const newMember = await prisma.member.create({
              data: {
                id: user.id,
                email: user.email!,
                first_name: effectiveFirstName,
                last_name: effectiveLastName,
                promo_id,
                status: sanitizedStatus,
                gender: sanitizedGender,
                registration_status : invitation_token ? 'APPROVED' :  'PENDING', // s'il a un lien d'invitation, on l'enregistre directement
                role: 'MEMBER', // Toujours MEMBER — ne jamais faire confiance aux métadonnées client
                profile_status: profile_status || 'PUBLIC', // lire le statut du profil
                poste_id: null,
                function: 'NONE',
                slug,
              }
            })
            logger.info({ memberId: newMember.id, slug }, 'Auth Callback: SUCCESS! Member created');

            // on rédirige l'utilisateur vers une page d'informaiton en attendant la validation de son enregistrement
            if (invitation_token) {
               // Creation succeeded. Let's redirect with the welcome animation flag.
            const urlToRedirect = new URL(`${baseOrigin}${next}`);
            urlToRedirect.searchParams.set("welcome", "true");
            return NextResponse.redirect(urlToRedirect.toString());
            }else{
              return NextResponse.redirect(`${baseOrigin}/auth/pending-review`);
            }
          } catch (prismaError) {
            logger.error({ prismaError }, 'Auth Callback ERROR (Prisma)');
          }
        }
      } else {
        
        logger.info('Auth Callback: Member already exists in Prisma, skipping creation.');
        // on vérifie le statut d'enregistrement de l'utilisateur pour faire la bonne redirection
        if (existingMember.registration_status === "PENDING"){
          return NextResponse.redirect(`${baseOrigin}/auth/pending-review`)
        }
        if (existingMember.registration_status === 'REJECTED') {
          return NextResponse.redirect(`${baseOrigin}/auth/registration-rejected`);
        }
      }
      
        
      return NextResponse.redirect(`${baseOrigin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${baseOrigin}/auth/auth-code-error`)
}
