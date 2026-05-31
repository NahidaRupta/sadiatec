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
        'flex flex-col items-center gap-10 lg:gap-16', // Slightly wider gap for cleaner separation
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
            className="aspect-[16/10] w-full rounded-2xl object-cover shadow-sm border border-neutral-100" // Changed to elegant 16/10 aspect ratio
          />
        ) : (
          <div className="aspect-[16/10] w-full rounded-2xl bg-(--color-neutral-100)" />
        )}
      </div>

      {/* Content */}
      <div className="w-full md:w-1/2 text-left space-y-3">
        {service.subheadline && (
          <p className="text-[11px] font-bold uppercase tracking-widest text-(--color-primary)">
            {service.subheadline}
          </p>
        )}
        {/* Balanced row heading scale */}
        <h3 className="text-2xl font-extrabold tracking-tight text-(--color-text) lg:text-3xl">
          {service.title}
        </h3>
        {service.description && (
          <p className="text-sm md:text-base leading-relaxed text-(--color-muted)">
            {service.description}
          </p>
        )}
        {service.cta.label && (
          <div className="pt-2">
            <Link
              href={service.cta.href}
              className="inline-flex items-center gap-1.5 text-sm font-bold text-(--color-primary) hover:underline group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
            >
              <span>{service.cta.label}</span>
              <svg 
                className="h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1 stroke-[2.5]" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
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
      className="flex flex-col overflow-hidden rounded-2xl border border-(--color-neutral-200) bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {service.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={service.imageUrl}
          alt={service.imageName}
          className="aspect-[16/10] w-full object-cover" // 16/10 golden ratio looks much leaner than boxy 4/3
        />
      ) : (
        <div className="aspect-[16/10] w-full bg-(--color-neutral-100)" />
      )}
      <div className="flex flex-1 flex-col p-6 text-left">
        {service.subheadline && (
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-(--color-primary)">
            {service.subheadline}
          </p>
        )}
        {/* Toned card heading size down from xl to text-lg */}
        <h3 className="text-lg font-bold tracking-tight text-(--color-text)">
          {service.title}
        </h3>
        {service.description && (
          <p className="mt-2 flex-1 text-xs md:text-sm leading-relaxed text-(--color-muted)">
            {service.description}
          </p>
        )}
        {service.cta.label && (
          <div className="mt-4 pt-3 border-t border-neutral-50">
            <Link
              href={service.cta.href}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-(--color-primary) hover:underline group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
            >
              <span>{service.cta.label}</span>
              <svg 
                className="h-3.5 w-3.5 transform transition-transform duration-200 group-hover:translate-x-1 stroke-[2.5]" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
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
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section header */}
        <div className="mb-16 md:mb-24 text-center max-w-3xl mx-auto space-y-3">
          <SectionEyebrow>{eyebrow}</SectionEyebrow>
          {/* Main header toned down to text-3xl with text-4xl on desktop */}
          <h2 className="text-3xl font-extrabold tracking-tight text-(--color-text) md:text-4xl">
            {heading}
          </h2>
        </div>

        {layout === 'alternating' ? (
          <div className="space-y-24 md:space-y-32">
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