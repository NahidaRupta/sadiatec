import type { CTABannerBlockProps, CTABannerVariant } from './types'

// Map legacy variant values written before the rename, in case old seeds exist
const variantMap: Record<string, CTABannerVariant> = {
  filled: 'solid',
  outlined: 'gradient',
  'image-bg': 'image',
  solid: 'solid',
  gradient: 'gradient',
  image: 'image',
}

export function adaptCTABannerBlock(raw: unknown): CTABannerBlockProps {
  const data = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>

  const primaryRaw = (data['primaryButton'] ?? {}) as Record<string, unknown>
  const secondaryRaw = (data['secondaryButton'] ?? {}) as Record<string, unknown>
  const bgImage = data['backgroundImage'] as Record<string, unknown> | null | undefined

  const rawVariant = typeof data['variant'] === 'string' ? data['variant'] : 'gradient'
  const variant: CTABannerVariant = variantMap[rawVariant] ?? 'gradient'

  const eyebrowStr = typeof data['eyebrow'] === 'string' && data['eyebrow'] ? data['eyebrow'] : ''
  const bodyStr = typeof data['body'] === 'string' && data['body'] ? data['body'] : ''
  const bgUrl = bgImage && typeof bgImage['url'] === 'string' ? bgImage['url'] : ''

  const hasSecondary =
    typeof secondaryRaw['label'] === 'string' &&
    secondaryRaw['label'] &&
    typeof secondaryRaw['href'] === 'string' &&
    secondaryRaw['href']

  return {
    heading: typeof data['heading'] === 'string' ? data['heading'] : '',
    primaryButton: {
      label: typeof primaryRaw['label'] === 'string' ? primaryRaw['label'] : '',
      href: typeof primaryRaw['href'] === 'string' ? primaryRaw['href'] : '#',
    },
    variant,
    ...(eyebrowStr ? { eyebrow: eyebrowStr } : {}),
    ...(bodyStr ? { body: bodyStr } : {}),
    ...(hasSecondary
      ? { secondaryButton: { label: secondaryRaw['label'] as string, href: secondaryRaw['href'] as string } }
      : {}),
    ...(bgUrl ? { backgroundImageUrl: bgUrl } : {}),
  }
}
