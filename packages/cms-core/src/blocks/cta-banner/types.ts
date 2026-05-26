export interface CTABannerBlockProps {
  heading: string
  subheading?: string
  primaryButton: { label: string; href: string }
  secondaryButton?: { label: string; href: string }
  variant: 'filled' | 'outlined' | 'image-bg'
  backgroundImageUrl?: string
}
