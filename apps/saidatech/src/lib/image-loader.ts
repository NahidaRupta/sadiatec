'use client'
import type { ImageLoaderProps } from 'next/image'

export default function cloudflareR2Loader({ src, width, quality }: ImageLoaderProps): string {
  if (src.startsWith('data:')) return src

  const r2Url = process.env['NEXT_PUBLIC_R2_BUCKET_URL']
  if (!r2Url) return src

  const absSource = src.startsWith('http') ? src : `${r2Url}${src}`
  const params = `width=${width},quality=${quality ?? 80},format=auto`
  return `/cdn-cgi/image/${params}/${absSource}`
}
