'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { SectionEyebrow } from '../../components/ui'
import { staggerContainer, fadeInUp } from '../../lib/motion'
import type { NewsListBlockProps, NewsItem } from './types'

function NewsCard({ item }: { item: NewsItem }) {
  return (
    <motion.li variants={fadeInUp} className="list-none flex">
      <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs transition-all duration-300 hover:shadow-md w-full">
        
        {/* 1. Added "relative" to this container class list */}
<div className="relative aspect-video w-full overflow-hidden bg-slate-50 border-b border-slate-100">
  {item.thumbnail ? (
    <Image
      src={item.thumbnail}
      alt={item.headline}
      fill
      sizes="(max-w-7xl) 33vw, 100vw"
      className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
    />
  ) : (
    /* Fallback placeholder frame */
    <div className="w-full h-full bg-slate-100/70" />
  )}
</div>

        {/* Card Body Context */}
        <div className="flex flex-1 flex-col p-6 text-left">
          <div className="mb-3 flex items-center gap-3">
            {item.category && (
              <span className="inline-flex items-center rounded-full bg-(--color-primary)/5 px-2.5 py-0.5 text-[10px] font-semibold text-(--color-primary)">
                {item.category}
              </span>
            )}
            {item.date && (
              <span className="text-xs font-medium text-slate-400">
                {new Date(item.date).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
              </span>
            )}
          </div>

          <h3 className="mb-2 text-lg font-bold leading-snug tracking-tight text-slate-900 line-clamp-2 min-h-[3.5rem]">
            <Link href={item.href} className="hover:text-(--color-primary) focus-visible:outline-hidden">
              {item.headline}
            </Link>
          </h3>

          {item.excerpt && (
            <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-500 line-clamp-3">
              {item.excerpt}
            </p>
          )}

          <div className="mt-auto pt-2">
            <Link href={item.href} className="group inline-flex items-center gap-1.5 text-sm font-bold text-(--color-primary) focus-visible:outline-hidden">
              <span className="group-hover:underline">Read more</span>
              <svg className="h-3.5 w-3.5 transform transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </article>
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
    <section aria-labelledby="news-grid-heading" className="py-12 md:py-20 bg-slate-50/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Centered Block Header */}
        <div className="mx-auto max-w-3xl text-center mb-12 md:mb-16 space-y-3">
          {eyebrow && (
            <div className="flex justify-center">
              <SectionEyebrow>{eyebrow}</SectionEyebrow>
            </div>
          )}
          {heading && (
            <h2 id="news-grid-heading" className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              {heading}
            </h2>
          )}
          {intro && <p className="text-base leading-relaxed text-slate-500">{intro}</p>}
        </div>

        {/* 3-Column Grid Layout */}
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
        >
          {items.slice(0, 3).map((item, i) => (
            <NewsCard key={i} item={item} />
          ))}
        </motion.ul>

        {/* Bottom View All Button */}
        {viewAllCta && (
          <div className="mt-12 text-center">
            <Link
              href={viewAllCta.href}
              className="inline-flex h-11 items-center justify-center rounded-md bg-(--color-primary) px-6 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-(--color-primary) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#029676]"
            >
              {viewAllCta.label}
            </Link>
          </div>
        )}
        
      </div>
    </section>
  )
}