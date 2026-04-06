import logger from './logger'

/**
 * Vérifie un token Cloudflare Turnstile côté serveur.
 * Retourne `true` si la vérification réussit ou si la clé secrète n'est pas configurée.
 */
export async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) return true

  try {
    const formData = new URLSearchParams()
    formData.append('secret', secretKey)
    formData.append('response', token)

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: formData,
    })
    const data = await response.json()
    if (!data.success) {
      logger.warn({ data }, 'Turnstile verification failed')
    }
    return data.success
  } catch (error) {
    const errorDetails = error instanceof Error ? { message: error.message, stack: error.stack } : error
    logger.error({ error: errorDetails }, 'Turnstile captcha verification error')
    return false
  }
}
