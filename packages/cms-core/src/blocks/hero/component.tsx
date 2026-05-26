"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { HeroBlockProps } from './types'

// Animation orchestration configurations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {框架staggerChildren: 0.12, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
}

const floatVariants = (delay: number) => ({
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 5,
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
  highlights = [],
  ctaPrimary,
  ctaSecondary,
  heroImageUrl,
}: HeroBlockProps) => {

  const defaultImageUrl = '/images/hero/hero.png'
  const imageUrl = heroImageUrl || defaultImageUrl

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-navy-950"
    >
      {/* 1. Corrected Core Background Gradient */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-br from-[#0a192f] via-[#112240] to-[#1a365d]"
      />
      
      {/* 2. Dynamic Factory image overlay with clean absolute opacity rules */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center mix-blend-luminosity opacity-20 pointer-events-none"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />

      {/* 3. Deep Radial glow flare */}
      <div
        aria-hidden="true"
        className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none"
      />

      {/* Content Grid Layout */}
      <div className="max-w-7xl relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column Content Section */}
        <motion.div 
          className="lg:col-span-7 z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            id="hero-heading" 
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-white leading-[1.2]"
          >
            <span className="text-amber-400 block mb-2">
              {heading ? heading.split('-')[0]?.trim() + ' -' : 'Study and Work -'}
            </span>
            <span className="block font-bold">
              {heading && heading.includes('-') 
                ? heading.split('-').slice(1).join('-').trim() 
                : 'Navigating to connect Human Resources'}
            </span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="mt-6 max-w-xl text-base sm:text-lg text-white/80 font-normal leading-relaxed"
          >
            {subheading}
          </motion.p>

          {/* Core Action Navigation Callouts */}
          <motion.div variants={itemVariants} className="mt-10 flex flex-wrap gap-4">
            {ctaPrimary && (
              <Link
                href={ctaPrimary.href}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-black/20 transition-all duration-200 hover:bg-[#c6710b] hover:-translate-y-0.5"
              >
                {ctaPrimary.label} <span className="text-lg">→</span>
              </Link>
            )}
            
            {ctaSecondary && (
              <Link
                href={ctaSecondary.href}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 hover:-translate-y-0.5"
              >
                {ctaSecondary.label}
              </Link>
            )}
          </motion.div>

          {/* Highlights Metrics Array Mapping */}
          {highlights && highlights.length > 0 && (
            <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-x-12 gap-y-6 text-left">
              {highlights.map((highlightItem, idx) => {
                const text = typeof highlightItem === 'object' && highlightItem !== null
                  ? (highlightItem as any).text || highlightItem
                  : highlightItem;

                if (!text) return null;

                const match = text.match(/^([0-9%,\+\/\-]+)\s+(.*)$/);
                const displayValue = match ? match[1] : text;
                const displayLabel = match ? match[2] : "";

                return (
                  <div key={idx} className="flex flex-col max-w-sm">
                    <span className={`${match ? "text-4xl sm:text-[40px] font-extrabold" : "text-xl sm:text-2xl font-bold"} text-white tracking-tight leading-tight`}>
                      {displayValue}
                    </span>
                    {displayLabel && (
                      <span className="text-sm font-medium text-white/60 mt-2 tracking-normal">
                        {displayLabel}
                      </span>
                    )}
                  </div>
                );
              })}
            </motion.div>
          )}
        </motion.div>

        {/* Right Column: Floating Staggered Keyword Badges */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="hidden lg:col-span-5 lg:flex flex-col gap-4 pl-4 z-10"
        >
          {/* Row 1 */}
          <div className="flex gap-3 justify-start lg:justify-end mr-6">
            {["Human Resource", "Study Permit"].map((tag, idx) => (
              <motion.span 
                key={tag} 
                variants={floatVariants(idx * 0.25)}
                animate="animate"
                className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-white/20 whitespace-nowrap"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex gap-3 justify-start lg:justify-end -mr-2">
            {["Student Program", "Scholarship", "Language Training"].map((tag, idx) => (
              <motion.span 
                key={tag} 
                variants={floatVariants((idx + 2) * 0.2)}
                animate="animate"
                className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-white/20 whitespace-nowrap"
              >
                {tag}
              </motion.span>
            ))}
          </div>

          {/* Row 3 */}
          <div className="flex gap-3 justify-start lg:justify-end mr-4">
            {["SDC", "Work in Japan", "Future", "Global"].map((tag, idx) => (
              <motion.span 
                key={tag} 
                variants={floatVariants((idx + 4) * 0.15)}
                animate="animate"
                className="rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-5 py-2.5 text-sm font-medium text-white shadow-md transition-all duration-300 hover:bg-white/20 whitespace-nowrap"
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Downward Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-[10px] text-white/40 tracking-[0.2em] uppercase font-bold select-none">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          className="h-6 w-px bg-gradient-to-b from-white/70 to-transparent"
        />
      </div>
    </section>
  )
}