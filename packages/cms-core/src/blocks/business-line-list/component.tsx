'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { BusinessLineListBlockProps, BusinessLineItem } from './types'

// Global Staggered Container Animation
const listContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

// Clean fade-up preset
const standardFadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
  },
}

function RowItem({ item, index }: { item: BusinessLineItem; index: number }) {
  const hasImage = !!item.imageUrl

  // Alternates the image position between left and right for visual balance, or defaults to left
  const isImageLeft = item.imagePosition === 'left' || (item.imagePosition !== 'right' && index % 2 === 0)

  return (
    <motion.li 
      variants={standardFadeUpVariants}
      className="w-full"
    >
      {/* If there's an image, split half/half on desktop (lg:grid-cols-2). 
        If there's no image, it behaves as a normal full-width block.
      */}
      <div className={`grid grid-cols-1 gap-8 items-center ${hasImage ? 'lg:grid-cols-2' : 'w-full'}`}>
        
        {/* Render Image Half if present */}
        {hasImage && item.imageUrl && (
          <div className={`overflow-hidden rounded-2xl border border-neutral-100 shadow-sm aspect-[4/3] w-full ${
            isImageLeft ? 'lg:order-1' : 'lg:order-2'
          }`}>
            <Image
              src={item.imageUrl}
              alt={item.imageAlt ?? item.title}
              width={640}
              height={480}
              className="h-full w-full object-cover"
              priority={index === 0}
            />
          </div>
        )}

        {/* Text Area Content */}
        <div className={`flex flex-col gap-3 w-full ${
          hasImage && !isImageLeft ? 'lg:order-1' : 'lg:order-2'
        }`}>
          {item.eyebrow && (
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary,rgba(15,164,87,1))]">
              {item.eyebrow}
            </p>
          )}
          
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-snug">
            {item.title}
          </h3>
          
          <div className="space-y-4">
            {item.description.split('\n').filter(Boolean).map((para, i) => (
              <p 
                key={i} 
                className="text-[15px] sm:text-[16px] leading-relaxed text-gray-500 font-normal"
              >
                {para}
              </p>
            ))}
          </div>

          {item.ctaLabel && item.ctaHref && (
            <Link
              href={item.ctaHref}
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-primary,rgba(15,164,87,1))] hover:underline group"
            >
              {item.ctaLabel} <span className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
            </Link>
          )}
        </div>

      </div>
    </motion.li>
  )
}

export function BusinessLineListBlock({
  heading,
  intro,
  items,
}: BusinessLineListBlockProps) {
  if (!items || items.length === 0) return null

  return (
    <section className="py-16 md:py-24 overflow-hidden bg-white">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Block Section */}
        {(heading || intro) && (
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-20 text-center max-w-3xl mx-auto"
          >
            {heading && (
              <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
                {heading}
              </h2>
            )}
            {intro && (
              <p className="mt-4 text-base leading-relaxed text-neutral-500">{intro}</p>
            )}
          </motion.div>
        )}

        {/* List Stacker */}
        <motion.ul 
          variants={listContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="flex flex-col w-full gap-16 md:gap-24"
        >
          {items.map((item, i) => (
            <RowItem key={i} item={item} index={i} />
          ))}
        </motion.ul>

      </div>
    </section>
  )
}