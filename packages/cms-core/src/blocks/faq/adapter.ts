import type { FAQBlockProps } from './types'

export function adaptFAQBlock(_raw: unknown): FAQBlockProps {
  return { faqIds: [], variant: 'accordion' }
}
