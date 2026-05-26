import { unstable_cache } from 'next/cache'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import siteConfig from '../../../../../site.config'
import { getCachedPayload } from '@/lib/payload'
import { blockRegistry } from '@saidatech/cms-core/blocks'

const LOCALES = ['en', 'ja', 'bn'] as const
type Locale = (typeof LOCALES)[number]

function isLocale(s: string): s is Locale {
  return (LOCALES as readonly string[]).includes(s)
}

type RawBlock = { blockType: string; id?: string } & Record<string, unknown>
type Props = { params: Promise<{ locale: string }> }

const getServicesPage = unstable_cache(
  async (locale: Locale) => {
    const payload = await getCachedPayload()
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'services' } },
      locale,
      limit: 1,
    })
    return result.docs[0] ?? null
  },
  ['services-page'],
  { tags: ['services'] },
)

export async function generateStaticParams() {
  return siteConfig.locales.enabled.map((locale) => ({ locale }))
}

const titles: Record<Locale, string> = {
  en: 'Our Services',
  ja: 'サービス一覧',
  bn: 'আমাদের সেবাসমূহ',
}

const descriptions: Record<Locale, string> = {
  en: 'Explore our full range of career placement, visa support, and language training services for professionals in Japan.',
  ja: 'キャリア支援・ビザ申請サポート・日本語研修など、全サービスをご覧ください。',
  bn: 'জাপানে পেশাদারদের জন্য আমাদের সম্পূর্ণ ক্যারিয়ার নিয়োগ, ভিসা সহায়তা এবং ভাষা প্রশিক্ষণ সেবাগুলি দেখুন।',
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  if (!isLocale(locale)) return {}

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const canonicalPath = locale === defaultLocale ? '/services' : `/${locale}/services`

  const languages: Record<string, string> = { 'x-default': `${base}/services` }
  for (const loc of siteConfig.locales.enabled) {
    languages[loc] = loc === defaultLocale ? `${base}/services` : `${base}/${loc}/services`
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

export default async function ServicesIndexPage({ params }: Props) {
  if (!siteConfig.features.services) notFound()

  const { locale } = await params
  if (!isLocale(locale)) notFound()

  const page = await getServicesPage(locale)
  if (!page) return null

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const homeUrl = locale === defaultLocale ? base : `${base}/${locale}`
  const servicesUrl = locale === defaultLocale ? `${base}/services` : `${base}/${locale}/services`

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: homeLabels[locale], item: homeUrl },
      { '@type': 'ListItem', position: 2, name: servicesLabels[locale], item: servicesUrl },
    ],
  }

  const blocks = (page.layout ?? []) as RawBlock[]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {blocks.map((block, index) => {
        const renderer = blockRegistry[block.blockType]
        if (!renderer) return null
        return <div key={block.id ?? index}>{renderer(block)}</div>
      })}
    </>
  )
}
