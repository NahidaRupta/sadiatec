"use client" // CRUCIAL: Tells Next.js to load Framer Motion securely on the client side

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { HeroBlockProps } from './types'

// Staggered orchestration animation container
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
}

// Staggered slide-up item animation
const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }, // Smooth custom ease-out cubic
  },
}

// Floating animations for the right-hand tags
const floatVariants = (delay: number) => ({
  animate: {
    y: [0, -6, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut",
      delay: delay,
    },
  },
})

export const HeroBlock = ({
  heading,
  subheading,
  tagline,
  highlights,
  ctaPrimary,
  ctaSecondary,
  heroImageUrl,
}: HeroBlockProps) => {

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-svh items-start overflow-hidden bg-[#0a192f]"
    >
      {/* Background radial gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#1e3a8a]" />
      
      {/* Background Factory image layout */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-luminosity"
        style={{
          backgroundImage: `url('${typeof heroImageUrl === 'object' && heroImageUrl !== null
              ? (heroImageUrl as any).url
              : (heroImageUrl || '/images/hero/hero.png')
            }')`
        }}
      />

      {/* Center glowing light flare orb */}
      <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />

      {/* Content Container */}
      <div className="max-w-7xl relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-40 flex justify-between items-center">
        
        {/* Left Column: Core Hero Text Fields */}
        <motion.div 
          className="max-w-3xl z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {tagline && (
            <motion.span 
              variants={itemVariants}
              className="inline-block mb-4 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-amber-400"
            >
              {tagline}
            </motion.span>
          )}

          <motion.h1 
            id="hero-heading" 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-amber-400 leading-[1.15]"
          >
            {heading || 'Study and Work -'}
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="mt-6 max-w-xl text-lg text-white/70 leading-relaxed"
          >
            {subheading || "SadiaTec is one of the Japan's largest comprehensive human resources companies..."}
          </motion.p>

          {/* Action Buttons Row */}
          <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-4">
            <Link
              href={ctaPrimary?.href || '/contact'}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-7 py-3.5 text-base font-semibold text-white shadow-lg shadow-amber-500/20 transition-all duration-200 hover:bg-amber-600 hover:-translate-y-0.5"
            >
              {ctaPrimary?.label || 'Get Started'} <span> →</span>
            </Link>
            
            {ctaSecondary?.href && (
              <Link
                href={ctaSecondary.href}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5"
              >
                {ctaSecondary.label || 'Learn More'}
              </Link>
            )}
          </motion.div>

          {/* Dynamic Highlights Section */}
          {highlights && highlights.length > 0 && (
            <motion.div variants={itemVariants} className="mt-14 flex flex-wrap gap-x-12 gap-y-4 text-left">
              {highlights.map((highlightItem, idx) => {
                const text = typeof highlightItem === 'object' && highlightItem !== null
                  ? (highlightItem as any).text
                  : highlightItem;

                if (!text || typeof text !== 'string') return null;

                const parts = text.split(':')
                const displayValue = parts[0]?.trim() || text
                const displayLabel = parts[1]?.trim() || ''

                return (
                  <div key={idx} className="space-y-0.5">
                    <p className="text-3xl font-bold text-white tracking-tight">
                      {displayValue}
                    </p>
                    {displayLabel && (
                      <p className="text-sm font-medium text-white/50">
                        {displayLabel}
                      </p>
                    )}
                  </div>
                )
              })}
            </motion.div>
          )}
        </motion.div>

        {/* Right Column: Desktop Floating Staggered Keyword Badges */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="hidden xl:flex flex-col items-end gap-3 max-w-xl z-10 transform translate-y-6"
        >
          {/* Row 1 */}
          <div className="flex gap-3 justify-end">
            {["Human Resource", "Study Permit"].map((tag, idx) => (
              <motion.span 
                key={tag} 
                variants={floatVariants(idx * 0.2)}
                animate="animate"
                className="rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-5 py-2 text-sm text-white/90 shadow-md transition-all duration-300 hover:bg-white/10 hover:border-white/40 whitespace-nowrap"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex gap-3 justify-end">
            {["Student Program", "Scholarship", "Language Training"].map((tag, idx) => (
              <motion.span 
                key={tag} 
                variants={floatVariants(idx * 0.3)}
                animate="animate"
                className="rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-5 py-2 text-sm text-white/90 shadow-md transition-all duration-300 hover:bg-white/10 hover:border-white/40 whitespace-nowrap"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Row 3 */}
          <div className="flex gap-3 justify-end">
            {["SDC", "Work in Japan", "Future", "Global"].map((tag, idx) => (
              <motion.span 
                key={tag} 
                variants={floatVariants(idx * 0.4)}
                animate="animate"
                className="rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-5 py-2 text-sm text-white/90 shadow-md transition-all duration-300 hover:bg-white/10 hover:border-white/40 whitespace-nowrap"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Animated Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
        <span className="text-xs text-white/30 tracking-widest uppercase selection:bg-none">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          className="h-5 w-px bg-gradient-to-b from-white/60 to-transparent"
        />
      </div>
    </section>
  )
}