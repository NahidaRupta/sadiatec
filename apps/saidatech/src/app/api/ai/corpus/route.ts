import { type NextRequest, NextResponse } from 'next/server'
import { getCachedPayload } from '@/lib/payload'
import siteConfig from '../../../../../site.config'
import { lexicalToText } from '@saidatech/cms-core/payload/lib/richtext-to-text'

// ---------------------------------------------------------------------------
// Document shape
// ---------------------------------------------------------------------------

interface CorpusDocument {
  type: string
  slug: string
  title: string
  content: string
  sources: { label?: string; url?: string }[]
}

// ---------------------------------------------------------------------------
// Helpers: safe field extraction from raw Payload docs
// ---------------------------------------------------------------------------

function str(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : []
}

function pick(group: unknown, locale: string): string {
  if (!group || typeof group !== 'object') return ''
  return str((group as Record<string, unknown>)[locale])
}

// ---------------------------------------------------------------------------
// Per-collection serializers
// ---------------------------------------------------------------------------

function serializeServices(docs: unknown[], _locale: string): CorpusDocument[] {
  return docs.map((d) => {
    const doc = d as Record<string, unknown>
    return {
      type: 'service',
      slug: str(doc['slug']),
      title: str(doc['title']),
      content: [str(doc['excerpt']), lexicalToText(doc['body'])].filter(Boolean).join('\n\n'),
      sources: [],
    }
  })
}

function serializeFaqs(docs: unknown[], _locale: string): CorpusDocument[] {
  return docs.map((d) => {
    const doc = d as Record<string, unknown>
    const rawSources = arr<Record<string, unknown>>(doc['sources'])
    return {
      type: 'faq',
      slug: str(doc['slug']),
      title: str(doc['question']),
      content: lexicalToText(doc['answer']),
      sources: rawSources.map((s) => ({ label: str(s['label']), url: str(s['url']) })),
    }
  })
}

function serializeTeam(docs: unknown[], _locale: string): CorpusDocument[] {
  return docs.map((d) => {
    const doc = d as Record<string, unknown>
    return {
      type: 'team',
      slug: str(doc['slug']),
      title: str(doc['name']),
      content: [str(doc['title']), lexicalToText(doc['bio'])].filter(Boolean).join('\n'),
      sources: [],
    }
  })
}

function serializeCaseStudies(docs: unknown[], _locale: string): CorpusDocument[] {
  return docs.map((d) => {
    const doc = d as Record<string, unknown>
    return {
      type: 'case-study',
      slug: str(doc['slug']),
      title: str(doc['title']),
      content: [
        str(doc['tagline']),
        lexicalToText(doc['challenge']),
        lexicalToText(doc['solution']),
        lexicalToText(doc['outcome']),
      ]
        .filter(Boolean)
        .join('\n\n'),
      sources: [],
    }
  })
}

function serializeBlog(docs: unknown[], _locale: string): CorpusDocument[] {
  return docs.map((d) => {
    const doc = d as Record<string, unknown>
    return {
      type: 'blog',
      slug: str(doc['slug']),
      title: str(doc['title']),
      content: [str(doc['excerpt']), lexicalToText(doc['content'])].filter(Boolean).join('\n\n'),
      sources: [],
    }
  })
}

function serializeNews(docs: unknown[], _locale: string): CorpusDocument[] {
  return docs.map((d) => {
    const doc = d as Record<string, unknown>
    return {
      type: 'news',
      slug: str(doc['slug']),
      title: str(doc['title']),
      content: [str(doc['excerpt']), lexicalToText(doc['content'])].filter(Boolean).join('\n\n'),
      sources: [],
    }
  })
}

function serializeSeminars(docs: unknown[], _locale: string): CorpusDocument[] {
  return docs.map((d) => {
    const doc = d as Record<string, unknown>
    const speaker = doc['speaker'] as Record<string, unknown> | undefined
    return {
      type: 'seminar',
      slug: str(doc['slug']),
      title: str(doc['title']),
      content: [
        str(doc['excerpt']),
        lexicalToText(doc['description']),
        speaker?.['name'] ? `Speaker: ${str(speaker['name'])}` : '',
      ]
        .filter(Boolean)
        .join('\n\n'),
      sources: [],
    }
  })
}

