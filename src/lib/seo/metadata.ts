import type { Metadata } from 'next'
import { SITE_NAME, DEFAULT_OG_IMAGE, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT, absoluteUrl } from './site'

export interface ToolMetadataInput {
  /** Route path, e.g. '/pdf-merger'. Used to build the canonical + OG url. */
  path: string
  title: string
  description: string
  /** Overrides for the OpenGraph card; default to title/description. */
  ogTitle?: string
  ogDescription?: string
  /** Overrides for the Twitter card; default to ogTitle/ogDescription. */
  twitterTitle?: string
  twitterDescription?: string
  /** Defaults to the site-wide branded OG image. */
  ogImage?: string
  ogImageAlt?: string
  /** Defaults to indexable. Set true for private/transactional pages. */
  noindex?: boolean
}

// Deliberately no `keywords` field — Google has not used the meta keywords
// tag as a ranking signal since 2009, so it's dead weight we don't reproduce.
export function buildToolMetadata(input: ToolMetadataInput): Metadata {
  const url = absoluteUrl(input.path)
  const ogImage = input.ogImage ?? DEFAULT_OG_IMAGE
  const ogImageAlt = input.ogImageAlt ?? input.title
  const ogTitle = input.ogTitle ?? input.title
  const ogDescription = input.ogDescription ?? input.description

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    robots: input.noindex
      ? { index: false, follow: true }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'website',
      url,
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: OG_IMAGE_WIDTH, height: OG_IMAGE_HEIGHT, alt: ogImageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: input.twitterTitle ?? ogTitle,
      description: input.twitterDescription ?? ogDescription,
      images: [ogImage],
    },
  }
}
