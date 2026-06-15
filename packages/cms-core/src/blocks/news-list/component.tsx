'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { staggerContainer, fadeInUp } from '../../lib/motion'
import type { NewsListBlockProps, NewsItem } from './types'

/* ──────────────────────────────────────────────────────────────────────
   LAYOUT A: ORIGINAL DEDICATED SUBPAGE DESIGN (layout === 'list')
   ────────────────────────────────────────────────────────────────────── */
function NewsRowItem({ item }: { item: NewsItem }) {
  return (
    <motion.li 
      variants={fadeInUp}
      className="list-none border-t border-slate-200/80 pt-6 pb-8 first:border-t-0 first:pt-0 group text-left"
    >
      <Link href={item.href} className="block space-y-3.5 focus-visible:outline-none">
        <div className="flex flex-wrap items-center gap-4">
          {item.date && (
            <span className="text-[15px] font-semibold text-gray-700 tracking-tight">
              {new Date(item.date).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          )}
          {item.category && (
            <span className="inline-flex items-center bg-black px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase rounded-none">
              {item.category}
            </span>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-[14px] md:text-[15px] font-bold leading-relaxed text-gray-900 group-hover:text-blue-600 transition-colors duration-150">
            {item.headline}
          </h3>
          {item.excerpt && (
            <p className="text-[13.5px] md:text-[14px] leading-relaxed text-gray-600 font-normal line-clamp-3">
              {item.excerpt}
            </p>
          )}
        </div>
      </Link>
    </motion.li>
  )
}

function ListLayoutView({ heading, items, viewAllCta }: NewsListBlockProps) {
  return (
    <section aria-labelledby="news-split-heading" className="bg-[#F6F6F6] py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-start">
          <div className="lg:col-span-5 flex flex-col items-start space-y-8 lg:sticky lg:top-12">
            <h2 id="news-split-heading" className="text-3xl font-extrabold tracking-tight text-black md:text-4xl">
              {heading}
            </h2>
            {viewAllCta && (
              <Link
                href={viewAllCta.href}
                className="inline-flex h-11 items-center justify-center rounded-full border border-gray-400 bg-transparent px-8 text-xs font-bold text-gray-900 tracking-wide transition-all duration-200 hover:bg-black hover:text-white hover:border-black active:scale-[0.98]"
              >
                {viewAllCta.label || 'View news list'}
              </Link>
            )}
          </div>
          <div className="lg:col-span-7">
            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              role="list"
              className="flex flex-col space-y-2 border-b border-slate-200/80 pb-2"
            >
              {items.slice(0, 3).map((item, i) => (
                <NewsRowItem key={item.headline || i} item={item} />
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   LAYOUT B: HOMEPAGE SLIDER CAROUSEL DESIGN (layout === 'carousel')
   ────────────────────────────────────────────────────────────────────── */
function CarouselCardItem({ item }: { item: NewsItem }) {
  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : ''

  return (
    <motion.div 
      variants={fadeInUp}
      className="flex flex-col bg-transparent group text-left min-w-[290px] sm:min-w-[340px] md:min-w-[380px] flex-1"
    >
      <Link href={item.href} className="block space-y-4 focus:outline-none">
        
        {/* 1. 🛠️ Scaled Down Image Size - max-w-[85%] centered container for a more compact thumb layout */}
        <div className="relative aspect-[16/10] max-w-[85%] mx-auto w-full rounded-2xl overflow-hidden bg-white/90 border border-white/20 shadow-md">
          {item.thumbnail ? (
            <Image
              src={item.thumbnail}
              alt={item.headline}
              fill
              className="object-cover object-center transition-transform duration-300 group-hover:scale-103"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 text-xs">
              No Image Available
            </div>
          )}
        </div>

        {/* 2. Badge Meta Metadata Row with White Text color overrides */}
        <div className="flex items-center gap-3 pt-2 pl-[7.5%]">
          {item.category && (
            <span className="inline-block bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-sm">
              {item.category}
            </span>
          )}
          {formattedDate && (
            <span className="text-[13px] font-medium text-white/90 tracking-tight">
              {formattedDate}
            </span>
          )}
        </div>

        {/* 3. 🛠️ Boosted headline text size to be bigger, with absolute pure white coloring */}
        <div className="space-y-2 pl-[7.5%] pr-2">
          <h3 className="text-[16px] md:text-[18px] font-extrabold text-white leading-snug line-clamp-2 transition-colors duration-150">
            {item.headline}
          </h3>
          {item.excerpt && (
            <p className="text-[13.5px] leading-relaxed text-white/80 font-normal line-clamp-3">
              {item.excerpt}
            </p>
          )}
        </div>

      </Link>
    </motion.div>
  )
}

function CarouselLayoutView({ heading = 'Latest Information', items }: NewsListBlockProps) {
  const displayItems = items.slice(0, 3)

  return (
    <div className="w-full bg-white py-6 md:py-10">
      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 md:px-10 lg:px-12">
        
        <section className="relative w-full bg-brand-accent rounded-[2rem] p-8 md:p-14 lg:p-16 overflow-hidden shadow-sm">
          
          
          <div className="w-full">
            
            {/* 🛠️ Main Layout Title set to White text */}
            <div className="mb-10 text-left">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                {heading}
              </h2>
            </div>

            {/* Horizontal Slider Track Grid Column System */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
              className="flex flex-col sm:flex-row gap-6 lg:gap-8 overflow-x-auto scrollbar-none pb-4"
            >
              {displayItems.map((item, i) => (
                <CarouselCardItem key={item.headline || i} item={item} />
              ))}
            </motion.div>

          </div>
        </section>

      </div>
    </div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   MAIN SERVICE RUNTIME BLOCK DISPATCHER ENTRYPOINT
   ────────────────────────────────────────────────────────────────────── */
export function NewsListBlock(props: NewsListBlockProps) {
  if (!props.items || props.items.length === 0) return null

  if (props.layout === 'carousel') {
    return <CarouselLayoutView {...props} />
  }

  return <ListLayoutView {...props} />
}