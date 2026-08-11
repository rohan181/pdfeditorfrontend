export type PDFChatPage = {
  pageNumber: number;
  text: string;
  wordCount: number;
};

export type PDFChatHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export type PDFChatCitation = {
  page: number;
  quote: string;
};

const STOP_WORDS = new Set([
  "about",
  "after",
  "again",
  "also",
  "and",
  "are",
  "because",
  "been",
  "before",
  "being",
  "between",
  "but",
  "can",
  "could",
  "did",
  "does",
  "for",
  "from",
  "had",
  "has",
  "have",
  "how",
  "into",
  "its",
  "may",
  "more",
  "most",
  "not",
  "of",
  "on",
  "only",
  "or",
  "other",
  "our",
  "should",
  "than",
  "that",
  "the",
  "their",
  "there",
  "these",
  "they",
  "this",
  "those",
  "through",
  "to",
  "under",
  "was",
  "were",
  "what",
  "when",
  "where",
  "which",
  "who",
  "why",
  "will",
  "with",
  "would",
  "you",
  "your",
]);

export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeForMatching(value: string): string {
  return normalizeWhitespace(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase();
}

export function tokenizeQuestion(value: string): string[] {
  const normalized = normalizeForMatching(value);
  const tokens = normalized
    .split(/\s+/)
    .map((token) =>
      token.replace(/^[.,!?;:()[\]{}"'`]+|[.,!?;:()[\]{}"'`]+$/g, ""),
    )
    .filter(Boolean);

  return Array.from(
    new Set(
      tokens.filter(
        (token) =>
          token.length >= 2 &&
          (!STOP_WORDS.has(token) || /\d/.test(token)),
      ),
    ),
  ).slice(0, 80);
}

function termFrequency(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let start = 0;

  while (count < 12) {
    const index = haystack.indexOf(needle, start);
    if (index === -1) break;
    count += 1;
    start = index + needle.length;
  }

  return count;
}

export function selectRelevantPages(
  question: string,
  pages: PDFChatPage[],
  options: {
    historyText?: string;
    maxPages?: number;
    maxCharacters?: number;
  } = {},
): PDFChatPage[] {
  const maxPages = Math.max(1, Math.min(options.maxPages ?? 8, 12));
  const maxCharacters = Math.max(
    4_000,
    Math.min(options.maxCharacters ?? 72_000, 90_000),
  );
  const query = normalizeWhitespace(
    `${question} ${options.historyText ?? ""}`,
  );
  const normalizedQuestion = normalizeForMatching(question);
  const tokens = tokenizeQuestion(query);
  const phrases = normalizedQuestion
    .split(/[?!.;,]|\b(?:and|or|but)\b/g)
    .map(normalizeWhitespace)
    .filter((phrase) => phrase.length >= 8)
    .slice(0, 6);

  const ranked = pages
    .filter((page) => page.pageNumber > 0 && normalizeWhitespace(page.text))
    .map((page) => {
      const text = normalizeForMatching(page.text);
      let score = 0;

      for (const token of tokens) {
        const frequency = termFrequency(text, token);
        if (!frequency) continue;
        const specificity = /\d/.test(token) || token.length >= 8 ? 2.2 : 1;
        score += Math.min(frequency, 6) * specificity;
      }

      for (const phrase of phrases) {
        if (text.includes(phrase)) score += 12;
      }

      if (page.pageNumber === 1) score += 0.15;
      return { page, score };
    })
    .sort((a, b) => b.score - a.score || a.page.pageNumber - b.page.pageNumber);

  const selected: PDFChatPage[] = [];
  let characterCount = 0;

  for (const { page } of ranked) {
    if (selected.length >= maxPages) break;
    const pageText = normalizeWhitespace(page.text);
    const remaining = maxCharacters - characterCount;
    if (remaining < 500) break;

    const text = pageText.length > remaining ? pageText.slice(0, remaining) : pageText;
    selected.push({ ...page, text });
    characterCount += text.length;
  }

  return selected.sort((a, b) => a.pageNumber - b.pageNumber);
}

export function verifyCitationQuote(pageText: string, quote: string): boolean {
  const normalizedPage = normalizeForMatching(pageText);
  const normalizedQuote = normalizeForMatching(quote)
    .replace(/^["'“”‘’]+|["'“”‘’]+$/g, "")
    .trim();

  return normalizedQuote.length >= 8 && normalizedPage.includes(normalizedQuote);
}

export function validateCitations(
  citations: PDFChatCitation[],
  pages: Pick<PDFChatPage, "pageNumber" | "text">[],
  maximum = 6,
): PDFChatCitation[] {
  const pageMap = new Map(pages.map((page) => [page.pageNumber, page.text]));
  const seen = new Set<string>();
  const valid: PDFChatCitation[] = [];

  for (const citation of citations) {
    const page = Number(citation?.page);
    const quote = normalizeWhitespace(String(citation?.quote ?? "")).slice(0, 280);
    const pageText = pageMap.get(page);
    const key = `${page}:${quote.toLocaleLowerCase()}`;

    if (!pageText || seen.has(key) || !verifyCitationQuote(pageText, quote)) {
      continue;
    }

    seen.add(key);
    valid.push({ page, quote });
    if (valid.length >= maximum) break;
  }

  return valid;
}
