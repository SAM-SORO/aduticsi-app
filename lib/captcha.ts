import logger from './logger'

/**
 * Vérifie un token Cloudflare Turnstile côté serveur.
 * Retourne `true` si la vérification réussit ou si la clé secrète n'est pas configurée.
 */
export async function verifyTurnstile(token: string): Promise<boolean> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY
  if (!secretKey) return true

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ response: token, secret: secretKey }),
    })
    const data = await response.json()
    return data.success
  } catch (error) {
    logger.error({ error }, 'Turnstile captcha verification error')
    return false
  }
}
