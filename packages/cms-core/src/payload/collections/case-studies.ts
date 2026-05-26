import { safeRevalidateTag as revalidateTag } from '../lib/revalidate'
import type { CollectionConfig } from 'payload'
import { aiVisibleField } from '../fields/ai-visible'
import { slugField } from '../fields/slug'

export const CaseStudiesCollection: CollectionConfig = {
  slug: 'case-studies',
  labels: { singular: 'Case Study', plural: 'Case Studies' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'clientName', 'publishedAt', 'active'],
    preview: (doc) => {
      const base = process.env['NEXT_PUBLIC_SERVER_URL'] ?? 'http://localhost:3000'
      return `${base}/case-studies/${String(doc['slug'] ?? '')}`
    },
  },
  hooks: {
    afterChange: [() => { revalidateTag('case-studies') }],
  },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'clientName', type: 'text', localized: true, required: true },
    { name: 'industry', type: 'text', localized: true, required: true },
    { name: 'tagline', type: 'text', localized: true },
    { name: 'challenge', type: 'richText', localized: true },
    { name: 'solution', type: 'richText', localized: true },
    { name: 'outcome', type: 'richText', localized: true },
    { name: 'featuredImage', type: 'upload', relationTo: 'media' },
    {
      name: 'results',
      type: 'array',
      fields: [
        { name: 'value', type: 'number', required: true },
        { name: 'suffix', type: 'text' },
        { name: 'label', type: 'text', localized: true, required: true },
      ],
    },
    { name: 'publishedAt', type: 'date', required: true },
    slugField,
    { name: 'active', type: 'checkbox', defaultValue: true, admin: { position: 'sidebar' } },
    aiVisibleField,
  ],
}
