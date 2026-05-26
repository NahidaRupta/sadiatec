import { safeRevalidateTag as revalidateTag } from '../lib/revalidate'
import type { CollectionConfig } from 'payload'
import { aiVisibleField } from '../fields/ai-visible'
import { slugField } from '../fields/slug'

export const SeminarsCollection: CollectionConfig = {
  slug: 'seminars',
  labels: { singular: 'Seminar', plural: 'Seminars' },
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'date', 'registrationStatus', 'active'] },
  hooks: { afterChange: [() => { revalidateTag('seminars') }] },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'date', type: 'date', required: true },
    { name: 'endDate', type: 'date' },
    { name: 'venue', type: 'text', localized: true },
    {
      name: 'onlineMeetingUrl',
      type: 'text',
      admin: { description: 'URL for online or hybrid events' },
    },
    { name: 'excerpt', type: 'textarea', localized: true },
    { name: 'description', type: 'richText', localized: true },
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    {
      name: 'speaker',
      type: 'group',
      fields: [
        { name: 'name', type: 'text' },
        { name: 'jobTitle', type: 'text', localized: true },
        { name: 'organization', type: 'text', localized: true },
      ],
    },
    { name: 'capacity', type: 'number', admin: { position: 'sidebar' } },
    {
      name: 'registrationStatus',
      type: 'select',
      options: ['open', 'closed', 'full', 'cancelled'],
      defaultValue: 'open',
      admin: { position: 'sidebar' },
    },
    {
      name: 'registrationUrl',
      type: 'text',
      admin: { description: 'External registration link' },
    },
    slugField,
    { name: 'active', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    aiVisibleField,
  ],
}
