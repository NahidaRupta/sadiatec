export interface BentoGridItem {
  heading: string
  body?: string
  size: 'large' | 'small'
  icon?: string
  imageUrl?: string
}

export interface BentoGridBlockProps {
  sectionHeading?: string
  items: BentoGridItem[]
}
