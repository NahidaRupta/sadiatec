import type { TimelineBlockProps } from './types'

export function adaptTimelineBlock(_raw: unknown): TimelineBlockProps {
  return { mode: 'history', items: [] }
}
