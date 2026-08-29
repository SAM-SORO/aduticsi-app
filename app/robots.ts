import type { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/', '/dashboard/', '/profile/'],
    },
    sitemap: 'https://aduticsi.com/sitemap.xml',
  }
}
