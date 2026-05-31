// SERVER COMPONENT — do not add 'use client'
import { getCachedPayload } from '@/lib/payload'
import siteConfig from '../../../../../site.config'
import { HeaderClient } from './HeaderClient'

interface NavChild {
  label: string | Record<string, string>
  href: string
}

interface MegaColumnItem {
  label: string | Record<string, string>
  href: string
  description?: string | Record<string, string> // 👈 Added for sub-text details
}

interface MegaColumn {
  heading?: string | Record<string, string>
  items?: MegaColumnItem[]
}

interface PayloadMedia {
  id: string
  url?: string
  alt?: string
  [key: string]: any
}

interface NavItem {
  label: string | Record<string, string>
  href: string
  children?: NavChild[]
  megaMenu?: boolean
  megaColumns?: MegaColumn[]
  featuredImage?: string | PayloadMedia // 👈 Added for classroom picture upload reference
}

interface HeaderGlobalData {
  navItems?: NavItem[]
  ctaButton?: { label?: string | Record<string, string>; href?: string }
}

export interface ResolvedMegaColumnItem {
  label: string
  href: string
  description?: string | undefined // 👈 Added | undefined to satisfy strict property types
}

export interface ResolvedMegaColumn {
  heading?: string
  items?: ResolvedMegaColumnItem[]
}

export interface ResolvedNavChild {
  label: string
  href: string
}

export interface ResolvedNavItem {
  label: string
  href: string
  children?: ResolvedNavChild[]
  megaMenu?: boolean
  megaColumns?: ResolvedMegaColumn[]
  featuredImageUrl?: string | undefined // 👈 Added | undefined to satisfy strict property types
  featuredImageAlt?: string | undefined  // 👈 Added | undefined to satisfy strict property types
}

export async function Header({ locale }: { locale: string }) {
  const payload = await getCachedPayload()

  let headerData: HeaderGlobalData = {}
  try {
    const raw = await payload.findGlobal({
      slug: 'header',
      locale: locale as 'en' | 'ja' | 'bn',
      depth: 1, // 👈 Ensures the image relation object gets fetched entirely rather than just an ID string
    })
    headerData = raw as HeaderGlobalData
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') console.warn('[Header] CMS unavailable:', err)
  }

  const resolve = (value: string | Record<string, string> | undefined): string => {
    if (!value) return ''
    if (typeof value === 'string') {
      if (value.trim().startsWith('{')) {
        try { const p = JSON.parse(value); return p[locale] || p['en'] || '' } catch { return value }
      }
      return value
    }
    return value[locale] || value['en'] || ''
  }

  const resolvedNavItems: ResolvedNavItem[] = (headerData.navItems ?? []).map((item) => {
    const resolved: ResolvedNavItem = {
      label: resolve(item.label),
      href: item.href,
    }
    
    // Resolve optional menu featured image
    if (item.featuredImage && typeof item.featuredImage === 'object') {
      resolved.featuredImageUrl = item.featuredImage.url || undefined
      resolved.featuredImageAlt = item.featuredImage.alt || undefined
    }

    if (item.children?.length) {
      resolved.children = item.children.map((c) => ({ 
        label: resolve(c.label), 
        href: c.href 
      }))
    }
    
    if (item.megaMenu) resolved.megaMenu = true
    
    if (item.megaColumns?.length) {
      resolved.megaColumns = item.megaColumns.map((col) => {
        const column: ResolvedMegaColumn = {}
        if (col.heading) column.heading = resolve(col.heading)
        if (col.items?.length) {
          column.items = col.items.map((i) => ({ 
            label: resolve(i.label), 
            href: i.href,
            description: resolve(i.description) // 👈 Resolving description field natively
          }))
        }
        return column
      })
    }
    return resolved
  })

  const localeLabels: Record<string, string> = { en: '🇺🇸', ja: '🇯🇵', bn: '🇧🇩' }

  return (
    <HeaderClient
      navItems={resolvedNavItems}
      ctaLabel={resolve(headerData.ctaButton?.label)}
      ctaHref={headerData.ctaButton?.href ?? '/contact'}
      locales={siteConfig.locales.enabled}
      localeLabels={localeLabels}
      locale={locale}
    />
  )
}