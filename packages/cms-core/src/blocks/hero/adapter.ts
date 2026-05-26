import type { HeroBlockProps } from './types'

export function adaptHeroBlock(raw: unknown): HeroBlockProps {
  const data = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>

  const ctaRaw = (data['ctaPrimary'] ?? {}) as Record<string, unknown>
  const ctaSecRaw = (data['ctaSecondary'] ?? {}) as Record<string, unknown>
  const heroImg = (data['heroImage'] ?? null) as Record<string, unknown> | null
  const badgeRaw = (data['floatingBadge'] ?? {}) as Record<string, unknown>

  const rawHighlights = Array.isArray(data['highlights']) ? data['highlights'] : []
  const highlights = rawHighlights
    .map((item: any) => (typeof item?.text === 'string' ? item.text : ''))
    .filter((text): text is string => text.length > 0)

  return {
    heading: typeof data['heading'] === 'string' ? data['heading'] : '',
    tagline: typeof data['tagline'] === 'string' ? data['tagline'] : undefined,
    subheading: typeof data['subheading'] === 'string' ? data['subheading'] : undefined,
    highlights,

    ctaPrimary: {
      label: typeof ctaRaw['label'] === 'string' ? ctaRaw['label'] : 'Get Started',
      href: typeof ctaRaw['href'] === 'string' ? ctaRaw['href'] : '/',
    },

    ...(typeof ctaSecRaw['label'] === 'string' && ctaSecRaw['label'] && 
        typeof ctaSecRaw['href'] === 'string' && ctaSecRaw['href']
      ? {
          ctaSecondary: {
            label: ctaSecRaw['label'],
            href: ctaSecRaw['href'],
          },
        }
      : {}),

    heroImageUrl: heroImg && typeof heroImg['url'] === 'string' ? heroImg['url'] : undefined,

    ...(badgeRaw && typeof badgeRaw['text'] === 'string' && badgeRaw['text']
      ? {
          floatingBadge: {
            text: badgeRaw['text'],
            subtext: typeof badgeRaw['subtext'] === 'string' ? badgeRaw['subtext'] : undefined,
          },
        }
      : {}),
  } as HeroBlockProps
}