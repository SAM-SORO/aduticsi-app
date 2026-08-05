import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aduticsi.com'

  // Pages statiques — lastModified automatique (date du dernier déploiement)
  const now = new Date().toISOString()

  const routes = [
    { path: '', priority: 1, freq: 'weekly' as const },
    { path: '/about', priority: 0.9, freq: 'weekly' as const },
    { path: '/activities', priority: 0.8, freq: 'weekly' as const },
    { path: '/members', priority: 0.8, freq: 'daily' as const },
    { path: '/contact', priority: 0.6, freq: 'monthly' as const },
    { path: '/auth/login', priority: 0.3, freq: 'monthly' as const },
  ].map(({ path, priority, freq }) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: freq,
    priority,
  }))

  try {
    // Pages dynamiques (ex: profils membres)
    const members = await prisma.member.findMany({
      select: { id: true, slug: true, updated_at: true },
    })

    const memberRoutes = members.map((member) => ({
      url: `${baseUrl}/members/${member.slug ?? member.id}`,
      lastModified: member.updated_at.toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))

    return [...routes, ...memberRoutes]
  } catch {
    return routes
  }
}
