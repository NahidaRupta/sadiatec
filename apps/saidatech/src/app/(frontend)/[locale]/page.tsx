import { notFound } from 'next/navigation'
import { getCachedPayload } from '@/lib/payload'
import { blockRegistry } from '@saidatech/cms-core/blocks'
export const revalidate = 0 // Forces Next.js to fetch fresh data on every single request

const SUPPORTED_LOCALES = ['en', 'ja', 'bn'] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

function isSupportedLocale(s: string): s is SupportedLocale {
  return (SUPPORTED_LOCALES as readonly string[]).includes(s)
}

type RawBlock = { blockType: string; id?: string } & Record<string, unknown>

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!isSupportedLocale(locale)) notFound()

  const payload = await getCachedPayload()

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'home' } },
    locale,
    limit: 1,
  })

  const page = result.docs[0]
  if (!page) return null

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
