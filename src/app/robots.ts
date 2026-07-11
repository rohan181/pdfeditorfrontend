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
          '/_next/',
          '/trpc/',
        ],
      },
    ],
    sitemap: 'https://editpdfai.com/sitemap.xml',
  }
}
