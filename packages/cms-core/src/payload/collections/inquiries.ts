import type { CollectionConfig } from 'payload'

export const InquiriesCollection: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: 'Inquiry', plural: 'Inquiries' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'formType', 'inquiryType', 'status', 'submittedAt'],
    description: 'Contact and job-apply form submissions. Contains PII — do not export without consent.',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: () => true,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'company', type: 'text' },
    {
      name: 'formType',
      type: 'select',
      required: true,
      options: [
        { label: 'Contact', value: 'contact' },
        { label: 'Job Apply', value: 'job-apply' },
      ],
    },
    {
      name: 'inquiryType',
      type: 'select',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Visa', value: 'visa' },
        { label: 'Recruitment', value: 'recruitment' },
        { label: 'Other', value: 'other' },
      ],
      admin: { description: 'Only set for contact form submissions' },
    },
    {
      name: 'jobSlug',
      type: 'text',
      admin: { description: 'Only set for job-apply submissions' },
    },
    { name: 'message', type: 'textarea', required: true },
    { name: 'locale', type: 'text', admin: { position: 'sidebar' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      required: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'Replied', value: 'replied' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'submittedAt',
      type: 'date',
      admin: { position: 'sidebar', readOnly: true },
      defaultValue: () => new Date().toISOString(),
    },
  ],
}
