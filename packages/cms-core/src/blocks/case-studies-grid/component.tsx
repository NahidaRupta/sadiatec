"use client";

import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { User, ChevronLeft, ChevronRight } from 'lucide-react'
import { SectionEyebrow } from '../../components/ui'
import { staggerContainer, fadeInUp } from '../../lib/motion'
import type { CaseStudiesGridBlockProps, CaseStudyCardItem } from './types'

// Updated helper hook elements inline for self-containment
function useReducedMotion() {
  return false // Default helper flag
}

export function CaseStudiesGridBlock({
  eyebrow,
  heading,
  studies = [],
  challengeLabel = 'Challenge',
  solutionLabel = 'Solution',
}: CaseStudiesGridBlockProps) {
  
  // Guard clause against empty items array
  if (!studies || studies.length === 0) return null

  // Middle element calculator
  const initialCenterIndex = Math.floor(studies.length / 2)
  const [activeIdx, setActiveIdx] = useState(initialCenterIndex)

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % studies.length)
  }

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + studies.length) % studies.length)
  }

  return (
    <section 
      aria-labelledby="case-studies-heading" 
      className="relative overflow-hidden py-24 md:py-32 min-h-[850px] flex flex-col justify-center select-none"
    >
      {/* ── 🌌 Fixed Parallax Background Container matching image_a5bf65.jpg ── */}
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
        
        {/* Layered high-contrast depth darkness filters */}
        <div className="absolute inset-0 bg-slate-950/50 z-1" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/30 to-slate-950/75 z-1" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/40 via-transparent to-slate-950/40 z-1" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent z-1" />
      </div>

      {/* ── 📊 Main Structural Layout Wrapper ── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        
        {/* Section Heading Titles */}
        {(eyebrow || heading) && (
          <div className="mb-8 text-center max-w-2xl mx-auto">
            {eyebrow && <SectionEyebrow>{eyebrow}</SectionEyebrow>}
            {heading && (
              <h2
                id="case-studies-heading"
                className="mt-3 text-3xl font-extrabold text-white md:text-4xl tracking-tight"
              >
                {heading}
              </h2>
            )}
          </div>
        )}

        {/* ── 🧊 3D Overlapping Depth Stack Slider Track ── */}
        <div className="relative w-full h-[540px] flex items-center justify-center my-2">
          {studies.map((study, index) => {
            let offset = index - activeIdx

            // Ensure mathematical looping rotations wrap around boundaries smoothly
            if (offset < -2) offset += studies.length
            if (offset > 2) offset -= studies.length

            const isActive = offset === 0
            const isVisible = Math.abs(offset) <= 2

            if (!isVisible) return null

            // 3D positioning matrices based on image layout guidelines
            const xTranslation = offset * 340 
            const cardScale = isActive ? 1.0 : 0.82
            const cardZIndex = 10 - Math.abs(offset)
            const cardOpacity = offset === 0 ? 1 : Math.abs(offset) === 1 ? 0.55 : 0.12

            return (
              <motion.div
                key={index}
                initial={false}
                animate={{
                  x: xTranslation,
                  scale: cardScale,
                  zIndex: cardZIndex,
                  opacity: cardOpacity,
                }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="absolute w-[380px] sm:w-[420px] shrink-0"
              >
                <article
                  className={`group flex flex-col rounded-2xl border p-8 min-h-[520px] justify-start transition-all duration-300 backdrop-blur-xl ${
                    isActive
                      ? "border-amber-500/50 bg-slate-900/95 shadow-[0_25px_50px_-12px_rgba(245,158,11,0.15)]"
                      : "border-white/10 bg-slate-950/80 shadow-2xl shadow-black/60"
                  }`}
                >
                  {/* Avatar Profile Area */}
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                    {study.photoUrl ? (
                      <div className="relative h-12 w-12 shrink-0 rounded-full overflow-hidden border border-amber-500/20">
                        <Image
                          src={study.photoUrl}
                          alt={study.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                        <User size={22} />
                      </div>
                    )}
                    <div className="overflow-hidden text-left">
                      <h4 className="text-base font-bold text-white tracking-tight truncate">
                        {study.name}
                      </h4>
                      {study.role && (
                        <p className="text-sm text-amber-400/90 font-medium truncate leading-tight mt-0.5">
                          {study.role}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Highlights Metrics Card row */}
                  {study.metric && (
                    <div className="flex items-center gap-3 mb-6 p-4 rounded-xl bg-slate-950/60 border border-white/5 backdrop-blur-md">
                      <span className="text-2xl font-black text-amber-400 tabular-nums leading-none">
                        {study.metric.value}
                      </span>
                      <span className="text-xs font-semibold text-white/50 leading-tight text-left">
                        {study.metric.caption}
                      </span>
                    </div>
                  )}

                  {/* Challenge Text Area */}
                  {study.challenge && (
                    <div className="mb-5 text-left">
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-amber-400/90">
                        {challengeLabel}
                      </p>
                      <p className="text-sm leading-relaxed text-white/80 font-normal">
                        {study.challenge}
                      </p>
                    </div>
                  )}

                  {/* Solution Text Area */}
                  {study.solution && (
                    <div className="text-left">
                      <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                        {solutionLabel}
                      </p>
                      <p className="text-sm leading-relaxed text-white/80 font-normal">
                        {study.solution}
                      </p>
                    </div>
                  )}
                </article>
              </motion.div>
            )
          })}
        </div>

        {/* ── 🕹️ Slide Nav Controls Layer ── */}
        <div className="flex justify-center items-center gap-6 mt-12">
          <button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
            aria-label="Previous story card"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Center Indicators dots */}
          <div className="flex gap-2.5">
            {studies.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIdx ? "w-8 bg-amber-400" : "w-1.5 bg-white/30"
                }`}
                aria-label={`Go to story slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none"
            aria-label="Next story card"
          >
            <ChevronRight size={22} />
          </button>
        </div>

      </div>
    </section>
  )
}