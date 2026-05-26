export interface HeroBlockProps {
  blockType?: 'hero'
  heading: string
  tagline?: string
  subheading?: string
  highlights?: string[]
  ctaPrimary?: {
    label: string
    href: string
  }
  ctaSecondary?: {
    label: string
    href: string
  }
  heroImageUrl?: string
  floatingBadge?: {
    text: string
    subtext: string
  }
  
  // Previous additions
  overlayOpacity?: number
  variant?: 'center' | 'left' | string
  minHeight?: 'small' | 'medium' | 'large' | string
  backgroundImageUrl?: string

  // ADD THIS LINE TO FIX THE LAST ERROR:
  transparentHeader?: boolean
}