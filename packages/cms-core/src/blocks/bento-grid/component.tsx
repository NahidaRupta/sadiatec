'use client'
// Client boundary: scroll-triggered stagger animation via Framer Motion whileInView

import { motion } from 'framer-motion'
import { SectionEyebrow } from '../../components/ui'
import { staggerContainer, fadeInUp } from '../../lib/motion'
import type { BentoGridBlockProps, BentoGridItem, BentoLayout } from './types'

interface BentoCardProps {
  item: BentoGridItem
  index: number
  layout: BentoLayout
}

function BentoCard({ item, index, layout }: BentoCardProps) {
  // First card in asymmetric layout spans 2 columns on md+ screens
  const spanClass = layout === 'asymmetric' && index === 0 ? 'md:col-span-2 lg:col-span-2' : ''

  return (
    <motion.article
      variants={fadeInUp}
      className={[
        'relative rounded-2xl border border-(--color-neutral-200) bg-white p-6 md:p-8 text-left',
        'transition-all duration-300 hover:border-(--color-primary)/30 hover:shadow-md',
        spanClass,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Refined into a premium badge token layout */}
      <span 
        className="inline-flex items-center justify-center rounded-md bg-(--color-primary)/5 px-2 py-0.5 text-xs font-mono font-bold tracking-wider text-(--color-primary)" 
        aria-hidden="true"
      >
        {item.number}
      </span>
      
      {/* Downscaled heading for clean presentation */}
      <h3 className="mt-4 text-lg font-bold tracking-tight text-(--color-text) md:text-xl">
        {item.title}
      </h3>
      
      {/* Tighter description text scale */}
      {item.description && (
        <p className="mt-2 text-xs md:text-sm leading-relaxed text-(--color-muted) font-normal">
          {item.description}
        </p>
      )}
    </motion.article>
  )
}

export function BentoGridBlock({
  eyebrow,
  heading,
  intro,
  items,
  layout = 'asymmetric',
}: BentoGridBlockProps) {
  if (items.length === 0) return null

  // Asymmetric: 3-col desktop (first card col-span-2), 2-col tablet, 1-col mobile
  // Standard: uniform 3-col desktop, 2-col tablet, 1-col mobile
  const gridClass =
    layout === 'asymmetric'
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Balanced and structured Section header */}
        <div className="mx-auto mb-16 max-w-3xl text-center space-y-3">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 className="text-3xl font-extrabold tracking-tight text-(--color-text) md:text-4xl">
            {heading}
          </h2>
          {intro && (
            <p className="mx-auto max-w-2xl text-sm md:text-base leading-relaxed text-(--color-muted)">
              {intro}
            </p>
          )}
        </div>

        {/* Bento grid assembly */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className={`grid gap-5 md:gap-6 ${gridClass}`}
        >
          {items.map((item, i) => (
            <BentoCard key={i} item={item} index={i} layout={layout} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}