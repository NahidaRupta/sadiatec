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
        'relative rounded-2xl border border-(--color-neutral-200) bg-white p-8',
        'transition-all duration-200 hover:-translate-y-1 hover:shadow-lg',
        spanClass,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span className="text-2xl font-bold text-(--color-primary)" aria-hidden="true">
        {item.number}
      </span>
      <h3 className="mt-4 text-xl font-semibold text-(--color-text) md:text-2xl">
        {item.title}
      </h3>
      {item.description && (
        <p className="mt-3 text-base leading-relaxed text-(--color-muted)">
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
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-bold text-(--color-text) md:text-4xl">{heading}</h2>
          {intro && (
            <p className="mt-4 text-lg leading-relaxed text-(--color-muted)">{intro}</p>
          )}
        </div>

        {/* Bento grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className={`grid gap-6 ${gridClass}`}
        >
          {items.map((item, i) => (
            <BentoCard key={i} item={item} index={i} layout={layout} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
