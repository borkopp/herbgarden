import { MetadataRoute } from 'next'
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://tinyme.mk'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/account', '/cart', '/checkout'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}