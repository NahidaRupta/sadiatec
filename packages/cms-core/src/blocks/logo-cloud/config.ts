import type { Block } from 'payload'

export const LogoCloudBlockConfig: Block = {
  slug: 'logo-cloud',
  interfaceName: 'LogoCloudBlock',
  labels: { singular: 'Logo Cloud', plural: 'Logo Clouds' },
  fields: [
    { name: 'sectionHeading', type: 'text', localized: true },
    {
      name: 'scrolling',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Enable CSS infinite-scroll animation' },
    },
  ],
}
