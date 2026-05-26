import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import siteConfig from '../../../../../../site.config'
import { getCachedPayload } from '@/lib/payload'
import {
  HeroBlock,
  RichTextBlock,
  StatsBlock,
  CTABannerBlock,
} from '@saidatech/cms-core/blocks'
import type {
  HeroBlockProps,
  RichTextBlockProps,
  StatsBlockProps,
  StatItem,
  CTABannerBlockProps,
} from '@saidatech/cms-core/blocks'
import { Container, Section, Heading, Text } from '@saidatech/cms-core/components/ui'

const LOCALES = ['en', 'ja', 'bn'] as const
type Locale = (typeof LOCALES)[number]

function isLocale(s: string): s is Locale {
  return (LOCALES as readonly string[]).includes(s)
}

type Props = { params: Promise<{ locale: string; slug: string }> }

type CaseStudyDoc = {
  clientName: string
  industry: string
  tagline?: string
  challenge?: unknown
  solution?: unknown
  outcome?: unknown
  featuredImage?: { url?: string | null } | null
  results?: Array<{ value: number; suffix?: string; label: string }>
  publishedAt: string
  slug: string
}

const getStudy = unstable_cache(
  async (slug: string, locale: Locale) => {
    const payload = await getCachedPayload()
    const result = await payload.find({
      collection: 'case-studies',
      where: { slug: { equals: slug } },
      locale,
      limit: 1,
    })
    return (result.docs[0] ?? null) as CaseStudyDoc | null
  },
  ['case-study'],
  { tags: ['case-studies'] },
)

export async function generateStaticParams() {
  const payload = await getCachedPayload()
  const result = await payload.find({
    collection: 'case-studies',
    where: { active: { equals: true } },
    limit: 100,
  })
  return siteConfig.locales.enabled.flatMap((locale) =>
    result.docs.map((doc) => ({ locale, slug: doc.slug as string })),
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}

  const study = await getStudy(slug, locale)
  if (!study) return {}

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const canonicalPath =
    locale === defaultLocale
      ? `/case-studies/${slug}`
      : `/${locale}/case-studies/${slug}`

  const languages: Record<string, string> = {
    'x-default': `${base}/case-studies/${slug}`,
  }
  for (const loc of siteConfig.locales.enabled) {
    languages[loc] =
      loc === defaultLocale
        ? `${base}/case-studies/${slug}`
        : `${base}/${loc}/case-studies/${slug}`
  }

  const description = study.tagline ?? `${study.clientName} · ${study.industry}`
  const thumbnailUrl = study.featuredImage?.url
  const ogImages = thumbnailUrl ? [{ url: thumbnailUrl }] : undefined

  return {
    title: study.clientName,
    description,
    openGraph: {
      title: study.clientName,
      description,
      url: `${base}${canonicalPath}`,
      siteName: siteConfig.site.name,
      locale,
      type: 'article',
      ...(ogImages ? { images: ogImages } : {}),
    },
    alternates: {
      canonical: `${base}${canonicalPath}`,
      languages,
    },
  }
}

const homeLabels: Record<Locale, string> = {
  en: 'Home',
  ja: 'ホーム',
  bn: 'হোম',
}

const caseStudyTitles: Record<Locale, string> = {
  en: 'Case Studies',
  ja: '導入事例',
  bn: 'কেস স্টাডি',
}

const challengeLabels: Record<Locale, string> = {
  en: 'Challenge',
  ja: '課題',
  bn: 'চ্যালেঞ্জ',
}

const solutionLabels: Record<Locale, string> = {
  en: 'Solution',
  ja: '解決策',
  bn: 'সমাধান',
}

const outcomeLabels: Record<Locale, string> = {
  en: 'Outcome',
  ja: '成果',
  bn: 'ফলাফল',
}

const resultsLabels: Record<Locale, string> = {
  en: 'Results at a Glance',
  ja: '実績サマリー',
  bn: 'ফলাফল সারসংক্ষেপ',
}

