import type { RichTextBlockProps } from './types'

export function adaptRichTextBlock(_raw: unknown): RichTextBlockProps {
  return { content: null, maxWidth: 'prose' }
}
