'use client'
// Client boundary: useScroll (parallax) + keyword pill scroll strip

import Link from 'next/link'
import { motion, useScroll } from 'framer-motion'
import { staggerContainer, fadeInUp, useHeroParallax } from '../../lib/motion'
import type { HeroBlockProps } from './types'

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
  inlineStats,
  keywordPills,
  backgroundImageUrl,
  heroImageUrl,
  showScrollIndicator = true,
}: HeroBlockProps) {
  const { scrollY } = useScroll()
  const parallaxY = useHeroParallax(scrollY)

  // Support legacy field names used by inner-page hero instances
  const resolvedHeadline = headline ?? heading ?? ''
  const resolvedSubheadline = subheadline ?? subheading
  const resolvedBgImage = backgroundImageUrl ?? heroImageUrl
  const resolvedPrimaryCta = primaryCta ?? ctaPrimary
  const resolvedSecondaryCta = secondaryCta ?? ctaSecondary

  const headlineParts = resolvedHeadline.split('\n')
  const pills = keywordPills ?? []
  const doubledPills = [...pills, ...pills]

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-[70vh] md:min-h-[80vh] w-full items-center overflow-hidden bg-[var(--color-neutral-900)]"
    >
      {/* Layered background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[var(--color-neutral-950)] via-[var(--color-neutral-900)] to-[var(--color-neutral-800)]"
      />
      {resolvedBgImage && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity"
          style={{ backgroundImage: `url('${resolvedBgImage}')` }}
        />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/4 left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-[var(--color-primary)]/10 blur-[120px]"
      />

      {/* Parallax content */}
      <motion.div
        {...(parallaxY ? { style: { y: parallaxY } } : {})}
        className="relative w-full"
      >
        <div className="mx-auto max-w-4xl px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible">

            {/* Eyebrow */}
            {eyebrow && (
              <motion.p
                variants={fadeInUp}
                className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]"
              >
                {eyebrow}
              </motion.p>
            )}

            {/* Headline — splits on \n */}
            <motion.h1
              id="hero-heading"
              variants={fadeInUp}
              className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              {headlineParts.map((part, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {i === 0
                    ? <span className="text-[var(--color-accent)]">{part}</span>
                    : part
                  }
                </span>
              ))}
            </motion.h1>

            {/* Subheadline */}
            {resolvedSubheadline && (
              <motion.p
                variants={fadeInUp}
                className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl"
              >
                {resolvedSubheadline}
              </motion.p>
            )}

            {/* CTAs */}
            {(resolvedPrimaryCta || resolvedSecondaryCta) && (
              <motion.div
                variants={fadeInUp}
                className="mt-10 flex flex-wrap justify-center gap-4"
              >
                {resolvedPrimaryCta && (
                  <Link
                    href={resolvedPrimaryCta.href}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-[var(--color-primary)] px-7 py-3.5 text-base font-semibold text-white transition-opacity duration-150 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
                  >
                    {resolvedPrimaryCta.label}
                  </Link>
                )}
                {resolvedSecondaryCta && (
                  <Link
                    href={resolvedSecondaryCta.href}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md border border-white/30 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-colors duration-150 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {resolvedSecondaryCta.label}
                  </Link>
                )}
              </motion.div>
            )}

            {/* Inline stats */}
            {inlineStats && inlineStats.length > 0 && (
              <motion.div
                variants={fadeInUp}
                className="mt-12 flex flex-col justify-center gap-8 sm:flex-row sm:gap-12"
              >
                {inlineStats.map((stat, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-3xl font-bold tracking-tight text-white">
                      {stat.value}
                    </span>
                    <span className="mt-1 text-sm uppercase tracking-wider text-white/50">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Keyword pills — reuses .logo-track CSS (globals.css) for infinite scroll */}
            {pills.length > 0 && (
              <motion.div
                variants={fadeInUp}
                className="mt-10 overflow-hidden"
                aria-hidden="true"
              >
                <div className="logo-track gap-3">
                  {doubledPills.map((pill, i) => (
                    <span
                      key={i}
                      className="inline-flex shrink-0 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm"
                    >
                      {pill.text}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      {showScrollIndicator && (
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="select-none text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="h-6 w-px bg-gradient-to-b from-white/70 to-transparent"
          />
        </div>
      )}
    </section>
  )
}