function serializeCompanyInfo(global: unknown, locale: string): CorpusDocument | null {
  if (!global || typeof global !== 'object') return null
  const g = global as Record<string, unknown>

  const lines: string[] = [
    g['legalName'] ? `Company: ${str(g['legalName'])}` : '',
    g['foundedYear'] ? `Founded: ${String(g['foundedYear'])}` : '',
    g['employeeCount'] ? `Employees: ~${String(g['employeeCount'])}` : '',
    g['capital'] ? `Capital: ${str(g['capital'])}` : '',
    pick(g['description'], locale),
    pick(g['mission'], locale),
    pick(g['vision'], locale),
    pick(g['address'], locale) ? `Address: ${pick(g['address'], locale)}` : '',
    pick(g['businessHours'], locale) ? `Hours: ${pick(g['businessHours'], locale)}` : '',
  ]

  const executives = arr<Record<string, unknown>>(g['executives'])
  if (executives.length > 0) {
    lines.push(
      'Leadership: ' +
        executives
          .map((e) => `${str(e['name'])} (${pick(e['role'], locale)})`)
          .filter(Boolean)
          .join(', '),
    )
  }

  const timeline = arr<Record<string, unknown>>(g['timeline'])
  if (timeline.length > 0) {
    lines.push(
      'History:\n' +
        timeline
          .map((t) => `${String(t['year'])}: ${pick(t['label'], locale)}`)
          .filter(Boolean)
          .join('\n'),
    )
  }

  return {
    type: 'company',
    slug: 'company-info',
    title: str(g['legalName']) || siteConfig.site.name,
    content: lines.filter(Boolean).join('\n'),
    sources: [],
  }
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function GET(request: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const authHeader = request.headers.get('authorization')
  const expectedToken = process.env['AI_CORPUS_SECRET']

  if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  // ── Locale ──────────────────────────────────────────────────────────────────
  const url = new URL(request.url)
  const requestedLocale = url.searchParams.get('locale') ?? siteConfig.locales.default
  const locale = siteConfig.locales.enabled.includes(requestedLocale)
    ? requestedLocale
    : siteConfig.locales.default

  try {
    const payload = await getCachedPayload()

    // ── Parallel queries ────────────────────────────────────────────────────
    const aiFilter = { aiVisible: { equals: true } }
    const activeFilter = { active: { equals: true } }
    const aiActive = { and: [aiFilter, activeFilter] }

    const [
      servicesResult,
      faqsResult,
      teamResult,
      companyGlobal,
      caseStudiesResult,
      blogResult,
      newsResult,
      seminarsResult,
    ] = await Promise.all([
      payload.find({ collection: 'services', where: aiActive, locale: locale as 'en', limit: 500 }),
      payload.find({ collection: 'faqs', where: aiActive, locale: locale as 'en', limit: 500 }),
      siteConfig.features.team
        ? payload.find({ collection: 'team', where: aiFilter, locale: locale as 'en', limit: 500 })
        : Promise.resolve({ docs: [] }),
      payload.findGlobal({ slug: 'company-info' }),
      siteConfig.features.caseStudies
        ? payload.find({ collection: 'case-studies', where: aiActive, locale: locale as 'en', limit: 500 })
        : Promise.resolve({ docs: [] }),
      siteConfig.features.blog
        ? payload.find({ collection: 'blog', where: aiActive, locale: locale as 'en', limit: 500 })
        : Promise.resolve({ docs: [] }),
      payload.find({ collection: 'news', where: aiFilter, locale: locale as 'en', limit: 500 }),
      siteConfig.features.seminars
        ? payload.find({ collection: 'seminars', where: aiActive, locale: locale as 'en', limit: 500 })
        : Promise.resolve({ docs: [] }),
    ])

    // ── Serialise ───────────────────────────────────────────────────────────
    const companyDoc = serializeCompanyInfo(companyGlobal, locale)

    const documents: CorpusDocument[] = [
      ...serializeServices(servicesResult.docs as unknown[], locale),
      ...serializeFaqs(faqsResult.docs as unknown[], locale),
      ...serializeTeam(teamResult.docs as unknown[], locale),
      ...(companyDoc ? [companyDoc] : []),
      ...serializeCaseStudies(caseStudiesResult.docs as unknown[], locale),
      ...serializeBlog(blogResult.docs as unknown[], locale),
      ...serializeNews(newsResult.docs as unknown[], locale),
      ...serializeSeminars(seminarsResult.docs as unknown[], locale),
    ].filter((d) => d.title || d.content)

    return NextResponse.json({
      success: true,
      data: {
        locale,
        documents,
        totalDocuments: documents.length,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: 'Corpus compilation failed' },
      { status: 500 },
    )
  }
}
