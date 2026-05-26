import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import siteConfig from '../../../../../site.config'
import { getCachedPayload } from '@/lib/payload'
import { HeroBlock, CTABannerBlock } from '@saidatech/cms-core/blocks'
import type { HeroBlockProps, CTABannerBlockProps } from '@saidatech/cms-core/blocks'
import { Container, Section, Heading } from '@saidatech/cms-core/components/ui'
import { FaqAccordion } from './_components/FaqAccordion'

const LOCALES = ['en', 'ja', 'bn'] as const
type Locale = (typeof LOCALES)[number]

function isLocale(s: string): s is Locale {
  return (LOCALES as readonly string[]).includes(s)
}

type Props = { params: Promise<{ locale: string }> }

type FaqDoc = {
  id: string
  question: string
  answer: unknown
  category?: string
  sortOrder?: number
  aiVisible?: boolean
}

const getFaqs = unstable_cache(
  async (locale: Locale) => {
    const payload = await getCachedPayload()
    const result = await payload.find({
      collection: 'faqs',
      where: { active: { equals: true } },
      sort: 'sortOrder',
      locale,
      limit: 200,
    })
    return result.docs as unknown as FaqDoc[]
  },
  ['faqs-list'],
  { tags: ['faq'] },
)

// Lexical rich text → plain HTML (minimal serialiser for answer text)
function lexicalToHtml(content: unknown): string {
  if (!content || typeof content !== 'object') return ''
  const root = (content as Record<string, unknown>)['root']
  if (!root || typeof root !== 'object') return ''
  const children = (root as Record<string, unknown>)['children']
  if (!Array.isArray(children)) return ''
  return children
    .map((node: unknown) => {
      if (!node || typeof node !== 'object') return ''
      const n = node as Record<string, unknown>
      if (n['type'] === 'paragraph') {
        const text = Array.isArray(n['children'])
          ? (n['children'] as Record<string, unknown>[])
              .map((c) => String(c['text'] ?? ''))
              .join('')
          : ''
        return `<p>${text}</p>`
      }
      return ''
    })
    .join('')
}

export async function generateStaticParams() {
  return siteConfig.locales.enabled.map((locale) => ({ locale }))
}

const titles: Record<Locale, string> = {
  en: 'Frequently Asked Questions',
  ja: 'よくある質問',
  bn: 'সাধারণ জিজ্ঞাসা',
}

const descriptions: Record<Locale, string> = {
  en: 'Find answers to common questions about working in Japan, visa requirements, and our recruitment process.',
  ja: '日本での就労・ビザ要件・採用プロセスに関するよくある質問と回答をご覧ください。',
  bn: 'জাপানে কাজ করা, ভিসার প্রয়োজনীয়তা এবং আমাদের নিয়োগ প্রক্রিয়া সম্পর্কে সাধারণ প্রশ্নের উত্তর খুঁজুন।',
}

const heroSubheadings: Record<Locale, string> = {
  en: 'Everything you need to know before starting your Japan career journey.',
  ja: '日本でのキャリアをスタートする前に知っておくべきことを網羅しています。',
  bn: 'জাপানে আপনার ক্যারিয়ার যাত্রা শুরু করার আগে আপনার যা জানা দরকার সব কিছু।',
}

const homeLabels: Record<Locale, string> = {
  en: 'Home',
  ja: 'ホーム',
  bn: 'হোম',
}

const ctaHeadings: Record<Locale, string> = {
  en: "Still have questions? We're here to help.",
  ja: 'まだご質問がありますか？お気軽にご相談ください。',
  bn: 'এখনও প্রশ্ন আছে? আমরা সাহায্য করতে এখানে আছি।',
}

const ctaButtons: Record<Locale, string> = {
  en: 'Contact Us',
  ja: 'お問い合わせ',
  bn: 'যোগাযোগ করুন',
}

const uncategorizedLabels: Record<Locale, string> = {
  en: 'General',
  ja: '一般',
  bn: 'সাধারণ',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const canonicalPath = locale === defaultLocale ? '/faq' : `/${locale}/faq`

  const languages: Record<string, string> = { 'x-default': `${base}/faq` }
  for (const loc of siteConfig.locales.enabled) {
    languages[loc] = loc === defaultLocale ? `${base}/faq` : `${base}/${loc}/faq`
  }

  return {
    title: titles[locale],
    description: descriptions[locale],
    openGraph: {
      title: titles[locale],
      description: descriptions[locale],
      url: `${base}${canonicalPath}`,
      siteName: siteConfig.site.name,
      locale,
      type: 'website',
    },
    alternates: {
      canonical: `${base}${canonicalPath}`,
      languages,
    },
  }
}

export default async function FAQPage({ params }: Props) {
  if (!siteConfig.features.faq) notFound()

  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const faqs = await getFaqs(locale)

  // Group by category, preserving first-seen order
  const categoryMap = new Map<string, FaqDoc[]>()
  for (const faq of faqs) {
    const cat = faq.category ?? uncategorizedLabels[locale]
    const existing = categoryMap.get(cat)
    if (existing) {
      existing.push(faq)
    } else {
      categoryMap.set(cat, [faq])
    }
  }

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const homeUrl = locale === defaultLocale ? base : `${base}/${locale}`
  const pageUrl = locale === defaultLocale ? `${base}/faq` : `${base}/${locale}/faq`

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeLabels[locale], item: homeUrl },
      { '@type': 'ListItem', position: 2, name: titles[locale], item: pageUrl },
    ],
  }

  // FAQPage schema — only aiVisible items
  const aiItems = faqs.filter((f) => f.aiVisible)
  const faqPageJsonLd =
    aiItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: aiItems.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: lexicalToHtml(f.answer).replace(/<[^>]+>/g, ''),
            },
          })),
        }
      : null

  const heroProps: HeroBlockProps = {
    heading: titles[locale],
    subheading: heroSubheadings[locale],
    ctaPrimary: { label: ctaButtons[locale], href: '/contact' },
    overlayOpacity: 40,
    variant: 'center',
    minHeight: 'medium',
    transparentHeader: false,
  }

  const ctaProps: CTABannerBlockProps = {
    heading: ctaHeadings[locale],
    primaryButton: { label: ctaButtons[locale], href: '/contact' },
    variant: 'filled',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqPageJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageJsonLd) }}
        />
      )}
      <HeroBlock {...heroProps} />
      <Section>
        <Container>
          {categoryMap.size === 0 ? (
            <p className="text-center text-[var(--color-muted)] py-16">{descriptions[locale]}</p>
          ) : (
            <div className="space-y-12">
              {Array.from(categoryMap.entries()).map(([category, items]) => (
                <div key={category}>
                  <Heading level={2} className="text-xl font-semibold mb-4 text-[var(--color-text)]">
                    {category}
                  </Heading>
                  <FaqAccordion
                    items={items.map((f) => ({
                      id: f.id,
                      question: f.question,
                      answerHtml: lexicalToHtml(f.answer),
                    }))}
                  />
                </div>
              ))}
            </div>
          )}
        </Container>
      </Section>
      <CTABannerBlock {...ctaProps} />
    </>
  )
}
