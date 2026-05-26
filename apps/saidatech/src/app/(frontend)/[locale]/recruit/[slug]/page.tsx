import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import siteConfig from '../../../../../../site.config'
import { getCachedPayload } from '@/lib/payload'
import {
  HeroBlock,
  RichTextBlock,
  CTABannerBlock,
} from '@saidatech/cms-core/blocks'
import type {
  HeroBlockProps,
  RichTextBlockProps,
  CTABannerBlockProps,
} from '@saidatech/cms-core/blocks'
import { Container, Section, Text } from '@saidatech/cms-core/components/ui'

const LOCALES = ['en', 'ja', 'bn'] as const
type Locale = (typeof LOCALES)[number]

function isLocale(s: string): s is Locale {
  return (LOCALES as readonly string[]).includes(s)
}

type Props = { params: Promise<{ locale: string; slug: string }> }

type RequirementItem = { item?: string }

type JobDoc = {
  title: string
  excerpt?: string
  department?: string
  location?: string
  employmentType?: string
  salary?: string
  salaryMin?: number
  salaryMax?: number
  salaryCurrency?: string
  description: unknown
  responsibilities: unknown
  requirements?: RequirementItem[]
  benefits?: RequirementItem[]
  publishedAt?: string
  closingDate?: string
  thumbnail?: { url?: string | null } | null
  slug: string
  updatedAt?: string
}

const getJob = unstable_cache(
  async (slug: string, locale: Locale) => {
    const payload = await getCachedPayload()
    const result = await payload.find({
      collection: 'jobs',
      where: { slug: { equals: slug } },
      locale,
      limit: 1,
    })
    return (result.docs[0] ?? null) as JobDoc | null
  },
  ['job-detail'],
  { tags: ['recruit'] },
)

