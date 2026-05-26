import type { HeroBlockProps } from './types'

export function adaptHeroBlock(raw: unknown): HeroBlockProps {
  const data = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>

  // Payload database schemas map fields using snake_case properties
  const ctaRaw    = (data['cta_primary']    ?? {}) as Record<string, unknown>
  const ctaSecRaw = (data['cta_secondary']  ?? {}) as Record<string, unknown>
  const bgImg     = (data['hero_image']     ?? null) as Record<string, unknown> | null
  const badgeRaw  = (data['floating_badge'] ?? null) as Record<string, unknown> | null
  
  // Safe mapping over highlights blocks array rows
  const rawHighlights = Array.isArray(data['highlights']) ? data['highlights'] : []
  const highlights = rawHighlights
    .map((item) => (typeof item === 'object' && item !== null ? (item as Record<string, any>).text : ''))
    .filter((text): text is string => typeof text === 'string' && text.length > 0)

  const ctaSecLabel = typeof ctaSecRaw['label'] === 'string' ? ctaSecRaw['label'] : ''
  const ctaSecHref  = typeof ctaSecRaw['href']  === 'string' ? ctaSecRaw['href']  : ''

  return {
    heading: typeof data['heading'] === 'string' ? data['heading'] : '',
    ...(typeof data['tagline'] === 'string' && data['tagline'] ? { tagline: data['tagline'] } : {}),
    ...(typeof data['subheading'] === 'string' && data['subheading'] ? { subheading: data['subheading'] } : {}),
    highlights,
    ctaPrimary: {
      label: typeof ctaRaw['label'] === 'string' ? ctaRaw['label'] : 'Get Started',
      href:  typeof ctaRaw['href']  === 'string' ? ctaRaw['href']  : '/',
    },
    ...(ctaSecLabel && ctaSecHref ? { ctaSecondary: { label: ctaSecLabel, href: ctaSecHref } } : {}),
    heroImageUrl: bgImg !== null && typeof bgImg['url'] === 'string' ? bgImg['url'] : '',
    ...(badgeRaw && typeof badgeRaw['text'] === 'string'
      ? { floatingBadge: { text: badgeRaw['text'], subtext: typeof badgeRaw['subtext'] === 'string' ? badgeRaw['subtext'] : '' } }
      : {}),
  }
}