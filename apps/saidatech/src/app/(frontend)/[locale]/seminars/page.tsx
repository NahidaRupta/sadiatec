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
  searchParams: Promise<{ tab?: string }>
}

type SeminarSummary = {
  slug: string
  title: string
  excerpt?: string
  venue?: string
  onlineMeetingUrl?: string
  date: string
  registrationStatus?: string
  speaker?: { name?: string }
}

const getSeminars = unstable_cache(
  async (locale: Locale) => {
    const payload = await getCachedPayload()
    const result = await payload.find({
      collection: 'seminars',
      where: { active: { equals: true } },
      sort: 'date',
      locale,
      limit: 200,
    })
    return result.docs as unknown as SeminarSummary[]
  },
  ['seminars-list'],
  { tags: ['seminars'] },
)

export async function generateStaticParams() {
  return siteConfig.locales.enabled.map((locale) => ({ locale }))
}

const titles: Record<Locale, string> = {
  en: 'Seminars & Webinars',
  ja: 'セミナー・ウェビナー',
  bn: 'সেমিনার ও ওয়েবিনার',
}

const descriptions: Record<Locale, string> = {
  en: 'Join our expert-led seminars on Japan work visas, employment law, and international hiring strategies.',
  ja: '就労ビザ・労働法・外国人採用戦略に関する専門家によるセミナーにご参加ください。',
  bn: 'জাপান কর্মসংস্থান ভিসা, শ্রম আইন এবং আন্তর্জাতিক নিয়োগ কৌশলে বিশেষজ্ঞ-পরিচালিত সেমিনারে যোগ দিন।',
}

const homeLabels: Record<Locale, string> = {
  en: 'Home',
  ja: 'ホーム',
  bn: 'হোম',
}

const heroSubheadings: Record<Locale, string> = {
  en: 'Expert sessions on visas, hiring, and workplace compliance — live and on demand.',
  ja: 'ビザ・採用・職場コンプライアンスに関する専門家セッションをお届けします。',
  bn: 'ভিসা, নিয়োগ এবং কর্মক্ষেত্র সম্মতিতে বিশেষজ্ঞ সেশন — লাইভ এবং অন ডিমান্ড।',
}

const upcomingLabels: Record<Locale, string> = {
  en: 'Upcoming',
  ja: '今後の予定',
  bn: 'আসন্ন',
}

const pastLabels: Record<Locale, string> = {
  en: 'Past',
  ja: '過去',
  bn: 'অতীত',
}

const viewDetailsLabels: Record<Locale, string> = {
  en: 'View Details',
  ja: '詳細を見る',
  bn: 'বিস্তারিত দেখুন',
}

const onlineLabels: Record<Locale, string> = {
  en: 'Online',
  ja: 'オンライン',
  bn: 'অনলাইন',
}

const ctaHeadings: Record<Locale, string> = {
  en: 'Want to be notified about upcoming seminars?',
  ja: '今後のセミナー情報をお届けしますか？',
  bn: 'আসন্ন সেমিনার সম্পর্কে জানতে চান?',
}

const ctaButtons: Record<Locale, string> = {
  en: 'Contact Us',
  ja: 'お問い合わせ',
  bn: 'যোগাযোগ করুন',
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
  const canonicalPath = locale === defaultLocale ? '/seminars' : `/${locale}/seminars`

  const languages: Record<string, string> = { 'x-default': `${base}/seminars` }
  for (const loc of siteConfig.locales.enabled) {
    languages[loc] = loc === defaultLocale ? `${base}/seminars` : `${base}/${loc}/seminars`
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

export default async function SeminarsIndexPage({ params, searchParams }: IndexProps) {
  if (!siteConfig.features.seminars) notFound()

  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const { tab } = await searchParams
  const showPast = tab === 'past'

  const allSeminars = await getSeminars(locale)

  const now = new Date()
  const upcoming = allSeminars.filter((s) => new Date(s.date) >= now)
  const past = allSeminars.filter((s) => new Date(s.date) < now).reverse()
  const seminars = showPast ? past : upcoming

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const homeUrl = locale === defaultLocale ? base : `${base}/${locale}`
  const pageUrl = locale === defaultLocale ? `${base}/seminars` : `${base}/${locale}/seminars`

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
          <nav aria-label={titles[locale]} className="flex gap-2 mb-10">
            <Link
              href="?"
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                !showPast
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                  : 'border-neutral-300 text-[var(--color-text)] hover:border-[var(--color-primary)]'
              }`}
            >
              {upcomingLabels[locale]}
            </Link>
            <Link
              href="?tab=past"
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                showPast
                  ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                  : 'border-neutral-300 text-[var(--color-text)] hover:border-[var(--color-primary)]'
              }`}
            >
              {pastLabels[locale]}
            </Link>
          </nav>
          {seminars.length === 0 ? (
            <Text className="text-center text-[var(--color-muted)] py-16">
              {descriptions[locale]}
            </Text>
          ) : (
            <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {seminars.map((seminar) => {
                const href =
                  locale === defaultLocale
                    ? `/seminars/${seminar.slug}`
                    : `/${locale}/seminars/${seminar.slug}`
                const date = new Date(seminar.date).toLocaleDateString(
                  locale === 'ja' ? 'ja-JP' : locale === 'bn' ? 'bn-BD' : 'en-US',
                  { year: 'numeric', month: 'long', day: 'numeric' },
                )
                const location = seminar.onlineMeetingUrl
                  ? onlineLabels[locale]
                  : (seminar.venue ?? null)
                return (
                  <li key={seminar.slug}>
                    <Card as="article" hover className="flex flex-col h-full p-6">
                      <Heading level={3} className="text-lg mb-2 leading-snug">
                        {seminar.title}
                      </Heading>
                      {seminar.excerpt && (
                        <Text className="text-sm text-[var(--color-muted)] mb-4 flex-1 line-clamp-3">
                          {seminar.excerpt}
                        </Text>
                      )}
                      <div className="mt-auto pt-4 border-t border-neutral-200 flex items-center justify-between">
                        <Text className="text-xs text-[var(--color-muted)]">
                          {date}
                          {location && ` · ${location}`}
                        </Text>
                        <Link
                          href={href}
                          className="text-sm font-medium text-[var(--color-primary)] hover:underline shrink-0 ml-2"
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
