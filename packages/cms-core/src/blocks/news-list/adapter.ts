import type { NewsListBlockProps, NewsItem } from './types'

function mapCollectionItem(doc: Record<string, unknown>): NewsItem | null {
  const headline = typeof doc['title'] === 'string' ? doc['title'] : ''
  const slug = typeof doc['slug'] === 'string' ? doc['slug'] : ''
  if (!headline) return null

  const date = typeof doc['publishedAt'] === 'string' ? doc['publishedAt'] : new Date().toISOString()
  const category = typeof doc['category'] === 'string' && doc['category'] ? doc['category'] : undefined
  const href = slug ? `/news/${slug}` : '/news'
  
  // 1. Parse the excerpt field safely
  const excerpt = typeof doc['excerpt'] === 'string' && doc['excerpt'] ? doc['excerpt'] : undefined

  // 2. Safely extract thumbnail string path from the populated media relation
  let thumbnail: string | undefined = undefined
  if (doc['thumbnail'] && typeof doc['thumbnail'] === 'object') {
    const thumbMedia = doc['thumbnail'] as Record<string, unknown>
    if (typeof thumbMedia['url'] === 'string') {
      thumbnail = thumbMedia['url']
    }
  } else if (typeof doc['thumbnail'] === 'string' && doc['thumbnail']) {
    thumbnail = doc['thumbnail']
  }

  return {
    headline,
    date,
    href,
    ...(category ? { category } : {}),
    ...(excerpt ? { excerpt } : {}),
    ...(thumbnail ? { thumbnail } : {}),
  }
}

function mapInlineItem(item: Record<string, unknown>): NewsItem | null {
  const headline = typeof item['headline'] === 'string' ? item['headline'] : ''
  const href = typeof item['href'] === 'string' ? item['href'] : ''
  if (!headline || !href) return null

  const date = typeof item['date'] === 'string' ? item['date'] : new Date().toISOString()
  const category = typeof item['category'] === 'string' && item['category'] ? item['category'] : undefined
  
  // 3. Support thumbnail and excerpt mapping for manually configured inline blocks as well
  const excerpt = typeof item['excerpt'] === 'string' && item['excerpt'] ? item['excerpt'] : undefined
  const thumbnail = typeof item['thumbnail'] === 'string' && item['thumbnail'] ? item['thumbnail'] : undefined

  return {
    headline,
    date,
    href,
    ...(category ? { category } : {}),
    ...(excerpt ? { excerpt } : {}),
    ...(thumbnail ? { thumbnail } : {}),
  }
}

export function adaptNewsListBlock(raw: unknown): NewsListBlockProps {
  const data = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>

  const str = (v: unknown) => (typeof v === 'string' && v ? v : '')

  const source = data['source'] === 'inline' ? 'inline' : 'collection'

  let items: NewsItem[] = []
  if (source === 'collection') {
    const rawItems = Array.isArray(data['selectedItems']) ? data['selectedItems'] : []
    items = rawItems
      .filter((i): i is Record<string, unknown> => typeof i === 'object' && i !== null)
      .map(mapCollectionItem)
      .filter((i): i is NewsItem => i !== null)
  } else {
    const rawItems = Array.isArray(data['inlineItems']) ? data['inlineItems'] : []
    items = rawItems
      .filter((i): i is Record<string, unknown> => typeof i === 'object' && i !== null)
      .map(mapInlineItem)
      .filter((i): i is NewsItem => i !== null)
  }

  const ctaRaw = (data['viewAllCta'] ?? {}) as Record<string, unknown>
  const ctaLabel = str(ctaRaw['label'])
  const ctaHref = str(ctaRaw['href']) || '/news'

  return {
    items,
    ...(str(data['eyebrow']) ? { eyebrow: str(data['eyebrow']) } : {}),
    ...(str(data['heading']) ? { heading: str(data['heading']) } : {}),
    ...(str(data['intro']) ? { intro: str(data['intro']) } : {}),
    ...(ctaLabel ? { viewAllCta: { label: ctaLabel, href: ctaHref } } : {}),
  }
}