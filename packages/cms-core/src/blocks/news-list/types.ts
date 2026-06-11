// apps/saidatech/src/blocks/NewsList/types.ts

export interface NewsItem {
  date: string
  category?: string
  headline: string
  href: string
  thumbnail?: string // Pure string containing the image URL path
  excerpt?: string
}

export interface NewsListBlockProps {
  blockType?: 'news-list'
  eyebrow?: string
  heading?: string
  intro?: string
  items: NewsItem[]
  viewAllCta?: { 
    label: string
    href: string 
  }
  locale?: string
}