const industryLabels: Record<Locale, string> = {
  en: 'Industry',
  ja: '業種',
  bn: 'শিল্প খাত',
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

const contactLabels: Record<Locale, string> = {
  en: 'Contact Us',
  ja: 'お問い合わせ',
  bn: 'যোগাযোগ করুন',
}

export default async function CaseStudyDetailPage({ params }: Props) {
  if (!siteConfig.features.caseStudies) notFound()

  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const study = await getStudy(slug, locale)
  if (!study) notFound()

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const homeUrl = locale === defaultLocale ? base : `${base}/${locale}`
  const listUrl =
    locale === defaultLocale ? `${base}/case-studies` : `${base}/${locale}/case-studies`
  const pageUrl =
    locale === defaultLocale
      ? `${base}/case-studies/${slug}`
      : `${base}/${locale}/case-studies/${slug}`

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeLabels[locale], item: homeUrl },
      { '@type': 'ListItem', position: 2, name: caseStudyTitles[locale], item: listUrl },
      { '@type': 'ListItem', position: 3, name: study.clientName, item: pageUrl },
    ],
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    articleSection: 'Case Study',
    headline: study.clientName,
    description: study.tagline ?? `${study.clientName} · ${study.industry}`,
    datePublished: study.publishedAt,
    url: pageUrl,
    author: {
      '@type': 'Organization',
      name: siteConfig.site.name,
      url: base,
    },
  }

  const thumbnailUrl = study.featuredImage?.url
  const heroTagline = study.tagline
  const heroProps: HeroBlockProps = {
    heading: study.clientName,
    ...(heroTagline ? { subheading: heroTagline } : {}),
    ...(thumbnailUrl ? { backgroundImageUrl: thumbnailUrl } : {}),
    overlayOpacity: 55,
    variant: 'center',
    minHeight: 'medium',
    ctaPrimary: { label: contactLabels[locale], href: '/contact' },
    transparentHeader: false,
  }

  const richTextProps = (content: unknown): RichTextBlockProps => ({
    content,
    maxWidth: 'prose',
  })

  const resultsItems: StatItem[] | null =
    study.results && study.results.length > 0 ? study.results : null

  const statsProps: StatsBlockProps | null = resultsItems
    ? { sectionHeading: resultsLabels[locale], items: resultsItems }
    : null

  const ctaProps: CTABannerBlockProps = {
    heading: ctaHeadings[locale],
    primaryButton: { label: ctaButtons[locale], href: '/contact' },
    variant: 'filled',
  }

  const date = new Date(study.publishedAt).toLocaleDateString(
    locale === 'ja' ? 'ja-JP' : locale === 'bn' ? 'bn-BD' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <HeroBlock {...heroProps} />
      <Section padding="sm">
        <Container>
          <Text className="text-sm text-[var(--color-muted)] text-center">
            {industryLabels[locale]}: <strong>{study.industry}</strong>
            {' · '}
            {date}
          </Text>
        </Container>
      </Section>
      {study.challenge && (
        <Section>
          <Container>
            <Heading level={2} className="mb-6">
              {challengeLabels[locale]}
            </Heading>
            <RichTextBlock {...richTextProps(study.challenge)} />
          </Container>
        </Section>
      )}
      {study.solution && (
        <Section>
          <Container>
            <Heading level={2} className="mb-6">
              {solutionLabels[locale]}
            </Heading>
            <RichTextBlock {...richTextProps(study.solution)} />
          </Container>
        </Section>
      )}
      {statsProps && <StatsBlock {...statsProps} />}
      {study.outcome && (
        <Section>
          <Container>
            <Heading level={2} className="mb-6">
              {outcomeLabels[locale]}
            </Heading>
            <RichTextBlock {...richTextProps(study.outcome)} />
          </Container>
        </Section>
      )}
      <CTABannerBlock {...ctaProps} />
    </>
  )
}
