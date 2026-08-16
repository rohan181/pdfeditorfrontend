import { MetadataRoute } from 'next'

// Every route that isn't disallowed below is marketing/tool-page content —
// no user-uploaded files, authenticated pages, or API responses are ever
// publicly routable (PDF processing runs client-side; the only server
// surface is /api/*, which is disallowed for every crawler here).
const DISALLOW = [
  '/api/',
  '/dashboard',
  '/manage-subscription',
  '/checkout',
  '/cancel',
  '/sign-in',
  '/sign-up',
  '/trpc/',
]

// Answer-engine and AI-assistant crawlers, explicitly allowed. This site's
// entire strategy is to be the cited answer in AI Overviews / ChatGPT /
// Perplexity / Copilot (see the AEO audit), so blocking the crawlers that
// power those surfaces would work directly against the goal. None of them
// gets broader access than "*" already grants — same allow/disallow list.
const ANSWER_ENGINE_CRAWLERS = [
  'GPTBot',          // OpenAI training/browsing crawler
  'OAI-SearchBot',   // ChatGPT Search
  'ChatGPT-User',    // ChatGPT "browse" plugin, on-demand fetches
  'ClaudeBot',        // Anthropic training crawler
  'Claude-Web',       // Anthropic on-demand fetches (Claude web browsing)
  'anthropic-ai',
  'PerplexityBot',
  'Google-Extended',  // Gemini / AI Overviews grounding, separate from Googlebot
  'Applebot-Extended', // Apple Intelligence / Siri
  'bingbot',           // Bing search + Copilot
]

// Bulk/training-only crawlers with no citation or referral benefit to this
// site, and (for Bytespider in particular) a documented history of ignoring
// robots.txt rate limits. Blocked rather than defaulting to "allow everything".
const BULK_SCRAPE_CRAWLERS = [
  'CCBot',       // Common Crawl — resold/redistributed for undisclosed uses
  'Bytespider',  // ByteDance — aggressive crawl rate, no search/answer surface
  'Amazonbot',
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: DISALLOW },
      { userAgent: ANSWER_ENGINE_CRAWLERS, allow: '/', disallow: DISALLOW },
      { userAgent: BULK_SCRAPE_CRAWLERS, disallow: '/' },
    ],
    sitemap: 'https://www.editpdfai.com/sitemap.xml',
  }
}
