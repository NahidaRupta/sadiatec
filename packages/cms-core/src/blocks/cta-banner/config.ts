import type { Block } from 'payload'

export const CTABannerBlockConfig: Block = {
  slug: 'cta-banner',
  interfaceName: 'CTABannerBlock',
  labels: { singular: 'CTA Banner', plural: 'CTA Banners' },
  fields: [
    { name: 'heading', type: 'text', localized: true, required: true },
    { name: 'subheading', type: 'text', localized: true },
    {
      name: 'primaryButton',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'secondaryButton',
      type: 'group',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'filled',
      options: [
        { label: 'Filled', value: 'filled' },
        { label: 'Outlined', value: 'outlined' },
        { label: 'Image background', value: 'image-bg' },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Required when variant is image-bg' },
    },
  ],
}
