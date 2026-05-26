export interface TimelineItem {
  year?: string
  stepNumber?: number
  label: string
  description?: string
  icon?: string
}

export interface TimelineBlockProps {
  sectionHeading?: string
  mode: 'history' | 'process'
  items: TimelineItem[]
}
