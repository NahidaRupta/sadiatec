import type { Block } from 'payload'

export const HeroBlockConfig: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'headline', type: 'text', localized: true, required: true },
    { name: 'subheadline', type: 'textarea', localized: true },
    {
      name: 'primaryCta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'secondaryCta',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'inlineStats',
      type: 'array',
      maxRows: 4,
      labels: { singular: 'Stat', plural: 'Stats' },
      fields: [
        { name: 'value', type: 'text', localized: true, required: true },
        { name: 'label', type: 'text', localized: true, required: true },
      ],
    },
    {
      name: 'keywordPills',
      type: 'array',
      maxRows: 12,
      labels: { singular: 'Pill', plural: 'Pills' },
      fields: [
        { name: 'text', type: 'text', localized: true, required: true },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'heroSlides',
      label: 'Hero Image Slides',
      type: 'array',
      minRows: 1,
      maxRows: 5,
      admin: {
        description: 'Full-width slider images — 2 to 4 recommended. If empty, falls back to Background Image.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'alt',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'showScrollIndicator',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
