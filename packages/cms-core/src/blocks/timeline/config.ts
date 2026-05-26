import type { Block } from 'payload'

export const TimelineBlockConfig: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  labels: { singular: 'Timeline', plural: 'Timelines' },
  fields: [
    { name: 'sectionHeading', type: 'text', localized: true },
    {
      name: 'mode',
      type: 'select',
      required: true,
      options: [
        { label: 'Company history', value: 'history' },
        { label: 'Process steps', value: 'process' },
      ],
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        { name: 'year', type: 'text', admin: { description: 'Used in history mode' } },
        { name: 'stepNumber', type: 'number', admin: { description: 'Used in process mode' } },
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'description', type: 'textarea', localized: true },
        { name: 'icon', type: 'text', admin: { description: 'Lucide icon name' } },
      ],
    },
  ],
}
