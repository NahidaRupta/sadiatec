import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params

  if (!slug) notFound()

  return (
    <main>
      <h1>{slug}</h1>
    </main>
  )
}
