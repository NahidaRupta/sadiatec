// Canonical values: solid | gradient | image
// Legacy values kept for backwards compat with existing page-level inline props
export type CTABannerVariant = 'solid' | 'gradient' | 'image' | 'filled' | 'outlined' | 'image-bg'

export interface CTABannerCta {
  label: string
  href: string
}

export interface CTABannerBlockProps {
  eyebrow?: string
  heading: string
  body?: string
  primaryButton: CTABannerCta
  secondaryButton?: CTABannerCta
  variant?: CTABannerVariant
  backgroundImageUrl?: string
}
