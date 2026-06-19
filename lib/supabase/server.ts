import { createServerClient } from '@supabase/ssr'
import { error } from 'console'
import { cookies } from 'next/headers'


// Sumulation d'un utilisateur connecté en développement pour tests locaux
const IS_DEV = process.env.NODE_ENV === 'development'
const MOCK_USER = {
  id: 'iic1k5nexfajurej9rrwc6xc',
  email: "test@test.flow",
}


export async function createClient() {

  // ajout d'un utilisateur fictif pour les tests en développement
  if(IS_DEV){
    return {
      auth : {
        getUser : async () => ({
            data : {user : MOCK_USER},
              error : null,
            }),
      },
    } as any
  }

  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
