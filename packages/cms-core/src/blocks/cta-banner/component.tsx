'use client'
// Client boundary: scroll-triggered fade-up animation

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { MotionStyle } from 'framer-motion'
import { SectionEyebrow } from '../../components/ui'
import { fadeInUp } from '../../lib/motion'
import type { CTABannerBlockProps, CTABannerVariant } from './types'

function resolveCardStyle(
  variant: CTABannerVariant,
  backgroundImageUrl?: string,
): MotionStyle {
  if (variant === 'gradient') {
    return {
      backgroundImage: `linear-gradient(to bottom right, var(--color-primary), color-mix(in srgb, var(--color-primary) 60%, black))`,
    }
  }
  if (variant === 'image' && backgroundImageUrl) {
    return {
      backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url('${backgroundImageUrl}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return {}
}

export function CTABannerBlock({
  eyebrow,
  heading,
  body,
  primaryButton,
  secondaryButton,
  variant = 'gradient',
  backgroundImageUrl,
}: CTABannerBlockProps) {
  const isSolid = variant === 'solid'
  const cardStyle = resolveCardStyle(variant, backgroundImageUrl)

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          style={cardStyle}
          className={[
            'rounded-3xl p-10 md:p-16',
            isSolid ? 'bg-(--color-primary)' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          {/* Desktop: text left, CTAs right. Mobile: stacked centered */}
          <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-center md:justify-between md:text-left">
            {/* Text group */}
            <div className="max-w-xl">
              {eyebrow && (
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-white/70">
                  {eyebrow}
                </p>
              )}
              <h2 className="text-3xl font-bold text-white md:text-4xl">{heading}</h2>
              {body && (
                <p className="mt-4 text-lg leading-relaxed text-white/80">{body}</p>
              )}
            </div>

            {/* CTA group */}
            {(primaryButton.label || secondaryButton) && (
              <div className="flex shrink-0 flex-col items-center gap-3 sm:flex-row md:items-start">
                {primaryButton.label && (
                  <Link
                    href={primaryButton.href}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-md bg-white px-7 py-3.5 text-base font-semibold text-(--color-primary) transition-opacity duration-150 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {primaryButton.label}
                  </Link>
                )}
                {secondaryButton && (
                  <Link
                    href={secondaryButton.href}
                    className="inline-flex min-h-[44px] items-center justify-center gap-1 px-7 py-3.5 text-base font-semibold text-white transition-opacity duration-150 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {secondaryButton.label}
                    <span aria-hidden="true" className="text-lg">→</span>
                  </Link>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
