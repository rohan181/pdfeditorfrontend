import { PRODUCT_ACCESS_SUMMARY } from '@/lib/productMessaging'
import { toolMetaMap } from '@/lib/toolMeta'
import { SUPPORT_EMAIL } from '@/lib/entity'
import {
  ORGANIZATION_ID,
  PRODUCTION_ORIGIN,
  SITE_NAME,
  WEBSITE_ID,
  absoluteUrl,
} from './site'

export type JsonLdPrimitive = string | number | boolean | null
export type JsonLdValue = JsonLdPrimitive | JsonLdObject | JsonLdValue[]
export interface JsonLdObject {
  [key: string]: JsonLdValue | undefined
}

export interface StructuredFaq {
  q: string
  a: string
}

export const ORGANIZATION_STRUCTURED_DATA: JsonLdObject = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  url: PRODUCTION_ORIGIN,
  logo: {
    '@type': 'ImageObject',
    '@id': `${PRODUCTION_ORIGIN}/#logo`,
    url: `${PRODUCTION_ORIGIN}/logo-square.svg`,
    contentUrl: `${PRODUCTION_ORIGIN}/logo-square.svg`,
    width: 512,
    height: 512,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    email: SUPPORT_EMAIL,
    contactType: 'customer support',
  },
}

export function buildHomepageStructuredData(): JsonLdObject {
  const pageId = `${PRODUCTION_ORIGIN}/#webpage`
  const applicationId = `${PRODUCTION_ORIGIN}/#application`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: SITE_NAME,
        url: PRODUCTION_ORIGIN,
        inLanguage: 'en',
        publisher: { '@id': ORGANIZATION_ID },
      },
      {
        '@type': 'WebPage',
        '@id': pageId,
        name: SITE_NAME,
        url: PRODUCTION_ORIGIN,
        description: PRODUCT_ACCESS_SUMMARY,
        inLanguage: 'en',
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': applicationId },
        mainEntity: { '@id': applicationId },
      },
      {
        '@type': 'WebApplication',
        '@id': applicationId,
        name: SITE_NAME,
        url: PRODUCTION_ORIGIN,
        description: PRODUCT_ACCESS_SUMMARY,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web browser',
        inLanguage: 'en',
        provider: { '@id': ORGANIZATION_ID },
        mainEntityOfPage: { '@id': pageId },
      },
    ],
  }
}

export function buildToolStructuredData(slug: string): JsonLdObject {
  const tool = toolMetaMap[slug]
  if (!tool) throw new Error(`Unknown tool slug: ${slug}`)

  const url = absoluteUrl(`/${slug}`)
  const pageId = `${url}#webpage`
  const applicationId = `${url}#application`
  const breadcrumbId = `${url}#breadcrumb`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': pageId,
        name: tool.name,
        url,
        description: tool.desc,
        inLanguage: 'en',
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': applicationId },
        mainEntity: { '@id': applicationId },
        breadcrumb: { '@id': breadcrumbId },
      },
      {
        '@type': 'WebApplication',
        '@id': applicationId,
        name: tool.name,
        url,
        description: tool.desc,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web browser',
        inLanguage: 'en',
        provider: { '@id': ORGANIZATION_ID },
        mainEntityOfPage: { '@id': pageId },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: PRODUCTION_ORIGIN,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: tool.name,
            item: url,
          },
        ],
      },
    ],
  }
}

export function buildFaqStructuredData(path: string, faqs: StructuredFaq[]): JsonLdObject {
  const url = absoluteUrl(path)

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    isPartOf: { '@id': `${url}#webpage` },
    mainEntity: faqs.map((faq, index) => ({
      '@type': 'Question',
      '@id': `${url}#question-${index + 1}`,
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        '@id': `${url}#answer-${index + 1}`,
        text: faq.a,
      },
    })),
  }
}

export function buildWebPageStructuredData({
  path,
  name,
  description,
  type = 'WebPage',
  mainEntityId,
}: {
  path: string
  name: string
  description: string
  type?: 'WebPage' | 'AboutPage' | 'ContactPage' | 'CollectionPage'
  mainEntityId?: string
}): JsonLdObject {
  const url = absoluteUrl(path)

  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#webpage`,
    name,
    url,
    description,
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    ...(mainEntityId ? { mainEntity: { '@id': mainEntityId } } : {}),
  }
}

export function buildGuideStructuredData(guide: {
  slug: string
  title: string
  description: string
  datePublished?: string
  dateModified?: string
}): JsonLdObject {
  const url = absoluteUrl(`/guides/${guide.slug}`)
  const pageId = `${url}#webpage`
  const articleId = `${url}#article`
  const breadcrumbId = `${url}#breadcrumb`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': pageId,
        name: guide.title,
        url,
        description: guide.description,
        inLanguage: 'en',
        isPartOf: { '@id': WEBSITE_ID },
        breadcrumb: { '@id': breadcrumbId },
        mainEntity: { '@id': articleId },
      },
      {
        '@type': 'Article',
        '@id': articleId,
        headline: guide.title,
        description: guide.description,
        url,
        ...(guide.datePublished ? { datePublished: guide.datePublished } : {}),
        ...(guide.dateModified ? { dateModified: guide.dateModified } : {}),
        inLanguage: 'en',
        publisher: { '@id': ORGANIZATION_ID },
        mainEntityOfPage: { '@id': pageId },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: PRODUCTION_ORIGIN,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Guides',
            item: absoluteUrl('/guides'),
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: guide.title,
            item: url,
          },
        ],
      },
    ],
  }
}

export function buildGuidesCollectionStructuredData(guides: Array<{
  slug: string
  title: string
}>): JsonLdObject {
  const url = absoluteUrl('/guides')
  const pageId = `${url}#webpage`
  const listId = `${url}#guide-list`
  const breadcrumbId = `${url}#breadcrumb`

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': pageId,
        name: 'PDF Guides & How-To Articles',
        url,
        description: 'Step-by-step guides for editing, compressing, signing, merging and securing PDF documents.',
        inLanguage: 'en',
        isPartOf: { '@id': WEBSITE_ID },
        breadcrumb: { '@id': breadcrumbId },
        mainEntity: { '@id': listId },
      },
      {
        '@type': 'ItemList',
        '@id': listId,
        itemListElement: guides.map((guide, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: guide.title,
          url: absoluteUrl(`/guides/${guide.slug}`),
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': breadcrumbId,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: PRODUCTION_ORIGIN,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Guides',
            item: url,
          },
        ],
      },
    ],
  }
}
