'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { SectionEyebrow } from '../../components/ui'
import { fadeInUp } from '../../lib/motion'
import type { ServicesGridBlockProps, ServiceItem } from './types'

interface RowProps {
  service: ServiceItem
  index: number
}

/* ──────────────────────────────────────────────────────────────────────
   A. HOMEPAGE DESIGN STYLE (layout === 'alternating')
   ────────────────────────────────────────────────────────────────────── */
function OverlapRow({ service, index }: RowProps) {
  const isEven = index % 2 === 0

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="relative w-full min-h-[300px] md:min-h-[340px] flex flex-col justify-center items-stretch"
    >
      <div 
        className={[
          'w-full md:w-[62%] h-[200px] sm:h-[260px] md:h-[320px] relative rounded-2xl overflow-hidden shadow-sm z-0',
          isEven ? 'md:ml-auto' : 'md:mr-auto'
        ].join(' ')}
      >
        {service.imageUrl ? (
          <Image
            src={service.imageUrl}
            alt={service.imageName || service.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 62vw"
          />
        ) : (
          <div className="w-full h-full bg-slate-100" />
        )}
      </div>

      <div
        className={[
          'w-full md:w-[44%] bg-[#EBF5FF] p-5 sm:p-7 md:p-8 rounded-2xl md:shadow-md text-left space-y-3 z-10',
          'mt-[-30px] md:mt-0 mx-4 sm:mx-6 md:mx-0 md:absolute md:top-1/2 md:-translate-y-1/2',
          isEven ? 'md:left-0' : 'md:right-0'
        ].join(' ')}
      >
        <div className="space-y-0.5">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
            {service.title}
          </h3>
          {service.subheadline && (
            <p className="text-[12px] font-semibold text-blue-400 tracking-wider capitalize">
              {service.subheadline}
            </p>
          )}
        </div>

        {service.description && (
          <p className="text-[14px] leading-relaxed text-gray-700 font-normal">
            {service.description}
          </p>
        )}

        {service.cta.label && (
          <div className="pt-2">
            <Link
              href={service.cta.href}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#5EA6E6] hover:bg-[#4B93D3] active:scale-[0.98] text-white text-[12px] font-medium rounded-lg transition-all duration-200 shadow-sm group focus:outline-none"
            >
              <span>{service.cta.label}</span>
              <svg 
                className="h-3.5 w-3.5 transform transition-transform duration-200 group-hover:translate-x-1" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   B. SERVICES PAGE DESIGN STYLE (layout === 'corporate-banner')
   ────────────────────────────────────────────────────────────────────── */
function CorporateBannerRow({ service }: RowProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center transition-all duration-300 hover:shadow-[0_10px_30px_-6px_rgba(0,0,0,0.07)]"
    >
      <div className="md:col-span-3 relative aspect-[16/10] md:aspect-[4/3] w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-100/60 shadow-sm">
        {service.imageUrl ? (
          <Image
            src={service.imageUrl}
            alt={service.imageName || service.title}
            fill
            className="object-cover object-center transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, 22vw"
          />
        ) : (
          <div className="w-full h-full bg-slate-100" />
        )}
      </div>

      <div className="md:col-span-9 text-left space-y-4 flex flex-col justify-center">
        <div className="space-y-1.5">
          {service.subheadline && (
            <span className="inline-block px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#5EA6E6] bg-blue-50/60 rounded">
              {service.subheadline}
            </span>
          )}
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 leading-tight">
            {service.title}
          </h3>
        </div>

        {service.description && (
          <p className="text-[14px] md:text-[14.5px] leading-relaxed text-gray-600 font-normal max-w-4xl">
            {service.description}
          </p>
        )}

        {service.cta.label && (
          <div className="pt-1">
            <Link
              href={service.cta.href}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#5EA6E6] hover:bg-[#4B93D3] active:scale-[0.98] text-white text-[13px] font-semibold rounded-full transition-all duration-200 shadow-sm group focus:outline-none"
            >
              <span>{service.cta.label}</span>
              <svg 
                className="h-3.5 w-3.5 transform transition-transform duration-200 group-hover:translate-x-1" 
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ──────────────────────────────────────────────────────────────────────
   MAIN CORE LOGIC GRID EXPORT
   ────────────────────────────────────────────────────────────────────── */
export function ServicesGridBlock({
  eyebrow,
  heading,
  services,
  layout = 'alternating',
}: ServicesGridBlockProps) {
  if (!services || services.length === 0) return null

  const isCorporateLayout = layout === 'corporate-banner'

  return (
    <section 
      className={[
        'overflow-hidden',
        isCorporateLayout ? 'pt-8 pb-20 md:pt-10 md:pb-24 bg-[#F8FAFC]' : 'pt-12 pb-20 md:pt-16 md:pb-24 bg-white'
      ].join(' ')}
    >
      <div className="mx-auto max-w-full px-6 md:px-16 lg:px-24">
        
        {!isCorporateLayout && (
          <div className="mb-12 md:mb-16 text-center max-w-3xl mx-auto space-y-2">
            {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
            <h2 className="text-2xl md:text-[34px] font-bold tracking-tight text-gray-900 leading-tight">
              {heading}
            </h2>
          </div>
        )}

        {/* Dynamic Card Spacing Grid Wrapper */}
        <div 
          className={[
            'mx-auto max-w-[1300px]',
            isCorporateLayout ? 'space-y-6' : 'space-y-16 md:space-y-24'
          ].join(' ')}
        >
          {services.map((service, i) => (
            isCorporateLayout ? (
              <CorporateBannerRow key={service.title || i} service={service} index={i} />
            ) : (
              <OverlapRow key={service.title || i} service={service} index={i} />
            )
          ))}
        </div>

        

      </div>
    </section>
  )
}