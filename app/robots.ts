import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/auth/callback/', '/dashboard/'],
    },
    sitemap: 'https://aduti.org/sitemap.xml', // Remplacez par votre domaine réel
  }
}
