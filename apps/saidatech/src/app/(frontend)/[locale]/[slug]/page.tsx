import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getCachedPayload } from '@/lib/payload'
import { blockRegistry } from '@saidatech/cms-core/blocks'
import siteConfig from '../../../../../site.config'

function isSupportedLocale(s: string): boolean {
  return (siteConfig.locales.enabled as string[]).includes(s)
}

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

type RawBlock = { blockType: string; id?: string } & Record<string, unknown>

export async function generateStaticParams() {
  const payload = await getCachedPayload()
  const result = await payload.find({
    collection: 'pages',
    limit: 1000,
    select: { slug: true },
  })

  const locales = siteConfig.locales.enabled as string[]

  return locales.flatMap((locale) =>
    result.docs
      .filter((doc) => typeof doc.slug === 'string')
      .map((doc) => ({ locale, slug: doc.slug as string }))
  )
}

export const dynamicParams = true

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isSupportedLocale(locale)) return {}

  const payload = await getCachedPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    locale,
    limit: 1,
  })
  const page = result.docs[0]
  if (!page) return {}

  const meta = (page.meta ?? {}) as Record<string, unknown>
  const metaTitle = typeof meta['title'] === 'string' && meta['title']
    ? meta['title']
    : typeof page['title'] === 'string' ? page['title'] : ''
  const metaDesc = typeof meta['description'] === 'string' ? meta['description'] : ''
  const metaImage = meta['image'] as Record<string, unknown> | null | undefined
  const metaImageUrl = metaImage && typeof metaImage['url'] === 'string' ? metaImage['url'] : undefined

  return {
    title: metaTitle,
    ...(metaDesc ? { description: metaDesc } : {}),
    ...(metaImageUrl ? { openGraph: { images: [metaImageUrl] } } : {}),
  }
}

export default async function DynamicPage({ params }: Props) {
  const { locale, slug } = await params
  if (!slug) notFound()
  if (!isSupportedLocale(locale)) notFound()

  const payload = await getCachedPayload()
  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    locale,
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) notFound()

  const blocks = (page.layout ?? []) as RawBlock[]

  return (
    <>
      {blocks.map((block, index) => {
        const renderer = blockRegistry[block.blockType]
        if (!renderer) return null
        return <div key={block.id ?? index}>{renderer(block)}</div>
      })}
    </>
  )
}