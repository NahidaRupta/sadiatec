import type { ContactInfoCardBlockProps } from './types'

export function adaptContactInfoCardBlock(raw: unknown): ContactInfoCardBlockProps {
  const data = (typeof raw === 'object' && raw !== null ? raw : {}) as Record<string, unknown>

  const str = (v: unknown): string | undefined =>
    typeof v === 'string' && v.length > 0 ? v : undefined

  const result: ContactInfoCardBlockProps = {}

  const heading = str(data['heading'])
  if (heading) result.heading = heading

  const subheading = str(data['subheading'])
  if (subheading) result.subheading = subheading

  const address = str(data['address'])
  if (address) result.address = address

  const tel = str(data['tel'])
  if (tel) result.tel = tel

  const fax = str(data['fax'])
  if (fax) result.fax = fax

  const phone = str(data['phone'])
  if (phone) result.phone = phone

  const email = str(data['email'])
  if (email) result.email = email

  const officeHours = str(data['officeHours'])
  if (officeHours) result.officeHours = officeHours

  return result
}