export async function generateStaticParams() {
  const payload = await getCachedPayload()
  const result = await payload.find({
    collection: 'jobs',
    where: { active: { equals: true } },
    limit: 200,
  })
  return siteConfig.locales.enabled.flatMap((locale) =>
    result.docs.map((doc) => ({ locale, slug: doc.slug as string })),
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}

  const job = await getJob(slug, locale)
  if (!job) return {}

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const canonicalPath =
    locale === defaultLocale ? `/recruit/${slug}` : `/${locale}/recruit/${slug}`

  const languages: Record<string, string> = { 'x-default': `${base}/recruit/${slug}` }
  for (const loc of siteConfig.locales.enabled) {
    languages[loc] =
      loc === defaultLocale ? `${base}/recruit/${slug}` : `${base}/${loc}/recruit/${slug}`
  }

  const description = job.excerpt ?? undefined
  const thumbnailUrl = job.thumbnail?.url ?? undefined
  const ogImages = thumbnailUrl ? [{ url: thumbnailUrl }] : undefined

  return {
    title: job.title,
    ...(description ? { description } : {}),
    openGraph: {
      title: job.title,
      ...(description ? { description } : {}),
      url: `${base}${canonicalPath}`,
      siteName: siteConfig.site.name,
      locale,
      type: 'website',
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

const recruitTitles: Record<Locale, string> = {
  en: 'Careers',
  ja: '採用情報',
  bn: 'ক্যারিয়ার',
}

const requirementsLabels: Record<Locale, string> = {
  en: 'Requirements',
  ja: '応募要件',
  bn: 'প্রয়োজনীয়তা',
}

const benefitsLabels: Record<Locale, string> = {
  en: 'Benefits',
  ja: '待遇・福利厚生',
  bn: 'সুবিধাসমূহ',
}

const applyLabels: Record<Locale, string> = {
  en: 'Apply Now',
  ja: '今すぐ応募',
  bn: 'এখনই আবেদন করুন',
}

const closingLabels: Record<Locale, string> = {
  en: 'Closing',
  ja: '締切',
  bn: 'সময়সীমা',
}

const ctaHeadings: Record<Locale, string> = {
  en: 'Ready to start your career journey with us?',
  ja: '私たちとキャリアの旅を始めませんか？',
  bn: 'আমাদের সাথে আপনার ক্যারিয়ার যাত্রা শুরু করতে প্রস্তুত?',
}

const ctaButtons: Record<Locale, string> = {
  en: 'Contact Us',
  ja: 'お問い合わせ',
  bn: 'যোগাযোগ করুন',
}

const employmentTypeLabels: Record<string, Record<Locale, string>> = {
  'full-time': { en: 'Full-time', ja: '正社員', bn: 'পূর্ণকালীন' },
  'part-time': { en: 'Part-time', ja: 'パート', bn: 'খণ্ডকালীন' },
  'contract': { en: 'Contract', ja: '契約社員', bn: 'চুক্তিভিত্তিক' },
  'intern': { en: 'Intern', ja: 'インターン', bn: 'ইন্টার্ন' },
  'temporary': { en: 'Temporary', ja: '派遣', bn: 'অস্থায়ী' },
  'remote': { en: 'Remote', ja: 'リモート', bn: 'রিমোট' },
}

const schemaEmploymentType: Record<string, string> = {
  'full-time': 'FULL_TIME',
  'part-time': 'PART_TIME',
  'contract': 'CONTRACTOR',
  'intern': 'INTERN',
  'temporary': 'TEMPORARY',
  'remote': 'OTHER',
}

export default async function RecruitDetailPage({ params }: Props) {
  if (!siteConfig.features.recruit) notFound()

  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const job = await getJob(slug, locale)
  if (!job) notFound()

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const homeUrl = locale === defaultLocale ? base : `${base}/${locale}`
  const listUrl =
    locale === defaultLocale ? `${base}/recruit` : `${base}/${locale}/recruit`
  const pageUrl =
    locale === defaultLocale
      ? `${base}/recruit/${slug}`
      : `${base}/${locale}/recruit/${slug}`

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeLabels[locale], item: homeUrl },
      { '@type': 'ListItem', position: 2, name: recruitTitles[locale], item: listUrl },
      { '@type': 'ListItem', position: 3, name: job.title, item: pageUrl },
    ],
  }

  const baseSalary =
    job.salaryMin != null && job.salaryMax != null
      ? {
          '@type': 'MonetaryAmount',
          currency: job.salaryCurrency ?? 'JPY',
          value: {
            '@type': 'QuantitativeValue',
            minValue: job.salaryMin,
            maxValue: job.salaryMax,
            unitText: 'YEAR',
          },
        }
      : undefined

  const jobPostingJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    url: pageUrl,
    hiringOrganization: {
      '@type': 'Organization',
      name: siteConfig.site.name,
      sameAs: base,
    },
    ...(job.location ? { jobLocation: { '@type': 'Place', name: job.location } } : {}),
    ...(job.employmentType && schemaEmploymentType[job.employmentType]
      ? { employmentType: schemaEmploymentType[job.employmentType] }
      : {}),
    ...(job.publishedAt ? { datePosted: job.publishedAt } : {}),
    ...(job.closingDate ? { validThrough: job.closingDate } : {}),
    ...(job.excerpt ? { description: job.excerpt } : {}),
    ...(baseSalary ? { baseSalary } : {}),
  }

  const thumbnailUrl = job.thumbnail?.url ?? undefined

  const heroProps: HeroBlockProps = {
    heading: job.title,
    ...(job.excerpt ? { subheading: job.excerpt } : {}),
    ...(thumbnailUrl ? { backgroundImageUrl: thumbnailUrl } : {}),
    overlayOpacity: 50,
    variant: 'center',
    minHeight: 'medium',
    ctaPrimary: { label: applyLabels[locale], href: '/contact' },
    transparentHeader: false,
  }

  const descriptionProps: RichTextBlockProps = { content: job.description, maxWidth: 'prose' }
  const responsibilitiesProps: RichTextBlockProps = {
    content: job.responsibilities,
    maxWidth: 'prose',
  }

  const ctaProps: CTABannerBlockProps = {
    heading: ctaHeadings[locale],
    primaryButton: { label: applyLabels[locale], href: '/contact' },
    variant: 'filled',
  }

  const typeLabel = job.employmentType
    ? (employmentTypeLabels[job.employmentType]?.[locale] ?? job.employmentType)
    : undefined

  const metaParts = [job.department, job.location, typeLabel, job.salary]
  const metaLine = metaParts.filter(Boolean).join(' · ')

  const closingDate = job.closingDate
    ? new Date(job.closingDate).toLocaleDateString(
        locale === 'ja' ? 'ja-JP' : locale === 'bn' ? 'bn-BD' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' },
      )
    : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
      />
      <HeroBlock {...heroProps} />
      {(metaLine || closingDate) && (
        <Section padding="sm">
          <Container>
            <Text className="text-sm text-[var(--color-muted)] text-center">
              {metaLine}
              {closingDate && ` · ${closingLabels[locale]}: ${closingDate}`}
            </Text>
          </Container>
        </Section>
      )}
      <Section>
        <Container>
          <RichTextBlock {...descriptionProps} />
        </Container>
      </Section>
      <Section>
        <Container>
          <RichTextBlock {...responsibilitiesProps} />
        </Container>
      </Section>
      {job.requirements && job.requirements.length > 0 && (
        <Section>
          <Container>
            <h2 className="text-xl font-semibold mb-4">{requirementsLabels[locale]}</h2>
            <ul className="list-disc list-inside space-y-2">
              {job.requirements.map((req, i) =>
                req.item ? (
                  <li key={i} className="text-sm text-[var(--color-text)]">
                    {req.item}
                  </li>
                ) : null,
              )}
            </ul>
          </Container>
        </Section>
      )}
      {job.benefits && job.benefits.length > 0 && (
        <Section>
          <Container>
            <h2 className="text-xl font-semibold mb-4">{benefitsLabels[locale]}</h2>
            <ul className="list-disc list-inside space-y-2">
              {job.benefits.map((ben, i) =>
                ben.item ? (
                  <li key={i} className="text-sm text-[var(--color-text)]">
                    {ben.item}
                  </li>
                ) : null,
              )}
            </ul>
          </Container>
        </Section>
      )}
      <Section padding="sm">
        <Container className="text-center">
          <Link
            href="/contact"
            className="inline-block px-8 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition-opacity"
          >
            {applyLabels[locale]}
          </Link>
        </Container>
      </Section>
      <CTABannerBlock {...ctaProps} />
    </>
  )
}
