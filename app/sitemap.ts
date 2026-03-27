import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://aduti.org' // Remplacez par votre domaine réel

  // Pages statiques
  const routes = [
    '',
    '/about',
    '/activities',
    '/contact',
    '/members',
    '/auth/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  try {
    // Pages dynamiques (ex: profils membres)
    const members = await prisma.member.findMany({
      select: { id: true, updated_at: true },
    })

    const memberRoutes = members.map((member) => ({
      url: `${baseUrl}/members/${member.id}`,
      lastModified: member.updated_at.toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }))

    return [...routes, ...memberRoutes]
  } catch {
    return routes
  }
}
