'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { CEOMessageBlockProps } from './types'

const bgMap: Record<string, string> = {
  white: 'bg-white',
  light: 'bg-[var(--color-neutral-50,#fafafa)]',
  black: 'bg-[#090e1a]',
}

// Framer motion variants for a smooth scroll-triggered reveal
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1], // Custom cubic-bezier for a premium, snappy feel
    },
  },
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
  const isDarkBg = backgroundStyle === 'black'
  
  // Dynamic color adjustments based on active background selection
  const textColor = isDarkBg ? 'text-white/90' : 'text-neutral-600'
  const subtitleColor = isDarkBg ? 'text-neutral-400' : 'text-neutral-400'

  const portraitEl = (
    <div className="flex-shrink-0">
      <div className={`overflow-hidden rounded-full shadow-lg w-64 h-64 md:w-80 md:h-80 mx-auto aspect-square border ${isDarkBg ? 'border-white/10' : 'border-neutral-100'}`}>
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
        <p className="text-sm font-bold uppercase tracking-wider text-[#10b981]">
          {"CEO'S MESSAGE"}
        </p>
      </div>

      <div className="space-y-5">
        {message.split('\n').filter(Boolean).map((para, i) => (
          <p
            key={i}
            className={`text-base leading-relaxed font-normal ${textColor}`}
          >
            {para}
          </p>
        ))}
      </div>

      <div className="mt-2 flex flex-col gap-0.5">
        <p className="text-lg font-semibold text-[#10b981]">{name}</p>
        <p className={`text-xs font-medium ${subtitleColor}`}>{title}</p>
      </div>

      {signatureUrl && (
        <div className="mt-2">
          <Image
            src={signatureUrl}
            alt={name}
            width={160}
            height={60}
            className={`h-12 w-auto object-contain opacity-80 ${isDarkBg ? 'invert brightness-200' : ''}`}
          />
        </div>
      )}
    </div>
  )

  return (
    <section className={`pt-24 pb-16 md:pt-32 md:pb-24 ${bg}`}>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Changed wrapper div to a motion.div with scroll trigger visibility */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className={`flex flex-col gap-12 md:flex-row md:items-center md:gap-16 ${
            portraitPosition === 'right' ? 'md:flex-row-reverse' : ''
          }`}
        >
          {portraitEl}
          {textEl}
        </motion.div>
      </div>
    </section>
  )
}