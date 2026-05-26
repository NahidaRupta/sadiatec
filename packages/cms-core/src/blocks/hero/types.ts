export interface HeroInlineStat {
  value: string
  label: string
}

export interface HeroKeywordPill {
  text: string
}

export interface HeroCta {
  label: string
  href: string
}

export interface HeroBlockProps {
  blockType?: 'hero'
  // Canonical fields (new)
  eyebrow?: string
  headline?: string
  subheadline?: string
  primaryCta?: HeroCta
  secondaryCta?: HeroCta
  inlineStats?: HeroInlineStat[]
  keywordPills?: HeroKeywordPill[]
  backgroundImageUrl?: string
  showScrollIndicator?: boolean
  // Legacy fields — accepted for backwards compat with existing page files
  heading?: string
  subheading?: string
  tagline?: string
  overlayOpacity?: number
  variant?: string
  minHeight?: string
  transparentHeader?: boolean
  heroImageUrl?: string
  highlights?: string[]
  floatingBadge?: { text: string; subtext?: string }
  // Legacy CTA field names (old Payload config used ctaPrimary/ctaSecondary)
  ctaPrimary?: HeroCta
  ctaSecondary?: HeroCta
}
