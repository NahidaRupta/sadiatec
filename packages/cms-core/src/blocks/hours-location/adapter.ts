import type { HoursLocationBlockProps } from './types'

export function adaptHoursLocationBlock(_raw: unknown): HoursLocationBlockProps {
  return { showMap: true, showHours: true, showAddress: true, showPhone: true }
}
