import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AI Quiz Creator from PDF — Generate Quizzes Instantly',
  description: 'Create quizzes and flashcards from any PDF with AI. Generate multiple-choice, true/false and open-ended questions from textbooks, notes and study materials.',
  keywords: 'AI quiz creator, quiz from PDF, generate quiz from PDF, PDF to quiz, AI quiz generator, flashcard generator from PDF',
  alternates: { canonical: 'https://www.editpdfai.com/quiz-creator' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'AI Quiz Creator from PDF — Generate Quizzes Instantly',
    description: 'Generate quizzes and flashcards from any PDF with AI. Perfect for studying and revision. Free online.',
    type: 'website',
    url: 'https://www.editpdfai.com/quiz-creator',
    siteName: 'EditPDF AI',
    images: [{ url: '/social/quiz-creator.png', width: 1200, height: 630, alt: 'AI Quiz Creator from PDF' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Quiz Creator from PDF',
    description: 'Generate quizzes and flashcards from any PDF with AI. Free online, no signup.',
    images: ['/social/quiz-creator.png'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI Quiz Creator',
  url: 'https://www.editpdfai.com/quiz-creator',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Create quizzes and flashcards from any PDF with AI. Generate multiple-choice, true/false and open-ended questions.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {children}
    </>
  )
}
