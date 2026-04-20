'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthErrorDetector() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // 1. Check Query Parameters (Standard Supabase Redirect)
    const error = searchParams.get('error')
    const errorCode = searchParams.get('error_code')
    
    // 2. Check Hash/Fragment (Some Supabase Auth flows use #error=...)
    // This is useful for client-side only detection
    const hash = window.location.hash
    const hasHashError = hash.includes('error=') || hash.includes('error_code=')

    if (error || errorCode || hasHashError) {
      // Logic: If there is an auth error, we redirect to the dedicated error page.
      // Most common auth error codes: otp_expired, access_denied, validation_failed
      const shouldRedirect = 
        errorCode === 'otp_expired' || 
        errorCode === 'access_denied' || 
        error === 'access_denied' ||
        hash.includes('otp_expired')

      if (shouldRedirect) {
        router.push('/auth/auth-code-error')
      }
    }
  }, [searchParams, router])

  return null
}

export function AuthErrorListener() {
  return (
    <Suspense fallback={null}>
      <AuthErrorDetector />
    </Suspense>
  )
}
