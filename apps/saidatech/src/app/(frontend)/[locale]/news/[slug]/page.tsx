import { notFound } from 'next/navigation'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params

  if (!slug) notFound()

  return (
    <main>
      <h1>News: {slug}</h1>
    </main>
  )
}
