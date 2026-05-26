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

const LOCALES = ['en', 'ja', 'bn'] as const
type Locale = (typeof LOCALES)[number]

function isLocale(s: string): s is Locale {
  return (LOCALES as readonly string[]).includes(s)
}

type Props = { params: Promise<{ locale: string; slug: string }> }

type ServiceDoc = {
  title: string
  excerpt: string
  slug: string
  thumbnail?: { url?: string | null } | null
  body?: unknown
  stats?: Array<{ value: number; suffix?: string; label: string; icon?: string }>
  cta?: {
    heading?: string
    subheading?: string
    buttonLabel?: string
    buttonHref?: string
  }
}

const getService = unstable_cache(
  async (slug: string, locale: Locale) => {
    const payload = await getCachedPayload()
    const result = await payload.find({
      collection: 'services',
      where: { slug: { equals: slug } },
      locale,
      limit: 1,
    })
    return (result.docs[0] ?? null) as ServiceDoc | null
  },
  ['service'],
  { tags: ['services'] },
)

export async function generateStaticParams() {
  const payload = await getCachedPayload()
  const result = await payload.find({
    collection: 'services',
    where: { active: { equals: true } },
    limit: 100,
  })
  return siteConfig.locales.enabled.flatMap((locale) =>
    result.docs.map((service) => ({
      locale,
      slug: service.slug as string,
    })),
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isLocale(locale)) return {}

  const service = await getService(slug, locale)
  if (!service) return {}

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const canonicalPath =
    locale === defaultLocale ? `/services/${slug}` : `/${locale}/services/${slug}`

  const languages: Record<string, string> = {
    'x-default': `${base}/services/${slug}`,
  }
  for (const loc of siteConfig.locales.enabled) {
    languages[loc] =
      loc === defaultLocale
        ? `${base}/services/${slug}`
        : `${base}/${loc}/services/${slug}`
  }

  const thumbnailUrl = service.thumbnail?.url
  const ogImages = thumbnailUrl ? [{ url: thumbnailUrl }] : undefined

  return {
    title: service.title,
    description: service.excerpt,
    openGraph: {
      title: service.title,
      description: service.excerpt,
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

const ctaFallback: Record<Locale, string> = {
  en: 'Ready to get started?',
  ja: 'まずはご相談ください',
  bn: 'শুরু করতে প্রস্তুত?',
}

const ctaButtonFallback: Record<Locale, string> = {
  en: 'Contact Us',
  ja: 'お問い合わせ',
  bn: 'যোগাযোগ করুন',
}

const homeLabels: Record<Locale, string> = {
  en: 'Home',
  ja: 'ホーム',
  bn: 'হোম',
}

const servicesLabels: Record<Locale, string> = {
  en: 'Services',
  ja: 'サービス',
  bn: 'সেবাসমূহ',
}

export default async function ServiceDetailPage({ params }: Props) {
  if (!siteConfig.features.services) notFound()

  const { locale, slug } = await params
  if (!isLocale(locale)) notFound()

  const service = await getService(slug, locale)
  if (!service) notFound()

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const homeUrl = locale === defaultLocale ? base : `${base}/${locale}`
  const servicesUrl =
    locale === defaultLocale ? `${base}/services` : `${base}/${locale}/services`
  const pageUrl =
    locale === defaultLocale
      ? `${base}/services/${slug}`
      : `${base}/${locale}/services/${slug}`

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeLabels[locale], item: homeUrl },
      { '@type': 'ListItem', position: 2, name: servicesLabels[locale], item: servicesUrl },
      { '@type': 'ListItem', position: 3, name: service.title, item: pageUrl },
    ],
  }

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.title,
    description: service.excerpt,
    url: pageUrl,
    provider: {
      '@type': 'Organization',
      name: siteConfig.site.name,
      url: base,
    },
  }

  const thumbnailUrl = service.thumbnail?.url
  const heroProps: HeroBlockProps = {
    heading: service.title,
    ...(thumbnailUrl ? { backgroundImageUrl: thumbnailUrl } : {}),
    overlayOpacity: 50,
    variant: 'center',
    minHeight: 'medium',
    ctaPrimary: {
      label: service.cta?.buttonLabel ?? ctaButtonFallback[locale],
      href: service.cta?.buttonHref ?? '/contact',
    },
    transparentHeader: false,
  }

  const richTextProps: RichTextBlockProps = {
    content: service.body,
    maxWidth: 'prose',
  }

  const statsItems: StatItem[] | null =
    service.stats && service.stats.length > 0 ? service.stats : null

  const statsProps: StatsBlockProps | null = statsItems ? { items: statsItems } : null

  const ctaSubheading = service.cta?.subheading
  const ctaProps: CTABannerBlockProps = {
    heading: service.cta?.heading ?? ctaFallback[locale],
    ...(ctaSubheading ? { subheading: ctaSubheading } : {}),
    primaryButton: {
      label: service.cta?.buttonLabel ?? ctaButtonFallback[locale],
      href: service.cta?.buttonHref ?? '/contact',
    },
    variant: 'filled',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <HeroBlock {...heroProps} />
      <RichTextBlock {...richTextProps} />
      {statsProps && <StatsBlock {...statsProps} />}
      <CTABannerBlock {...ctaProps} />
    </>
  )
}
