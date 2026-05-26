'use client'
// Client boundary: per-row and per-card scroll-triggered fade animations

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SectionEyebrow } from '../../components/ui'
import { fadeInUp, staggerContainer } from '../../lib/motion'
import type { ServicesGridBlockProps, ServiceItem } from './types'

interface AlternatingRowProps {
  service: ServiceItem
  index: number
}

function AlternatingRow({ service, index }: AlternatingRowProps) {
  const imageRight = index % 2 === 1

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={[
        'flex flex-col items-center gap-8 md:gap-12',
        imageRight ? 'md:flex-row-reverse' : 'md:flex-row',
      ].join(' ')}
    >
      {/* Image */}
      <div className="w-full md:w-1/2">
        {service.imageUrl ? (
          // Use <img> — swap to next/image once image domains are configured in next.config
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={service.imageUrl}
            alt={service.imageName}
            className="aspect-[4/3] w-full rounded-2xl object-cover"
          />
        ) : (
          <div className="aspect-[4/3] w-full rounded-2xl bg-(--color-neutral-100)" />
        )}
      </div>

      {/* Content */}
      <div className="w-full md:w-1/2">
        {service.subheadline && (
          <p className="mb-2 text-sm font-semibold text-(--color-primary)">
            {service.subheadline}
          </p>
        )}
        <h3 className="text-2xl font-bold text-(--color-text) md:text-3xl">{service.title}</h3>
        {service.description && (
          <p className="mt-4 text-base leading-relaxed text-(--color-muted)">
            {service.description}
          </p>
        )}
        {service.cta.label && (
          <Link
            href={service.cta.href}
            className="mt-6 inline-flex min-h-[44px] items-center gap-1 text-base font-semibold text-(--color-primary) hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
          >
            {service.cta.label}
            <span aria-hidden="true" className="text-lg">→</span>
          </Link>
        )}
      </div>
    </motion.div>
  )
}

interface GridCardProps {
  service: ServiceItem
}

function GridCard({ service }: GridCardProps) {
  return (
    <motion.article
      variants={fadeInUp}
      className="flex flex-col overflow-hidden rounded-2xl border border-(--color-neutral-200) bg-white"
    >
      {service.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={service.imageUrl}
          alt={service.imageName}
          className="aspect-[4/3] w-full object-cover"
        />
      ) : (
        <div className="aspect-[4/3] w-full bg-(--color-neutral-100)" />
      )}
      <div className="flex flex-1 flex-col p-6">
        {service.subheadline && (
          <p className="mb-1 text-sm font-semibold text-(--color-primary)">{service.subheadline}</p>
        )}
        <h3 className="text-xl font-bold text-(--color-text)">{service.title}</h3>
        {service.description && (
          <p className="mt-3 flex-1 text-sm leading-relaxed text-(--color-muted)">
            {service.description}
          </p>
        )}
        {service.cta.label && (
          <Link
            href={service.cta.href}
            className="mt-4 inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold text-(--color-primary) hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
          >
            {service.cta.label}
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </motion.article>
  )
}

export function ServicesGridBlock({
  eyebrow,
  heading,
  services,
  layout = 'alternating',
}: ServicesGridBlockProps) {
  if (services.length === 0) return null

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-16 text-center">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          <h2 className="mt-4 text-3xl font-bold text-(--color-text) md:text-4xl">{heading}</h2>
        </div>

        {layout === 'alternating' ? (
          <div className="space-y-20 md:space-y-28">
            {services.map((service, i) => (
              <AlternatingRow key={i} service={service} index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {services.map((service, i) => (
              <GridCard key={i} service={service} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
