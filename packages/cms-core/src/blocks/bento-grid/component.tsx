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
  extraClass?: string
}

function BentoCard({ item, index, layout, extraClass = '' }: BentoCardProps) {
  const isFirst = layout === 'asymmetric' && index === 0

  return (
    <motion.article
      variants={fadeInUp}
      className={[
        'relative text-left py-6',
        isFirst ? 'border-l-4 border-brand-primary pl-6' : '',
        extraClass,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Oversized decorative numeral */}
      <span
        className="block text-6xl font-bold text-brand-primary opacity-20 leading-none mb-4"
        aria-hidden="true"
      >
        {item.number}
      </span>

      <h3 className="text-lg font-bold tracking-tight text-text-primary md:text-xl">
        {item.title}
      </h3>

      {item.description && (
        <p className="mt-2 text-xs md:text-sm leading-relaxed text-text-muted font-normal">
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

  const restItems = layout === 'asymmetric' ? items.slice(1) : items
  const remaining = restItems.length
  const lastRowRemainder = remaining % 3

  return (
    <section className="py-20 lg:py-28 bg-white overflow-hidden border-t-4 border-brand-primary">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        <div className="mx-auto mb-12 max-w-3xl text-center space-y-3">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary md:text-4xl">
            {heading}
          </h2>
          {intro && (
            <p className="mx-auto max-w-2xl text-sm md:text-base leading-relaxed text-text-muted">
              {intro}
            </p>
          )}
        </div>

        {layout === 'asymmetric' && items.length > 0 ? (
          <div className="space-y-10">
            {/* Featured first card — full width with left accent border */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
            >
              <BentoCard item={items[0]!} index={0} layout={layout} />
            </motion.div>

            {/* Remaining cards — 3-col grid */}
            {restItems.length > 0 && (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8"
              >
                {restItems.map((item, i) => {
                  const isLastAlone = lastRowRemainder === 1 && i === remaining - 1
                  return (
                    <BentoCard
                      key={i + 1}
                      item={item}
                      index={i + 1}
                      layout={layout}
                      extraClass={isLastAlone ? 'lg:col-span-2' : ''}
                    />
                  )
                })}
              </motion.div>
            )}
          </div>
        ) : (
          /* Standard layout — uniform 3-col grid */
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          >
            {items.map((item, i) => (
              <BentoCard key={i} item={item} index={i} layout={layout} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
