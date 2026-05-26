import type { ServicesGridBlockProps } from './types'

export function adaptServicesGridBlock(_raw: unknown): ServicesGridBlockProps {
  return { serviceIds: [], columns: '3' }
}
