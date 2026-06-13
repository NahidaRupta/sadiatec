'use client'
// Client boundary: slider state + auto-advance interval

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer, fadeInUp } from '../../lib/motion'
import type { HeroBlockProps } from './types'

function ChevronLeft() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  )
}

export function HeroBlock({
  eyebrow,
  headline,
  heading,
  subheadline,
  subheading,
  primaryCta,
  ctaPrimary,
  secondaryCta,
  ctaSecondary,
  heroSlides,
  backgroundImageUrl,
  heroImageUrl,
}: HeroBlockProps) {
  const [current, setCurrent] = useState(0)

  // Support legacy field names
  const resolvedHeadline = headline ?? heading ?? ''
  const resolvedSubheadline = subheadline ?? subheading
  const resolvedPrimaryCta = primaryCta ?? ctaPrimary
  const resolvedSecondaryCta = secondaryCta ?? ctaSecondary
  const resolvedBgImage = backgroundImageUrl ?? heroImageUrl

  // Prefer heroSlides array; fall back to single backgroundImage
  const slides = heroSlides?.length
    ? heroSlides
    : resolvedBgImage
      ? [{ imageUrl: resolvedBgImage, alt: '' }]
      : []

  const total = slides.length

  // Auto-advance every 5 s
  useEffect(() => {
    if (total <= 1) return
    const id = setInterval(() => {
      setCurrent((i) => (i + 1) % total)
    }, 5000)
    return () => clearInterval(id)
  }, [total])

  const prev = useCallback(() => {
    setCurrent((i) => (i - 1 + total) % total)
  }, [total])

  const next = useCallback(() => {
    setCurrent((i) => (i + 1) % total)
  }, [total])

  // Luxurious crossfade + initial load scale animation configuration
  const crossFadeVariants = {
    enter: {
      opacity: 0,
      scale: 1.05,
    },
    center: {
      opacity: 1,
      scale: 1,
      transition: {
        opacity: { duration: 1.4, ease: [0.25, 1, 0.5, 1] },
        scale: { duration: 1.6, ease: [0.25, 1, 0.5, 1] },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.97,
      transition: {
        opacity: { duration: 1.0, ease: 'linear' },
        scale: { duration: 1.4, ease: [0.25, 1, 0.5, 1] },
      },
    },
  }

  return (
    <div aria-label="Hero" role="region" className="flex flex-col bg-white overflow-hidden">

      {/* ── Band 1: White heading strip (Reduced vertical padding to close the gap) ── */}
      <div className="bg-white px-6 pt-6 pb-2 lg:px-20 lg:pt-8 lg:pb-2">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-right"
        >
          {eyebrow && (
            <motion.p
              variants={fadeInUp}
              className="mb-0 text-xs font-semibold uppercase tracking-widest text-text-secondary"
            >
              {eyebrow}
            </motion.p>
          )}

          <motion.h1
            id="hero-heading"
            variants={fadeInUp}
            className="ml-auto max-w-[700px] text-3xl font-medium tracking-tight text-text-primary md:text-4xl lg:text-5xl"
          >
            {resolvedHeadline}
          </motion.h1>
          
        </motion.div>
      </div>

      {/* ── Band 2: Floating Canvas Container ── */}
      {slides.length > 0 && (
        <div className="w-full px-4 pb-4 md:px-6 md:pb-6 lg:px-10 lg:pb-8">
          <div
            className="relative w-full overflow-hidden bg-bg-secondary rounded-2xl md:rounded-3xl h-[calc(100vh-140px)] min-h-[500px]"
          >
            <AnimatePresence initial={true} mode="popLayout">
              <motion.div
                key={current}
                variants={crossFadeVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={slides[current]?.imageUrl || ''}
                  alt={slides[current]?.alt || ''}
                  fill
                  className="object-cover"
                  priority
                  sizes="95vw"
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous slide"
                  className="absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text-primary shadow-md backdrop-blur-sm transition-all hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next slide"
                  className="absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text-primary shadow-md backdrop-blur-sm transition-all hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
                >
                  <ChevronRight />
                </button>

                {/* Dots Indicator */}
                <div
                  className="absolute bottom-6 right-8 z-10 flex gap-2"
                  role="tablist"
                  aria-label="Slide indicators"
                >
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={i === current}
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => setCurrent(i)}
                      className={[
                        'h-2 w-2 rounded-full transition-all duration-300',
                        i === current ? 'bg-brand-primary w-4' : 'bg-white/60',
                      ].join(' ')}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  )
}