'use client'
// Client boundary: scroll-triggered stagger animation via Framer Motion whileInView

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SectionEyebrow } from '../../components/ui'
import { staggerContainer, fadeInUp } from '../../lib/motion'
import type { NewsListBlockProps, NewsItem } from './types'

function formatNewsDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return iso
  }
}

function NewsItemRow({ item }: { item: NewsItem }) {
  return (
    <motion.li variants={fadeInUp} className="list-none">
      <Link
        href={item.href}
        className="group flex flex-col gap-2 border-b border-neutral-100/90 py-4 sm:flex-row sm:items-center sm:gap-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
      >
        {/* Compact, lighter metadata date */}
        <span className="w-28 shrink-0 tabular-nums text-xs font-medium text-slate-400">
          {formatNewsDate(item.date)}
        </span>

        {/* Pill-shaped badge styling from image_980979.png */}
        {item.category && (
          <div className="w-32 shrink-0">
            <span className="inline-flex items-center gap-1 rounded-full bg-(--color-primary)/5 px-2.5 py-0.5 text-[10px] font-semibold text-(--color-primary)">
              <svg className="h-2.5 w-2.5 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5.25 5.25a.75.75 0 0 0-.75.75v6.75a.75.75 0 0 0 .75.75h6.75a.75.75 0 0 0 .75-.75V6a.75.75 0 0 0-.75-.75H5.25Z" />
                <path fillRule="evenodd" d="M3 5.25A2.25 2.25 0 0 1 5.25 3h6.75A2.25 2.25 0 0 1 14.25 5.25v6.75a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25Zm14.03 3.53a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l3.22-3.22-3.22-3.22a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
              {item.category}
            </span>
          </div>
        )}

        {/* Clean, high-contrast headline text layout */}
        <span className="flex-1 text-sm font-semibold tracking-tight text-slate-900 group-hover:text-(--color-primary) transition-colors duration-150">
          {item.headline}
        </span>
      </Link>
    </motion.li>
  )
}

export function NewsListBlock({
  eyebrow,
  heading,
  intro,
  items,
  viewAllCta,
}: NewsListBlockProps) {
  if (items.length === 0) return null

  return (
    <section aria-labelledby="news-list-heading" className="py-20 md:py-28 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Asymmetric layout container matrix */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          
          {/* Left Sticky Column Panel Area */}
          <div className="lg:col-span-4 text-left space-y-4 lg:pr-6">
            {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
            {heading && (
              <h2
                id="news-list-heading"
                className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl"
              >
                {heading}
              </h2>
            )}
            {intro && (
              <p className="text-sm md:text-base leading-relaxed text-slate-500 max-w-sm">
                {intro}
              </p>
            )}
            
            {viewAllCta && (
              <div className="pt-4">
                <Link
                  href={viewAllCta.href}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-(--color-primary) group hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-primary)"
                >
                  <span>{viewAllCta.label}</span>
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

          {/* Right Chronological News Container Area */}
          <div className="lg:col-span-8">
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              role="list"
              className="divide-y-0 border-t border-neutral-100/90"
            >
              {items.map((item, i) => (
                <NewsItemRow key={i} item={item} />
              ))}
            </motion.ul>
          </div>

        </div>
        
      </div>
    </section>
  )
}