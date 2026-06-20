import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
export const revalidate = 300 // refresh listing every 5 min as fallback

function formatNewsDate(iso: string | undefined): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  } catch { return iso || '' }
}

export default async function NewsPage() {
  const payload = await getPayload({ config: configPromise })
  
  // Fetch everything directly saved in your Collection
  const result = await payload.find({
    collection: 'news',
    sort: '-publishedAt',
    limit: 24,
  })

  const articles = result.docs

  return (
    <main className="bg-white min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-8">Announcements & News</h1>
        
        <div className="flex flex-col border-t border-slate-100">
          {articles.map((article) => (
            <Link 
              key={article.id} 
              href={`/news/${article.slug}`}
              className="group flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 py-6 border-b border-slate-100 transition-colors hover:bg-slate-50/40 px-2 rounded-lg"
            >
              <time className="w-32 shrink-0 text-xs font-semibold text-slate-400 tabular-nums">
                {formatNewsDate(article.publishedAt)}
              </time>
              <span className="flex-1 text-base font-semibold text-slate-900 group-hover:text-amber-600 transition-colors">
                {article.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}