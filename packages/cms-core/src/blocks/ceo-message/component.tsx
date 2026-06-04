import Image from 'next/image'
import type { CEOMessageBlockProps } from './types'

const bgMap: Record<string, string> = {
  white: 'bg-white',
  light: 'bg-[var(--color-neutral-50,#fafafa)]',
}

export function CEOMessageBlock({
  portraitUrl,
  portraitAlt,
  name,
  title,
  message,
  signatureUrl,
  portraitPosition = 'left',
  backgroundStyle = 'white',
}: CEOMessageBlockProps) {
  const bg = bgMap[backgroundStyle] ?? bgMap['white']

  const portraitEl = (
    <div className="flex-shrink-0">
      {/* Updated to use a strict perfect square aspect ratio (aspect-square) 
        and rounded-full to create the exact circular image format from the screenshot 
      */}
      <div className="overflow-hidden rounded-full shadow-lg w-64 h-64 md:w-80 md:h-80 mx-auto aspect-square border border-neutral-100">
        <Image
          src={portraitUrl}
          alt={portraitAlt}
          width={320}
          height={320}
          className="h-full w-full object-cover object-center"
        />
      </div>
    </div>
  )

  const textEl = (
    <div className="flex flex-1 flex-col gap-5 text-left">
      <div className="flex flex-col gap-1">
        {/* CEO'S MESSAGE Subtitle label style */}
        <p className="text-sm font-bold uppercase tracking-wider text-[#10b981]">
          {title || "CEO'S MESSAGE"}
        </p>
      </div>

      <div className="space-y-5">
        {message.split('\n').filter(Boolean).map((para, i) => (
          <p
            key={i}
            className="text-base leading-relaxed text-neutral-600 font-normal"
          >
            {para}
          </p>
        ))}
      </div>

      {/* Name and Title placed cleanly beneath the message blocks */}
      <div className="mt-2 flex flex-col gap-0.5">
        <p className="text-lg font-semibold text-[#10b981]">{name}</p>
        <p className="text-xs font-medium text-neutral-400">President & CEO</p>
      </div>

      {signatureUrl && (
        <div className="mt-2">
          <Image
            src={signatureUrl}
            alt={name}
            width={160}
            height={60}
            className="h-12 w-auto object-contain opacity-80"
          />
        </div>
      )}
    </div>
  )

  return (
    /* Added clean structural top padding space (pt-24 md:pt-32) to distance the section away from header block */
    <section className={`pt-24 pb-16 md:pt-32 md:pb-24 ${bg}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Static Title Header matching the visual layout */}
        <div className="w-full text-center mb-12 md:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-800 md:text-4xl">
            Official Publication
          </h2>
        </div>

        {/* Main Grid Wrapper: Updated to use 'md:items-center' to anchor the circular profile 
          portrait perfectly center-aligned with the accompanying block text 
        */}
        <div className={`flex flex-col gap-12 md:flex-row md:items-center md:gap-16 ${portraitPosition === 'right' ? 'md:flex-row-reverse' : ''}`}>
          {portraitEl}
          {textEl}
        </div>
      </div>
    </section>
  )
}