import { safeRevalidateTag as revalidateTag } from '../lib/revalidate'
import type { GlobalConfig } from 'payload'

const localeSubfields = [
  { name: 'en', type: 'text' as const, label: 'English' },
  { name: 'ja', type: 'text' as const, label: 'Japanese' },
  { name: 'bn', type: 'text' as const, label: 'Bengali' },
]

const localeTextareaSubfields = [
  { name: 'en', type: 'textarea' as const, label: 'English' },
  { name: 'ja', type: 'textarea' as const, label: 'Japanese' },
  { name: 'bn', type: 'textarea' as const, label: 'Bengali' },
]

export const CompanyInfoGlobal: GlobalConfig = {
  slug: 'company-info',
  label: 'Company Information',
  admin: { description: 'Used in footer, contact page, company profile, and schema.org markup' },
  hooks: { afterChange: [() => { revalidateTag('company') }] },
  fields: [
    { name: 'legalName', type: 'text', admin: { description: 'Official legal / registered name' } },
    { name: 'registrationNumber', type: 'text', admin: { description: 'Corporate registration number' } },
    { name: 'foundedYear', type: 'number' },
    { name: 'capital', type: 'text', admin: { description: 'e.g. ¥10,000,000' } },
    { name: 'employeeCount', type: 'number', admin: { description: 'Approximate headcount' } },
    {
      name: 'description',
      type: 'group',
      label: 'Company description',
      fields: localeTextareaSubfields,
    },
    {
      name: 'mission',
      type: 'group',
      label: 'Mission statement',
      fields: localeTextareaSubfields,
    },
    {
      name: 'vision',
      type: 'group',
      label: 'Vision statement',
      fields: localeTextareaSubfields,
    },
    {
      name: 'address',
      type: 'group',
      label: 'Address',
      fields: localeSubfields,
    },
    {
      name: 'businessHours',
      type: 'group',
      label: 'Business hours',
      fields: localeSubfields,
    },
    {
      name: 'executives',
      type: 'array',
      label: 'Leadership / Executives',
      fields: [
        { name: 'name', type: 'text', required: true },
        {
          name: 'role',
          type: 'group',
          label: 'Role / Title',
          fields: localeSubfields,
        },
      ],
    },
    {
      name: 'timeline',
      type: 'array',
      label: 'Company history',
      admin: { description: 'Key milestones in chronological order' },
      fields: [
        { name: 'year', type: 'number', required: true },
        {
          name: 'label',
          type: 'group',
          label: 'Milestone label',
          fields: localeSubfields,
        },
        {
          name: 'description',
          type: 'group',
          label: 'Milestone description',
          fields: localeTextareaSubfields,
        },
      ],
    },
  ],
}
