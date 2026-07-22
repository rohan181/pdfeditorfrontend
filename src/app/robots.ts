import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard',
          '/manage-subscription',
          '/checkout',
          '/cancel',
          '/sign-in',
          '/sign-up',
          '/trpc/',
        ],
      },
    ],
    sitemap: 'https://www.editpdfai.com/sitemap.xml',
  }
}
