import type { CTABannerBlockProps } from './types'

export function adaptCTABannerBlock(_raw: unknown): CTABannerBlockProps {
  return {
    heading: '',
    variant: 'filled',
    primaryButton: { label: '', href: '' },
  }
}
