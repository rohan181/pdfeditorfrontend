import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat with PDF Online - AI Answers with Page Citations",
  description:
    "Ask questions about any searchable PDF and get grounded AI answers with verified quotes and page citations. Local text extraction and five free AI questions daily.",
  keywords:
    "chat with PDF, ask PDF questions, AI PDF chat, PDF question answer, PDF page citations, talk to PDF, analyze PDF with AI",
  alternates: { canonical: "https://www.editpdfai.com/chat-with-pdf" },
  openGraph: {
    title: "Chat with PDF - Cited Answers from Your Document",
    description:
      "Ask questions in plain English and check every important answer against verified PDF page quotes.",
    url: "https://www.editpdfai.com/chat-with-pdf",
    siteName: "EditPDF AI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chat with PDF Online",
    description: "Get grounded PDF answers with verified page citations.",
  },
};

const applicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Chat with PDF - EditPDF AI",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  url: "https://www.editpdfai.com/chat-with-pdf",
  description:
    "An AI document question-and-answer tool with local PDF text extraction and verified page citations.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  featureList: [
    "Natural-language PDF questions",
    "Relevant page retrieval",
    "Verified supporting quotes",
    "PDF page citations",
    "Follow-up questions",
    "Local PDF text extraction",
  ],
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://www.editpdfai.com",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Chat with PDF",
      item: "https://www.editpdfai.com/chat-with-pdf",
    },
  ],
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(applicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
