'use client'
// Client boundary: useScroll (parallax) + floating pill animations

import Link from 'next/link'
import { motion, useScroll } from 'framer-motion'
import { staggerContainer, fadeInUp, useHeroParallax } from '../../lib/motion'
import type { HeroBlockProps } from './types'

// Staggered float delays for each pill so they bob independently
const FLOAT_DELAYS = [0, 0.5, 1.0, 0.25, 0.75, 1.25, 0.4, 0.9, 0.15, 0.65, 1.1, 0.35]

// Pre-computed scattered positions for up to 12 pills in the right panel
const PILL_POSITIONS = [
  'top-[4%]  left-[30%]',
  'top-[4%]  right-[4%]',
  'top-[26%] left-[4%]',
  'top-[24%] right-[8%]',
  'top-[48%] left-[22%]',
  'top-[50%] right-[2%]',
  'top-[70%] left-[6%]',
  'top-[72%] right-[18%]',
  'top-[14%] left-[55%]',
  'top-[40%] left-[46%]',
  'top-[62%] left-[48%]',
  'top-[86%] left-[28%]',
]

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

  // Support legacy field names
  const resolvedHeadline = headline ?? heading ?? ''
  const resolvedSubheadline = subheadline ?? subheading
  const resolvedBgImage = backgroundImageUrl ?? heroImageUrl
  const resolvedPrimaryCta = primaryCta ?? ctaPrimary
  const resolvedSecondaryCta = secondaryCta ?? ctaSecondary

  const headlineParts = resolvedHeadline.split('\n')
  const pills = keywordPills ?? []

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-[var(--color-neutral-900)]"
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
      {/* Ambient glow — left/centre */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/4 left-1/3 h-[700px] w-[700px] -translate-x-1/2 rounded-full bg-[var(--color-primary)]/10 blur-[100px]"
      />
      {/* Ambient glow — right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full bg-[var(--color-accent)]/5 blur-[80px]"
      />

      {/* Parallax wrapper */}
      <motion.div
        {...(parallaxY ? { style: { y: parallaxY } } : {})}
        className="relative w-full"
      >
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">

            {/* ── Left column: text content ── */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col"
            >
              {/* Eyebrow / tagline */}
              {/* {eyebrow && (
                <motion.p
                  variants={fadeInUp}
                  className="mb-5 flex items-center gap-2.5 text-sm font-semibold uppercase tracking-widest text-[var(--color-accent)]"
                >
                  <span className="inline-block h-px w-6 bg-[var(--color-accent)]" aria-hidden="true" />
                  {eyebrow}
                </motion.p>
              )} */}

              {/* Headline — first segment in accent colour, rest in white */}
              {/* 🛠️ Dynamic parsing logic to isolate the headline accent */}
              {(() => {
                // Join parts if it's an array, or just grab the raw text string
                const fullText = Array.isArray(headlineParts) ? headlineParts.join(' ') : headlineParts;

                // Find where your phrase splits
                const targetPhrase = "Study and Work";
                const hasTarget = fullText.includes(targetPhrase);

                if (hasTarget) {
                  const remainder = fullText.replace(targetPhrase, '').trim();
                  // Clean up any dangling hyphens or colons at the beginning of the remaining string
                  const cleanRemainder = remainder.replace(/^[\s\-\:\—]+/, '');

                  return (
                    <motion.h1
                      id="hero-heading"
                      variants={fadeInUp}
                      className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl xl:text-6xl"
                    >
                      <span className="text-amber-500">{targetPhrase}</span>
                      {cleanRemainder && (
                        <>
                          <br />
                          <span className="text-white">{cleanRemainder}</span>
                        </>
                      )}
                    </motion.h1>
                  );
                }

                // Fallback if the headline changes inside the admin panel completely
                return (
                  <motion.h1
                    id="hero-heading"
                    variants={fadeInUp}
                    className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl xl:text-6xl"
                  >
                    {fullText}
                  </motion.h1>
                );
              })()}

              {/* Subheadline */}
              {resolvedSubheadline && (
                <motion.p
                  variants={fadeInUp}
                  className="mt-6 max-w-xl text-base leading-relaxed text-white/70 md:text-lg"
                >
                  {resolvedSubheadline}
                </motion.p>
              )}

              {/* CTAs */}
              {(resolvedPrimaryCta || resolvedSecondaryCta) && (
                <motion.div
                  variants={fadeInUp}
                  className="mt-9 flex flex-wrap gap-4"
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
                  className="mt-10 flex flex-wrap gap-8"
                >
                  {inlineStats.map((stat, i) => (
                    <div key={i} className="flex flex-col">
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

              {/* Mobile pill cloud — flex-wrap strip, shown only on small screens */}
              {pills.length > 0 && (
                <motion.div
                  variants={fadeInUp}
                  className="mt-10 flex flex-wrap gap-3 lg:hidden"
                  aria-hidden="true"
                >
                  {pills.map((pill, i) => (
                    <span
                      key={i}
                      className="inline-flex rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-md"
                    >
                      {pill.text}
                    </span>
                  ))}
                </motion.div>
              )}
            </motion.div>

            {/* ── Right column: floating glassmorphic pill cloud (desktop only) ── */}
            {pills.length > 0 && (
              <div
                aria-hidden="true"
                className="relative hidden h-[420px] w-full lg:block"
              >
                {pills.slice(0, PILL_POSITIONS.length).map((pill, i) => {
                  const pos = PILL_POSITIONS[i] ?? 'top-[50%] left-[50%]'
                  const floatDelay = FLOAT_DELAYS[i % FLOAT_DELAYS.length] ?? 0

                  return (
                    <motion.div
                      key={i}
                      className={`absolute ${pos}`}
                      initial={{ opacity: 0, scale: 0.75 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 0.25 + i * 0.09,
                        duration: 0.55,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <motion.span
                        animate={{ y: [0, -9, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 3.8,
                          ease: 'easeInOut',
                          delay: floatDelay,
                        }}
                        whileHover={{ scale: 1.07, y: -11 }}
                        className="inline-flex cursor-default select-none items-center whitespace-nowrap rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-[0_4px_24px_rgba(0,0,0,0.25)] backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-300 hover:border-white/40 hover:bg-white/15 hover:shadow-[0_4px_32px_rgba(255,255,255,0.1)]"
                      >
                        {pill.text}
                      </motion.span>
                    </motion.div>
                  )
                })}
              </div>
            )}

          </div>
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
