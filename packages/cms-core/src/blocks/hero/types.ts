export interface HeroBlockProps {
  blockType?: 'hero'
  heading: string
  tagline?: string | undefined          // ← Explicitly allow undefined
  subheading?: string | undefined
  highlights?: string[]
  ctaPrimary?: {
    label: string
    href: string
  }
  ctaSecondary?: {
    label: string
    href: string
  }
  heroImageUrl?: string | undefined
  floatingBadge?: {
    text: string
    subtext?: string | undefined
  } | undefined
  overlayOpacity?: number
  variant?: string
  minHeight?: string
  transparentHeader?: boolean
}