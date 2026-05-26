import type { Payload } from 'payload'

export async function upsertBySlug<T extends Record<string, unknown>>(
  payload: Payload,
  collection: string,
  slug: string,
  data: T,
): Promise<void> {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    return
  }

  // locale:'all' is a Payload runtime feature not reflected in its TypeScript overloads
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (payload as any).create({ collection, data: { ...data, slug }, locale: 'all' })
}

export async function upsertGlobal<T extends Record<string, unknown>>(
  payload: Payload,
  slug: string,
  data: T,
): Promise<void> {
  await payload.updateGlobal({ slug, data })
}
