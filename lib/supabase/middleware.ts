import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'


// Sumulation d'un utilisateur connecté en développement pour tests locaux
const IS_DEV = process.env.NODE_ENV === 'development'
const MOCK_USER = {
  id: 'iic1k5nexfajurej9rrwc6xc',
  email: "test@test.flow",
}





export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // ajout d'un utilisateur fictif pour les tests en développement

  if(IS_DEV){
      const headers = new Headers(request.headers)
      headers.set("x-mock-user-id", MOCK_USER.id)
      headers.set("x-mock-user-email", MOCK_USER.email)
      return NextResponse.next({ request:{headers}})
    }



  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser()


  const { pathname } = request.nextUrl

  // List of public paths that don't require authentication
  const isPublicPath = 
    pathname === '/' ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/about') ||
    pathname.startsWith('/activities') ||
    pathname.startsWith('/members') ||
    pathname.startsWith('/contact') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') // Static files

    

  if (!user && !isPublicPath) {
    // redirect unauthenticated users to login page
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  return supabaseResponse
}
