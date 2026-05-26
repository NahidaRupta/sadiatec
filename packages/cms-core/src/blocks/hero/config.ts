import type { Block } from 'payload'

export const HeroBlockConfig: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'tagline', type: 'text', localized: true },
    { name: 'heading', type: 'text', localized: true, required: true },
    { name: 'subheading', type: 'textarea', localized: true },
    {
      name: 'highlights',
      type: 'array',
      labels: { singular: 'Highlight', plural: 'Highlights' },
      fields: [{ name: 'text', type: 'text', localized: true, required: true }],
    },
    {
      name: 'ctaPrimary',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'ctaSecondary',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'href', type: 'text' },
      ],
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'floatingBadge',
      type: 'group',
      fields: [
        { name: 'text', type: 'text', localized: true },
        { name: 'subtext', type: 'text', localized: true },
      ],
    },
  ],
}