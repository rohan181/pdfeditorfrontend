import type { Metadata } from 'next'
import {
  DEFAULT_OG_IMAGE,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
  absoluteUrl,
} from './site'

export type SeoRobots = Readonly<{
  index: boolean
  follow: boolean
}>

export interface PageSeoConfig {
  /** Public route path. Query strings and hashes are discarded when URLs are built. */
  path: string
  title: string
  description: string
  /** Defaults to `path`. Use `null` for private/noindex pages that should not emit a canonical. */
  canonicalPath?: string | null
  /** Defaults to `path`. This is intentionally independent from the canonical field. */
  ogUrl?: string
  ogTitle?: string
  ogDescription?: string
  ogType?: 'website' | 'article'
  /** Local image paths are made absolute against the production origin. */
  ogImage?: string
  ogImageAlt?: string
  publishedTime?: string
  modifiedTime?: string
  twitterCard?: 'summary' | 'summary_large_image'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  /** Public pages default to index/follow. Private routes must opt into noindex/follow. */
  robots?: SeoRobots
}

const INDEX_FOLLOW: SeoRobots = { index: true, follow: true }

function socialImageUrl(image: string): string {
  if (/^https?:\/\//i.test(image)) return image
  return absoluteUrl(image)
}

/**
 * Converts the typed page SEO configuration into Next.js App Router metadata.
 * Canonical and social URLs always use the verified production origin; request
 * query parameters, preview hosts and deployment environment variables cannot
 * alter them.
 */
export function buildPageMetadata(input: PageSeoConfig): Metadata {
  const robots = input.robots ?? INDEX_FOLLOW
  const canonicalPath = input.canonicalPath === undefined ? input.path : input.canonicalPath
  const canonicalUrl = canonicalPath === null ? undefined : absoluteUrl(canonicalPath)
  const openGraphUrl = absoluteUrl(input.ogUrl ?? canonicalPath ?? input.path)
  const openGraphTitle = input.ogTitle ?? input.title
  const openGraphDescription = input.ogDescription ?? input.description
  const openGraphImage = socialImageUrl(input.ogImage ?? DEFAULT_OG_IMAGE)
  const twitterImage = socialImageUrl(input.twitterImage ?? input.ogImage ?? DEFAULT_OG_IMAGE)

  return {
    title: { absolute: input.title },
    description: input.description,
    ...(canonicalUrl ? { alternates: { canonical: canonicalUrl } } : {}),
    robots: robots.index
      ? {
          index: true,
          follow: robots.follow,
          googleBot: {
            index: true,
            follow: robots.follow,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        }
      : {
          index: false,
          follow: robots.follow,
          googleBot: { index: false, follow: robots.follow },
        },
    openGraph: {
      title: openGraphTitle,
      description: openGraphDescription,
      type: input.ogType ?? 'website',
      url: openGraphUrl,
      siteName: SITE_NAME,
      locale: 'en_US',
      images: [{
        url: openGraphImage,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
        alt: input.ogImageAlt ?? input.title,
      }],
      ...(input.ogType === 'article' && input.publishedTime
        ? { publishedTime: input.publishedTime }
        : {}),
      ...(input.ogType === 'article' && input.modifiedTime
        ? { modifiedTime: input.modifiedTime }
        : {}),
    },
    twitter: {
      card: input.twitterCard ?? 'summary_large_image',
      title: input.twitterTitle ?? openGraphTitle,
      description: input.twitterDescription ?? openGraphDescription,
      images: [twitterImage],
    },
  }
}

// Backwards-compatible names for route layouts. Both aliases use the single
// page-level builder above; new code should use PageSeoConfig/buildPageMetadata.
export type ToolMetadataInput = PageSeoConfig
export const buildToolMetadata = buildPageMetadata
