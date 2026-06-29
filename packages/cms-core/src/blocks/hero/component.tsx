'use client'

import { useLocale } from 'next-intl'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
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
  subheadline,
  heading,
  heroSlides,
  backgroundImageUrl,
  heroImageUrl,

}: HeroBlockProps & {
  subheadline?: string
  locale?: string
}) {
  const [current, setCurrent] = useState(0)

  const resolvedHeadline = headline ?? heading ?? ''
  const resolvedBgImage = backgroundImageUrl ?? heroImageUrl

  const slides = heroSlides?.length
    ? heroSlides
    : resolvedBgImage
      ? [{ imageUrl: resolvedBgImage, alt: '', title: '', subtitle: '' }]
      : []

  const total = slides.length

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

  const crossFadeVariants = {
    enter: { opacity: 0, scale: 1.05 },
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

  const locale = useLocale();
  const isJapanese = locale === 'ja';
  const isBangla = locale === 'bn';

  return (
    <div aria-label="Hero" role="region" className="flex flex-col bg-white overflow-hidden">

      {/* Heading Strip */}
      <div className="bg-white px-6 pt-6 pb-3 lg:px-20 lg:pt-8 lg:pb-2">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="text-right"
        >
          {eyebrow && (
            <motion.p
              variants={fadeInUp}
              className="mb-1 text-xs font-semibold uppercase tracking-widest text-text-secondary"
            >
              {eyebrow}
            </motion.p>
          )}

          {/* Headline */}
          <motion.h1
            id="hero-heading"
            variants={fadeInUp}
            className="ml-auto whitespace-nowrap text-[26px] font-medium tracking-tight text-text-primary md:text-3xl lg:text-[42px]"
          >
            {resolvedHeadline}
          </motion.h1>

          {/* Subheadline - Same style for Japanese & Bangla */}
          {subheadline && (
            <motion.p
              variants={fadeInUp}
              className={`ml-auto mb-6 
      ${isJapanese || isBangla
                  ? 'max-w-[380px] sm:max-w-[450px] md:max-w-[500px] text-[16px] md:text-[18px] lg:text-[20px]'
                  : 'max-w-[500px] sm:max-w-[550px] md:max-w-[650px] text-[16px] md:text-[18px] lg:text-[20px]'
                } 
      leading-tight md:leading-[1.35] 
      text-text-secondary tracking-[-0.1px] break-words`}
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {subheadline}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Image Slider - unchanged */}
      {slides.length > 0 && (
        <div className="w-full px-4 pb-4 md:px-6 md:pb-6 lg:px-10 lg:pb-8">
          <div className="relative w-full overflow-hidden bg-bg-secondary rounded-2xl md:rounded-3xl aspect-[4/3] sm:aspect-[16/10] md:h-[calc(100vh-160px)] md:min-h-[500px]">
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
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 768px) 100vw, 95vw"
                />

                {(slides[current]?.title || slides[current]?.subtitle) && (
                  <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-8 sm:p-12 md:p-16 text-left">
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                      className="max-w-2xl space-y-2 text-white"
                    >
                      {slides[current].title && (
                        <h2 className="text-xl sm:text-2xl md:text-4xl font-bold tracking-tight">
                          {slides[current].title}
                        </h2>
                      )}
                      {slides[current].subtitle && (
                        <p className="text-sm sm:text-base md:text-lg text-white/90 font-normal leading-relaxed">
                          {slides[current].subtitle}
                        </p>
                      )}
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous slide"
                  className="absolute left-3 top-1/2 z-10 flex h-9 w-9 md:h-11 md:w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text-primary shadow-md backdrop-blur-sm transition-all hover:bg-white focus-visible:outline-none"
                >
                  <ChevronLeft />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next slide"
                  className="absolute right-3 top-1/2 z-10 flex h-9 w-9 md:h-11 md:w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-text-primary shadow-md backdrop-blur-sm transition-all hover:bg-white focus-visible:outline-none"
                >
                  <ChevronRight />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:bottom-6 md:right-8 z-10 flex gap-2" role="tablist">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      aria-selected={i === current}
                      onClick={() => setCurrent(i)}
                      className={[
                        'h-2 w-2 rounded-full transition-all duration-300',
                        i === current ? 'bg-white w-4' : 'bg-white/50',
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