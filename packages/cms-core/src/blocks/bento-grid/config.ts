import type { Block } from 'payload'

export const BentoGridBlockConfig: Block = {
  slug: 'bento-grid',
  interfaceName: 'BentoGridBlock',
  labels: { singular: 'Bento Grid', plural: 'Bento Grids' },
  fields: [
    { name: 'sectionHeading', type: 'text', localized: true },
    {
      name: 'items',
      type: 'array',
      required: true,
      maxRows: 6,
      fields: [
        { name: 'heading', type: 'text', localized: true, required: true },
        { name: 'body', type: 'text', localized: true },
        {
          name: 'size',
          type: 'select',
          required: true,
          options: [
            { label: 'Large', value: 'large' },
            { label: 'Small', value: 'small' },
          ],
        },
        { name: 'icon', type: 'text', admin: { description: 'Lucide icon name' } },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
