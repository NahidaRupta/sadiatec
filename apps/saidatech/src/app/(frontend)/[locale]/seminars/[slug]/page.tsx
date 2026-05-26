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

type SeminarDoc = {
  title: string
  excerpt?: string
  venue?: string
  onlineMeetingUrl?: string
  date: string
  endDate?: string
  description: unknown
  thumbnail?: { url?: string | null } | null
  registrationStatus?: 'open' | 'closed' | 'full' | 'cancelled'
  registrationUrl?: string
  speaker?: { name?: string; jobTitle?: string; organization?: string }
  capacity?: number
  slug: string
  updatedAt?: string
}

const getSeminar = unstable_cache(
  async (slug: string, locale: Locale) => {
    const payload = await getCachedPayload()
    const result = await payload.find({
      collection: 'seminars',
      where: { slug: { equals: slug } },
      locale,
      limit: 1,
    })
    return (result.docs[0] ?? null) as SeminarDoc | null
  },
  ['seminar-detail'],
  { tags: ['seminars'] },
)

export async function generateStaticParams() {
  const payload = await getCachedPayload()
  const result = await payload.find({
    collection: 'seminars',
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

  const seminar = await getSeminar(slug, locale)
  if (!seminar) return {}

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const canonicalPath =
    locale === defaultLocale ? `/seminars/${slug}` : `/${locale}/seminars/${slug}`

  const languages: Record<string, string> = { 'x-default': `${base}/seminars/${slug}` }
  for (const loc of siteConfig.locales.enabled) {
    languages[loc] =
      loc === defaultLocale ? `${base}/seminars/${slug}` : `${base}/${loc}/seminars/${slug}`
  }

  const description = seminar.excerpt ?? undefined
  const thumbnailUrl = seminar.thumbnail?.url ?? undefined
  const ogImages = thumbnailUrl ? [{ url: thumbnailUrl }] : undefined

  return {
    title: seminar.title,
    ...(description ? { description } : {}),
    openGraph: {
      title: seminar.title,
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

const seminarListTitles: Record<Locale, string> = {
  en: 'Seminars & Webinars',
  ja: 'セミナー・ウェビナー',
  bn: 'সেমিনার ও ওয়েবিনার',
}

const speakerLabels: Record<Locale, string> = {
  en: 'Speaker',
  ja: '講師',
  bn: 'বক্তা',
}

const registerLabels: Record<Locale, string> = {
  en: 'Register Now',
  ja: '今すぐ登録',
  bn: 'এখনই নিবন্ধন করুন',
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

const contactLabels: Record<Locale, string> = {
  en: 'Contact Us',
  ja: 'お問い合わせ',
  bn: 'যোগাযোগ করুন',
}

export default async function SeminarDetailPage({ params }: Props) {
  if (!siteConfig.features.seminars) notFound()

  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const seminar = await getSeminar(slug, locale)
  if (!seminar) notFound()

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const homeUrl = locale === defaultLocale ? base : `${base}/${locale}`
  const listUrl =
    locale === defaultLocale ? `${base}/seminars` : `${base}/${locale}/seminars`
  const pageUrl =
    locale === defaultLocale
      ? `${base}/seminars/${slug}`
      : `${base}/${locale}/seminars/${slug}`

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeLabels[locale], item: homeUrl },
      { '@type': 'ListItem', position: 2, name: seminarListTitles[locale], item: listUrl },
      { '@type': 'ListItem', position: 3, name: seminar.title, item: pageUrl },
    ],
  }

  const isOnline = Boolean(seminar.onlineMeetingUrl)
  const isCancelled = seminar.registrationStatus === 'cancelled'

  const eventJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: seminar.title,
    startDate: seminar.date,
    endDate: seminar.endDate ?? seminar.date,
    eventStatus: isCancelled
      ? 'https://schema.org/EventCancelled'
      : 'https://schema.org/EventScheduled',
    eventAttendanceMode: isOnline
      ? 'https://schema.org/OnlineEventAttendanceMode'
      : 'https://schema.org/OfflineEventAttendanceMode',
    location: isOnline
      ? { '@type': 'VirtualLocation', url: seminar.onlineMeetingUrl }
      : { '@type': 'Place', name: seminar.venue ?? siteConfig.site.name },
    organizer: {
      '@type': 'Organization',
      name: siteConfig.site.name,
      url: base,
    },
    url: pageUrl,
    ...(seminar.excerpt ? { description: seminar.excerpt } : {}),
    ...(seminar.speaker?.name
      ? {
          performer: {
            '@type': 'Person',
            name: seminar.speaker.name,
            ...(seminar.speaker.jobTitle ? { jobTitle: seminar.speaker.jobTitle } : {}),
            ...(seminar.speaker.organization
              ? {
                  affiliation: {
                    '@type': 'Organization',
                    name: seminar.speaker.organization,
                  },
                }
              : {}),
          },
        }
      : {}),
    offers: {
      '@type': 'Offer',
      url: seminar.registrationUrl ?? pageUrl,
      availability:
        seminar.registrationStatus === 'open'
          ? 'https://schema.org/InStock'
          : seminar.registrationStatus === 'full'
            ? 'https://schema.org/SoldOut'
            : 'https://schema.org/Discontinued',
    },
  }

  const thumbnailUrl = seminar.thumbnail?.url ?? undefined

  const heroProps: HeroBlockProps = {
    heading: seminar.title,
    ...(seminar.excerpt ? { subheading: seminar.excerpt } : {}),
    ...(thumbnailUrl ? { backgroundImageUrl: thumbnailUrl } : {}),
    overlayOpacity: 50,
    variant: 'center',
    minHeight: 'medium',
    ctaPrimary: { label: contactLabels[locale], href: '/contact' },
    transparentHeader: false,
  }

  const richTextProps: RichTextBlockProps = {
    content: seminar.description,
    maxWidth: 'prose',
  }

  const ctaProps: CTABannerBlockProps = {
    heading: ctaHeadings[locale],
    primaryButton: { label: ctaButtons[locale], href: '/contact' },
    variant: 'filled',
  }

  const date = new Date(seminar.date).toLocaleDateString(
    locale === 'ja' ? 'ja-JP' : locale === 'bn' ? 'bn-BD' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' },
  )

  const location = seminar.onlineMeetingUrl ? onlineLabels[locale] : (seminar.venue ?? null)
  const metaParts = [date, location, seminar.capacity != null ? `${seminar.capacity} seats` : null]
  const metaLine = metaParts.filter(Boolean).join(' · ')

  const speakerName = seminar.speaker?.name
  const speakerTitle = seminar.speaker?.jobTitle
  const speakerOrg = seminar.speaker?.organization

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <HeroBlock {...heroProps} />
      <Section padding="sm">
        <Container>
          <Text className="text-sm text-[var(--color-muted)] text-center">{metaLine}</Text>
        </Container>
      </Section>
      {speakerName && (
        <Section padding="sm">
          <Container>
            <Text className="text-xs font-medium text-[var(--color-primary)] uppercase tracking-wide mb-1 text-center">
              {speakerLabels[locale]}
            </Text>
            <Text className="text-center font-semibold">{speakerName}</Text>
            {(speakerTitle ?? speakerOrg) && (
              <Text className="text-sm text-[var(--color-muted)] text-center">
                {[speakerTitle, speakerOrg].filter(Boolean).join(' · ')}
              </Text>
            )}
          </Container>
        </Section>
      )}
      <Section>
        <Container>
          <RichTextBlock {...richTextProps} />
        </Container>
      </Section>
      {seminar.registrationStatus === 'open' && seminar.registrationUrl && (
        <Section padding="sm">
          <Container className="text-center">
            <Link
              href={seminar.registrationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:opacity-90 transition-opacity"
            >
              {registerLabels[locale]}
            </Link>
          </Container>
        </Section>
      )}
      <CTABannerBlock {...ctaProps} />
    </>
  )
}
