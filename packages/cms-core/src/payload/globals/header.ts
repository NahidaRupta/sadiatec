import { safeRevalidateTag as revalidateTag } from '../lib/revalidate'
import type { GlobalConfig } from 'payload'

export const HeaderGlobal: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  hooks: { afterChange: [() => { revalidateTag('header') }] },
  fields: [
    { name: 'logo', type: 'upload', relationTo: 'media' },
    {
      name: 'navItems',
      type: 'array',
      label: 'Navigation items',
      fields: [
        { name: 'labelKey', type: 'text', required: true, admin: { description: 'i18n key, e.g. nav.services' } },
        { name: 'href', type: 'text', required: true },
        {
          name: 'children',
          type: 'array',
          label: 'Dropdown items',
          fields: [
            { name: 'labelKey', type: 'text', required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Header CTA button',
      fields: [
        { name: 'label', type: 'text', localized: true },
        { name: 'href', type: 'text' },
      ],
    },
  ],
}
