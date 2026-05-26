import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import siteConfig from '../../../../../site.config'
import { getCachedPayload } from '@/lib/payload'
import { HeroBlock, CTABannerBlock } from '@saidatech/cms-core/blocks'
import type { HeroBlockProps, CTABannerBlockProps } from '@saidatech/cms-core/blocks'
import {
  Container,
  Section,
  Heading,
  Card,
  Text,
} from '@saidatech/cms-core/components/ui'

const LOCALES = ['en', 'ja', 'bn'] as const
type Locale = (typeof LOCALES)[number]

function isLocale(s: string): s is Locale {
  return (LOCALES as readonly string[]).includes(s)
}

type Props = { params: Promise<{ locale: string }> }

type CaseStudySummary = {
  slug: string
  clientName: string
  industry: string
  tagline?: string
  publishedAt: string
}

const getCaseStudyList = unstable_cache(
  async (locale: Locale) => {
    const payload = await getCachedPayload()
    const result = await payload.find({
      collection: 'case-studies',
      where: { active: { equals: true } },
      sort: '-publishedAt',
      locale,
      limit: 100,
    })
    return result.docs as unknown as CaseStudySummary[]
  },
  ['case-studies-index'],
  { tags: ['case-studies'] },
)

export async function generateStaticParams() {
  return siteConfig.locales.enabled.map((locale) => ({ locale }))
}

const titles: Record<Locale, string> = {
  en: 'Case Studies',
  ja: '導入事例',
  bn: 'কেস স্টাডি',
}

const descriptions: Record<Locale, string> = {
  en: 'Real outcomes from real clients — explore how Saidatech has helped businesses across Japan hire, onboard, and retain skilled international talent.',
  ja: '実際のクライアントの導入事例をご覧ください。サイダテックがどのように日本企業の採用・定着を支援してきたかをご紹介します。',
  bn: 'বাস্তব ক্লায়েন্টের ফলাফল দেখুন — সাইদাটেক কীভাবে জাপানের ব্যবসায়গুলিকে দক্ষ বিদেশী কর্মী নিয়োগ ও ধরে রাখতে সাহায্য করেছে।',
}

const homeLabels: Record<Locale, string> = {
  en: 'Home',
  ja: 'ホーム',
  bn: 'হোম',
}

const heroHeadings: Record<Locale, string> = {
  en: 'Case Studies',
  ja: '導入事例',
  bn: 'কেস স্টাডি',
}

const heroSubheadings: Record<Locale, string> = {
  en: 'Real outcomes. Measurable impact. See how we have helped clients across Japan build high-performing international teams.',
  ja: '実績で語る採用支援。日本全国のクライアントが外国人材を活かしてチームを強化した事例をご紹介します。',
  bn: 'বাস্তব ফলাফল। পরিমাপযোগ্য প্রভাব। আমরা কীভাবে জাপান জুড়ে ক্লায়েন্টদের উচ্চ-কার্যক্ষম আন্তর্জাতিক দল গড়তে সাহায্য করেছি তা দেখুন।',
}

const ctaHeadings: Record<Locale, string> = {
  en: 'Ready to see results like these?',
  ja: 'このような成果を実現しませんか？',
  bn: 'এরকম ফলাফল পেতে প্রস্তুত?',
}

const ctaButtons: Record<Locale, string> = {
  en: 'Talk to Our Team',
  ja: 'チームに相談する',
  bn: 'আমাদের টিমের সাথে কথা বলুন',
}

const viewStudyLabels: Record<Locale, string> = {
  en: 'View Case Study',
  ja: '事例を見る',
  bn: 'কেস স্টাডি দেখুন',
}

const industryLabels: Record<Locale, string> = {
  en: 'Industry',
  ja: '業種',
  bn: 'শিল্প খাত',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const canonicalPath = locale === defaultLocale ? '/case-studies' : `/${locale}/case-studies`

  const languages: Record<string, string> = { 'x-default': `${base}/case-studies` }
  for (const loc of siteConfig.locales.enabled) {
    languages[loc] =
      loc === defaultLocale ? `${base}/case-studies` : `${base}/${loc}/case-studies`
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

export default async function CaseStudiesIndexPage({ params }: Props) {
  if (!siteConfig.features.caseStudies) notFound()

  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const docs = await getCaseStudyList(locale)

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const homeUrl = locale === defaultLocale ? base : `${base}/${locale}`
  const pageUrl =
    locale === defaultLocale ? `${base}/case-studies` : `${base}/${locale}/case-studies`

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeLabels[locale], item: homeUrl },
      { '@type': 'ListItem', position: 2, name: titles[locale], item: pageUrl },
    ],
  }

  const heroProps: HeroBlockProps = {
    heading: heroHeadings[locale],
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
      <HeroBlock {...heroProps} />
      <Section>
        <Container>
          <Heading level={2} className="mb-8 text-center">
            {titles[locale]}
          </Heading>
          {docs.length === 0 ? (
            <Text className="text-center text-[var(--color-muted)]">{descriptions[locale]}</Text>
          ) : (
            <ul
              role="list"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {docs.map((doc) => {
                const href =
                  locale === defaultLocale
                    ? `/case-studies/${doc.slug}`
                    : `/${locale}/case-studies/${doc.slug}`
                const date = new Date(doc.publishedAt).toLocaleDateString(
                  locale === 'ja' ? 'ja-JP' : locale === 'bn' ? 'bn-BD' : 'en-US',
                  { year: 'numeric', month: 'long' },
                )
                return (
                  <li key={doc.slug}>
                    <Card as="article" hover className="flex flex-col h-full p-6">
                      <Text className="text-xs font-medium text-[var(--color-muted)] uppercase tracking-wide mb-2">
                        {industryLabels[locale]}: {doc.industry}
                      </Text>
                      <Heading level={3} className="text-lg mb-2">
                        {doc.clientName}
                      </Heading>
                      {doc.tagline && (
                        <Text className="text-[var(--color-muted)] text-sm mb-4 flex-1">
                          {doc.tagline}
                        </Text>
                      )}
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-200">
                        <Text className="text-xs text-[var(--color-muted)]">{date}</Text>
                        <Link
                          href={href}
                          className="text-sm font-medium text-[var(--color-primary)] hover:underline"
                        >
                          {viewStudyLabels[locale]} →
                        </Link>
                      </div>
                    </Card>
                  </li>
                )
              })}
            </ul>
          )}
        </Container>
      </Section>
      <CTABannerBlock {...ctaProps} />
    </>
  )
}
