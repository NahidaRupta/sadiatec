'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { motion } from 'framer-motion'
import { User, ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionEyebrow } from '../../components/ui'
import type { CaseStudiesGridBlockProps } from './types'

// 1. Localization dictionary for UI labels
const labels: Record<string, { challenge: string; solution: string }> = {
  en: { challenge: 'Challenge', solution: 'Solution' },
  ja: { challenge: '課題', solution: '解決策' },
  bn: { challenge: 'চ্যালেঞ্জ', solution: 'সমাধান' },
}

export function CaseStudiesGridBlock({
  eyebrow,
  heading,
  studies = [],
}: CaseStudiesGridBlockProps) {

  // 2. Setup localization hook and type-safe label access
  const locale = useLocale()
  const t = (labels[locale] || labels['en']) as { challenge: string; solution: string }

  if (!studies || studies.length === 0) return null

  const initialCenterIndex = Math.floor(studies.length / 2)
  const [activeIdx, setActiveIdx] = useState(initialCenterIndex)

  const handleNext = () => setActiveIdx((prev) => (prev + 1) % studies.length)
  const handlePrev = () => setActiveIdx((prev) => (prev - 1 + studies.length) % studies.length)

  return (
    <section
      aria-labelledby="case-studies-heading"
      className="relative overflow-hidden py-24 md:py-32 min-h-[850px] flex flex-col justify-center select-none"
    >
      {/* Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 [clip-path:inset(0_0_0_0)]">
          <div className="fixed inset-0 w-full h-full">
            <Image
              src="/images/case-study.png"
              alt=""
              fill
              className="object-cover object-center"
              sizes="100vw"
              quality={85}
              priority
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-brand-dark/50 z-1" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/90 via-brand-dark/30 to-brand-dark/75 z-1" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/40 via-transparent to-brand-dark/40 z-1" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent z-1" />
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">

        {(eyebrow || heading) && (
          <div className="mb-8 text-center max-w-2xl mx-auto">
            {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
            {heading && (
              <h2 id="case-studies-heading" className="mt-3 text-3xl font-extrabold text-white md:text-4xl tracking-tight">
                {heading}
              </h2>
            )}
          </div>
        )}

        {/* Carousel Slider */}
        <div className="relative w-full h-[540px] flex items-center justify-center my-2">
          {studies.map((study, index) => {
            // 1. Calculate the shortest distance (offset) considering circularity
            let offset = index - activeIdx

            // Normalize offset to be within (-N/2, N/2]
            const N = studies.length
            if (offset > N / 2) offset -= N
            if (offset <= -N / 2) offset += N

            // 2. Only show cards if they are within a reasonable range 
            // For 3 cards, we show all. For 5+, we show 5 (index -2 to +2)
            const isVisible = Math.abs(offset) <= 2

            if (!isVisible) return null

            const isActive = offset === 0
            const cardScale = isActive ? 1.0 : 0.82
            const cardZIndex = 10 - Math.abs(offset)
            const cardOpacity = isActive ? 1 : 0.55 // Adjusted for better visibility with fewer cards

            return (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  x: offset * 340,
                  scale: cardScale,
                  zIndex: cardZIndex,
                  opacity: cardOpacity,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="absolute w-[380px] sm:w-[420px] shrink-0"
              >
                <article className={`group flex flex-col rounded-2xl border p-8 min-h-[520px] justify-start transition-all duration-300 backdrop-blur-xl ${isActive
                    ? "border-brand-primary/50 bg-brand-dark/95 shadow-[0_25px_50px_-12px_rgba(95,169,230,0.15)]"
                    : "border-white/10 bg-brand-dark/80 shadow-2xl shadow-black/60"
                  }`}>
                  {/* Card Avatar Section */}
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                    {study.photoUrl ? (
                      <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden border border-brand-primary/20">
                        <Image src={study.photoUrl} alt={study.name} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
                        <User size={22} />
                      </div>
                    )}
                    <div className="overflow-hidden text-left">
                      <h4 className="text-base font-bold text-white tracking-tight truncate">{study.name}</h4>
                      {study.role && <p className="text-sm text-brand-primary font-medium truncate leading-tight mt-0.5">{study.role}</p>}
                    </div>
                  </div>

                  {/* Metric Display */}
                  {study.metric && (
                    <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-brand-dark/60 border border-white/5 backdrop-blur-md">
                      <span className="text-2xl font-black text-brand-primary tabular-nums leading-none">{study.metric.value}</span>
                      <span className="text-xs font-semibold text-white/50 leading-tight text-left">{study.metric.caption}</span>
                    </div>
                  )}

                  {/* Dynamic Challenge Section */}
                  {study.challenge && (
                    <div className="mb-5 text-left">
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-brand-primary">
                        {t.challenge}
                      </p>
                      <p className="text-sm leading-relaxed text-white/80 font-normal">{study.challenge}</p>
                    </div>
                  )}

                  {/* Dynamic Solution Section */}
                  {study.solution && (
                    <div className="text-left">
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-brand-accent">
                        {t.solution}
                      </p>
                      <p className="text-sm leading-relaxed text-white/80 font-normal">{study.solution}</p>
                    </div>
                  )}
                </article>
              </motion.div>
            )
          })}
        </div>

        {/* Carousel Navigation */}
        <div className="flex justify-center items-center gap-6 mt-12">
          <button onClick={handlePrev} className="w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none" aria-label="Previous story card">
            <ChevronLeft size={22} />
          </button>

          <div className="flex gap-2.5">
            {studies.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIdx ? "w-8 bg-brand-primary" : "w-1.5 bg-white/30"}`}
                aria-label={`Go to story slide ${i + 1}`}
              />
            ))}
          </div>

          <button onClick={handleNext} className="w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none" aria-label="Next story card">
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  )
}