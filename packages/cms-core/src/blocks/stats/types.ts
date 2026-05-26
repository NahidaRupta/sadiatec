export interface StatItem {
  value: number
  suffix?: string
  label: string
  icon?: string
}

export interface StatsBlockProps {
  sectionHeading?: string
  items: StatItem[]
}
