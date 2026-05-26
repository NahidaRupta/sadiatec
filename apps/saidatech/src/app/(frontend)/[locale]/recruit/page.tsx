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

type IndexProps = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ dept?: string }>
}

type JobSummary = {
  slug: string
  title: string
  excerpt?: string
  department?: string
  location?: string
  employmentType?: string
  closingDate?: string
}

const getJobs = unstable_cache(
  async (locale: Locale) => {
    const payload = await getCachedPayload()
    const result = await payload.find({
      collection: 'jobs',
      where: { active: { equals: true } },
      sort: '-publishedAt',
      locale,
      limit: 200,
    })
    return result.docs as unknown as JobSummary[]
  },
  ['jobs-list'],
  { tags: ['recruit'] },
)

export async function generateStaticParams() {
  return siteConfig.locales.enabled.map((locale) => ({ locale }))
}

const titles: Record<Locale, string> = {
  en: 'Careers',
  ja: '採用情報',
  bn: 'ক্যারিয়ার',
}

const descriptions: Record<Locale, string> = {
  en: 'Join Saidatech and help shape the future of international employment in Japan.',
  ja: 'サイダテックで、日本の国際的な雇用の未来を共に創りましょう。',
  bn: 'সাইদাটেকে যোগ দিন এবং জাপানে আন্তর্জাতিক কর্মসংস্থানের ভবিষ্যৎ গড়ে তুলুন।',
}

const heroSubheadings: Record<Locale, string> = {
  en: 'We are looking for passionate people to help connect global talent with Japanese employers.',
  ja: 'グローバルな人材と日本企業をつなぐ、情熱あふれる仲間を募集しています。',
  bn: 'আমরা এমন আগ্রহী মানুষ খুঁজছি যারা বৈশ্বিক প্রতিভা ও জাপানি নিয়োগকর্তাদের সংযুক্ত করতে সাহায্য করবে।',
}

const homeLabels: Record<Locale, string> = {
  en: 'Home',
  ja: 'ホーム',
  bn: 'হোম',
}

const allDeptLabels: Record<Locale, string> = {
  en: 'All Departments',
  ja: 'すべての部署',
  bn: 'সব বিভাগ',
}

const viewDetailsLabels: Record<Locale, string> = {
  en: 'View Details',
  ja: '詳細を見る',
  bn: 'বিস্তারিত দেখুন',
}

const noOpeningsLabels: Record<Locale, string> = {
  en: 'No open positions at the moment. Check back soon.',
  ja: '現在募集中のポジションはありません。またご確認ください。',
  bn: 'বর্তমানে কোনো খালি পদ নেই। শীঘ্রই আবার দেখুন।',
}

const ctaHeadings: Record<Locale, string> = {
  en: "Don't see the right role? We'd love to hear from you.",
  ja: 'ご希望のポジションが見当たりませんか？ぜひご連絡ください。',
  bn: 'সঠিক পদটি দেখতে পাচ্ছেন না? আমরা আপনার কথা শুনতে চাই।',
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const canonicalPath = locale === defaultLocale ? '/recruit' : `/${locale}/recruit`

  const languages: Record<string, string> = { 'x-default': `${base}/recruit` }
  for (const loc of siteConfig.locales.enabled) {
    languages[loc] = loc === defaultLocale ? `${base}/recruit` : `${base}/${loc}/recruit`
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

export default async function RecruitIndexPage({ params, searchParams }: IndexProps) {
  if (!siteConfig.features.recruit) notFound()

  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const { dept } = await searchParams

  const allJobs = await getJobs(locale)

  const departments = Array.from(
    new Set(allJobs.map((j) => j.department).filter((d): d is string => Boolean(d))),
  )

  const jobs = dept ? allJobs.filter((j) => j.department === dept) : allJobs

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const homeUrl = locale === defaultLocale ? base : `${base}/${locale}`
  const pageUrl = locale === defaultLocale ? `${base}/recruit` : `${base}/${locale}/recruit`

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeLabels[locale], item: homeUrl },
      { '@type': 'ListItem', position: 2, name: titles[locale], item: pageUrl },
    ],
  }

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
      <HeroBlock {...heroProps} />
      <Section>
        <Container>
          {departments.length > 0 && (
            <nav aria-label="Department filter" className="flex flex-wrap gap-2 mb-10">
              <Link
                href="?"
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  !dept
                    ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                    : 'border-neutral-300 text-[var(--color-text)] hover:border-[var(--color-primary)]'
                }`}
              >
                {allDeptLabels[locale]}
              </Link>
              {departments.map((d) => (
                <Link
                  key={d}
                  href={`?dept=${encodeURIComponent(d)}`}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    dept === d
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'border-neutral-300 text-[var(--color-text)] hover:border-[var(--color-primary)]'
                  }`}
                >
                  {d}
                </Link>
              ))}
            </nav>
          )}
          {jobs.length === 0 ? (
            <Text className="text-center text-[var(--color-muted)] py-16">
              {noOpeningsLabels[locale]}
            </Text>
          ) : (
            <ul role="list" className="flex flex-col gap-4">
              {jobs.map((job) => {
                const href =
                  locale === defaultLocale
                    ? `/recruit/${job.slug}`
                    : `/${locale}/recruit/${job.slug}`
                const typeLabel = job.employmentType
                  ? (employmentTypeLabels[job.employmentType]?.[locale] ?? job.employmentType)
                  : undefined
                const metaParts = [job.department, job.location, typeLabel]
                const meta = metaParts.filter(Boolean).join(' · ')
                return (
                  <li key={job.slug}>
                    <Card as="article" hover className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <Heading level={3} className="text-lg mb-1 leading-snug">
                            {job.title}
                          </Heading>
                          {meta && (
                            <Text className="text-sm text-[var(--color-muted)] mb-2">{meta}</Text>
                          )}
                          {job.excerpt && (
                            <Text className="text-sm text-[var(--color-text)] line-clamp-2">
                              {job.excerpt}
                            </Text>
                          )}
                        </div>
                        <Link
                          href={href}
                          className="shrink-0 text-sm font-medium text-[var(--color-primary)] hover:underline"
                        >
                          {viewDetailsLabels[locale]} →
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
