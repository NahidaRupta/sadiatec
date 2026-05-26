import type { Block } from 'payload'

export const CaseStudyCarouselBlockConfig: Block = {
  slug: 'case-study-carousel',
  interfaceName: 'CaseStudyCarouselBlock',
  labels: { singular: 'Case Study Carousel', plural: 'Case Study Carousels' },
  fields: [
    { name: 'sectionHeading', type: 'text', localized: true },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
    },
    {
      name: 'autoAdvanceSeconds',
      type: 'number',
      defaultValue: 5,
      min: 0,
      admin: { description: 'Set to 0 to disable auto-advance' },
    },
  ],
}
