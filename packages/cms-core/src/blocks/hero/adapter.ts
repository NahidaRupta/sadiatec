import type { HeroBlockProps } from './types'

export function adaptHeroBlock(raw: unknown): HeroBlockProps {
  const data = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>

  const primaryCtaRaw = (data['primaryCta'] ?? {}) as Record<string, unknown>
  const secondaryCtaRaw = (data['secondaryCta'] ?? {}) as Record<string, unknown>
  const bgImage = data['backgroundImage'] as Record<string, unknown> | null | undefined

  const rawStats = Array.isArray(data['inlineStats']) ? data['inlineStats'] : []
  const inlineStats = rawStats
    .filter((s): s is Record<string, unknown> => typeof s === 'object' && s !== null)
    .map((s) => ({
      value: typeof s['value'] === 'string' ? s['value'] : '',
      label: typeof s['label'] === 'string' ? s['label'] : '',
    }))
    .filter((s) => s.value && s.label)

  const rawPills = Array.isArray(data['keywordPills']) ? data['keywordPills'] : []
  const keywordPills = rawPills
    .filter((p): p is Record<string, unknown> => typeof p === 'object' && p !== null)
    .map((p) => ({ text: typeof p['text'] === 'string' ? p['text'] : '' }))
    .filter((p) => p.text)

  const hasPrimary =
    typeof primaryCtaRaw['label'] === 'string' &&
    primaryCtaRaw['label'] &&
    typeof primaryCtaRaw['href'] === 'string' &&
    primaryCtaRaw['href']

  const hasSecondary =
    typeof secondaryCtaRaw['label'] === 'string' &&
    secondaryCtaRaw['label'] &&
    typeof secondaryCtaRaw['href'] === 'string' &&
    secondaryCtaRaw['href']

  const eyebrowStr = typeof data['eyebrow'] === 'string' && data['eyebrow'] ? data['eyebrow'] : ''
  const subheadlineStr = typeof data['subheadline'] === 'string' && data['subheadline'] ? data['subheadline'] : ''
  const bgImageUrl = bgImage && typeof bgImage['url'] === 'string' ? bgImage['url'] : ''

  return {
    headline: typeof data['headline'] === 'string' ? data['headline'] : '',
    showScrollIndicator:
      typeof data['showScrollIndicator'] === 'boolean' ? data['showScrollIndicator'] : true,
    ...(eyebrowStr ? { eyebrow: eyebrowStr } : {}),
    ...(subheadlineStr ? { subheadline: subheadlineStr } : {}),
    ...(hasPrimary
      ? { primaryCta: { label: primaryCtaRaw['label'] as string, href: primaryCtaRaw['href'] as string } }
      : {}),
    ...(hasSecondary
      ? { secondaryCta: { label: secondaryCtaRaw['label'] as string, href: secondaryCtaRaw['href'] as string } }
      : {}),
    ...(inlineStats.length > 0 ? { inlineStats } : {}),
    ...(keywordPills.length > 0 ? { keywordPills } : {}),
    ...(bgImageUrl ? { backgroundImageUrl: bgImageUrl } : {}),
  }
}
