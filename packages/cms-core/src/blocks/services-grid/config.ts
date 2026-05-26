import type { Block } from 'payload'

export const ServicesGridBlockConfig: Block = {
  slug: 'services-grid',
  interfaceName: 'ServicesGridBlock',
  labels: { singular: 'Services Grid', plural: 'Services Grids' },
  fields: [
    { name: 'sectionHeading', type: 'text', localized: true },
    { name: 'sectionSubheading', type: 'text', localized: true },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '3 columns', value: '3' },
        { label: '4 columns', value: '4' },
      ],
    },
  ],
}
