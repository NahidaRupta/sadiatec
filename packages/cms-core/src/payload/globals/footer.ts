import { safeRevalidateTag as revalidateTag } from '../lib/revalidate'
import type { GlobalConfig } from 'payload'

export const FooterGlobal: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  hooks: { afterChange: [() => { revalidateTag('footer') }] },
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Footer columns',
      fields: [
        { name: 'heading', type: 'text', localized: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', localized: true, required: true },
            { name: 'href', type: 'text', required: true },
          ],
        },
      ],
    },
    { name: 'copyrightText', type: 'text', localized: true },
  ],
}
