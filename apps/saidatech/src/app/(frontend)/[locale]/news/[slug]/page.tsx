import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import React from 'react'
import { getCachedPayload } from '@/lib/payload'
import { blockRegistry } from '@saidatech/cms-core/blocks'
import siteConfig from '../../../../../../site.config'

function isSupportedLocale(s: string): boolean {
  return (siteConfig.locales.enabled as string[]).includes(s)
}

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

type RawBlock = { blockType: string; id?: string } & Record<string, unknown>

// 🛠️ INTERNAL LIGHTWEIGHT RENDERER FOR YOUR LEXICAL CONTENT FIELD
function RenderLexicalText({ content }: { content: any }) {
  if (!content) return null

  if (typeof content === 'string') {
    return <p className="text-slate-700 whitespace-pre-wrap leading-relaxed mb-5">{content}</p>
  }

  const renderNodes = (nodes: any[]): React.ReactNode => {
    if (!Array.isArray(nodes)) return null

    return nodes.map((node, index) => {
      if (!node) return null

      if (node.type === 'text') {
        let textElement: React.ReactNode = node.text || ''
        if (node.format & 1) textElement = <strong key={index} className="font-bold text-slate-900">{textElement}</strong>
        if (node.format & 2) textElement = <em key={index} className="italic">{textElement}</em>
        return <span key={index}>{textElement}</span>
      }

      switch (node.type) {
        case 'paragraph':
          return (
            <p key={index} className="text-base text-slate-700 leading-relaxed mb-5 text-left">
              {node.children ? renderNodes(node.children) : ''}
            </p>
          )
        case 'heading':
          const Tag = node.tag || 'h2'
          const headingStyles: Record<string, string> = {
            h1: 'text-2xl md:text-3xl font-bold text-slate-900 mt-8 mb-4 tracking-tight text-left',
            h2: 'text-xl md:text-2xl font-bold text-slate-900 mt-6 mb-3 tracking-tight text-left',
            h3: 'text-lg md:text-xl font-semibold text-slate-900 mt-5 mb-2 text-left',
          }
          return (
            <Tag key={index} className={headingStyles[Tag] || headingStyles.h2}>
              {node.children ? renderNodes(node.children) : ''}
            </Tag>
          )
        default:
          if (node.children && Array.isArray(node.children)) {
            return <React.Fragment key={index}>{renderNodes(node.children)}</React.Fragment>
          }
          return null
      }
    })
  }

  const targetNodes = content?.root?.children || content?.children || (Array.isArray(content) ? content : null)
  return <div className="w-full text-left">{targetNodes ? renderNodes(targetNodes) : null}</div>
}

export async function generateStaticParams() {
  const payload = await getCachedPayload()
  const result = await payload.find({
    collection: 'news',
    limit: 100,
  })
  return siteConfig.locales.enabled.flatMap((locale) =>
    result.docs.map((article) => ({
      locale,
      slug: article.slug as string,
    })),
  )
}

export const dynamicParams = true

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  if (!isSupportedLocale(locale)) return {}

  const payload = await getCachedPayload()
  const result = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug } },
    locale,
    limit: 1,
  })
  const article = result.docs[0]
  if (!article) return {}

  const title = typeof article['title'] === 'string' ? article['title'] : ''
  const description = typeof article['excerpt'] === 'string' ? article['excerpt'] : ''
  const thumbnail = article['thumbnail'] as Record<string, unknown> | null | undefined
  const thumbnailUrl = thumbnail && typeof thumbnail['url'] === 'string' ? thumbnail['url'] : undefined

  const base = `https://${siteConfig.site.domain}`
  const defaultLocale = siteConfig.locales.default
  const canonicalPath = locale === defaultLocale ? `/news/${slug}` : `/${locale}/news/${slug}`

  return {
    title,
    ...(description ? { description } : {}),
    openGraph: {
      title,
      ...(description ? { description } : {}),
      url: `${base}${canonicalPath}`,
      siteName: siteConfig.site.name,
      locale,
      type: 'article',
      ...(thumbnailUrl ? { images: [{ url: thumbnailUrl }] } : {}),
    },
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params
  if (!slug) notFound()
  if (!isSupportedLocale(locale)) notFound()

  const payload = await getCachedPayload()
  const result = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug } },
    locale,
    limit: 1,
  })

  const article = result.docs[0]
  if (!article) notFound()

  // 🛠️ SEPARATE SELECTION LOGICS:
  const layoutBlocks = (article['layout'] ?? []) as RawBlock[]
  const hasLayoutBlocks = Array.isArray(layoutBlocks) && layoutBlocks.length > 0
  
  const richTextContent = article['content'] // Pure lexical content field object

  const titleText = typeof article['title'] === 'string' ? article['title'] : ''
  const excerptText = typeof article['excerpt'] === 'string' ? article['excerpt'] : null

  const thumbnail = article['thumbnail'] as Record<string, unknown> | null | undefined
  const thumbnailUrl = thumbnail && typeof thumbnail['url'] === 'string' ? thumbnail['url'] : null
  const thumbnailAlt = thumbnail && typeof thumbnail['alt'] === 'string' ? thumbnail['alt'] : titleText

  return (
    <main className="w-full pt-14 md:pt-24 bg-white">
      
      {/* Header Panel Layout Frame */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 border-b border-neutral-100">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          
          {thumbnailUrl && (
            <div className="relative flex items-center justify-start shrink-0">
              <div className="relative w-40 h-24 sm:w-48 sm:h-28">
                <Image
                  src={thumbnailUrl}
                  alt={thumbnailAlt}
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </div>
          )}

          <div className="max-w-3xl flex-1 text-left">
            <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text,#111827)] sm:text-4xl">
              {titleText}
            </h1>
            {excerptText && (
              <p className="mt-3 text-base leading-relaxed text-[var(--color-muted,#4b5563)] sm:text-lg">
                {excerptText}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* 🛠️ CONDITIONAL CORE CONTENT RENDERER */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {hasLayoutBlocks ? (
          /* Case A: Custom layout blocks exist */
          <div className="w-full">
            {layoutBlocks.map((block, index) => {
              const renderer = blockRegistry[block.blockType]
              if (!renderer) return null
              return <div key={block.id ?? index}>{renderer(block)}</div>
            })}
          </div>
        ) : richTextContent ? (
          /* Case B: Fall back to standard Lexical text body configuration */
          <div className="w-full border-t border-neutral-100 pt-8">
            <RenderLexicalText content={richTextContent} />
          </div>
        ) : (
          <p className="text-center text-slate-400 py-12 text-sm italic">
            No content written for this article structure.
          </p>
        )}
      </div>

    </main>
  )
}